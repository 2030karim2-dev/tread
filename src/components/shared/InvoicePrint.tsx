import { forwardRef } from 'react';

interface PrintItem {
  product_name: string;
  oem_number: string;
  brand: string;
  quantity: number;
  price: number;
  size: string;
}

interface InvoicePrintProps {
  type: 'purchase' | 'sale';
  invoiceNumber: string;
  date: string;
  partyName: string; // supplier or customer
  items: PrintItem[];
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  taxNumber?: string;
}

export const InvoicePrint = forwardRef<HTMLDivElement, InvoicePrintProps>(
  ({ type, invoiceNumber, date, partyName, items, companyName = 'AutoParts', companyAddress = 'الرياض، المملكة العربية السعودية', companyPhone = '+966 50 000 0000', taxNumber = '300000000000003' }, ref) => {
    const total = items.reduce((s, i) => s + i.quantity * i.price, 0);
    const isPurchase = type === 'purchase';

    return (
      <div ref={ref} className="print-invoice p-8 bg-white text-black font-sans" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold">{companyName}</h1>
            <p className="text-sm text-gray-600">{companyAddress}</p>
            <p className="text-sm text-gray-600">هاتف: {companyPhone}</p>
            {taxNumber && <p className="text-sm text-gray-600">الرقم الضريبي: {taxNumber}</p>}
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold">{isPurchase ? 'فاتورة شراء' : 'فاتورة بيع'}</h2>
            <p className="text-sm">رقم: {invoiceNumber}</p>
            <p className="text-sm">التاريخ: {date}</p>
          </div>
        </div>

        {/* Party info */}
        <div className="mb-6 p-3 bg-gray-50 rounded border">
          <p className="font-semibold text-sm">{isPurchase ? 'المورد' : 'العميل'}: <span className="font-bold">{partyName}</span></p>
        </div>

        {/* Items table */}
        <table className="w-full border-collapse text-sm mb-6">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-2 text-right border">#</th>
              <th className="p-2 text-right border">المنتج</th>
              <th className="p-2 text-right border">رقم OEM</th>
              <th className="p-2 text-right border">العلامة</th>
              <th className="p-2 text-center border">المقاس</th>
              <th className="p-2 text-center border">الكمية</th>
              <th className="p-2 text-center border">السعر</th>
              <th className="p-2 text-center border">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="p-2 border text-center">{i + 1}</td>
                <td className="p-2 border">{item.product_name}</td>
                <td className="p-2 border font-mono text-xs">{item.oem_number}</td>
                <td className="p-2 border">{item.brand}</td>
                <td className="p-2 border text-center">{item.size}</td>
                <td className="p-2 border text-center">{item.quantity}</td>
                <td className="p-2 border text-center">${item.price.toFixed(2)}</td>
                <td className="p-2 border text-center font-semibold">${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-800 text-white font-bold">
              <td colSpan={7} className="p-2 border text-right">المجموع الكلي</td>
              <td className="p-2 border text-center">${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        {/* Footer */}
        <div className="flex justify-between items-end mt-12 pt-4 border-t border-gray-300">
          <div className="text-center">
            <div className="w-40 border-b border-gray-400 mb-1"></div>
            <p className="text-xs text-gray-500">توقيع المستلم</p>
          </div>
          <div className="text-center">
            <div className="w-40 border-b border-gray-400 mb-1"></div>
            <p className="text-xs text-gray-500">توقيع المسؤول</p>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-400 mt-8">تم الإنشاء بواسطة نظام {companyName} • {new Date().toLocaleDateString('ar-SA')}</p>
      </div>
    );
  }
);

InvoicePrint.displayName = 'InvoicePrint';
