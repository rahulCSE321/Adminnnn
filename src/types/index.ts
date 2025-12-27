export interface ProductVariant {
    id: string;
    size: string;
    price: number;
    mrp: number;
    stock: number;
    sku: string;
}

export interface Product {
    id: string;
    name: string;
    brand: string;
    category: string;
    description: string;
    disclaimer: string;
    variants: ProductVariant[];
    images: string[];
    published: boolean;
    createdAt: string;
    updatedAt: string;
}

export const BRANDS = [
    'Pro Nature',
    'Organic India',
    'Patanjali',
    'Dhara',
    'Fortune',
    'Saffola',
    'Aashirvaad',
    'Tata Sampann',
    'Mother Dairy',
    'Amul'
];

export const CATEGORIES = [
    'Oils & Ghee',
    'Pulses & Grains',
    'Spices & Masalas',
    'Rice & Flour',
    'Dairy Products',
    'Snacks & Namkeen',
    'Tea & Coffee',
    'Sugar & Jaggery',
    'Dry Fruits & Nuts',
    'Organic Products'
];
