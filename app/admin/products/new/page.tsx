import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight uppercase">New Product</h1>
        <p className="text-white/50 text-sm tracking-wide">Add a new item to your luxury collection.</p>
      </div>

      <ProductForm />
    </div>
  );
}
