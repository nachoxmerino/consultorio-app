import clsx from 'clsx'

const variants = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600',
  secondary: 'bg-white text-text-secondary border border-border hover:bg-gray-50 hover:text-text-primary',
  danger: 'bg-danger-500 text-white hover:bg-danger-600',
  success: 'bg-success-500 text-white hover:bg-success-600',
  warning: 'bg-warning-500 text-white hover:bg-warning-600',
  ghost: 'text-text-secondary hover:bg-gray-50 hover:text-text-primary',
  whatsapp: 'bg-[#25D366] text-white hover:bg-[#1da851]',
  'ghost-primary': 'text-primary-500 hover:bg-primary-50',
}

const sizes = {
  xs: 'px-3 py-1.5 text-[12px]',
  sm: 'px-3.5 py-2 text-[13px]',
  md: 'px-4 py-2.5 text-[14px]',
  lg: 'px-5 py-2.5 text-[14px]',
}

export default function Button({ variant = 'primary', size = 'md', className, children, ...props }) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none',
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
