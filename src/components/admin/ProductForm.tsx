import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Save, X, Upload, Plus, Trash2, Wand2,
    AlertCircle, Image as ImageIcon, IndianRupee,
    CheckCircle2, Loader2
} from 'lucide-react';
import { Product, ProductVariant, BRANDS, CATEGORIES } from '@/types';
import { generateProductDescription, generateDisclaimer } from '@/services/geminiService';

interface ProductFormProps {
    product?: Product | null;
    onSubmit?: (productData: Partial<Product>) => void;
    onCancel?: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
    const navigate = useNavigate();
    const [loadingAi, setLoadingAi] = useState(false);
    const [loadingDisclaimer, setLoadingDisclaimer] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [disclaimer, setDisclaimer] = useState('');
    const [published, setPublished] = useState(true);

    const [variants, setVariants] = useState<ProductVariant[]>([]);

    const [images, setImages] = useState<string[]>([]);

    // Initialize form from product prop
    useEffect(() => {
        if (product) {
            setName(product.name || '');
            setBrand(product.brand || '');
            setCategory(product.category || '');
            setDescription(product.description || '');
            setDisclaimer(product.disclaimer || '');
            setVariants(product.variants || []);
            setImages(product.images || []);
            setPublished(product.published ?? true);
        }
    }, [product]);

    // Handlers
    const handleSubmit = () => {
        // Validate form
        if (!name.trim()) {
            alert('Please enter a product name');
            return;
        }
        if (!brand) {
            alert('Please select a brand');
            return;
        }
        if (!category) {
            alert('Please select a category');
            return;
        }
        if (variants.length === 0) {
            alert('Please add at least one product variant');
            return;
        }

        // Prepare product data
        const productData: Partial<Product> = {
            name,
            brand,
            category,
            description,
            disclaimer,
            variants,
            images,
            published
        };

        // Call onSubmit if provided, otherwise navigate back
        if (onSubmit) {
            onSubmit(productData);
        }

        navigate('/admin');
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
        navigate('/admin');
    };

    const handleAiGenerate = async () => {
        if (!name || !brand) {
            alert("Please enter a product name and brand first.");
            return;
        }
        setLoadingAi(true);
        const desc = await generateProductDescription(name, brand, category);
        if (desc) setDescription(desc);
        setLoadingAi(false);
    };

    const handleDisclaimerGenerate = async () => {
        setLoadingDisclaimer(true);
        const text = await generateDisclaimer(category);
        if (text) setDisclaimer(text);
        setLoadingDisclaimer(false);
    };

    const addVariant = () => {
        const newVariant: ProductVariant = {
            id: Date.now().toString(),
            size: '',
            price: 0,
            mrp: 0,
            stock: 0,
            sku: ''
        };
        setVariants([...variants, newVariant]);
    };

    const removeVariant = (id: string) => {
        setVariants(variants.filter(v => v.id !== id));
    };

