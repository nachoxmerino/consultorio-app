import { useMemo } from 'react'
import Header from '../components/layout/Header'
import { useData } from '../context/DataContext'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Calendar, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

const COLORS = ['#4F6FEF', '#20B486', '#F59E0B', '#EF5B68', '#7c3aed']

export default function Statistics() {
  const { appointments, patients, doctors } = useData()

  const statusStats = useMemo(() => {
    const counts = { pendiente: 0, confirmado: 0, atendido: 0, cancelado: 0, ausente: 0 }
    appointments.forEach(a => { if (counts[a.status] !== undefined) counts[a.status]++ })
    return [
      { name: 'Pendiente', value: counts.pendiente, color: '#F59E0B' },
      { name: 'Confirmado', value: counts.confirmado, color: '#4F6FEF' },
      { name: 'Atendido', value: counts.atendido, color: '#20B486' },
      { name: 'Cancelado', value: counts.cancelado, color: '#a3adc2' },
      { name: 'Ausente', value: counts.ausente, color: '#EF5B68' },
    ].filter(s => s.value > 0)
  }, [appointments])

  const doctorStats = useMemo(() => doctors.map(d => ({
    name: `Dr(a). ${d.first_name}`,
    turnos: appointments.filter(a => a.doctor_id === d.id).length,
    atendidos: appointments.filter(a => a.doctor_id === d.id && a.status === 'atendido').length,
    cancelados: appointments.filter(a => a.doctor_id === d.id && a.status === 'cancelado').length,
  })), [appointments, doctors])

  const dailyStats = useMemo(() => {
    const counts = {}
    appointments.forEach(a => {
      if (!counts[a.date]) counts[a.date] = { date: a.date.slice(5).replace('-', '/'), total: 0, atendidos: 0 }
      counts[a.date].total++
      if (a.status === 'atendido') counts[a.date].atendidos++
    })
    return Object.values(counts).sort((a, b) => a.date.localeCompare(b.date)).slice(-14)
  }, [appointments])

  const totalAppts = appointments.length
  const totalAttended = appointments.filter(a => a.status === 'atendido').length
  const totalCancelled = appointments.filter(a => a.status === 'cancelado').length
  const attendanceRate = totalAppts > 0 ? Math.round((totalAttended / totalAppts) * 100) : 0

  return (
    <div>
      <Header title="Estadisticas" subtitle="Resumen general del consultorio" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total turnos', value: totalAppts, icon: Calendar, iconColor: 'text-primary-500', iconBg: 'bg-primary-50' },
          { label: 'Atendidos', value: totalAttended, icon: CheckCircle, iconColor: 'text-success-500', iconBg: 'bg-[#ecfaf4]' },
          { label: 'Cancelaciones', value: totalCancelled, icon: XCircle, iconColor: 'text-text-muted', iconBg: 'bg-surface' },
          { label: 'Tasa asistencia', value: `${attendanceRate}%`, icon: AlertTriangle, iconColor: 'text-primary-500', iconBg: 'bg-primary-50' },
        ].map(({ label, value, icon: Icon, iconColor, iconBg }) => (
          <div key={label} className="card shadow-card p-4">
            <div className={`w-8 h-8 ${iconBg} rounded-[8px] flex items-center justify-center mb-2`}><Icon size={15} className={iconColor} /></div>
            <p className="text-[20px] font-bold text-text-primary">{value}</p>
            <p className="text-[11px] text-text-muted">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <div className="card shadow-card p-5">
          <h3 className="text-[13px] font-semibold text-text-primary mb-4">Distribucion por estado</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart><Pie data={statusStats} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">{statusStats.map((entry, i) => <Cell key={i} fill={entry.color} />)}</Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {statusStats.map(s => (
              <div key={s.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-[11px] text-text-secondary">{s.name}: {s.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card shadow-card p-5">
          <h3 className="text-[13px] font-semibold text-text-primary mb-4">Turnos por medico</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={doctorStats}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="turnos" fill="#4F6FEF" radius={[4, 4, 0, 0]} name="Total" />
              <Bar dataKey="atendidos" fill="#20B486" radius={[4, 4, 0, 0]} name="Atendidos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card shadow-card p-5">
        <h3 className="text-[13px] font-semibold text-text-primary mb-4">Turnos por dia (ultimos 14 dias)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={dailyStats}>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#4F6FEF" strokeWidth={2} name="Total" dot={{ r: 3 }} />
            <Line type="monotone" dataKey="atendidos" stroke="#20B486" strokeWidth={2} name="Atendidos" dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
