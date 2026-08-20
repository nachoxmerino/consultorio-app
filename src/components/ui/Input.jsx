import clsx from 'clsx'

export default function Input({ label, error, className, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-[14px] font-medium text-text-secondary">{label}</label>}
      <input
        className={clsx(
          'px-4 py-3 border border-border rounded-xl text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all duration-150 bg-white',
          error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-100',
          className
        )}
        {...props}
      />
      {error && <p className="text-[13px] text-danger-500">{error}</p>}
    </div>
  )
}

export function Select({ label, error, className, children, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-[14px] font-medium text-text-secondary">{label}</label>}
      <select
        className={clsx(
          'px-4 py-3 border border-border rounded-xl text-[14px] text-text-primary focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all duration-150 bg-white',
          error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-100',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-[13px] text-danger-500">{error}</p>}
    </div>
  )
}

export function Textarea({ label, error, className, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-[14px] font-medium text-text-secondary">{label}</label>}
      <textarea
        className={clsx(
          'px-4 py-3 border border-border rounded-xl text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all duration-150 bg-white resize-none',
          error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-100',
          className
        )}
        rows={3}
        {...props}
      />
      {error && <p className="text-[13px] text-danger-500">{error}</p>}
    </div>
  )
}
