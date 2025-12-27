import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-foreground">E-Commerce Store</h1>
        <p className="text-xl text-muted-foreground">Your online store is coming soon</p>
        <Button asChild size="lg" className="gap-2">
          <Link to="/admin">
            <LayoutDashboard className="h-5 w-5" />
            Go to Admin Panel
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
