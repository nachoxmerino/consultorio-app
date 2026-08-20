import clsx from 'clsx'
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children, size = 'md', className }) {
  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30"
        style={{ animation: 'fadeIn 0.15s ease-out' }}
        onClick={onClose}
      />
      <div
        className={clsx(
          'relative bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] flex flex-col',
          sizes[size],
          className
        )}
        style={{ animation: 'slideUp 0.2s ease-out' }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="text-[16px] font-semibold text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-150 cursor-pointer"
          >
            <X size={18} className="text-text-muted" />
          </button>
        </div>
        <div className="px-6 py-6 overflow-y-auto scrollbar-thin">
          {children}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
