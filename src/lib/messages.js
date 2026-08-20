import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

function formatDateFriendly(dateStr) {
  const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr
  const dayName = dayNames[d.getDay()]
  const day = d.getDate()
  const month = monthNames[d.getMonth()]
  return `${dayName} ${day} de ${month}`
}

export function generateReminderMessage(appointment, patient, doctor) {
  const dateStr = formatDateFriendly(appointment.date)
  const time = appointment.time.slice(0, 5)

  return `Hola ${patient.first_name}, le recordamos que tiene un turno en el consultorio.

Fecha: ${dateStr}
Hora: ${time}
Profesional: Dr(a). ${doctor.first_name} ${doctor.last_name}
Especialidad: ${doctor.specialty}

Por favor, confirme su asistencia respondiendo a este mensaje.

Muchas gracias.`
}

export function generateRescheduleMessage(appointment, patient, doctor, newDate, newTime) {
  const oldDateStr = formatDateFriendly(appointment.date)
  const newDateStr = formatDateFriendly(newDate)
  const time = newTime.slice(0, 5)

  return `Hola ${patient.first_name}, queremos informarle que su turno fue reprogramado.

Turno anterior: ${oldDateStr} a las ${appointment.time.slice(0, 5)}
Nueva fecha: ${newDateStr}
Nueva hora: ${time}
Profesional: Dr(a). ${doctor.first_name} ${doctor.last_name}
Especialidad: ${doctor.specialty}

Si tiene alguna consulta, no dude en comunicarse.

Muchas gracias.`
}

export function generateCancellationMessage(patient, doctor, dateStr) {
  return `Hola ${patient.first_name}, lamentamos informarle que el turno del ${formatDateFriendly(dateStr)} con Dr(a). ${doctor.first_name} ${doctor.last_name} fue cancelado.

Si desea reprogramarlo, por favor contactese con el consultorio.

Muchas gracias.`
}
