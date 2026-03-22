import { Printer, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Quotation } from '@/types';
import { formatNumber } from '@/lib/helpers';

interface Props {
  quotation: Quotation;
  onClose: () => void;
}

export function QuotationPreview({ quotation, onClose }: Props) {
  const isIncoming = quotation.type === 'incoming';
  const total = quotation.items.reduce((s, i) => s + (i.quantity * i.purchase_price), 0);
  
  // margin logic: margin_percentage is applied on top of the total to formulate the final price for the customer.
  const marginPercentage = isIncoming ? 0 : (quotation.margin_percentage || 0);
  const marginAmount = total * (marginPercentage / 100);
  const finalTotal = total + marginAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 sm:p-8 print:p-0 print:bg-white print:block">
      <div className="bg-white text-black w-full max-w-4xl min-h-[297mm] p-8 sm:p-12 shadow-2xl rounded-xl print:shadow-none print:rounded-none relative mb-10 print:mb-0">
        {/* Actions - hidden when printing */}
        <div className="absolute top-4 right-4 flex gap-2 print:hidden">
          <Button onClick={handlePrint} className="gap-2 gradient-primary text-white"><Printer className="w-4 h-4"/> طباعة / حفظ كـ PDF</Button>
          <Button onClick={onClose} variant="outline" className="text-black border-gray-300">إغلاق</Button>
        </div>

        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8 mt-8 print:mt-0">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-primary uppercase tracking-wider">TRADE<span className="text-amber-500">NAVIGATOR</span></h1>
            <p className="text-sm text-gray-500 font-medium">الوكيل التجاري المعتمد - الصين Yemen Agency</p>
            <div className="text-xs text-gray-500 flex flex-col gap-1 mt-4">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> Guangzhou, China</span>
              <span className="flex items-center gap-1"><Phone className="w-3 h-3"/> +86 123 4567 8900</span>
              <span className="flex items-center gap-1"><Mail className="w-3 h-3"/> export@tradenav.com</span>
            </div>
          </div>
          <div className="text-left space-y-1">
            <h2 className="text-4xl font-light text-gray-300">
              {isIncoming ? 'تسعيرة مورد' : 'عرض سعر'}
            </h2>
            <h2 className="text-4xl font-light text-gray-300">
              {isIncoming ? 'SUPPLIER QUOTE' : 'QUOTATION'}
            </h2>
            <div className="mt-4 text-sm rtl:text-right ltr:text-left">
              <p><span className="font-bold text-gray-700">الرقم المرجعي:</span> #{quotation.id.slice(0,8).toUpperCase()}</p>
              <p><span className="font-bold text-gray-700">التاريخ:</span> {quotation.date}</p>
              <p><span className="font-bold text-gray-700">صالح لمدة:</span> 15 يوماً</p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        {!isIncoming && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">السادة / المشتري (Buyer)</p>
            <h3 className="text-xl font-bold text-gray-800">{quotation.customer_name || 'عميل غير محدد'}</h3>
            <p className="text-sm text-gray-600 mt-1">الجمهورية اليمنية (Yemen)</p>
          </div>
        )}

        {/* Items Table */}
        <table className="w-full text-sm text-right border-collapse mb-8">
          <thead>
            <tr className="border-b-2 border-primary text-primary">
              <th className="py-3 px-2 font-bold w-12 text-center">#</th>
              <th className="py-3 px-2 font-bold">البيان / Product</th>
              <th className="py-3 px-2 font-bold text-center">رقم الوكالة OEM</th>
              <th className="py-3 px-2 font-bold text-center">الكمية Qty</th>
              <th className="py-3 px-2 font-bold text-center">سعر الوحدة Unit ($)</th>
              <th className="py-3 px-2 font-bold text-center">الإجمالي Total ($)</th>
            </tr>
          </thead>
          <tbody>
            {quotation.items.map((item, idx) => {
              const unitPriceWithMargin = item.purchase_price * (1 + marginPercentage / 100);
              const totalItemPrice = item.quantity * unitPriceWithMargin;
              return (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-2 text-center text-gray-500">{idx + 1}</td>
                  <td className="py-3 px-2">
                    <p className="font-bold text-gray-800">{item.product_name}</p>
                    <p className="text-xs text-gray-500">{item.brand} {item.size ? `| ${item.size}` : ''}</p>
                  </td>
                  <td className="py-3 px-2 text-center font-mono text-gray-600">{item.oem_number || '—'}</td>
                  <td className="py-3 px-2 text-center font-bold text-gray-800">{item.quantity}</td>
                  <td className="py-3 px-2 text-center font-bold text-gray-800">${formatNumber(unitPriceWithMargin)}</td>
                  <td className="py-3 px-2 text-center font-bold text-primary">${formatNumber(totalItemPrice)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-start mb-12 flex-row-reverse">
          <div className="w-72 bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
            {!isIncoming && marginPercentage > 0 && (
              <div className="flex justify-between text-sm text-gray-600 font-bold">
                <span>الإجمالي (Subtotal):</span>
                <span>${formatNumber(total)}</span>
              </div>
            )}
            {!isIncoming && marginPercentage > 0 && (
              <div className="flex justify-between text-sm text-gray-500">
                <span>العمولة المضافة ({marginPercentage}%):</span>
                <span>+${formatNumber(marginAmount)}</span>
              </div>
            )}
            <div className={`flex justify-between text-xl font-black text-primary ${!isIncoming && marginPercentage > 0 ? 'border-t border-gray-200 pt-3' : ''}`}>
              <span>الإجمالي النهائي (Total):</span>
              <span>${formatNumber(finalTotal)}</span>
            </div>
            {!isIncoming && (
              <p className="text-[10px] text-gray-400 text-center">الدفع يكون كاملاً قبل الشحن - Payment 100% advance</p>
            )}
            {isIncoming && (
              <p className="text-[10px] text-gray-400 text-center">أسعار المصنع الصافية (بدون شحن وعمولة)</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 border-t border-gray-200 pt-8 mt-auto absolute bottom-8 left-0 right-0">
          <p>هذا العرض مبني على أسعار المصنع الحالية وقد تتغير أجور الشحن الداخلي والخارجي حسب تقلبات السوق.</p>
          <p className="mt-1 font-mono">Generated by Trade Navigator Quotation Engine</p>
        </div>
      </div>
    </div>
  );
}
