import clsx from 'clsx'

const variants = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm',
  secondary: 'bg-white text-text-secondary border border-border hover:bg-surface hover:text-text-primary',
  danger: 'bg-danger-500 text-white hover:bg-danger-600',
  success: 'bg-success-500 text-white hover:bg-success-600',
  warning: 'bg-warning-500 text-white hover:bg-warning-600',
  ghost: 'text-text-secondary hover:bg-surface hover:text-text-primary',
  whatsapp: 'bg-[#25d366] text-white hover:bg-[#1da851]',
  'ghost-primary': 'text-primary-500 hover:bg-primary-50',
}

const sizes = {
  xs: 'px-2.5 py-1 text-[11px]',
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-[13px]',
  lg: 'px-5 py-2.5 text-sm',
}

export default function Button({ variant = 'primary', size = 'md', className, children, ...props }) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-1.5 font-medium rounded-[10px] transition-default cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
