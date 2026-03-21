import { toast as sonnerToast } from 'sonner';

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

export function toast({ title, description, variant, duration }: ToastProps) {
  if (variant === 'destructive') {
    return sonnerToast.error(title || 'خطأ', { description, duration });
  }
  return sonnerToast.success(title || 'نجاح', { description, duration });
}

export function useToast() {
  return { toast, dismiss: sonnerToast.dismiss };
}

