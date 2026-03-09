import { ReactNode } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  trigger?: ReactNode;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'warning' | 'default';
  onConfirm: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmText = 'تأكيد',
  cancelText = 'إلغاء',
  variant = 'destructive',
  onConfirm,
  open,
  onOpenChange,
}: ConfirmDialogProps) {
  const iconMap = {
    destructive: <Trash2 className="w-5 h-5 text-destructive" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning" />,
    default: null,
  };

  const content = (
    <AlertDialogContent dir="rtl" className="max-w-md">
      <AlertDialogHeader>
        <AlertDialogTitle className="flex items-center gap-3 font-bold">
          {iconMap[variant]}
          {title}
        </AlertDialogTitle>
        <AlertDialogDescription className="text-sm leading-relaxed">
          {description}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="gap-2 sm:gap-0">
        <AlertDialogCancel className="font-medium">{cancelText}</AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          className={
            variant === 'destructive'
              ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
              : variant === 'warning'
              ? 'bg-warning text-warning-foreground hover:bg-warning/90'
              : ''
          }
        >
          {confirmText}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );

  if (open !== undefined) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
        {content}
      </AlertDialog>
    );
  }

  return (
    <AlertDialog>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      {content}
    </AlertDialog>
  );
}
