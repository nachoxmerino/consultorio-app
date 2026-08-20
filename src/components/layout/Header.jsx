import { useState, useRef, useEffect } from 'react'
import { Search, X, Bell, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import Button from '../ui/Button'

export default function Header({ title, subtitle, onNewAppointment, actions, children }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const { searchGlobal } = useData()
  const navigate = useNavigate()

  useEffect(() => {
    if (query.length >= 2) {
      setResults(searchGlobal(query))
      setOpen(true)
    } else {
      setResults([])
      setOpen(false)
    }
  }, [query, searchGlobal])

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        document.getElementById('global-search')?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const handleSelect = (item) => {
    if (item._type === 'patient') navigate(`/pacientes/${item.id}`)
    else navigate(`/profesionales/${item.id}`)
    setQuery('')
    setOpen(false)
  }

  return (
    <div className="flex items-center justify-between gap-6 mb-8">
      <div className="min-w-0">
        <h1 className="text-[28px] font-bold text-text-primary leading-tight tracking-tight">{title}</h1>
        {subtitle && <p className="text-[14px] text-text-secondary mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Search */}
        <div className="relative hidden sm:block" ref={ref}>
          <div className="relative">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              id="global-search"
              type="text"
              placeholder="Buscar pacientes, turnos, medicos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-14 py-2.5 bg-surface border border-border-light rounded-[12px] text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-50 w-[320px] transition-default"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
              <kbd className="px-1.5 py-0.5 bg-white border border-border rounded-[5px] text-[10px] font-medium text-text-muted">Ctrl</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-border rounded-[5px] text-[10px] font-medium text-text-muted">K</kbd>
            </div>
          </div>
          {open && results.length > 0 && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-[14px] shadow-[0_12px_40px_rgba(23,33,61,0.12)] border border-border-light max-h-72 overflow-y-auto z-50">
              {results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface transition-default text-left cursor-pointer first:rounded-t-[14px] last:rounded-b-[14px]"
                >
                  <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                    <span className="text-primary-500 text-[11px] font-semibold">
                      {item.first_name[0]}{item.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-text-primary">{item.first_name} {item.last_name}</p>
                    <p className="text-[12px] text-text-muted">
                      {item._type === 'patient' ? `DNI: ${item.dni}` : item.specialty}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-[12px] hover:bg-surface transition-default cursor-pointer">
          <Bell size={20} className="text-text-secondary" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger-500 rounded-full" />
        </button>

        {/* New Appointment */}
        {onNewAppointment && (
          <Button onClick={onNewAppointment} size="md">
            <Plus size={16} /> Nuevo turno
          </Button>
        )}

        {children}
        {actions}
      </div>
    </div>
  )
}
