import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className="absolute inset-0 bg-spice-charcoal/60 backdrop-blur-sm animate-fade-in-up"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          'relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-spice-cream shadow-2xl animate-fade-in-up',
          className
        )}
      >
        {(title || onClose) && (
          <div className="flex items-center justify-between border-b border-spice-creamDark px-6 py-4">
            {title && (
              <h2
                id="modal-title"
                className="font-display text-lg font-semibold text-spice-charcoal"
              >
                {title}
              </h2>
            )}
            {title ? null : <div />}
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-spice-brown/70 transition-colors hover:bg-spice-creamDark hover:text-spice-charcoal"
              aria-label="关闭"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        <div className="px-6 py-5">
          {children}
        </div>

        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-spice-creamDark px-6 py-4 bg-spice-creamDark/30">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
