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
      <div className="px-6 pt-8 pb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-500 rounded-[14px] flex items-center justify-center shrink-0">
            <Heart size={24} className="text-white" fill="white" strokeWidth={0} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-[18px] font-bold text-text-primary">Consultorio</h1>
              <p className="text-[13px] text-text-muted mt-0.5">Centro Medico</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-150',
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                {!collapsed && <span>{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 pb-6 mt-auto">
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-gray-50 transition-all duration-150">
          <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
            <span className="text-primary-600 font-semibold text-[13px]">
              {currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-text-primary truncate">{currentUser?.name}</p>
                <p className="text-[12px] text-text-muted truncate">{currentUser?.role === 'admin' ? 'Administradora' : 'Secretaria'}</p>
              </div>
              <button className="p-1 rounded-lg hover:bg-gray-100 cursor-pointer">
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
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl shadow-sm border border-border cursor-pointer"
      >
        <Menu size={20} className="text-text-secondary" />
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/20" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[270px] bg-white shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <X size={18} className="text-text-muted" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      <aside
        className={clsx(
          'hidden lg:flex flex-col bg-white border-r border-border h-screen sticky top-0 transition-all duration-200 shrink-0',
          collapsed ? 'w-[72px]' : 'w-[260px]'
        )}
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-10 w-6 h-6 bg-white border border-border rounded-full flex items-center justify-center shadow-sm hover:shadow transition-all duration-150 cursor-pointer z-10"
        >
          <ChevronLeft size={13} className={clsx('text-text-muted transition-transform duration-200', collapsed && 'rotate-180')} />
        </button>
      </aside>
    </>
  )
}
