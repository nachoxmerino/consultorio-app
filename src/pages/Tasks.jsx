import { useState, useMemo } from 'react'
import Header from '../components/layout/Header'
import { useData } from '../context/DataContext'
import Button from '../components/ui/Button'
import { generateWhatsAppLink } from '../lib/whatsapp'
import { generateReminderMessage } from '../lib/messages'
import { MessageCircle, Check, CheckCircle, AlertCircle } from 'lucide-react'

export default function Tasks() {
  const { appointments, getPatient, getDoctor, dispatch } = useData()
  const today = new Date().toISOString().split('T')[0]
  const [completedTasks, setCompletedTasks] = useState([])

  const tasks = useMemo(() => {
    const list = []
    appointments.filter(a => a.date >= today && a.status === 'pendiente').forEach(a => {
      const patient = getPatient(a.patient_id)
      const doctor = getDoctor(a.doctor_id)
      if (!patient || !doctor) return
      list.push({ id: `confirm-${a.id}`, type: 'confirm', text: `Confirmar turno de ${patient.first_name} ${patient.last_name}`, detail: `${a.date} — ${a.time?.slice(0, 5)} — Dr(a). ${doctor.first_name} ${doctor.last_name}`, appointment: a })
    })
    appointments.filter(a => a.date >= today && (a.status === 'pendiente' || a.status === 'confirmado')).forEach(a => {
      const patient = getPatient(a.patient_id)
      const doctor = getDoctor(a.doctor_id)
      if (!patient || !doctor) return
      list.push({ id: `remind-${a.id}`, type: 'remind', text: `Enviar recordatorio a ${patient.first_name} ${patient.last_name}`, detail: `${a.date} — ${a.time?.slice(0, 5)} — Dr(a). ${doctor.first_name} ${doctor.last_name}`, appointment: a })
    })
    return list
  }, [appointments, getPatient, getDoctor, today])

  const toggleTask = (id) => setCompletedTasks(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])

  const handleConfirm = (appt) => dispatch({ type: 'UPDATE_APPOINTMENT', payload: { id: appt.id, status: 'confirmado', action: 'confirmed', details: 'Confirmado desde tareas' } })

  const handleReminder = (appt) => {
    const patient = getPatient(appt.patient_id)
    const doctor = getDoctor(appt.doctor_id)
    if (!patient || !doctor) return
    window.open(generateWhatsAppLink(patient.phone, generateReminderMessage(appt, patient, doctor)), '_blank')
    dispatch({ type: 'ADD_REMINDER', payload: { appointment_id: appt.id, patient_id: patient.id, method: 'whatsapp', sent_by: 'Lucia Martinez' } })
  }

  const pending = tasks.filter(t => !completedTasks.includes(t.id))
  const completed = tasks.filter(t => completedTasks.includes(t.id))

  return (
    <div>
      <Header title="Tareas pendientes" subtitle={`${pending.length} tarea${pending.length !== 1 ? 's' : ''} pendiente${pending.length !== 1 ? 's' : ''}`} />

      <div className="space-y-1.5">
        {pending.length === 0 ? (
          <div className="card shadow-card p-12 text-center">
            <CheckCircle size={36} className="mx-auto text-success-500 mb-3" />
            <p className="text-[14px] font-medium text-text-primary">Todas las tareas completadas</p>
          </div>
        ) : pending.map(task => (
          <div key={task.id} className="card shadow-card px-4 py-3 flex items-center gap-3 hover:shadow-card-hover transition-default">
            <button onClick={() => toggleTask(task.id)} className="w-[18px] h-[18px] border-[1.5px] border-border rounded-[5px] shrink-0 hover:border-primary-400 cursor-pointer transition-default" />
            <div className={`w-7 h-7 rounded-[7px] flex items-center justify-center shrink-0 ${task.type === 'confirm' ? 'bg-[#fef8ec]' : 'bg-primary-50'}`}>
              {task.type === 'confirm' ? <AlertCircle size={14} className="text-warning-500" /> : <MessageCircle size={14} className="text-primary-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-text-primary">{task.text}</p>
              <p className="text-[11px] text-text-muted">{task.detail}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {task.type === 'confirm' && <Button variant="ghost" size="xs" onClick={() => handleConfirm(task.appointment)}><Check size={13} className="text-success-500" /> Confirmar</Button>}
              <Button variant="whatsapp" size="xs" onClick={() => handleReminder(task.appointment)}><MessageCircle size={13} /></Button>
            </div>
          </div>
        ))}
      </div>

      {completed.length > 0 && (
        <div className="mt-8">
          <p className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-2">Completadas ({completed.length})</p>
          <div className="space-y-1">
            {completed.map(task => (
              <div key={task.id} className="card shadow-card px-4 py-2.5 flex items-center gap-3 opacity-50">
                <button onClick={() => toggleTask(task.id)} className="w-[18px] h-[18px] bg-success-500 border-none rounded-[5px] shrink-0 cursor-pointer flex items-center justify-center"><Check size={11} className="text-white" /></button>
                <p className="text-[12px] text-text-muted line-through">{task.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
