import clsx from 'clsx'

export default function Input({ label, error, className, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[13px] font-medium text-text-secondary">{label}</label>}
      <input
        className={clsx(
          'px-3.5 py-2.5 border border-border rounded-[10px] text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-default bg-white',
          error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-50',
          className
        )}
        {...props}
      />
      {error && <p className="text-[11px] text-danger-500">{error}</p>}
    </div>
  )
}

export function Select({ label, error, className, children, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[13px] font-medium text-text-secondary">{label}</label>}
      <select
        className={clsx(
          'px-3.5 py-2.5 border border-border rounded-[10px] text-[13px] text-text-primary focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-default bg-white',
          error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-50',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-[11px] text-danger-500">{error}</p>}
    </div>
  )
}

export function Textarea({ label, error, className, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[13px] font-medium text-text-secondary">{label}</label>}
      <textarea
        className={clsx(
          'px-3.5 py-2.5 border border-border rounded-[10px] text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-default bg-white resize-none',
          error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-50',
          className
        )}
        rows={3}
        {...props}
      />
      {error && <p className="text-[11px] text-danger-500">{error}</p>}
    </div>
  )
}
