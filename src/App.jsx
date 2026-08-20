import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DataProvider, useData } from './context/DataContext'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Agenda from './pages/Agenda'
import Patients from './pages/Patients'
import Doctors from './pages/Doctors'
import Reminders from './pages/Reminders'
import Tasks from './pages/Tasks'
import Statistics from './pages/Statistics'
import SettingsPage from './pages/Settings'
import Login from './pages/Login'

function ProtectedRoute({ children }) {
  const { currentUser } = useData()
  if (!currentUser) return <Navigate to="/login" replace />
  return children
}

function PublicRoute({ children }) {
  const { currentUser } = useData()
  if (currentUser) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="agenda" element={<Agenda />} />
        <Route path="pacientes" element={<Patients />} />
        <Route path="pacientes/:id" element={<Patients />} />
        <Route path="profesionales" element={<Doctors />} />
        <Route path="profesionales/:id" element={<Doctors />} />
        <Route path="recordatorios" element={<Reminders />} />
        <Route path="tareas" element={<Tasks />} />
        <Route path="estadisticas" element={<Statistics />} />
        <Route path="configuracion" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </DataProvider>
  )
}
