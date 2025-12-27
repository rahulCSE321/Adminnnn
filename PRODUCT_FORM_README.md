# Product Form - AI-Powered E-commerce Admin

## Overview
This enhanced product form provides a comprehensive interface for managing products in your e-commerce admin panel with AI-powered features.

## Features

### ✨ AI-Powered Content Generation
- **Product Description Generator**: Automatically generate compelling product descriptions using Google's Gemini AI
- **Smart Disclaimer Generator**: Auto-fill legal disclaimers based on product category
- Both features require a Gemini API key (see setup below)

### 📦 Product Variants Management
- Add multiple product variants (sizes, units)
- Individual pricing for each variant (Price & MRP)
- Automatic discount calculation and display
- Stock management per variant
- SKU tracking

### 🖼️ Image Management
- Upload multiple product images
- Main image preview
- Gallery view for additional images
- Easy image deletion
- Drag-and-drop support

### 💼 Product Information
- Product name and brand selection
- Category management
- Rich text descriptions
- Legal disclaimers
- Publish/unpublish toggle

## Setup Instructions

### 1. Get Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

### 2. Configure Environment Variables
1. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```

2. Add your Gemini API key to `.env`:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

3. Restart your development server

### 3. Access the Product Form
- Navigate to `/admin/products/add` in your application
- Or click the "Add Product" button from the admin products page

## File Structure

```
src/
├── components/
│   └── admin/
│       ├── ProductForm.tsx          # Main product form component
│       └── ProductFormDialog.tsx    # Legacy dialog (kept for compatibility)
├── pages/
│   └── ProductFormPage.tsx          # Product form page wrapper
├── services/
│   └── geminiService.ts             # Gemini AI integration
└── types/
    └── index.ts                     # Enhanced product types
```

## Usage

### Adding a New Product
1. Click "Add Product" from the admin panel
2. Fill in basic information (name, brand, category)
3. Use AI generation for description (optional)
4. Add product variants with pricing
5. Upload product images
6. Set visibility and save

### Using AI Features
- **Description**: Click "AI Generate" after entering product name and brand
- **Disclaimer**: Click "Auto-fill" to generate category-specific disclaimer
- Both features work offline-first and gracefully handle API errors

## Product Data Structure

```typescript
interface ProductVariant {
  id: string;
  size: string;        // e.g., "1L", "500ml"
  price: number;       // Selling price
  mrp: number;         // Maximum retail price
  stock: number;       // Available quantity
  sku: string;         // Stock keeping unit
}

interface Product {
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
```

## Customization

### Adding New Brands
Edit `src/types/index.ts`:
```typescript
export const BRANDS = [
  'Your Brand',
  'Another Brand',
  // ... add more
];
```

### Adding New Categories
Edit `src/types/index.ts`:
```typescript
export const CATEGORIES = [
  'Your Category',
  'Another Category',
  // ... add more
];
```

## Troubleshooting

### AI Features Not Working
1. Check if `VITE_GEMINI_API_KEY` is set in `.env`
2. Verify the API key is valid
3. Check browser console for errors
4. Ensure you have internet connectivity

### Images Not Uploading
1. Check file size (recommended: < 5MB)
2. Verify file format (JPEG, PNG supported)
3. Check browser console for errors

### Variants Not Saving
1. Ensure all required fields are filled
2. Check that price <= MRP
3. Verify stock is a positive number

## Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Dependencies
- React 18+
- Lucide React (icons)
- Google Gemini API
- TypeScript

## Future Enhancements
- [ ] Bulk product import
- [ ] Image optimization
- [ ] SEO metadata fields
- [ ] Product templates
- [ ] Multi-language support
- [ ] Advanced variant options (color, material, etc.)

## Support
For issues or questions, please check the console logs or contact your development team.
