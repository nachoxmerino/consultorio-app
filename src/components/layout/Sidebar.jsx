import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Calendar, Users, Stethoscope, Bell, ListTodo,
  BarChart3, Settings, LogOut, Menu, X, ChevronDown, Heart, ChevronLeft
} from 'lucide-react'
import { useData } from '../../context/DataContext'
import clsx from 'clsx'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/agenda', icon: Calendar, label: 'Agenda' },
  { path: '/pacientes', icon: Users, label: 'Pacientes' },
  { path: '/profesionales', icon: Stethoscope, label: 'Profesionales' },
  { path: '/recordatorios', icon: Bell, label: 'Recordatorios' },
  { path: '/tareas', icon: ListTodo, label: 'Tareas' },
  { path: '/estadisticas', icon: BarChart3, label: 'Estadisticas' },
  { path: '/configuracion', icon: Settings, label: 'Configuracion' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currentUser, dispatch } = useData()

  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: null })
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 pt-8 pb-10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-primary-500 rounded-[14px] flex items-center justify-center shrink-0">
            <Heart size={24} className="text-white" fill="white" strokeWidth={0} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-[20px] font-bold text-text-primary leading-tight tracking-tight">Consultorio</h1>
              <p className="text-[13px] text-text-muted leading-tight mt-0.5">Centro Medico</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-1 space-y-2.5">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-4 px-4 py-4 rounded-[14px] text-[15px] font-medium transition-default group',
                isActive
                  ? 'bg-primary-50 text-primary-500'
                  : 'text-text-secondary hover:bg-surface hover:text-text-primary'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
                {!collapsed && <span>{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="px-4 pb-7">
        <div className="flex items-center gap-3.5 px-4 py-4 rounded-[14px] hover:bg-surface transition-default">
          <div className="w-11 h-11 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
            <span className="text-primary-500 font-semibold text-[14px]">
              {currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-text-primary truncate">{currentUser?.name}</p>
                <p className="text-[12px] text-text-muted truncate">{currentUser?.role === 'admin' ? 'Administradora' : 'Secretaria'}</p>
              </div>
              <button className="cursor-pointer">
                <ChevronDown size={16} className="text-text-muted" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-5 left-5 z-50 p-3 bg-white rounded-[14px] shadow-card border border-border cursor-pointer"
      >
        <Menu size={20} className="text-text-secondary" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-text-primary/20 backdrop-blur-[2px]" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[270px] bg-white shadow-[4px_0_24px_rgba(0,0,0,0.08)]">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-[10px] hover:bg-surface cursor-pointer"
            >
              <X size={18} className="text-text-muted" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={clsx(
          'hidden lg:flex flex-col bg-white border-r border-border-light h-screen sticky top-0 transition-all duration-300 shrink-0',
          collapsed ? 'w-[76px]' : 'w-[270px]'
        )}
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-10 w-6 h-6 bg-white border border-border rounded-full flex items-center justify-center shadow-card hover:shadow-card-hover transition-default cursor-pointer z-10"
        >
          <ChevronLeft size={13} className={clsx('text-text-muted transition-transform duration-200', collapsed && 'rotate-180')} />
        </button>
      </aside>
    </>
  )
}
