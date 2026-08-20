import { useState, useEffect, useMemo } from 'react'
import { useData } from '../../context/DataContext'
import Button from '../ui/Button'
import Input, { Select, Textarea } from '../ui/Input'
import Modal from '../ui/Modal'
import { format } from 'date-fns'

export default function AppointmentForm({ isOpen, onClose, appointment, preselectedDate, preselectedDoctor }) {
  const { patients, doctors, isSlotAvailable, dispatch } = useData()
  const isEdit = !!appointment

  const [form, setForm] = useState({ patient_id: '', doctor_id: '', date: preselectedDate || format(new Date(), 'yyyy-MM-dd'), time: '', reason: '', notes: '', status: 'pendiente' })
  const [newPatient, setNewPatient] = useState(false)
  const [patientSearch, setPatientSearch] = useState('')
  const [availableSlots, setAvailableSlots] = useState([])
  const [error, setError] = useState('')
  const [newPatientForm, setNewPatientForm] = useState({ first_name: '', last_name: '', dni: '', phone: '', email: '', birth_date: '', insurance: '', insurance_number: '', notes: '' })

  useEffect(() => {
    if (appointment) {
      setForm({ patient_id: appointment.patient_id, doctor_id: appointment.doctor_id, date: appointment.date, time: appointment.time, reason: appointment.reason || '', notes: appointment.notes || '', status: appointment.status })
      const p = patients.find(pt => pt.id === appointment.patient_id)
      if (p) setPatientSearch(`${p.first_name} ${p.last_name}`)
    } else {
      setForm({ patient_id: '', doctor_id: preselectedDoctor || '', date: preselectedDate || format(new Date(), 'yyyy-MM-dd'), time: '', reason: '', notes: '', status: 'pendiente' })
      setPatientSearch('')
    }
    setNewPatient(false)
    setError('')
  }, [appointment, isOpen, preselectedDate, preselectedDoctor, patients])

  useEffect(() => {
    if (form.doctor_id && form.date) {
      const duration = doctors.find(d => d.id === form.doctor_id)?.duration || 30
      const slots = []
      for (let h = 8; h < 18; h++) {
        for (let m = 0; m < 60; m += duration) {
          const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
          if (isSlotAvailable(form.doctor_id, form.date, time, appointment?.id)) slots.push(time)
        }
      }
      setAvailableSlots(slots)
    }
  }, [form.doctor_id, form.date, isSlotAvailable, appointment?.id, doctors])

  const filteredPatients = useMemo(() =>
    patients.filter(p => `${p.first_name} ${p.last_name} ${p.dni} ${p.phone}`.toLowerCase().includes(patientSearch.toLowerCase())),
    [patients, patientSearch]
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!newPatient && !form.patient_id) { setError('Seleccione un paciente'); return }
    if (!form.doctor_id) { setError('Seleccione un medico'); return }
    if (!form.date) { setError('Seleccione una fecha'); return }
    if (!form.time) { setError('Seleccione un horario'); return }

    let patientId = form.patient_id
    if (newPatient) {
      if (!newPatientForm.first_name || !newPatientForm.last_name || !newPatientForm.phone) { setError('Complete nombre, apellido y telefono'); return }
      const newP = { ...newPatientForm, id: Date.now().toString(), created_at: new Date().toISOString() }
      dispatch({ type: 'ADD_PATIENT', payload: newP })
      patientId = newP.id
    }

    if (isEdit) {
      dispatch({ type: 'UPDATE_APPOINTMENT', payload: { ...form, id: appointment.id, patient_id: patientId, action: 'updated', details: 'Turno actualizado' } })
    } else {
      dispatch({ type: 'ADD_APPOINTMENT', payload: { ...form, patient_id: patientId, reminder_sent: false } })
    }
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Editar turno' : 'Nuevo turno'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="bg-danger-50 text-danger-500 text-[12px] px-4 py-2.5 rounded-[10px]">{error}</div>}

        <div className="flex gap-2 mb-1">
          <Button type="button" variant={!newPatient ? 'primary' : 'secondary'} size="xs" onClick={() => setNewPatient(false)}>Paciente existente</Button>
          <Button type="button" variant={newPatient ? 'primary' : 'secondary'} size="xs" onClick={() => setNewPatient(true)}>Nuevo paciente</Button>
        </div>

        {!newPatient ? (
          <div>
            <Input label="Buscar paciente" placeholder="Nombre, DNI o telefono..." value={patientSearch} onChange={(e) => { setPatientSearch(e.target.value); setForm(f => ({ ...f, patient_id: '' })) }} />
            {patientSearch && filteredPatients.length > 0 && !form.patient_id && (
              <div className="mt-1 max-h-36 overflow-y-auto border border-border rounded-[10px]">
                {filteredPatients.map(p => (
                  <button key={p.id} type="button" onClick={() => { setForm(f => ({ ...f, patient_id: p.id })); setPatientSearch(`${p.first_name} ${p.last_name}`) }} className="w-full text-left px-3 py-2 text-[12px] hover:bg-surface cursor-pointer">
                    {p.first_name} {p.last_name} — DNI: {p.dni}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Input label="Nombre" value={newPatientForm.first_name} onChange={(e) => setNewPatientForm(f => ({ ...f, first_name: e.target.value }))} />
            <Input label="Apellido" value={newPatientForm.last_name} onChange={(e) => setNewPatientForm(f => ({ ...f, last_name: e.target.value }))} />
            <Input label="DNI" value={newPatientForm.dni} onChange={(e) => setNewPatientForm(f => ({ ...f, dni: e.target.value }))} />
            <Input label="Telefono" value={newPatientForm.phone} onChange={(e) => setNewPatientForm(f => ({ ...f, phone: e.target.value }))} />
            <Input label="Email" value={newPatientForm.email} onChange={(e) => setNewPatientForm(f => ({ ...f, email: e.target.value }))} />
            <Input label="Fecha de nacimiento" type="date" value={newPatientForm.birth_date} onChange={(e) => setNewPatientForm(f => ({ ...f, birth_date: e.target.value }))} />
            <Input label="Obra social" value={newPatientForm.insurance} onChange={(e) => setNewPatientForm(f => ({ ...f, insurance: e.target.value }))} />
            <Input label="Nro afiliado" value={newPatientForm.insurance_number} onChange={(e) => setNewPatientForm(f => ({ ...f, insurance_number: e.target.value }))} />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Select label="Medico" value={form.doctor_id} onChange={(e) => setForm(f => ({ ...f, doctor_id: e.target.value, time: '' }))}>
            <option value="">Seleccionar...</option>
            {doctors.map(d => <option key={d.id} value={d.id}>Dr(a). {d.first_name} {d.last_name} — {d.specialty}</option>)}
          </Select>
          <Input label="Fecha" type="date" value={form.date} onChange={(e) => setForm(f => ({ ...f, date: e.target.value, time: '' }))} />
        </div>

        {form.doctor_id && form.date && (
          <div>
            <label className="text-[13px] font-medium text-text-secondary block mb-2">Horarios disponibles</label>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
              {availableSlots.length === 0 ? (
                <p className="text-[12px] text-text-muted">No hay horarios disponibles</p>
              ) : availableSlots.map(slot => (
                <button key={slot} type="button" onClick={() => setForm(f => ({ ...f, time: slot }))} className={`px-2.5 py-1.5 rounded-[8px] text-[12px] font-medium transition-default cursor-pointer ${form.time === slot ? 'bg-primary-500 text-white' : 'bg-primary-50 text-primary-500 hover:bg-primary-100 border border-primary-100'}`}>
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        <Input label="Motivo" value={form.reason} onChange={(e) => setForm(f => ({ ...f, reason: e.target.value }))} placeholder="Ej: Control, primera consulta..." />
        <Textarea label="Observaciones" value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} />

        <div className="flex justify-end gap-2 pt-3 border-t border-border-light">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">{isEdit ? 'Guardar cambios' : 'Crear turno'}</Button>
        </div>
      </form>
    </Modal>
  )
}
