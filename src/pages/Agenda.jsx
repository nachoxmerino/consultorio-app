import { useState } from 'react'
import Header from '../components/layout/Header'
import { useData } from '../context/DataContext'
import { format, addDays, subDays, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import AppointmentCard from '../components/appointments/AppointmentCard'
import AppointmentForm from '../components/appointments/AppointmentForm'
import { ChevronLeft, ChevronRight, Plus, Filter } from 'lucide-react'

const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']

export default function Agenda() {
  const { appointments, doctors, getPatient, getDoctor, dispatch } = useData()
  const [view, setView] = useState('day')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [filterDoctor, setFilterDoctor] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editAppt, setEditAppt] = useState(null)

  const dateStr = format(currentDate, 'yyyy-MM-dd')

  let filteredAppts = appointments.filter(a => {
    if (view === 'day') return a.date === dateStr
    if (view === 'week') {
      const d = new Date(a.date)
      const start = subDays(currentDate, currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1)
      const end = addDays(start, 6)
      return d >= start && d <= end
    }
    return a.date?.startsWith(format(currentDate, 'yyyy-MM'))
  })

  if (filterDoctor) filteredAppts = filteredAppts.filter(a => a.doctor_id === filterDoctor)
  if (filterStatus) filteredAppts = filteredAppts.filter(a => a.status === filterStatus)

  const dayAppts = filteredAppts.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date)
    return a.time.localeCompare(b.time)
  })

  const timeSlots = []
  for (let h = 8; h <= 18; h++) {
    timeSlots.push(`${String(h).padStart(2, '0')}:00`)
    if (h < 18) timeSlots.push(`${String(h).padStart(2, '0')}:30`)
  }

  const navigatePrev = () => {
    if (view === 'day') setCurrentDate(d => subDays(d, 1))
    else if (view === 'week') setCurrentDate(d => subDays(d, 7))
    else setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }

  const navigateNext = () => {
    if (view === 'day') setCurrentDate(d => addDays(d, 1))
    else if (view === 'week') setCurrentDate(d => addDays(d, 7))
    else setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }

  const handleEdit = (appt) => { setEditAppt(appt); setShowForm(true) }

  const weekDays = (() => {
    const start = subDays(currentDate, currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1)
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  })()

  return (
    <div>
      <Header
        title="Agenda"
        subtitle="Gestion de turnos del consultorio"
        onNewAppointment={() => { setEditAppt(null); setShowForm(true) }}
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="flex bg-surface rounded-[10px] p-0.5 border border-border-light">
            {['day', 'week', 'month'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3.5 py-1.5 rounded-[8px] text-[12px] font-medium transition-default cursor-pointer ${
                  view === v ? 'bg-white text-text-primary shadow-card' : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {v === 'day' ? 'Dia' : v === 'week' ? 'Semana' : 'Mes'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 ml-1">
            <button onClick={navigatePrev} className="p-1.5 rounded-[8px] hover:bg-surface transition-default cursor-pointer">
              <ChevronLeft size={16} className="text-text-secondary" />
            </button>
            <span className="text-[13px] font-medium text-text-primary min-w-[180px] text-center">
              {view === 'day' && format(currentDate, "EEEE d 'de' MMMM", { locale: es })}
              {view === 'week' && `${format(weekDays[0], 'd MMM')} - ${format(weekDays[6], 'd MMM')}`}
              {view === 'month' && format(currentDate, "MMMM yyyy", { locale: es })}
            </span>
            <button onClick={navigateNext} className="p-1.5 rounded-[8px] hover:bg-surface transition-default cursor-pointer">
              <ChevronRight size={16} className="text-text-secondary" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-text-muted" />
          <select value={filterDoctor} onChange={(e) => setFilterDoctor(e.target.value)} className="px-3 py-1.5 border border-border rounded-[8px] text-[12px] bg-white text-text-primary focus:outline-none focus:border-primary-400">
            <option value="">Todos los medicos</option>
            {doctors.map(d => <option key={d.id} value={d.id}>Dr(a). {d.first_name} {d.last_name}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-1.5 border border-border rounded-[8px] text-[12px] bg-white text-text-primary focus:outline-none focus:border-primary-400">
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmado">Confirmado</option>
            <option value="atendido">Atendido</option>
            <option value="cancelado">Cancelado</option>
            <option value="ausente">Ausente</option>
          </select>
        </div>
      </div>

      {/* Day View */}
      {view === 'day' && (
        <div className="card shadow-card overflow-hidden">
          <div className="divide-y divide-border-light">
            {timeSlots.map(slot => {
              const slotAppts = dayAppts.filter(a => a.time?.slice(0, 5) === slot)
              return (
                <div key={slot} className="flex items-stretch min-h-[56px]">
                  <div className="w-[72px] px-3 py-3 text-[11px] font-medium text-text-muted shrink-0 flex items-start pt-3 tabular-nums">{slot}</div>
                  <div className="flex-1 p-1.5 space-y-1 border-l border-border-light">
                    {slotAppts.map(appt => (
                      <AppointmentCard key={appt.id} appointment={appt} onEdit={handleEdit} compact />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Week View */}
      {view === 'week' && (
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map(day => {
            const dStr = format(day, 'yyyy-MM-dd')
            const dayApptsFiltered = filteredAppts.filter(a => a.date === dStr).sort((a, b) => a.time.localeCompare(b.time))
            const isToday = isSameDay(day, new Date())
            return (
              <div key={dStr} className={`rounded-[12px] border ${isToday ? 'border-primary-200 bg-primary-50/20' : 'border-border bg-white'}`}>
                <div className={`text-center py-2 border-b ${isToday ? 'border-primary-100' : 'border-border-light'}`}>
                  <p className="text-[10px] text-text-muted">{dayNames[day.getDay()]}</p>
                  <p className={`text-[16px] font-bold ${isToday ? 'text-primary-500' : 'text-text-primary'}`}>{format(day, 'd')}</p>
                </div>
                <div className="p-1 space-y-1 max-h-[360px] overflow-y-auto scrollbar-thin">
                  {dayApptsFiltered.map(appt => {
                    const patient = getPatient(appt.patient_id)
                    const doctor = getDoctor(appt.doctor_id)
                    if (!patient || !doctor) return null
                    return (
                      <div key={appt.id} className={`px-2 py-1.5 rounded-[8px] text-[11px] border-l-2 cursor-pointer hover:shadow-card transition-default ${
                        appt.status === 'confirmado' ? 'bg-primary-50 border-primary-500' :
                        appt.status === 'pendiente' ? 'bg-[#fef8ec] border-warning-500' :
                        appt.status === 'atendido' ? 'bg-[#ecfaf4] border-success-500' :
                        appt.status === 'cancelado' ? 'bg-surface border-text-muted opacity-50' :
                        appt.status === 'ausente' ? 'bg-danger-50 border-danger-500' :
                        'bg-surface border-border'
                      }`} onClick={() => handleEdit(appt)}>
                        <p className="font-semibold text-text-primary">{appt.time?.slice(0, 5)} {patient.first_name}</p>
                        <p className="text-text-muted">Dr(a). {doctor.last_name}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Month View */}
      {view === 'month' && (
        <div className="card shadow-card overflow-hidden">
          <div className="grid grid-cols-7 gap-px bg-border-light">
            {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map(d => (
              <div key={d} className="bg-surface text-center py-2 text-[11px] font-medium text-text-muted">{d}</div>
            ))}
            {(() => {
              const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
              const startOffset = (firstDay.getDay() + 6) % 7
              const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
              const cells = []
              for (let i = 0; i < startOffset; i++) cells.push(null)
              for (let d = 1; d <= daysInMonth; d++) cells.push(d)
              return cells.map((day, i) => {
                if (!day) return <div key={i} className="bg-white min-h-[72px]" />
                const dStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const dayApptsFiltered = filteredAppts.filter(a => a.date === dStr)
                const isToday = dStr === new Date().toISOString().split('T')[0]
                return (
                  <div key={i} className={`bg-white min-h-[72px] p-1.5 ${isToday ? 'bg-primary-50/30' : ''}`}>
                    <p className={`text-[11px] font-medium mb-1 ${isToday ? 'text-primary-500 font-bold' : 'text-text-secondary'}`}>{day}</p>
                    <div className="space-y-0.5">
                      {dayApptsFiltered.slice(0, 3).map(a => {
                        const p = getPatient(a.patient_id)
                        return (
                          <div key={a.id} className={`text-[9px] px-1 py-0.5 rounded-[4px] truncate ${
                            a.status === 'confirmado' ? 'bg-primary-50 text-primary-600' :
                            a.status === 'pendiente' ? 'bg-[#fef8ec] text-[#d48806]' :
                            a.status === 'cancelado' ? 'bg-surface text-text-muted' :
                            'bg-surface text-text-secondary'
                          }`}>
                            {a.time?.slice(0, 5)} {p?.first_name}
                          </div>
                        )
                      })}
                      {dayApptsFiltered.length > 3 && <p className="text-[9px] text-text-muted">+{dayApptsFiltered.length - 3}</p>}
                    </div>
                  </div>
                )
              })
            })()}
          </div>
        </div>
      )}

      <AppointmentForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditAppt(null) }}
        appointment={editAppt}
        preselectedDate={format(currentDate, 'yyyy-MM-dd')}
      />
    </div>
  )
}
