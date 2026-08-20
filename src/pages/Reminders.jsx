import { useState, useMemo } from 'react'
import Header from '../components/layout/Header'
import { useData } from '../context/DataContext'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { generateWhatsAppLink } from '../lib/whatsapp'
import { generateReminderMessage } from '../lib/messages'
import { MessageCircle, Check, Phone } from 'lucide-react'

export default function Reminders() {
  const { appointments, reminders, getPatient, getDoctor, dispatch } = useData()
  const today = new Date().toISOString().split('T')[0]
  const [tab, setTab] = useState('pending')

  const upcoming = useMemo(() => appointments.filter(a => a.date >= today && (a.status === 'pendiente' || a.status === 'confirmado')), [appointments, today])

  const pendingReminders = useMemo(() => {
    const reminded = reminders.map(r => r.appointment_id)
    return upcoming.filter(a => !reminded.includes(a.id)).sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
  }, [upcoming, reminders])

  const sentReminders = useMemo(() => reminders.filter(r => upcoming.some(a => a.id === r.appointment_id)).sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at)).map(r => ({ ...r, appointment: appointments.find(a => a.id === r.appointment_id) })).filter(r => r.appointment), [reminders, upcoming, appointments])

  const handleSend = (appt) => {
    const patient = getPatient(appt.patient_id)
    const doctor = getDoctor(appt.doctor_id)
    if (!patient || !doctor) return
    window.open(generateWhatsAppLink(patient.phone, generateReminderMessage(appt, patient, doctor)), '_blank')
    dispatch({ type: 'ADD_REMINDER', payload: { appointment_id: appt.id, patient_id: patient.id, method: 'whatsapp', sent_by: 'Lucia Martinez' } })
  }

  return (
    <div>
      <Header title="Recordatorios" subtitle="Gestion de recordatorios por WhatsApp" />

      <div className="flex gap-1 bg-surface rounded-[10px] p-0.5 mb-6 max-w-[280px] border border-border-light">
        <button onClick={() => setTab('pending')} className={`flex-1 px-3 py-2 rounded-[8px] text-[12px] font-medium transition-default cursor-pointer ${tab === 'pending' ? 'bg-white shadow-card text-text-primary' : 'text-text-muted'}`}>
          Pendientes ({pendingReminders.length})
        </button>
        <button onClick={() => setTab('sent')} className={`flex-1 px-3 py-2 rounded-[8px] text-[12px] font-medium transition-default cursor-pointer ${tab === 'sent' ? 'bg-white shadow-card text-text-primary' : 'text-text-muted'}`}>
          Enviados ({sentReminders.length})
        </button>
      </div>

      {tab === 'pending' ? (
        <div className="space-y-2">
          {pendingReminders.length === 0 ? (
            <div className="card shadow-card p-12 text-center">
              <Check size={36} className="mx-auto text-success-500 mb-3" />
              <p className="text-[14px] font-medium text-text-primary">Todos los recordatorios enviados</p>
              <p className="text-[12px] text-text-muted mt-1">No hay turnos pendientes de recordatorio</p>
            </div>
          ) : pendingReminders.map(appt => {
            const patient = getPatient(appt.patient_id)
            const doctor = getDoctor(appt.doctor_id)
            if (!patient || !doctor) return null
            return (
              <div key={appt.id} className="card shadow-card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="w-9 h-9 bg-primary-50 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-primary-500 text-[11px] font-semibold">{patient.first_name[0]}{patient.last_name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-text-primary">{patient.first_name} {patient.last_name}</p>
                  <p className="text-[12px] text-text-muted">Turno: {appt.date} — {appt.time?.slice(0, 5)}</p>
                  <p className="text-[11px] text-text-muted">Dr(a). {doctor.first_name} {doctor.last_name} — {patient.phone}</p>
                </div>
                <Button variant="whatsapp" size="sm" onClick={() => handleSend(appt)}><MessageCircle size={14} /> WhatsApp</Button>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="space-y-1.5">
          {sentReminders.length === 0 ? (
            <div className="card shadow-card p-12 text-center">
              <MessageCircle size={36} className="mx-auto text-text-muted mb-3" />
              <p className="text-[13px] text-text-muted">No hay recordatorios enviados aun</p>
            </div>
          ) : sentReminders.map(r => {
            const patient = getPatient(r.patient_id)
            const doctor = r.appointment ? getDoctor(r.appointment.doctor_id) : null
            return (
              <div key={r.id} className="card shadow-card px-4 py-3 flex items-center gap-3">
                <div className="w-7 h-7 bg-[#ecfaf4] rounded-full flex items-center justify-center shrink-0"><Check size={13} className="text-success-500" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-text-primary">{patient?.first_name} {patient?.last_name}</p>
                  <p className="text-[11px] text-text-muted">{r.appointment?.date} — {r.appointment?.time?.slice(0, 5)} — Dr(a). {doctor?.first_name} {doctor?.last_name}</p>
                </div>
                <Badge status={r.appointment?.status} size="sm" />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
