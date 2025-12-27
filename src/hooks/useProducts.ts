import { useState, useEffect } from 'react';
import { Product, ProductFormData } from '@/types/product';

const STORAGE_KEY = 'admin_products';

const generateId = () => Math.random().toString(36).substring(2, 15);

const getStoredProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setProducts(getStoredProducts());
    setIsLoading(false);
  }, []);

  const addProduct = (data: ProductFormData) => {
    const newProduct: Product = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...products, newProduct];
    setProducts(updated);
    saveProducts(updated);
    return newProduct;
  };

  const updateProduct = (id: string, data: Partial<ProductFormData>) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
    );
    setProducts(updated);
    saveProducts(updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    saveProducts(updated);
  };

  return { products, isLoading, addProduct, updateProduct, deleteProduct };
};
