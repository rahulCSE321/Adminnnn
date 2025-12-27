import { useNavigate, useParams } from 'react-router-dom';
import { ProductForm } from '@/components/admin/ProductForm';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';

const ProductFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { addProduct, updateProduct, products } = useProducts();
    const { toast } = useToast();

    // Find product if editing
    const product = id ? products.find(p => p.id === id) : null;

    const handleSubmit = (productData: Partial<Product>) => {
        if (id && product) {
            // Update existing product
            updateProduct(id, productData);
            toast({
                title: 'Product updated successfully',
                description: `${productData.name} has been updated.`
            });
        } else {
            // Add new product
            addProduct(productData as any);
            toast({
                title: 'Product added successfully',
                description: `${productData.name} has been added to your catalog.`
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <ProductForm product={product} onSubmit={handleSubmit} />
        </div>
    );
};

export default ProductFormPage;
