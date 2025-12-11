// resources/js/Pages/Items/Index.jsx
import React, { useEffect, useRef, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';

export default function ItemsIndex({ auth }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        id: null,
        name: '',
        sku: '',
        description: '',
        rental_type: 'bulk',
        qty_total: 1,
        price_per_day: 0,
        security_deposit: 0,
        image_url: '',
    });

    const isEditing = form.id !== null;

    const resetForm = () => {
        setForm({
            id: null,
            name: '',
            sku: '',
            description: '',
            rental_type: 'bulk',
            qty_total: 1,
            price_per_day: 0,
            security_deposit: 0,
            image_url: '',
        });
        setError(null);
    };

    const fetchItems = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get('/api/items');
            setItems(res.data);
        } catch (e) {
            console.error(e);
            setError('Failed to load items.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        const payload = {
            name: form.name,
            sku: form.sku,
            description: form.description,
            rental_type: form.rental_type,
            qty_total: Number(form.qty_total),
            price_per_day: Number(form.price_per_day),
            security_deposit: Number(form.security_deposit),
            image_url: form.image_url || null,
        };

        try {
            if (isEditing) {
                await axios.put(`/api/items/${form.id}`, payload);
            } else {
                await axios.post('/api/items', payload);
            }

            await fetchItems();
            resetForm();
        } catch (e) {
            console.error(e);
            if (e.response && e.response.data && e.response.data.message) {
                setError(e.response.data.message);
            } else {
                setError('Failed to save item.');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        setForm({
            id: item.id,
            name: item.name ?? '',
            sku: item.sku ?? '',
            description: item.description ?? '',
            rental_type: item.rental_type ?? 'bulk',
            qty_total: item.qty_total ?? 1,
            price_per_day: item.price_per_day ?? 0,
            security_deposit: item.security_deposit ?? 0,
            image_url: item.meta?.image_url ?? '',
        });
        setError(null);
    };

    const handleDelete = async (item) => {
        if (!confirm(`Delete item "${item.name}"?`)) return;

        try {
            await axios.delete(`/api/items/${item.id}`);
            await fetchItems();
        } catch (e) {
            console.error(e);
            alert('Failed to delete item.');
        }
    };

    // ============ IMAGE UPLOAD ============
    const handleBrowseClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const res = await axios.post('/api/items/upload-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const url = res.data.url;
            setForm((prev) => ({ ...prev, image_url: url }));
        } catch (err) {
            console.error(err);
            setError('Failed to upload image.');
        } finally {
            setUploadingImage(false);
            // clear file input so selecting same file again still triggers change
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Inventory Items
                </h2>
            }
        >
            <Head title="Items" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* Form Card */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h3 className="text-lg font-medium mb-4">
                                {isEditing ? 'Edit Item' : 'Add New Item'}
                            </h3>

                            {error && (
                                <div className="mb-4 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            <form
                                onSubmit={handleSubmit}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        SKU
                                    </label>
                                    <input
                                        type="text"
                                        name="sku"
                                        value={form.sku}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Rental Type
                                    </label>
                                    <select
                                        name="rental_type"
                                        value={form.rental_type}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    >
                                        <option value="bulk">Bulk</option>
                                        <option value="trackable">Trackable</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Quantity Total
                                    </label>
                                    <input
                                        type="number"
                                        name="qty_total"
                                        value={form.qty_total}
                                        min="0"
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Price per Day
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="price_per_day"
                                        value={form.price_per_day}
                                        min="0"
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Security Deposit
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="security_deposit"
                                        value={form.security_deposit}
                                        min="0"
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                </div>

                                {/* IMAGE URL + BROWSE */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Image
                                    </label>
                                    <div className="mt-1 flex flex-col sm:flex-row gap-2">
                                        <input
                                            type="text"
                                            name="image_url"
                                            value={form.image_url}
                                            onChange={handleChange}
                                            className="flex-1 rounded-md border-gray-300 shadow-sm"
                                            placeholder="/storage/items/sofa-white.jpg"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleBrowseClick}
                                            className="inline-flex items-center px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-200"
                                            disabled={uploadingImage}
                                        >
                                            {uploadingImage ? 'Uploading...' : 'Browse…'}
                                        </button>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    {form.image_url && (
                                        <div className="mt-2">
                                            <p className="text-xs text-gray-500 mb-1">
                                                Preview:
                                            </p>
                                            <img
                                                src={form.image_url}
                                                alt={form.name || 'Preview'}
                                                className="h-24 w-auto rounded border border-gray-200 object-cover bg-gray-50"
                                                onError={(e) => {
                                                    e.currentTarget.style.display =
                                                        'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        rows="3"
                                    />
                                </div>

                                <div className="md:col-span-2 flex items-center gap-3 mt-2">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-500 disabled:opacity-50"
                                    >
                                        {saving
                                            ? isEditing
                                                ? 'Saving...'
                                                : 'Adding...'
                                            : isEditing
                                            ? 'Save Changes'
                                            : 'Add Item'}
                                    </button>

                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md font-semibold text-xs text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Items List Card with TABS */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium">Items</h3>

                                <div className="flex items-center gap-2">
                                    {/* View mode tabs */}
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('table')}
                                        className={
                                            'px-3 py-1 text-xs font-medium rounded-full border ' +
                                            (viewMode === 'table'
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100')
                                        }
                                    >
                                        Table view
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('grid')}
                                        className={
                                            'px-3 py-1 text-xs font-medium rounded-full border ' +
                                            (viewMode === 'grid'
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100')
                                        }
                                    >
                                        Card view
                                    </button>

                                    {loading && (
                                        <span className="ml-3 text-sm text-gray-500">
                                            Loading...
                                        </span>
                                    )}
                                </div>
                            </div>

                            {items.length === 0 && !loading && (
                                <p className="text-sm text-gray-500">
                                    No items yet. Add your first decor item above.
                                </p>
                            )}

                            {/* TABLE VIEW */}
                            {items.length > 0 && viewMode === 'table' && (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Image
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    SKU
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Rental Type
                                                </th>
                                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Qty
                                                </th>
                                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Price/Day
                                                </th>
                                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Deposit
                                                </th>
                                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {items.map((item) => {
                                                const imageUrl =
                                                    item.meta?.image_url || null;

                                                return (
                                                    <tr key={item.id}>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                                                            {imageUrl ? (
                                                                <img
                                                                    src={imageUrl}
                                                                    alt={item.name}
                                                                    className="h-12 w-12 rounded object-cover bg-gray-100 border border-gray-200"
                                                                    onError={(e) => {
                                                                        e.currentTarget.style.display =
                                                                            'none';
                                                                    }}
                                                                />
                                                            ) : (
                                                                <span className="text-xs text-gray-400">
                                                                    No image
                                                                </span>
                                                            )}
                                                        </td>

                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                            {item.name}
                                                        </td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                            {item.sku || '-'}
                                                        </td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                            {item.rental_type}
                                                        </td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-500">
                                                            {item.qty_total}
                                                        </td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-500">
                                                            $
                                                            {Number(
                                                                item.price_per_day,
                                                            ).toFixed(2)}
                                                        </td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-500">
                                                            $
                                                            {Number(
                                                                item.security_deposit,
                                                            ).toFixed(2)}
                                                        </td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right space-x-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleEdit(item)
                                                                }
                                                                className="text-indigo-600 hover:text-indigo-900 text-xs font-medium"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(item)
                                                                }
                                                                className="text-red-600 hover:text-red-900 text-xs font-medium"
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* GRID / CARD VIEW */}
                            {items.length > 0 && viewMode === 'grid' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {items.map((item) => {
                                        const imageUrl =
                                            item.meta?.image_url || null;
                                        return (
                                            <div
                                                key={item.id}
                                                className="border border-gray-200 rounded-lg p-4 flex flex-col"
                                            >
                                                <div className="flex-1">
                                                    <div className="w-full h-40 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden mb-3">
                                                        {imageUrl ? (
                                                            <img
                                                                src={imageUrl}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display =
                                                                        'none';
                                                                }}
                                                            />
                                                        ) : (
                                                            <span className="text-xs text-gray-400">
                                                                No image
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h4 className="font-semibold text-gray-900 mb-1">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 mb-1">
                                                        SKU:{' '}
                                                        {item.sku ? item.sku : '—'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mb-1">
                                                        Type: {item.rental_type}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Qty:{' '}
                                                        <span className="font-medium text-gray-800">
                                                            {item.qty_total}
                                                        </span>{' '}
                                                        • Price/day:{' '}
                                                        <span className="font-medium text-gray-800">
                                                            $
                                                            {Number(
                                                                item.price_per_day,
                                                            ).toFixed(2)}
                                                        </span>
                                                    </p>
                                                </div>

                                                <div className="mt-3 flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="text-indigo-600 hover:text-indigo-900 text-xs font-medium"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(item)
                                                        }
                                                        className="text-red-600 hover:text-red-900 text-xs font-medium"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
