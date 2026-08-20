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
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[16px] font-semibold text-text-primary">{monthNames[month]} {year}</h3>
        <div className="flex items-center gap-1.5">
          <button className="p-2 rounded-[10px] hover:bg-surface transition-default cursor-pointer">
            <ChevronLeft size={16} className="text-text-muted" />
          </button>
          <button className="p-2 rounded-[10px] hover:bg-surface transition-default cursor-pointer">
            <ChevronRight size={16} className="text-text-muted" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {dayNamesShort.map(d => (
          <div key={d} className="text-center py-2.5 text-[11px] font-semibold text-text-muted uppercase tracking-wider">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const dayAppts = appointments.filter(a => a.date === dStr)
          const isToday = day === today
          return (
            <div key={i} className="flex flex-col items-center py-1">
              <div className={`w-9 h-9 flex items-center justify-center rounded-full text-[12px] ${
                isToday ? 'bg-primary-500 text-white font-semibold' : 'text-text-primary hover:bg-surface cursor-default'
              } transition-default`}>
                {day}
              </div>
              {dayAppts.length > 0 && !isToday && (
                <div className="flex gap-0.5 mt-1">
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
    window.open(generateWhatsAppLink(patient.phone, generateReminderMessage(appt, patient, doctor)), '_blank')
    dispatch({ type: 'ADD_REMINDER', payload: { appointment_id: appt.id, patient_id: patient.id, method: 'whatsapp', sent_by: 'Lucia Martinez' } })
  }

  const handleQuickConfirm = (appt) => {
    dispatch({ type: 'UPDATE_APPOINTMENT', payload: { id: appt.id, status: 'confirmado', action: 'confirmed', details: 'Confirmado desde dashboard' } })
  }

  const statCards = [
    { label: 'Turnos hoy', value: stats.total, icon: Calendar, iconColor: 'text-primary-500', iconBg: 'bg-primary-50', sub: diffTotal >= 0 ? `+${diffTotal} que ayer` : `${diffTotal} que ayer`, subColor: diffTotal >= 0 ? 'text-success-500' : 'text-danger-500' },
    { label: 'Confirmados', value: stats.confirmed, icon: CheckCircle, iconColor: 'text-success-500', iconBg: 'bg-[#ecfaf4]', sub: stats.total > 0 ? `${Math.round(stats.confirmed / stats.total * 100)}% del total` : null, subColor: 'text-success-500' },
    { label: 'Pendientes', value: stats.pending, icon: Clock, iconColor: 'text-warning-500', iconBg: 'bg-[#fef8ec]', sub: stats.pending > 0 ? 'Requieren atencion' : null, subColor: 'text-warning-500' },
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
      {/* ============ HEADER ============ */}
      <div className="flex items-center justify-between gap-8 mb-10">
        <div className="min-w-0">
          <h1 className="text-[30px] font-bold text-text-primary leading-tight tracking-tight">Bienvenida, Lucia! 👋</h1>
          <p className="text-[15px] text-text-secondary mt-1.5">{format(new Date(), "EEEE d 'de' MMMM, yyyy", { locale: es })}</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="relative hidden sm:block">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              id="global-search"
              type="text"
              placeholder="Buscar pacientes, turnos, medicos..."
              className="pl-11 pr-16 py-3 bg-white border border-border rounded-[14px] text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-50 w-[340px] transition-default"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
              <kbd className="px-2 py-0.5 bg-surface border border-border-light rounded-[6px] text-[11px] font-medium text-text-muted">Ctrl</kbd>
              <kbd className="px-2 py-0.5 bg-surface border border-border-light rounded-[6px] text-[11px] font-medium text-text-muted">K</kbd>
            </div>
          </div>
          <button className="relative p-3 rounded-[14px] hover:bg-white transition-default cursor-pointer border border-border-light">
            <Bell size={21} className="text-text-secondary" />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-danger-500 rounded-full" />
          </button>
          <Button onClick={() => setShowForm(true)} size="lg">
            <Plus size={18} /> Nuevo turno
          </Button>
        </div>
      </div>

      {/* ============ STAT CARDS ============ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 mb-10">
        {statCards.map(({ label, value, icon: Icon, iconColor, iconBg, sub, subColor }) => (
          <div key={label} className="bg-white rounded-[16px] border border-border shadow-card hover:shadow-card-hover p-6 transition-default cursor-default">
            <div className={`w-12 h-12 ${iconBg} rounded-[14px] flex items-center justify-center mb-5`}>
              <Icon size={22} className={iconColor} />
            </div>
            <p className="text-[32px] font-bold text-text-primary leading-none tracking-tight">{value}</p>
            <p className="text-[14px] text-text-secondary mt-2 font-medium">{label}</p>
            {sub && <p className={`text-[13px] ${subColor} mt-1.5 font-medium`}>{sub}</p>}
          </div>
        ))}
      </div>

      {/* ============ MAIN GRID - 65/35 ============ */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8">

        {/* ======= LEFT: AGENDA ======= */}
        <div>
          {/* Agenda Card */}
          <div className="bg-white rounded-[18px] border border-border shadow-card overflow-hidden">
            {/* Card Header */}
            <div className="flex items-center justify-between px-7 py-6 border-b border-border-light">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-primary-50 rounded-[12px] flex items-center justify-center">
                  <Calendar size={20} className="text-primary-500" />
                </div>
                <div>
                  <h2 className="text-[18px] font-semibold text-text-primary">Agenda de hoy</h2>
                  <p className="text-[13px] text-text-muted mt-0.5">{format(new Date(), "d 'de' MMMM", { locale: es })}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => navigate('/agenda')}>
                  Ver semana <ArrowRight size={14} />
                </Button>
                <div className="flex items-center gap-1 ml-1">
                  <button className="p-2 rounded-[10px] hover:bg-surface transition-default cursor-pointer">
                    <ChevronLeft size={17} className="text-text-muted" />
                  </button>
                  <button className="p-2 rounded-[10px] hover:bg-surface transition-default cursor-pointer">
                    <ChevronRight size={17} className="text-text-muted" />
                  </button>
                </div>
              </div>
            </div>

            {/* Appointments */}
            <div className="divide-y divide-border-light">
              {todayAppts.length === 0 ? (
                <div className="px-7 py-24 text-center">
                  <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-5">
                    <Calendar size={28} className="text-text-muted" />
                  </div>
                  <p className="text-[15px] font-medium text-text-muted">No hay turnos para hoy</p>
                </div>
              ) : (
                todayAppts.map((appt) => {
                  const patient = getPatient(appt.patient_id)
                  const doctor = getDoctor(appt.doctor_id)
                  if (!patient || !doctor) return null
                  const age = patient.birth_date ? Math.floor((Date.now() - new Date(patient.birth_date).getTime()) / 31557600000) : null

                  return (
                    <div
                      key={appt.id}
                      className={`flex items-stretch gap-0 px-7 py-5 hover:bg-[#F8FAFC]/80 transition-default group ${appt.status === 'cancelado' ? 'opacity-40' : ''}`}
                    >
                      {/* TIME */}
                      <div className="w-20 shrink-0 flex flex-col items-center justify-center pt-0.5">
                        <p className="text-[18px] font-bold text-text-primary tabular-nums leading-tight">{appt.time?.slice(0, 5)}</p>
                        <p className="text-[12px] text-text-muted mt-1">30 min</p>
                      </div>

                      {/* COLOR BAR */}
                      <div className="w-1 rounded-full shrink-0 mx-5 self-stretch" style={{ backgroundColor: doctor.avatar_color || '#4F6FEF' }} />

                      {/* PATIENT */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-11 h-11 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                          <span className="text-primary-500 text-[13px] font-bold">
                            {patient.first_name[0]}{patient.last_name[0]}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[15px] font-semibold text-text-primary truncate">{patient.first_name} {patient.last_name}</p>
                          {age && <p className="text-[13px] text-text-muted mt-0.5">{age} anios</p>}
                          {appt.reason && <p className="text-[13px] text-text-secondary mt-0.5 truncate">{appt.reason}</p>}
                        </div>
                      </div>

                      {/* DOCTOR */}
                      <div className="hidden lg:flex flex-col items-end justify-center shrink-0 w-[180px] pr-6">
                        <p className="text-[14px] font-medium text-text-primary">Dr(a). {doctor.first_name}</p>
                        <p className="text-[12px] text-text-muted mt-0.5">{doctor.specialty}</p>
                      </div>

                      {/* STATUS + ACTIONS */}
                      <div className="flex items-center gap-3 shrink-0">
                        <Badge status={appt.status} size="md" />
                        <div className="flex items-center gap-1">
                          {appt.status === 'pendiente' && (
                            <>
                              <button onClick={() => handleReminder(appt)} className="p-2.5 rounded-[10px] hover:bg-[#25d366]/10 transition-default cursor-pointer" title="Enviar WhatsApp">
                                <MessageCircle size={17} className="text-[#25d366]" />
                              </button>
                              <button onClick={() => handleQuickConfirm(appt)} className="p-2.5 rounded-[10px] hover:bg-success-50 transition-default cursor-pointer" title="Confirmar">
                                <CheckCircle size={17} className="text-success-500" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Footer */}
            {todayAppts.length > 0 && (
              <div className="px-7 py-5 border-t border-border-light">
                <button onClick={() => navigate('/agenda')} className="text-[14px] font-medium text-primary-500 hover:text-primary-600 transition-default cursor-pointer flex items-center gap-1.5">
                  Ver todos los turnos del dia <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="text-[16px] font-semibold text-text-primary mb-5">Acciones rapidas</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {quickActions.map(({ label, icon: Icon, color, bg, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="bg-white rounded-[14px] border border-border shadow-card hover:shadow-card-hover p-5 transition-default cursor-pointer group text-left"
                >
                  <div className={`w-11 h-11 ${bg} rounded-[12px] flex items-center justify-center mb-4 group-hover:scale-105 transition-default`}>
                    <Icon size={20} className={color} />
                  </div>
                  <p className="text-[13px] font-medium text-text-primary leading-snug">{label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ======= RIGHT COLUMN ======= */}
        <div className="space-y-8">

          {/* Reminders Card */}
          <div className="bg-white rounded-[18px] border border-border shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border-light">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-11 h-11 bg-[#fef8ec] rounded-[12px] flex items-center justify-center">
                    <Bell size={20} className="text-warning-500" />
                  </div>
                  {pendingReminders.length > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[20px] h-[20px] bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1.5">
                      {pendingReminders.length}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-[16px] font-semibold text-text-primary">Recordatorios pendientes</h3>
                </div>
              </div>
              <button onClick={() => navigate('/recordatorios')} className="text-[13px] text-primary-500 hover:text-primary-600 font-medium cursor-pointer">
                Ver todos
              </button>
            </div>
            <div className="divide-y divide-border-light max-h-[400px] overflow-y-auto scrollbar-thin">
              {pendingReminders.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <CheckCircle size={32} className="mx-auto text-success-500 mb-4" />
                  <p className="text-[14px] font-medium text-text-muted">Todo al dia</p>
                </div>
              ) : (
                pendingReminders.slice(0, 6).map(appt => {
                  const patient = getPatient(appt.patient_id)
                  const doctor = getDoctor(appt.doctor_id)
                  if (!patient || !doctor) return null
                  const isToday = appt.date === today
                  const isTomorrow = appt.date === tomorrow

                  return (
                    <div key={appt.id} className="px-6 py-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                        <span className="text-primary-500 text-[12px] font-bold">{patient.first_name[0]}{patient.last_name[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium text-text-primary truncate">{patient.first_name} {patient.last_name}</p>
                        <p className="text-[12px] text-text-muted mt-0.5">
                          Turno: {isToday ? 'Hoy' : isTomorrow ? 'Manana' : appt.date} {appt.time?.slice(0, 5)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleReminder(appt)}
                        className="p-2.5 rounded-[10px] bg-[#25d366]/10 hover:bg-[#25d366]/20 transition-default cursor-pointer shrink-0"
                        title="Enviar WhatsApp"
                      >
                        <MessageCircle size={16} className="text-[#25d366]" />
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Calendar Card */}
          <div className="bg-white rounded-[18px] border border-border shadow-card p-6">
            <MiniCalendar appointments={appointments} />
          </div>

          {/* Monthly Stats Card */}
          <div className="bg-white rounded-[18px] border border-border shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border-light">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-[#f3f0ff] rounded-[12px] flex items-center justify-center">
                  <BarChart3 size={20} className="text-[#7c3aed]" />
                </div>
                <div>
                  <h3 className="text-[16px] font-semibold text-text-primary">Estadisticas del mes</h3>
                  <p className="text-[12px] text-text-muted mt-0.5">{monthNames[new Date().getMonth()]} {new Date().getFullYear()}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/estadisticas')}>
                Ver reporte <ArrowRight size={14} />
              </Button>
            </div>
            <div className="grid grid-cols-3 divide-x divide-border-light">
              <div className="px-5 py-6 text-center">
                <p className="text-[26px] font-bold text-text-primary">{monthlyStats.total}</p>
                <p className="text-[12px] text-text-muted mt-1">Turnos totales</p>
              </div>
              <div className="px-5 py-6 text-center">
                <p className="text-[26px] font-bold text-success-500">{monthlyStats.attendanceRate}%</p>
                <p className="text-[12px] text-text-muted mt-1">Asistencia</p>
              </div>
              <div className="px-5 py-6 text-center">
                <p className="text-[26px] font-bold text-danger-500">{monthlyStats.cancelRate}%</p>
                <p className="text-[12px] text-text-muted mt-1">Cancelaciones</p>
              </div>
            </div>
          </div>

          {/* Doctors Today */}
          <div className="bg-white rounded-[18px] border border-border shadow-card overflow-hidden">
            <div className="flex items-center gap-4 px-6 py-5 border-b border-border-light">
              <div className="w-11 h-11 bg-primary-50 rounded-[12px] flex items-center justify-center">
                <Stethoscope size={20} className="text-primary-500" />
              </div>
              <h3 className="text-[16px] font-semibold text-text-primary">Profesionales</h3>
            </div>
            <div className="divide-y divide-border-light">
              {doctors.map(doc => {
                const docAppts = todayAppts.filter(a => a.doctor_id === doc.id)
                return (
                  <div key={doc.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#F8FAFC]/80 transition-default">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[12px] shrink-0" style={{ backgroundColor: doc.avatar_color }}>
                      {doc.first_name[0]}{doc.last_name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-text-primary truncate">Dr(a). {doc.first_name} {doc.last_name}</p>
                      <p className="text-[12px] text-text-muted mt-0.5">{doc.specialty}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[18px] font-bold text-text-primary">{docAppts.length}</p>
                      <p className="text-[11px] text-text-muted">turnos</p>
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
