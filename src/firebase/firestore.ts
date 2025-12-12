import { db } from "./config";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    DocumentData
} from "firebase/firestore";

// Collection References
const FOODS_COLLECTION = "foods";
const ORDERS_COLLECTION = "orders";
const THEME_COLLECTION = "theme";

// Food Items
export const addFoodItem = async (data: DocumentData) => {
    return await addDoc(collection(db, FOODS_COLLECTION), data);
};

export const getFoodItems = async () => {
    const q = query(collection(db, FOODS_COLLECTION));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateFoodItem = async (id: string, data: DocumentData) => {
    const docRef = doc(db, FOODS_COLLECTION, id);
    return await updateDoc(docRef, data);
};

export const deleteFoodItem = async (id: string) => {
    const docRef = doc(db, FOODS_COLLECTION, id);
    return await deleteDoc(docRef);
};

// Orders
export const createOrder = async (orderData: DocumentData) => {
    return await addDoc(collection(db, ORDERS_COLLECTION), {
        ...orderData,
        createdAt: serverTimestamp(),
        status: "pending"
    });
};

export const subscribeToOrders = (callback: (orders: any[]) => void) => {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(orders);
    });
};

export const updateOrderStatus = async (id: string, status: string) => {
    const docRef = doc(db, ORDERS_COLLECTION, id);
    return await updateDoc(docRef, { status });
};

export const getOrder = (id: string, callback: (order: any) => void) => {
    const docRef = doc(db, ORDERS_COLLECTION, id);
    return onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
            callback({ id: doc.id, ...doc.data() });
        } else {
            callback(null);
        }
    })
}

// Theme
export const saveThemeSettings = async (settings: DocumentData) => {
    return await addDoc(collection(db, THEME_COLLECTION), settings);
};
