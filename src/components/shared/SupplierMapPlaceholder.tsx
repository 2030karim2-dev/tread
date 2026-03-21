import { Map } from 'lucide-react';

export function SupplierMapPlaceholder() {
  return (
    <div className="w-full h-[500px] bg-muted/30 border border-border rounded-xl flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
        <Map className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold mb-2">خريطة الموردين التفاعلية (قريباً)</h3>
      <p className="text-muted-foreground max-w-md">
        سيتم إدراج خريطة تفاعلية هنا قريباً لتمكينك من استكشاف مواقع الموردين والمصانع جغرافياً.
      </p>
    </div>
  );
}
