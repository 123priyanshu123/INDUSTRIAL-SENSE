import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'max-w-xl',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full ${maxWidth} bg-[#1b1c1e] border border-[#38393b] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden`}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#292a2c] flex items-center justify-between">
          <h3 className="font-mono text-sm md:text-base font-bold text-white uppercase tracking-wider">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-[#292a2c] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-5 py-4 overflow-y-auto flex-1">{children}</div>

        {/* Modal Footer */}
        {footer && (
          <div className="px-5 py-3 border-t border-[#292a2c] bg-[#121315] flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
