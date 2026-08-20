import { createContext, useContext, useReducer, useCallback } from 'react'
import { seedData } from '../data/seed'

const DataContext = createContext(null)

const initialState = {
  ...seedData,
  currentUser: { id: '1', name: 'Lucia Martinez', role: 'admin', email: 'lucia@consultorio.com' },
}

function dataReducer(state, action) {
  switch (action.type) {
    case 'ADD_PATIENT':
      return { ...state, patients: [...state.patients, { ...action.payload, id: Date.now().toString(), created_at: new Date().toISOString() }] }
    case 'UPDATE_PATIENT':
      return { ...state, patients: state.patients.map(p => p.id === action.payload.id ? { ...p, ...action.payload } : p) }
    case 'DELETE_PATIENT':
      return { ...state, patients: state.patients.filter(p => p.id !== action.payload) }
    case 'ADD_DOCTOR':
      return { ...state, doctors: [...state.doctors, { ...action.payload, id: Date.now().toString() }] }
    case 'UPDATE_DOCTOR':
      return { ...state, doctors: state.doctors.map(d => d.id === action.payload.id ? { ...d, ...action.payload } : d) }
    case 'DELETE_DOCTOR':
      return { ...state, doctors: state.doctors.filter(d => d.id !== action.payload) }
    case 'ADD_SPECIALTY':
      return { ...state, specialties: [...state.specialties, { ...action.payload, id: Date.now().toString() }] }
    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, { ...action.payload, id: Date.now().toString(), created_at: new Date().toISOString() }] }
    case 'UPDATE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map(a => a.id === action.payload.id ? { ...a, ...action.payload } : a),
        history: [...state.history, {
          id: Date.now().toString(),
          appointment_id: action.payload.id,
          action: action.payload.action || 'update',
          details: action.payload.details || 'Turno actualizado',
          user: state.currentUser.name,
          timestamp: new Date().toISOString(),
        }]
      }
    case 'DELETE_APPOINTMENT':
      return { ...state, appointments: state.appointments.filter(a => a.id !== action.payload) }
    case 'UPDATE_SCHEDULE':
      return { ...state, doctorSchedules: state.doctorSchedules.map(s => s.id === action.payload.id ? { ...s, ...action.payload } : s) }
    case 'ADD_SCHEDULE':
      return { ...state, doctorSchedules: [...state.doctorSchedules, { ...action.payload, id: Date.now().toString() }] }
    case 'ADD_BLOCKED_SCHEDULE':
      return { ...state, blockedSchedules: [...state.blockedSchedules, { ...action.payload, id: Date.now().toString() }] }
    case 'REMOVE_BLOCKED_SCHEDULE':
      return { ...state, blockedSchedules: state.blockedSchedules.filter(b => b.id !== action.payload) }
    case 'ADD_REMINDER':
      return { ...state, reminders: [...state.reminders, { ...action.payload, id: Date.now().toString(), sent_at: new Date().toISOString() }] }
    case 'UPDATE_REMINDER':
      return { ...state, reminders: state.reminders.map(r => r.id === action.payload.id ? { ...r, ...action.payload } : r) }
    case 'ADD_HISTORY':
      return { ...state, history: [...state.history, { ...action.payload, id: Date.now().toString(), timestamp: new Date().toISOString() }] }
    case 'SET_USER':
      return { ...state, currentUser: action.payload }
    default:
      return state
  }
}

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, initialState)

  const value = {
    ...state,
    dispatch,
    getPatient: useCallback((id) => state.patients.find(p => p.id === id), [state.patients]),
    getDoctor: useCallback((id) => state.doctors.find(d => d.id === id), [state.doctors]),
    getSpecialty: useCallback((id) => state.specialties.find(s => s.id === id), [state.specialties]),
    getPatientAppointments: useCallback((patientId) => state.appointments.filter(a => a.patient_id === patientId).sort((a, b) => new Date(b.date) - new Date(a.date)), [state.appointments]),
    getDoctorAppointments: useCallback((doctorId, date) => {
      let filtered = state.appointments.filter(a => a.doctor_id === doctorId)
      if (date) filtered = filtered.filter(a => a.date === date)
      return filtered
    }, [state.appointments]),
    getAppointmentsByDate: useCallback((date) => state.appointments.filter(a => a.date === date).sort((a, b) => a.time.localeCompare(b.time)), [state.appointments]),
    getAppointmentsByDoctor: useCallback((doctorId) => state.appointments.filter(a => a.doctor_id === doctorId).sort((a, b) => new Date(b.date) - new Date(a.date)), [state.appointments]),
    getTodayAppointments: useCallback(() => {
      const today = new Date().toISOString().split('T')[0]
      return state.appointments.filter(a => a.date === today).sort((a, b) => a.time.localeCompare(b.time))
    }, [state.appointments]),
    getPendingReminders: useCallback(() => {
      const today = new Date().toISOString().split('T')[0]
      const upcoming = state.appointments.filter(a => {
        return a.date >= today && (a.status === 'pendiente' || a.status === 'confirmado')
      })
      const reminded = state.reminders.map(r => r.appointment_id)
      return upcoming.filter(a => !reminded.includes(a.id))
    }, [state.appointments, state.reminders]),
    getDoctorSchedule: useCallback((doctorId) => state.doctorSchedules.filter(s => s.doctor_id === doctorId), [state.doctorSchedules]),
    isSlotAvailable: useCallback((doctorId, date, time, excludeAppointmentId) => {
      const existing = state.appointments.find(a =>
        a.doctor_id === doctorId &&
        a.date === date &&
        a.time === time &&
        a.status !== 'cancelado' &&
        a.id !== excludeAppointmentId
      )
      const blocked = state.blockedSchedules.find(b =>
        b.doctor_id === doctorId &&
        b.date === date &&
        b.time === time
      )
      return !existing && !blocked
    }, [state.appointments, state.blockedSchedules]),
    searchGlobal: useCallback((query) => {
      const q = query.toLowerCase()
      const patients = state.patients.filter(p =>
        `${p.first_name} ${p.last_name} ${p.dni} ${p.phone}`.toLowerCase().includes(q)
      ).map(p => ({ ...p, _type: 'patient' }))
      const doctors = state.doctors.filter(d =>
        `${d.first_name} ${d.last_name} ${d.specialty}`.toLowerCase().includes(q)
      ).map(d => ({ ...d, _type: 'doctor' }))
      return [...patients, ...doctors]
    }, [state.patients, state.doctors]),
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
