import { useState, useMemo } from 'react'
import { useData } from '../context/DataContext'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { generateWhatsAppLink } from '../lib/whatsapp'
import { generateReminderMessage } from '../lib/messages'
import AppointmentForm from '../components/appointments/AppointmentForm'
import {
  Calendar, CheckCircle, Clock, XCircle, Users, UserCheck,
  MessageCircle, ArrowRight, Bell, ChevronLeft, ChevronRight,
  Stethoscope, Plus, CalendarPlus, Search, Lock, Send, Eye, BarChart3
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const dayNamesShort = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']

function MiniCalendar({ appointments }) {
  const [currentDate] = useState(new Date())
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const today = currentDate.getDate()
  const firstDay = new Date(year, month, 1)
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-semibold text-text-primary">{monthNames[month]} {year}</h3>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-[8px] hover:bg-surface transition-default cursor-pointer">
            <ChevronLeft size={15} className="text-text-muted" />
          </button>
          <button className="p-1.5 rounded-[8px] hover:bg-surface transition-default cursor-pointer">
            <ChevronRight size={15} className="text-text-muted" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0">
        {dayNamesShort.map(d => (
          <div key={d} className="text-center py-2 text-[11px] font-semibold text-text-muted uppercase tracking-wider">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const dayAppts = appointments.filter(a => a.date === dStr)
          const isToday = day === today
          return (
            <div key={i} className="flex flex-col items-center py-1.5">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full text-[12px] ${
                isToday ? 'bg-primary-500 text-white font-semibold' : 'text-text-primary hover:bg-surface cursor-default'
              } transition-default`}>
                {day}
              </div>
              {dayAppts.length > 0 && !isToday && (
                <div className="flex gap-0.5 mt-0.5">
                  {dayAppts.slice(0, 3).map((_, idx) => (
                    <div key={idx} className="w-1 h-1 rounded-full bg-primary-400" />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { appointments, doctors, getPatient, getDoctor, reminders, dispatch } = useData()
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  const todayAppts = useMemo(() =>
    appointments.filter(a => a.date === today).sort((a, b) => a.time.localeCompare(b.time)),
    [appointments, today]
  )

  const yesterdayAppts = useMemo(() =>
    appointments.filter(a => a.date === yesterday),
    [appointments, yesterday]
  )

  const stats = useMemo(() => ({
    total: todayAppts.length,
    confirmed: todayAppts.filter(a => a.status === 'confirmado').length,
    pending: todayAppts.filter(a => a.status === 'pendiente').length,
    cancelled: todayAppts.filter(a => a.status === 'cancelado').length,
    attended: todayAppts.filter(a => a.status === 'atendido').length,
    absent: todayAppts.filter(a => a.status === 'ausente').length,
  }), [todayAppts])

  const diffTotal = stats.total - yesterdayAppts.length

  const pendingReminders = useMemo(() => {
    const upcoming = appointments.filter(a => a.date >= today && (a.status === 'pendiente' || a.status === 'confirmado'))
    const reminded = reminders.map(r => r.appointment_id)
    return upcoming.filter(a => !reminded.includes(a.id)).sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
  }, [appointments, reminders, today])

  const monthlyStats = useMemo(() => {
    const monthAppts = appointments.filter(a => {
      const d = new Date(a.date)
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    const total = monthAppts.length || 1
    const attended = monthAppts.filter(a => a.status === 'atendido').length
    const cancelled = monthAppts.filter(a => a.status === 'cancelado').length
    return {
      total: monthAppts.length,
      attendanceRate: Math.round((attended / total) * 100),
      cancelRate: Math.round((cancelled / total) * 100),
    }
  }, [appointments])

  const handleReminder = (appt) => {
    const patient = getPatient(appt.patient_id)
    const doctor = getDoctor(appt.doctor_id)
    if (!patient || !doctor) return
    const message = generateReminderMessage(appt, patient, doctor)
    window.open(generateWhatsAppLink(patient.phone, message), '_blank')
    dispatch({ type: 'ADD_REMINDER', payload: { appointment_id: appt.id, patient_id: patient.id, method: 'whatsapp', sent_by: 'Lucia Martinez' } })
  }

  const handleQuickConfirm = (appt) => {
    dispatch({ type: 'UPDATE_APPOINTMENT', payload: { id: appt.id, status: 'confirmado', action: 'confirmed', details: 'Confirmado desde dashboard' } })
  }

  const statCards = [
    { label: 'Turnos hoy', value: stats.total, icon: Calendar, iconColor: 'text-primary-500', iconBg: 'bg-primary-50', sub: diffTotal >= 0 ? `+${diffTotal} que ayer` : `${diffTotal} que ayer`, subColor: diffTotal >= 0 ? 'text-success-500' : 'text-danger-500' },
    { label: 'Confirmados', value: stats.confirmed, icon: CheckCircle, iconColor: 'text-success-500', iconBg: 'bg-[#ecfaf4]', sub: stats.total > 0 ? `${Math.round(stats.confirmed / stats.total * 100)}% del total` : null, subColor: 'text-success-500' },
    { label: 'Pendientes', value: stats.pending, icon: Clock, iconColor: 'text-warning-500', iconBg: 'bg-[#fef8ec]', sub: stats.pending > 0 ? 'Requieren atencion' : 'Ninguno pendiente', subColor: 'text-warning-500' },
    { label: 'Cancelados', value: stats.cancelled, icon: XCircle, iconColor: 'text-danger-500', iconBg: 'bg-danger-50', sub: stats.total > 0 ? `${Math.round(stats.cancelled / stats.total * 100)}% del total` : null, subColor: 'text-danger-500' },
    { label: 'Atendidos', value: stats.attended, icon: UserCheck, iconColor: 'text-[#7c3aed]', iconBg: 'bg-[#f3f0ff]', sub: 'Hoy', subColor: 'text-[#7c3aed]' },
  ]

  const quickActions = [
    { label: 'Nuevo turno', icon: CalendarPlus, color: 'text-primary-500', bg: 'bg-primary-50', action: () => setShowForm(true) },
    { label: 'Nuevo paciente', icon: Users, color: 'text-success-500', bg: 'bg-[#ecfaf4]', action: () => navigate('/pacientes') },
    { label: 'Buscar paciente', icon: Search, color: 'text-warning-500', bg: 'bg-[#fef8ec]', action: () => document.getElementById('global-search')?.focus() },
    { label: 'Bloquear horario', icon: Lock, color: 'text-danger-500', bg: 'bg-danger-50', action: () => navigate('/configuracion') },
    { label: 'Enviar mensaje', icon: Send, color: 'text-[#7c3aed]', bg: 'bg-[#f3f0ff]', action: () => navigate('/recordatorios') },
    { label: 'Ver agenda', icon: Eye, color: 'text-text-secondary', bg: 'bg-surface', action: () => navigate('/agenda') },
  ]

  return (
    <div>
      {/* Dashboard Header */}
      <div className="flex items-center justify-between gap-6 mb-8">
        <div className="min-w-0">
          <h1 className="text-[28px] font-bold text-text-primary leading-tight tracking-tight">Bienvenida, Lucia! 👋</h1>
          <p className="text-[14px] text-text-secondary mt-1">{format(new Date(), "EEEE d 'de' MMMM, yyyy", { locale: es })}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Search */}
          <div className="relative hidden sm:block">
            <div className="relative">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                id="global-search"
                type="text"
                placeholder="Buscar pacientes, turnos, medicos..."
                className="pl-10 pr-14 py-2.5 bg-surface border border-border-light rounded-[12px] text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-50 w-[320px] transition-default"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                <kbd className="px-1.5 py-0.5 bg-white border border-border rounded-[5px] text-[10px] font-medium text-text-muted">Ctrl</kbd>
                <kbd className="px-1.5 py-0.5 bg-white border border-border rounded-[5px] text-[10px] font-medium text-text-muted">K</kbd>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <button className="relative p-2.5 rounded-[12px] hover:bg-white transition-default cursor-pointer">
            <Bell size={20} className="text-text-secondary" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger-500 rounded-full" />
          </button>

          <Button onClick={() => setShowForm(true)} size="md">
            <Plus size={16} /> Nuevo turno
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, iconColor, iconBg, sub, subColor }) => (
          <div key={label} className="card shadow-card hover:shadow-card-hover p-5 transition-default cursor-default">
            <div className={`w-10 h-10 ${iconBg} rounded-[12px] flex items-center justify-center mb-4`}>
              <Icon size={20} className={iconColor} />
            </div>
            <p className="text-[28px] font-bold text-text-primary leading-none tracking-tight">{value}</p>
            <p className="text-[13px] text-text-secondary mt-1.5 font-medium">{label}</p>
            {sub && <p className={`text-[12px] ${subColor} mt-1 font-medium`}>{sub}</p>}
          </div>
        ))}
      </div>

      {/* Main Grid - 70/30 */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

        {/* Left Column - Agenda */}
        <div>
          <div className="card shadow-card overflow-hidden">
            {/* Card Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border-light">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 bg-primary-50 rounded-[10px] flex items-center justify-center">
                  <Calendar size={18} className="text-primary-500" />
                </div>
                <div>
                  <h2 className="text-[16px] font-semibold text-text-primary">Agenda de hoy</h2>
                  <p className="text-[12px] text-text-muted mt-0.5">{format(new Date(), "d 'de' MMMM", { locale: es })}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="xs" onClick={() => navigate('/agenda')}>
                  Ver semana <ArrowRight size={13} />
                </Button>
                <div className="flex items-center gap-0.5 ml-1">
                  <button className="p-1.5 rounded-[8px] hover:bg-surface transition-default cursor-pointer">
                    <ChevronLeft size={16} className="text-text-muted" />
                  </button>
                  <button className="p-1.5 rounded-[8px] hover:bg-surface transition-default cursor-pointer">
                    <ChevronRight size={16} className="text-text-muted" />
                  </button>
                </div>
              </div>
            </div>

            {/* Appointments List */}
            <div className="divide-y divide-border-light">
              {todayAppts.length === 0 ? (
                <div className="px-6 py-20 text-center">
                  <div className="w-14 h-14 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar size={24} className="text-text-muted" />
                  </div>
                  <p className="text-[14px] font-medium text-text-muted">No hay turnos para hoy</p>
                </div>
              ) : (
                todayAppts.map((appt) => {
                  const patient = getPatient(appt.patient_id)
                  const doctor = getDoctor(appt.doctor_id)
                  if (!patient || !doctor) return null
                  const age = patient.birth_date ? Math.floor((Date.now() - new Date(patient.birth_date).getTime()) / 31557600000) : null

                  return (
                    <div key={appt.id} className={`flex items-center gap-5 px-6 py-4 hover:bg-surface/50 transition-default group ${appt.status === 'cancelado' ? 'opacity-40' : ''}`}>
                      {/* Time */}
                      <div className="text-right w-16 shrink-0">
                        <p className="text-[15px] font-semibold text-text-primary tabular-nums leading-tight">{appt.time?.slice(0, 5)}</p>
                        <p className="text-[11px] text-text-muted mt-0.5">30 min</p>
                      </div>

                      {/* Color indicator */}
                      <div className="w-1 h-12 rounded-full shrink-0" style={{ backgroundColor: doctor.avatar_color || '#4F6FEF' }} />

                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                        <span className="text-primary-500 text-[12px] font-semibold">
                          {patient.first_name[0]}{patient.last_name[0]}
                        </span>
                      </div>

                      {/* Patient info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-text-primary truncate">{patient.first_name} {patient.last_name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {age && <span className="text-[12px] text-text-muted">{age} anios</span>}
                          {age && appt.reason && <span className="text-text-muted">·</span>}
                          {appt.reason && <p className="text-[12px] text-text-muted truncate">{appt.reason}</p>}
                        </div>
                      </div>

                      {/* Doctor */}
                      <div className="hidden md:block shrink-0">
                        <p className="text-[13px] font-medium text-text-secondary">Dr(a). {doctor.last_name}</p>
                        <p className="text-[12px] text-text-muted">{doctor.specialty}</p>
                      </div>

                      {/* Status */}
                      <Badge status={appt.status} size="sm" />

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        {appt.status === 'pendiente' && (
                          <>
                            <button onClick={() => handleReminder(appt)} className="p-2 rounded-[8px] hover:bg-[#25d366]/10 transition-default cursor-pointer" title="Enviar WhatsApp">
                              <MessageCircle size={16} className="text-[#25d366]" />
                            </button>
                            <button onClick={() => handleQuickConfirm(appt)} className="p-2 rounded-[8px] hover:bg-success-50 transition-default cursor-pointer" title="Confirmar">
                              <CheckCircle size={16} className="text-success-500" />
                            </button>
                          </>
                        )}
                        {appt.status !== 'pendiente' && (
                          <button className="p-2 rounded-[8px] hover:bg-surface transition-default cursor-pointer opacity-0 group-hover:opacity-100">
                            <MessageCircle size={16} className="text-text-muted" />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Footer */}
            {todayAppts.length > 0 && (
              <div className="px-6 py-4 border-t border-border-light">
                <button onClick={() => navigate('/agenda')} className="text-[13px] font-medium text-primary-500 hover:text-primary-600 transition-default cursor-pointer">
                  Ver todos los turnos del dia
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-6">
            <h3 className="text-[15px] font-semibold text-text-primary mb-4">Acciones rapidas</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {quickActions.map(({ label, icon: Icon, color, bg, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="card shadow-card hover:shadow-card-hover p-4 transition-default cursor-pointer group text-left"
                >
                  <div className={`w-10 h-10 ${bg} rounded-[12px] flex items-center justify-center mb-3 group-hover:scale-105 transition-default`}>
                    <Icon size={18} className={color} />
                  </div>
                  <p className="text-[12px] font-medium text-text-primary leading-tight">{label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">

          {/* Pending Reminders */}
          <div className="card shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 bg-[#fef8ec] rounded-[10px] flex items-center justify-center">
                    <Bell size={17} className="text-warning-500" />
                  </div>
                  {pendingReminders.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                      {pendingReminders.length}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-text-primary">Recordatorios</h3>
                  <p className="text-[11px] text-text-muted">Pendientes</p>
                </div>
              </div>
              <button onClick={() => navigate('/recordatorios')} className="text-[12px] text-primary-500 hover:text-primary-600 font-medium cursor-pointer">
                Ver todos
              </button>
            </div>
            <div className="divide-y divide-border-light max-h-[340px] overflow-y-auto scrollbar-thin">
              {pendingReminders.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <CheckCircle size={28} className="mx-auto text-success-500 mb-3" />
                  <p className="text-[13px] font-medium text-text-muted">Todo al dia</p>
                </div>
              ) : (
                pendingReminders.slice(0, 5).map(appt => {
                  const patient = getPatient(appt.patient_id)
                  const doctor = getDoctor(appt.doctor_id)
                  if (!patient || !doctor) return null
                  const isToday = appt.date === today
                  const isTomorrow = appt.date === tomorrow

                  return (
                    <div key={appt.id} className="px-5 py-3.5 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                        <span className="text-primary-500 text-[11px] font-semibold">{patient.first_name[0]}{patient.last_name[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-text-primary truncate">{patient.first_name} {patient.last_name}</p>
                        <p className="text-[11px] text-text-muted">
                          Turno: {isToday ? 'Hoy' : isTomorrow ? 'Manana' : appt.date} {appt.time?.slice(0, 5)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleReminder(appt)}
                        className="p-2 rounded-[8px] bg-[#25d366]/10 hover:bg-[#25d366]/20 transition-default cursor-pointer shrink-0"
                        title="Enviar WhatsApp"
                      >
                        <MessageCircle size={15} className="text-[#25d366]" />
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Mini Calendar */}
          <div className="card shadow-card p-5">
            <MiniCalendar appointments={appointments} />
          </div>

          {/* Monthly Stats */}
          <div className="card shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#f3f0ff] rounded-[10px] flex items-center justify-center">
                  <BarChart3 size={17} className="text-[#7c3aed]" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-text-primary">Estadisticas del mes</h3>
                  <p className="text-[11px] text-text-muted">{monthNames[new Date().getMonth()]} {new Date().getFullYear()}</p>
                </div>
              </div>
              <Button variant="ghost" size="xs" onClick={() => navigate('/estadisticas')}>
                Ver reporte <ArrowRight size={13} />
              </Button>
            </div>
            <div className="grid grid-cols-3 divide-x divide-border-light">
              <div className="px-4 py-4 text-center">
                <p className="text-[22px] font-bold text-text-primary">{monthlyStats.total}</p>
                <p className="text-[11px] text-text-muted mt-0.5">Turnos totales</p>
              </div>
              <div className="px-4 py-4 text-center">
                <p className="text-[22px] font-bold text-success-500">{monthlyStats.attendanceRate}%</p>
                <p className="text-[11px] text-text-muted mt-0.5">Asistencia</p>
              </div>
              <div className="px-4 py-4 text-center">
                <p className="text-[22px] font-bold text-danger-500">{monthlyStats.cancelRate}%</p>
                <p className="text-[11px] text-text-muted mt-0.5">Cancelaciones</p>
              </div>
            </div>
          </div>

          {/* Doctors Today */}
          <div className="card shadow-card overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border-light">
              <div className="w-9 h-9 bg-primary-50 rounded-[10px] flex items-center justify-center">
                <Stethoscope size={17} className="text-primary-500" />
              </div>
              <h3 className="text-[14px] font-semibold text-text-primary">Profesionales</h3>
            </div>
            <div className="divide-y divide-border-light">
              {doctors.map(doc => {
                const docAppts = todayAppts.filter(a => a.doctor_id === doc.id)
                return (
                  <div key={doc.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface/50 transition-default">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-[11px] shrink-0" style={{ backgroundColor: doc.avatar_color }}>
                      {doc.first_name[0]}{doc.last_name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-text-primary truncate">Dr(a). {doc.first_name} {doc.last_name}</p>
                      <p className="text-[11px] text-text-muted">{doc.specialty}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[16px] font-bold text-text-primary">{docAppts.length}</p>
                      <p className="text-[10px] text-text-muted">turnos</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <AppointmentForm isOpen={showForm} onClose={() => setShowForm(false)} preselectedDate={today} />
    </div>
  )
}
