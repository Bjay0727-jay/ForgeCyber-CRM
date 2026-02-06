import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-forge-navy/60 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className="relative w-full max-w-[900px] max-h-[90vh] mx-4 bg-white rounded-2xl shadow-2xl flex flex-col animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-forge-border flex-shrink-0">
          <h2 className="font-heading text-xl font-bold text-forge-navy">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-forge-text-muted hover:bg-forge-bg hover:text-forge-text transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-forge-border flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
