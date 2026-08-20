import clsx from 'clsx'

const statusStyles = {
  pendiente: 'bg-[#fef8ec] text-[#d48806]',
  confirmado: 'bg-primary-50 text-primary-500',
  atendido: 'bg-[#ecfaf4] text-success-500',
  cancelado: 'bg-surface text-text-muted',
  ausente: 'bg-danger-50 text-danger-500',
  reprogramado: 'bg-[#f3f0ff] text-[#7c3aed]',
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
  reprogramado: 'bg-[#7c3aed]',
}

export default function Badge({ status, size = 'md', showDot = false, className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap',
        statusStyles[status] || 'bg-surface text-text-secondary',
        size === 'sm' && 'px-2 py-0.5 text-[11px]',
        size === 'md' && 'px-2.5 py-1 text-[11px]',
        size === 'lg' && 'px-3 py-1 text-xs',
        className
      )}
    >
      {showDot && <span className={clsx('w-1.5 h-1.5 rounded-full', dotColors[status])} />}
      {statusLabels[status] || status}
    </span>
  )
}
