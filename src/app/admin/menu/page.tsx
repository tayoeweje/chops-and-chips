"use client";

import { useState, useEffect } from "react";
import { getFoodItems, addFoodItem, updateFoodItem, deleteFoodItem } from "@/firebase/firestore";
import { uploadImage } from "@/firebase/storage";
import Image from "next/image";

export default function MenuManagementPage() {
    const [foods, setFoods] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        image: null as File | null,
        imageUrl: ""
    });

    const fetchFoods = async () => {
        setLoading(true);
        try {
            const items = await getFoodItems();
            setFoods(items);
        } catch (error) {
            console.error("Failed to fetch menu:", error);
            alert("Failed to load menu items. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            price: "",
            category: "",
            image: null,
            imageUrl: ""
        });
        setIsEditing(false);
        setCurrentId(null);
    };

    const handleEdit = (food: any) => {
        setFormData({
            name: food.name,
            description: food.description,
            price: food.price.toString(),
            category: food.category,
            image: null,
            imageUrl: food.imageUrl || ""
        });
        setCurrentId(food.id);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this item?")) {
            await deleteFoodItem(id);
            fetchFoods();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = formData.imageUrl;

            if (formData.image) {
                imageUrl = await uploadImage(formData.image, `foods/${Date.now()}_${formData.image.name}`);
            }

            const foodData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                category: formData.category,
                imageUrl
            };

            if (isEditing && currentId) {
                await updateFoodItem(currentId, foodData);
            } else {
                await addFoodItem(foodData);
            }

            resetForm();
            fetchFoods();
        } catch (error) {
            console.error("Error saving food item:", error);
            alert("Failed to save food item.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Menu Management</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                        <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Item" : "Add New Item"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-red focus:border-brand-red"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-red focus:border-brand-red"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-red focus:border-brand-red"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-red focus:border-brand-red"
                                    placeholder="e.g. Burgers, Drinks"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFormData({ ...formData, image: e.target.files ? e.target.files[0] : null })}
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                                />
                            </div>

                            <div className="flex gap-2 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-brand-red text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : (isEditing ? "Update" : "Add")}
                                </button>
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {foods.map((food) => (
                                    <tr key={food.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 relative">
                                                {food.imageUrl && <Image src={food.imageUrl} alt="" fill className="object-cover" />}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{food.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${food.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{food.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleEdit(food)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                            <button onClick={() => handleDelete(food.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
