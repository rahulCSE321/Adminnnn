import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { ProductTable } from '@/components/admin/ProductTable';
import { ProductFormDialog } from '@/components/admin/ProductFormDialog';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { Product, ProductFormData } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/auth');
    toast({ title: 'Logged out successfully' });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = (data: ProductFormData) => {
    addProduct(data);
    toast({ title: 'Product added successfully' });
  };

  const handleEditProduct = (data: ProductFormData) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
      toast({ title: 'Product updated successfully' });
    }
  };

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id);
    toast({ title: 'Product deleted', variant: 'destructive' });
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
                <p className="text-muted-foreground mt-1">Overview of your store performance</p>
              </div>
              <DashboardStats products={products} />
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Recent Products</h3>
                <ProductTable
                  products={products.slice(0, 5)}
                  onEdit={openEditDialog}
                  onDelete={handleDeleteProduct}
                />
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Products</h2>
                  <p className="text-muted-foreground mt-1">Manage your product catalog</p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </div>

              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <ProductTable
                products={filteredProducts}
                onEdit={openEditDialog}
                onDelete={handleDeleteProduct}
              />
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-3xl font-bold text-foreground">Settings</h2>
              <p className="text-muted-foreground mt-1">Configure your store settings</p>
              <div className="mt-8 p-8 rounded-lg border border-border bg-card text-center">
                <p className="text-muted-foreground">Settings coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <ProductFormDialog
        open={isDialogOpen}
        onClose={closeDialog}
        onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
        product={editingProduct}
      />
    </div>
  );
};

export default Admin;
