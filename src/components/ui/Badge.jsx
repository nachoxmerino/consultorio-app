import clsx from 'clsx'

const statusStyles = {
  pendiente: 'bg-warning-50 text-warning-600',
  confirmado: 'bg-primary-50 text-primary-600',
  atendido: 'bg-success-50 text-success-600',
  cancelado: 'bg-gray-100 text-text-muted',
  ausente: 'bg-danger-50 text-danger-500',
  reprogramado: 'bg-purple-50 text-purple-600',
}

const statusLabels = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  atendido: 'Atendido',
  cancelado: 'Cancelado',
  ausente: 'Ausente',
  reprogramado: 'Reprogramado',
}

const dotColors = {
  pendiente: 'bg-warning-500',
  confirmado: 'bg-primary-500',
  atendido: 'bg-success-500',
  cancelado: 'bg-text-muted',
  ausente: 'bg-danger-500',
  reprogramado: 'bg-purple-500',
}

export default function Badge({ status, size = 'md', showDot = false, className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap',
        statusStyles[status] || 'bg-gray-100 text-text-secondary',
        size === 'sm' && 'px-2.5 py-1 text-[12px]',
        size === 'md' && 'px-3 py-1 text-[12px]',
        size === 'lg' && 'px-3.5 py-1.5 text-[13px]',
        className
      )}
    >
      {showDot && <span className={clsx('w-1.5 h-1.5 rounded-full', dotColors[status])} />}
      {statusLabels[status] || status}
    </span>
  )
}
