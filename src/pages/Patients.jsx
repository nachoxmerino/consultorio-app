import { useState, useEffect, useMemo } from 'react'
import Header from '../components/layout/Header'
import { useData } from '../context/DataContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import Badge from '../components/ui/Badge'
import { Plus, Search, Edit, Trash2, Eye, Phone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatPhone } from '../lib/whatsapp'

function PatientForm({ isOpen, onClose, patient }) {
  const { dispatch } = useData()
  const isEdit = !!patient
  const [form, setForm] = useState({ first_name: '', last_name: '', dni: '', phone: '', email: '', birth_date: '', insurance: '', insurance_number: '', notes: '' })

  useEffect(() => {
    if (patient) {
      setForm({ first_name: patient.first_name || '', last_name: patient.last_name || '', dni: patient.dni || '', phone: patient.phone || '', email: patient.email || '', birth_date: patient.birth_date || '', insurance: patient.insurance || '', insurance_number: patient.insurance_number || '', notes: patient.notes || '' })
    } else {
      setForm({ first_name: '', last_name: '', dni: '', phone: '', email: '', birth_date: '', insurance: '', insurance_number: '', notes: '' })
    }
  }, [patient, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.first_name || !form.last_name || !form.phone) return
    if (isEdit) dispatch({ type: 'UPDATE_PATIENT', payload: { id: patient.id, ...form } })
    else dispatch({ type: 'ADD_PATIENT', payload: form })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Editar paciente' : 'Nuevo paciente'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Nombre *" value={form.first_name} onChange={(e) => setForm(f => ({ ...f, first_name: e.target.value }))} required />
          <Input label="Apellido *" value={form.last_name} onChange={(e) => setForm(f => ({ ...f, last_name: e.target.value }))} required />
          <Input label="DNI" value={form.dni} onChange={(e) => setForm(f => ({ ...f, dni: e.target.value }))} />
          <Input label="Telefono *" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} required placeholder="1144441234" />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
          <Input label="Fecha de nacimiento" type="date" value={form.birth_date} onChange={(e) => setForm(f => ({ ...f, birth_date: e.target.value }))} />
          <Input label="Obra social" value={form.insurance} onChange={(e) => setForm(f => ({ ...f, insurance: e.target.value }))} />
          <Input label="Nro. afiliado" value={form.insurance_number} onChange={(e) => setForm(f => ({ ...f, insurance_number: e.target.value }))} />
        </div>
        <Input label="Observaciones" value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} />
        <div className="flex justify-end gap-2 pt-3 border-t border-border-light">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">{isEdit ? 'Guardar' : 'Crear paciente'}</Button>
        </div>
      </form>
    </Modal>
  )
}

