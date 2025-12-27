import { Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductTable = ({ products, onEdit, onDelete }: ProductTableProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No products found. Add your first product to get started.</p>
      </div>
    );
  }

  const getPriceDisplay = (product: Product) => {
    if (!product.variants || product.variants.length === 0) return '₹0';
    const prices = product.variants.map(v => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return minPrice === maxPrice ? `₹${minPrice}` : `₹${minPrice} - ₹${maxPrice}`;
  };

  const getTotalStock = (product: Product) => {
    return product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-16">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="hover:bg-muted/30">
              <TableCell>
                <img
                  src={product.images?.[0] || '/placeholder.svg'}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover border border-border"
                />
              </TableCell>
              <TableCell className="font-medium">
                <div>{product.name}</div>
                <div className="text-xs text-muted-foreground">{product.brand}</div>
              </TableCell>
              <TableCell className="text-muted-foreground">{product.category}</TableCell>
              <TableCell className="text-right font-medium">{getPriceDisplay(product)}</TableCell>
              <TableCell className="text-right">
                <span className={getTotalStock(product) < 10 ? 'text-destructive font-medium' : ''}>
                  {getTotalStock(product)}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={product.published ? "default" : "secondary"} className={product.published ? "bg-green-500 hover:bg-green-600" : ""}>
                  {product.published ? 'Published' : 'Draft'}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(product)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(product.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
