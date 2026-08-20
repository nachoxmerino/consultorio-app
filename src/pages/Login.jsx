import { useState } from 'react'
import Header from '../components/layout/Header'
import { useData } from '../context/DataContext'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Button from '../components/ui/Button'
import { generateWhatsAppLink } from '../lib/whatsapp'
import { generateReminderMessage } from '../lib/messages'
import { CheckCircle, Lock, Mail, Heart } from 'lucide-react'
import Input from '../components/ui/Input'

export default function Login() {
  const { dispatch } = useData()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (email === 'lucia@consultorio.com' && password === 'admin123') {
      dispatch({ type: 'SET_USER', payload: { id: '1', name: 'Lucia Martinez', role: 'admin', email: 'lucia@consultorio.com' } })
    } else if (email === 'sofia@consultorio.com' && password === 'secret123') {
      dispatch({ type: 'SET_USER', payload: { id: '2', name: 'Sofia Gonzalez', role: 'secretary', email: 'sofia@consultorio.com' } })
    } else {
      setError('Credenciales incorrectas')
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-primary-500 rounded-[14px] flex items-center justify-center mx-auto mb-4 shadow-[0_8px_24px_rgba(79,111,239,0.25)]">
            <Heart size={24} className="text-white" fill="white" strokeWidth={0} />
          </div>
          <h1 className="text-xl font-bold text-text-primary">Consultorio Medico</h1>
          <p className="text-[13px] text-text-secondary mt-1">Sistema de gestion de turnos</p>
        </div>

        <div className="card shadow-[0_8px_40px_rgba(23,33,61,0.06)] p-7">
          <h2 className="text-base font-semibold text-text-primary mb-5">Iniciar sesion</h2>

          {error && (
            <div className="bg-danger-50 text-danger-500 text-[13px] px-4 py-2.5 rounded-[10px] mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-[38px] text-text-muted" />
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@consultorio.com" className="pl-10" required />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-[38px] text-text-muted" />
              <Input label="Contrasena" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-10" required />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Ingresar
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-border-light">
            <p className="text-[11px] text-text-muted text-center mb-2.5">Cuentas de prueba</p>
            <div className="space-y-1.5">
              <button
                onClick={() => { setEmail('lucia@consultorio.com'); setPassword('admin123') }}
                className="w-full text-left px-3.5 py-2.5 rounded-[8px] bg-surface hover:bg-primary-50 text-[12px] transition-default cursor-pointer"
              >
                <span className="font-medium text-text-primary">Admin:</span> <span className="text-text-muted">lucia@consultorio.com / admin123</span>
              </button>
              <button
                onClick={() => { setEmail('sofia@consultorio.com'); setPassword('secret123') }}
                className="w-full text-left px-3.5 py-2.5 rounded-[8px] bg-surface hover:bg-primary-50 text-[12px] transition-default cursor-pointer"
              >
                <span className="font-medium text-text-primary">Secretaria:</span> <span className="text-text-muted">sofia@consultorio.com / secret123</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-text-muted mt-5">v1.0</p>
      </div>
    </div>
  )
}
