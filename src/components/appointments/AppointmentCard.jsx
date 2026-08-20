import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { useData } from '../../context/DataContext'
import { generateWhatsAppLink } from '../../lib/whatsapp'
import { generateReminderMessage } from '../../lib/messages'
import { MessageCircle, Edit, MoreHorizontal, Check, UserCheck, CalendarX, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'

function ActionMenu({ appointment, onEdit, onClose }) {
  const { dispatch } = useData()
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const handleStatusChange = (status) => {
    dispatch({
      type: 'UPDATE_APPOINTMENT',
      payload: { id: appointment.id, status, action: status, details: `Estado cambiado a ${status}` }
    })
    onClose()
  }

  const items = [
    { label: 'Confirmar', icon: Check, color: 'text-success-500', show: appointment.status === 'pendiente', onClick: () => handleStatusChange('confirmado') },
    { label: 'Marcar atendido', icon: UserCheck, color: 'text-primary-500', show: appointment.status === 'confirmado', onClick: () => handleStatusChange('atendido') },
    { label: 'Marcar ausente', icon: CalendarX, color: 'text-danger-500', show: appointment.status === 'confirmado', onClick: () => handleStatusChange('ausente') },
    { label: 'Cancelar', icon: X, color: 'text-text-muted', show: !['cancelado', 'atendido', 'ausente'].includes(appointment.status), onClick: () => handleStatusChange('cancelado') },
    { label: 'Editar', icon: Edit, color: 'text-text-secondary', show: !!onEdit, onClick: () => { onEdit?.(appointment); onClose() } },
  ].filter(i => i.show)

  if (items.length === 0) return null

  return (
    <div ref={ref} className="absolute right-0 top-full mt-1 w-44 bg-white rounded-[10px] shadow-[0_8px_30px_rgba(23,33,61,0.1)] border border-border-light z-50 py-1">
      {items.map(({ label, icon: Icon, color, onClick }) => (
        <button
          key={label}
          onClick={onClick}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-text-primary hover:bg-surface transition-default cursor-pointer"
        >
          <Icon size={15} className={color} />
          {label}
        </button>
      ))}
    </div>
  )
}

export default function AppointmentCard({ appointment, onEdit, compact = false, showPatient = true, showDoctor = true }) {
  const { getPatient, getDoctor, dispatch, reminders } = useData()
  const patient = getPatient(appointment.patient_id)
  const doctor = getDoctor(appointment.doctor_id)
  const [menuOpen, setMenuOpen] = useState(false)

  if (!patient || !doctor) return null

  const hasReminder = reminders.some(r => r.appointment_id === appointment.id)

  const handleReminder = () => {
    const message = generateReminderMessage(appointment, patient, doctor)
    const link = generateWhatsAppLink(patient.phone, message)
    window.open(link, '_blank')
    dispatch({
      type: 'ADD_REMINDER',
      payload: { appointment_id: appointment.id, patient_id: patient.id, method: 'whatsapp', sent_by: 'Lucia Martinez' }
    })
  }

  if (compact) {
    return (
      <div className={clsx(
        'flex items-center gap-3 px-4 py-2.5 rounded-[10px] transition-default hover:bg-surface group',
        appointment.status === 'cancelado' && 'opacity-40',
      )}>
        <div className="w-1.5 h-8 rounded-full shrink-0" style={{ backgroundColor: doctor.avatar_color || '#4F6FEF' }} />
        <div className="text-[13px] font-semibold text-text-primary w-12 shrink-0 tabular-nums">{appointment.time?.slice(0, 5)}</div>
        <div className="flex-1 min-w-0">
          {showPatient && <p className="text-[13px] font-medium text-text-primary truncate">{patient.first_name} {patient.last_name}</p>}
          {showDoctor && <p className="text-[11px] text-text-muted truncate">Dr(a). {doctor.first_name} {doctor.last_name}</p>}
        </div>
        <Badge status={appointment.status} size="sm" />
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-default">
          {appointment.status === 'pendiente' && (
            <button onClick={handleReminder} className="p-1.5 rounded-[7px] hover:bg-[#25d366]/10 transition-default cursor-pointer" title="WhatsApp">
              <MessageCircle size={15} className="text-[#25d366]" />
            </button>
          )}
          {onEdit && (
            <button onClick={() => onEdit(appointment)} className="p-1.5 rounded-[7px] hover:bg-surface transition-default cursor-pointer" title="Editar">
              <Edit size={15} className="text-text-muted" />
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={clsx(
      'bg-white rounded-[12px] border border-border p-4 transition-default hover:shadow-card-hover',
      appointment.status === 'cancelado' && 'opacity-40',
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-1.5 h-full min-h-[40px] rounded-full shrink-0 mt-0.5" style={{ backgroundColor: doctor.avatar_color || '#4F6FEF' }} />
          <div>
            <p className="text-[14px] font-semibold text-text-primary">{patient.first_name} {patient.last_name}</p>
            <p className="text-[12px] text-text-secondary mt-0.5">Dr(a). {doctor.first_name} {doctor.last_name} — {doctor.specialty}</p>
            {appointment.reason && <p className="text-[11px] text-text-muted mt-1">{appointment.reason}</p>}
          </div>
        </div>
        <Badge status={appointment.status} />
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border-light">
        <Button variant="whatsapp" size="xs" onClick={handleReminder}>
          <MessageCircle size={13} />
          {hasReminder ? 'Reenviar' : 'Recordatorio'}
        </Button>
        {onEdit && (
          <Button variant="ghost" size="xs" onClick={() => onEdit(appointment)}>
            <Edit size={13} /> Editar
          </Button>
        )}
      </div>
    </div>
  )
}
