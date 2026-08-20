import { useState, useEffect } from 'react'
import Header from '../components/layout/Header'
import { useData } from '../context/DataContext'
import Button from '../components/ui/Button'
import Input, { Select } from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import { Plus, Edit, Trash2, Clock } from 'lucide-react'

const dayLabels = ['', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']

function DoctorForm({ isOpen, onClose, doctor }) {
  const { dispatch, specialties } = useData()
  const isEdit = !!doctor
  const [form, setForm] = useState({ first_name: '', last_name: '', specialty: '', matricula: '', phone: '', email: '', duration: 30, avatar_color: '#4F6FEF' })

  useEffect(() => {
    if (doctor) setForm({ first_name: doctor.first_name || '', last_name: doctor.last_name || '', specialty: doctor.specialty || '', matricula: doctor.matricula || '', phone: doctor.phone || '', email: doctor.email || '', duration: doctor.duration || 30, avatar_color: doctor.avatar_color || '#4F6FEF' })
    else setForm({ first_name: '', last_name: '', specialty: '', matricula: '', phone: '', email: '', duration: 30, avatar_color: '#4F6FEF' })
  }, [doctor, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.first_name || !form.last_name || !form.specialty) return
    if (isEdit) dispatch({ type: 'UPDATE_DOCTOR', payload: { id: doctor.id, ...form } })
    else dispatch({ type: 'ADD_DOCTOR', payload: form })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Editar profesional' : 'Nuevo profesional'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Nombre *" value={form.first_name} onChange={(e) => setForm(f => ({ ...f, first_name: e.target.value }))} required />
          <Input label="Apellido *" value={form.last_name} onChange={(e) => setForm(f => ({ ...f, last_name: e.target.value }))} required />
          <Select label="Especialidad *" value={form.specialty} onChange={(e) => setForm(f => ({ ...f, specialty: e.target.value }))} required>
            <option value="">Seleccionar...</option>
            {specialties.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
          </Select>
          <Input label="Matricula" value={form.matricula} onChange={(e) => setForm(f => ({ ...f, matricula: e.target.value }))} />
          <Input label="Telefono" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
          <Input label="Duracion (min)" type="number" value={form.duration} onChange={(e) => setForm(f => ({ ...f, duration: parseInt(e.target.value) || 30 }))} />
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-text-secondary">Color</label>
            <input type="color" value={form.avatar_color} onChange={(e) => setForm(f => ({ ...f, avatar_color: e.target.value }))} className="w-full h-10 rounded-[10px] border border-border cursor-pointer" />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-3 border-t border-border-light">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">{isEdit ? 'Guardar' : 'Crear'}</Button>
        </div>
      </form>
    </Modal>
  )
}

function ScheduleManager({ doctor, onClose }) {
  const { doctorSchedules, dispatch } = useData()
  const schedules = doctorSchedules.filter(s => s.doctor_id === doctor.id && !s.removed)
  const [newSchedule, setNewSchedule] = useState({ day_of_week: 1, start_time: '08:00', end_time: '13:00' })

  return (
    <Modal isOpen={true} onClose={onClose} title={`Horarios — Dr(a). ${doctor.first_name} ${doctor.last_name}`}>
      <div className="space-y-4">
        <div className="space-y-1.5">
          {schedules.map(s => (
            <div key={s.id} className="flex items-center gap-3 bg-surface rounded-[8px] px-4 py-2.5">
              <span className="text-[13px] font-medium text-text-primary w-28">{dayLabels[s.day_of_week]}</span>
              <span className="text-[13px] text-text-secondary tabular-nums">{s.start_time} — {s.end_time}</span>
              <button onClick={() => dispatch({ type: 'UPDATE_SCHEDULE', payload: { id: s.id, removed: true } })} className="ml-auto p-1 rounded-[6px] hover:bg-danger-50 cursor-pointer"><Trash2 size={13} className="text-danger-500" /></button>
            </div>
          ))}
          {schedules.length === 0 && <p className="text-[12px] text-text-muted text-center py-4">Sin horarios configurados</p>}
        </div>
        <div className="border-t border-border-light pt-4">
          <p className="text-[12px] font-medium text-text-secondary mb-2">Agregar horario</p>
          <div className="flex items-end gap-2">
            <Select value={newSchedule.day_of_week} onChange={(e) => setNewSchedule(s => ({ ...s, day_of_week: parseInt(e.target.value) }))}>
              {[1, 2, 3, 4, 5, 6].map(d => <option key={d} value={d}>{dayLabels[d]}</option>)}
            </Select>
            <Input type="time" value={newSchedule.start_time} onChange={(e) => setNewSchedule(s => ({ ...s, start_time: e.target.value }))} />
            <span className="text-text-muted pb-2.5 text-[12px]">a</span>
            <Input type="time" value={newSchedule.end_time} onChange={(e) => setNewSchedule(s => ({ ...s, end_time: e.target.value }))} />
            <Button type="button" size="sm" onClick={() => dispatch({ type: 'ADD_SCHEDULE', payload: { ...newSchedule, doctor_id: doctor.id } })}>+</Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default function Doctors() {
  const { doctors, specialties, appointments, dispatch } = useData()
  const [showForm, setShowForm] = useState(false)
  const [editDoctor, setEditDoctor] = useState(null)
  const [scheduleDoctor, setScheduleDoctor] = useState(null)
  const today = new Date().toISOString().split('T')[0]

  return (
    <div>
      <Header title="Profesionales" subtitle={`${doctors.length} profesionales`} actions={
        <Button onClick={() => { setEditDoctor(null); setShowForm(true) }}><Plus size={16} /> Nuevo profesional</Button>
      } />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map(doc => {
          const docAppts = appointments.filter(a => a.doctor_id === doc.id && a.date === today)
          return (
            <div key={doc.id} className="card shadow-card hover:shadow-card-hover p-5 transition-default">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-[14px] shrink-0" style={{ backgroundColor: doc.avatar_color }}>
                  {doc.first_name[0]}{doc.last_name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-semibold text-text-primary">Dr(a). {doc.first_name} {doc.last_name}</h3>
                  <p className="text-[12px] text-text-secondary">{doc.specialty}</p>
                  <p className="text-[11px] text-text-muted">{doc.matricula}</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border-light flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[12px] text-text-secondary">
                  <Clock size={13} className="text-text-muted" /> {doc.duration} min
                </div>
                <div className="text-[12px] text-text-secondary">{docAppts.length} turno{docAppts.length !== 1 ? 's' : ''} hoy</div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="secondary" size="xs" className="flex-1" onClick={() => setScheduleDoctor(doc)}><Clock size={13} /> Horarios</Button>
                <Button variant="ghost" size="xs" onClick={() => { setEditDoctor(doc); setShowForm(true) }}><Edit size={13} /></Button>
                <button onClick={() => { if (confirm('Eliminar?')) dispatch({ type: 'DELETE_DOCTOR', payload: doc.id }) }} className="p-1.5 rounded-[7px] hover:bg-danger-50 cursor-pointer"><Trash2 size={13} className="text-danger-500" /></button>
              </div>
            </div>
          )
        })}
      </div>

      <DoctorForm isOpen={showForm} onClose={() => { setShowForm(false); setEditDoctor(null) }} doctor={editDoctor} />
      {scheduleDoctor && <ScheduleManager doctor={scheduleDoctor} onClose={() => setScheduleDoctor(null)} />}
    </div>
  )
}
