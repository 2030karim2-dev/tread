import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScanLine } from 'lucide-react';

interface BarcodeScannerProps {
  onResult: (result: string) => void;
  title?: string;
  triggerButton?: React.ReactNode;
}

export function BarcodeScanner({ onResult, title = 'مسح الباركود / QR', triggerButton }: BarcodeScannerProps) {
  const [open, setOpen] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (open) {
      // Delay initialization slightly to ensure modal is rendered
      const timer = setTimeout(() => {
        if (!document.getElementById('reader')) return;
        
        scannerRef.current = new Html5QrcodeScanner(
          'reader',
          { fps: 10, qrbox: { width: 250, height: 250 }, rememberLastUsedCamera: true },
          /* verbose= */ false
        );
        scannerRef.current.render(
          (decodedText) => {
            onResult(decodedText);
            setOpen(false); // Close after successful scan
          },
          (error) => {
            // Ignore frequent errors during scan to avoid spam
          }
        );
      }, 100);
      return () => clearTimeout(timer);
    } else {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    }
  }, [open, onResult]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline" size="icon" title="مسح باركود" type="button" className="flex-shrink-0">
            <ScanLine className="w-5 h-5 text-muted-foreground" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <div id="reader" className="w-full max-w-sm rounded-lg overflow-hidden border bg-black/5"></div>
          <p className="text-sm text-muted-foreground text-center">قم بتوجيه الكاميرا نحو الباركود أو رمز QR للمنتج</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