    const updateVariant = (id: string, field: keyof ProductVariant, value: string | number) => {
        setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            setImages([...images, url]);
        }
    };

    const calculateDiscount = (price: number, mrp: number) => {
        if (mrp <= 0 || price >= mrp) return 0;
        return Math.round(((mrp - price) / mrp) * 100);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {product ? 'Update Product' : 'Add Product'}
                    </h1>
                    <p className="text-sm text-gray-500">Manage product details, pricing, and stocks.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm flex items-center gap-2 shadow-sm"
                    >
                        <Save size={16} />
                        {product ? 'Save Changes' : 'Add Product'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: General Info */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Basic Details Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <CheckCircle2 size={18} className="text-green-600" />
                            Basic Information
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                    placeholder="e.g. Pro Nature Ground Nut Oil"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                                    <div className="relative">
                                        <select
                                            value={brand}
                                            onChange={(e) => setBrand(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-white"
                                        >
                                            <option value="">Select Brand</option>
                                            {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <div className="relative">
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-white"
                                        >
                                            <option value="">Select Category</option>
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description & Disclaimer Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <CheckCircle2 size={18} className="text-green-600" />
                                Details & Description
                            </h3>
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <button
                                        onClick={handleAiGenerate}
                                        disabled={loadingAi}
                                        className="text-xs flex items-center gap-1 text-purple-600 font-medium hover:text-purple-700 bg-purple-50 px-2 py-1 rounded-md transition-colors"
                                    >
                                        {loadingAi ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                                        AI Generate
                                    </button>
                                </div>
                                <textarea
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm leading-relaxed"
                                />
                            </div>

                            <div className="relative">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-700">Disclaimer</label>
                                    <button
                                        onClick={handleDisclaimerGenerate}
                                        disabled={loadingDisclaimer}
                                        className="text-xs flex items-center gap-1 text-blue-600 font-medium hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-md transition-colors"
                                    >
                                        {loadingDisclaimer ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                                        Auto-fill
                                    </button>
                                </div>
                                <textarea
                                    rows={3}
                                    value={disclaimer}
                                    onChange={(e) => setDisclaimer(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm leading-relaxed text-gray-600 bg-gray-50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Variants Table Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <CheckCircle2 size={18} className="text-green-600" />
                                Product Variants
                            </h3>
                            <button
                                onClick={addVariant}
                                className="text-sm bg-green-50 text-green-700 px-3 py-1.5 rounded-lg font-medium hover:bg-green-100 transition-colors flex items-center gap-1"
                            >
                                <Plus size={16} /> Add Variant
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-3">Size / Unit</th>
                                        <th className="px-6 py-3">Price (₹)</th>
                                        <th className="px-6 py-3">MRP (₹)</th>
                                        <th className="px-6 py-3">Stock</th>
                                        <th className="px-6 py-3">SKU</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {variants.map((variant) => {
                                        const discount = calculateDiscount(variant.price, variant.mrp);
                                        return (
                                            <tr key={variant.id} className="hover:bg-gray-50/50">
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="text"
                                                        value={variant.size}
                                                        onChange={(e) => updateVariant(variant.id, 'size', e.target.value)}
                                                        placeholder="e.g. 1L"
                                                        className="w-24 px-2 py-1 rounded border border-gray-300 text-sm"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            value={variant.price}
                                                            onChange={(e) => updateVariant(variant.id, 'price', Number(e.target.value))}
                                                            className="w-20 px-2 py-1 rounded border border-gray-300 text-sm"
                                                        />
                                                        {discount > 0 && (
                                                            <span className="text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                                                                {discount}% OFF
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        value={variant.mrp}
                                                        onChange={(e) => updateVariant(variant.id, 'mrp', Number(e.target.value))}
                                                        className="w-20 px-2 py-1 rounded border border-gray-300 text-sm text-gray-500"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        value={variant.stock}
                                                        onChange={(e) => updateVariant(variant.id, 'stock', Number(e.target.value))}
                                                        className="w-16 px-2 py-1 rounded border border-gray-300 text-sm"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="text"
                                                        value={variant.sku}
                                                        onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)}
                                                        className="w-24 px-2 py-1 rounded border border-gray-300 text-sm uppercase"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => removeVariant(variant.id)}
                                                        className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {variants.length === 0 && (
                                <div className="p-8 text-center text-gray-400 text-sm">
                                    No variants added. Click "Add Variant" to start.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Media & Organization */}
                <div className="space-y-6">

                    {/* Media Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <ImageIcon size={18} className="text-green-600" />
                            Product Images
                        </h3>

                        <div className="space-y-4">
                            {/* Main Image Preview */}
                            <div className="aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden group">
                                {images.length > 0 ? (
                                    <img src={images[0]} alt="Main" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <Upload size={32} className="mx-auto mb-2 opacity-50" />
                                        <span className="text-xs">Main Image</span>
                                    </div>
                                )}
                                {images.length > 0 && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            onClick={() => setImages(images.slice(1))}
                                            className="text-white bg-red-500 p-2 rounded-full hover:bg-red-600"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Gallery Grid */}
                            <div className="grid grid-cols-3 gap-2">
                                {images.slice(1).map((img, idx) => (
                                    <div key={idx} className="aspect-square bg-gray-50 rounded-md border border-gray-200 relative overflow-hidden group">
                                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-contain p-1" />
                                        <button
                                            onClick={() => {
                                                const newImages = [...images];
                                                newImages.splice(idx + 1, 1);
                                                setImages(newImages);
                                            }}
                                            className="absolute top-1 right-1 text-white bg-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
                                        >
                                            <X size={10} />
                                        </button>
                                    </div>
                                ))}

                                {/* Upload Button Placeholder */}
                                <label className="aspect-square bg-gray-50 rounded-md border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-colors cursor-pointer flex flex-col items-center justify-center text-gray-400 hover:text-green-600">
                                    <Plus size={20} />
                                    <span className="text-[10px] mt-1">Add</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                            <p className="text-xs text-gray-400">
                                Recommended size: 1000x1000px. JPEG or PNG.
                            </p>
                        </div>
                    </div>

                    {/* Status & Visibility */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Visibility</h3>
                        <div className="space-y-3">
                            <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                <span className="text-sm font-medium text-gray-700">Published</span>
                                <input
                                    type="checkbox"
                                    checked={published}
                                    onChange={(e) => setPublished(e.target.checked)}
                                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                />
                            </label>

                            <div className="p-3 bg-yellow-50 rounded-lg flex items-start gap-2">
                                <AlertCircle size={16} className="text-yellow-600 mt-0.5" />
                                <p className="text-xs text-yellow-700 leading-snug">
                                    This product will be visible to all customers immediately after saving.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