function PatientDetail({ patient, onClose }) {
  const { appointments, getDoctor } = useData()
  const patientAppts = appointments.filter(a => a.patient_id === patient.id).sort((a, b) => new Date(b.date) - new Date(a.date))
  const today = new Date().toISOString().split('T')[0]
  const nextAppt = patientAppts.find(a => a.date >= today && a.status !== 'cancelado')

  return (
    <Modal isOpen={true} onClose={onClose} title="Ficha del paciente" size="lg">
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center">
            <span className="text-primary-500 text-lg font-bold">{patient.first_name[0]}{patient.last_name[0]}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary">{patient.first_name} {patient.last_name}</h3>
            <p className="text-[13px] text-text-muted">DNI: {patient.dni}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 bg-surface rounded-[12px] p-4">
          {[
            ['Telefono', formatPhone(patient.phone)],
            ['Email', patient.email || '—'],
            ['Obra social', patient.insurance || '—'],
            ['Nro. afiliado', patient.insurance_number || '—'],
            ['Nacimiento', patient.birth_date || '—'],
            ['Alta', patient.created_at?.slice(0, 10) || '—'],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-[11px] text-text-muted">{label}</p>
              <p className="text-[13px] font-medium text-text-primary">{value}</p>
            </div>
          ))}
        </div>
        {patient.notes && (
          <div className="bg-[#fef8ec] border border-[#fde68a] rounded-[12px] p-4">
            <p className="text-[11px] text-[#d48806] font-medium mb-0.5">Observaciones</p>
            <p className="text-[13px] text-text-primary">{patient.notes}</p>
          </div>
        )}
        {nextAppt && (
          <div>
            <h4 className="text-[12px] font-semibold text-text-secondary mb-2">Proximo turno</h4>
            <div className="bg-primary-50 border border-primary-100 rounded-[12px] p-3 flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-primary-600">{nextAppt.date} — {nextAppt.time?.slice(0, 5)}</p>
                <p className="text-[12px] text-primary-500">Dr(a). {getDoctor(nextAppt.doctor_id)?.first_name} {getDoctor(nextAppt.doctor_id)?.last_name}</p>
              </div>
              <Badge status={nextAppt.status} />
            </div>
          </div>
        )}
        <div>
          <h4 className="text-[12px] font-semibold text-text-secondary mb-2">Historial</h4>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {patientAppts.map(a => {
              const doctor = getDoctor(a.doctor_id)
              return (
                <div key={a.id} className="flex items-center gap-3 px-3 py-2 rounded-[8px] hover:bg-surface">
                  <div className="text-[11px] text-text-muted w-20 shrink-0 tabular-nums">{a.date?.slice(5).replace('-', '/')}</div>
                  <div className="text-[12px] text-text-secondary flex-1">Dr(a). {doctor?.first_name} {doctor?.last_name}</div>
                  <Badge status={a.status} size="sm" />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default function Patients() {
  const { patients, appointments, dispatch } = useData()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editPatient, setEditPatient] = useState(null)
  const [viewPatient, setViewPatient] = useState(null)

  const filtered = useMemo(() =>
    patients.filter(p => `${p.first_name} ${p.last_name} ${p.dni} ${p.phone}`.toLowerCase().includes(search.toLowerCase())).sort((a, b) => a.last_name.localeCompare(b.last_name)),
    [patients, search]
  )

  return (
    <div>
      <Header title="Pacientes" subtitle={`${patients.length} pacientes registrados`} actions={
        <Button onClick={() => { setEditPatient(null); setShowForm(true) }}><Plus size={16} /> Nuevo paciente</Button>
      } />

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" placeholder="Buscar por nombre, DNI o telefono..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-border rounded-[10px] text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-50 bg-white transition-default" />
        </div>
      </div>

      <div className="card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left px-5 py-3 text-[11px] font-medium text-text-muted uppercase tracking-wider">Paciente</th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-text-muted uppercase tracking-wider">DNI</th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-text-muted uppercase tracking-wider">Telefono</th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-text-muted uppercase tracking-wider">Obra social</th>
                <th className="text-right px-5 py-3 text-[11px] font-medium text-text-muted uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {filtered.map(patient => (
                <tr key={patient.id} className="hover:bg-surface/50 transition-default">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-primary-500 text-[11px] font-semibold">{patient.first_name[0]}{patient.last_name[0]}</span>
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-text-primary">{patient.first_name} {patient.last_name}</p>
                        <p className="text-[11px] text-text-muted">{patient.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[13px] text-text-secondary tabular-nums">{patient.dni}</td>
                  <td className="px-5 py-3 text-[13px] text-text-secondary">{formatPhone(patient.phone)}</td>
                  <td className="px-5 py-3 text-[13px] text-text-secondary">{patient.insurance || '—'}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setViewPatient(patient)} className="p-1.5 rounded-[7px] hover:bg-primary-50 transition-default cursor-pointer" title="Ver ficha"><Eye size={15} className="text-primary-500" /></button>
                      <button onClick={() => { setEditPatient(patient); setShowForm(true) }} className="p-1.5 rounded-[7px] hover:bg-surface transition-default cursor-pointer" title="Editar"><Edit size={15} className="text-text-muted" /></button>
                      <button onClick={() => { if (confirm('Eliminar paciente?')) dispatch({ type: 'DELETE_PATIENT', payload: patient.id }) }} className="p-1.5 rounded-[7px] hover:bg-danger-50 transition-default cursor-pointer" title="Eliminar"><Trash2 size={15} className="text-danger-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12"><p className="text-[13px] text-text-muted">No se encontraron pacientes</p></div>}
      </div>

      <PatientForm isOpen={showForm} onClose={() => { setShowForm(false); setEditPatient(null) }} patient={editPatient} />
      {viewPatient && <PatientDetail patient={viewPatient} onClose={() => setViewPatient(null)} />}
    </div>
  )
}
