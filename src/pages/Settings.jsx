import { useState } from 'react'
import Header from '../components/layout/Header'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import { useData } from '../context/DataContext'
import { Plus, Settings } from 'lucide-react'

export default function SettingsPage() {
  const { specialties, dispatch } = useData()
  const [showSpecialtyForm, setShowSpecialtyForm] = useState(false)
  const [newSpecialty, setNewSpecialty] = useState({ name: '', color: '#4F6FEF' })

  const handleAddSpecialty = (e) => {
    e.preventDefault()
    if (!newSpecialty.name) return
    dispatch({ type: 'ADD_SPECIALTY', payload: newSpecialty })
    setNewSpecialty({ name: '', color: '#4F6FEF' })
    setShowSpecialtyForm(false)
  }

  return (
    <div>
      <Header title="Configuracion" subtitle="Ajustes del sistema" />

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-text-primary">Especialidades</h3>
            <Button size="xs" onClick={() => setShowSpecialtyForm(true)}><Plus size={14} /> Agregar</Button>
          </div>
          <div className="space-y-1">
            {specialties.map(s => (
              <div key={s.id} className="flex items-center gap-3 px-3 py-2 rounded-[8px] hover:bg-surface transition-default">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color || '#4F6FEF' }} />
                <span className="text-[13px] text-text-primary">{s.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card shadow-card p-5">
          <h3 className="text-[14px] font-semibold text-text-primary mb-4">Informacion del consultorio</h3>
          <div className="space-y-3">
            <Input label="Nombre" defaultValue="Consultorio Medico Central" />
            <Input label="Direccion" defaultValue="Av. Corrientes 1234, Piso 5" />
            <Input label="Telefono" defaultValue="1144440000" />
            <Input label="Email" defaultValue="info@consultorio.com" />
            <Button className="mt-1">Guardar cambios</Button>
          </div>
        </div>

        <div className="card shadow-card p-5">
          <h3 className="text-[14px] font-semibold text-text-primary mb-3">Horarios bloqueados</h3>
          <p className="text-[12px] text-text-secondary mb-4">Configure horarios no disponibles para nuevos turnos.</p>
          <div className="text-center py-8">
            <Settings size={28} className="mx-auto text-text-muted mb-2" />
            <p className="text-[12px] text-text-muted">Proximamente</p>
          </div>
        </div>

        <div className="card shadow-card p-5">
          <h3 className="text-[14px] font-semibold text-text-primary mb-3">WhatsApp</h3>
          <p className="text-[12px] text-text-secondary mb-3">El sistema utiliza enlaces de WhatsApp con mensajes prellenados.</p>
          <div className="bg-primary-50 border border-primary-100 rounded-[10px] p-4">
            <p className="text-[12px] text-primary-600 font-medium">Estado: Enlace directo</p>
            <p className="text-[11px] text-primary-500 mt-0.5">Los mensajes se abren en WhatsApp con el mensaje pre-cargado.</p>
          </div>
        </div>
      </div>

      <Modal isOpen={showSpecialtyForm} onClose={() => setShowSpecialtyForm(false)} title="Nueva especialidad" size="sm">
        <form onSubmit={handleAddSpecialty} className="space-y-4">
          <Input label="Nombre" value={newSpecialty.name} onChange={(e) => setNewSpecialty(s => ({ ...s, name: e.target.value }))} required />
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-text-secondary">Color</label>
            <input type="color" value={newSpecialty.color} onChange={(e) => setNewSpecialty(s => ({ ...s, color: e.target.value }))} className="w-full h-10 rounded-[10px] border border-border cursor-pointer" />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setShowSpecialtyForm(false)}>Cancelar</Button>
            <Button type="submit">Agregar</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
