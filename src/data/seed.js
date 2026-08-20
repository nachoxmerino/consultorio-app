const today = new Date()
const todayStr = today.toISOString().split('T')[0]

function dateOffset(days) {
  const d = new Date(today)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

export const seedData = {
  specialties: [
    { id: '1', name: 'Clinica Medica', color: '#3b82f6' },
    { id: '2', name: 'Pediatria', color: '#22c55e' },
    { id: '3', name: 'Ginecologia', color: '#ec4899' },
    { id: '4', name: 'Dermatologia', color: '#f59e0b' },
    { id: '5', name: 'Cardiologia', color: '#ef4444' },
  ],

  doctors: [
    {
      id: '1', first_name: 'Juan', last_name: 'Perez',
      specialty: 'Clinica Medica', specialty_id: '1',
      matricula: 'MN 12345', phone: '1155551234', email: 'drperez@consultorio.com',
      duration: 30,
      avatar_color: '#3b82f6',
    },
    {
      id: '2', first_name: 'Laura', last_name: 'Lopez',
      specialty: 'Pediatria', specialty_id: '2',
      matricula: 'MN 23456', phone: '1155552345', email: 'dralopez@consultorio.com',
      duration: 30,
      avatar_color: '#22c55e',
    },
    {
      id: '3', first_name: 'Carlos', last_name: 'Martinez',
      specialty: 'Cardiologia', specialty_id: '5',
      matricula: 'MN 34567', phone: '1155553456', email: 'drmartinez@consultorio.com',
      duration: 45,
      avatar_color: '#ef4444',
    },
  ],

  patients: [
    { id: '1', first_name: 'Maria', last_name: 'Gonzalez', dni: '30123456', phone: '1144441001', email: 'maria.gonzalez@email.com', birth_date: '1985-03-15', insurance: 'OSDE', insurance_number: '1234567', notes: 'Paciente con hipertension controlada', created_at: '2024-01-10' },
    { id: '2', first_name: 'Carlos', last_name: 'Rodriguez', dni: '28456789', phone: '1144441002', email: 'carlos.rodriguez@email.com', birth_date: '1983-07-22', insurance: 'Swiss Medical', insurance_number: '2345678', notes: '', created_at: '2024-01-15' },
    { id: '3', first_name: 'Ana', last_name: 'Lopez', dni: '35789012', phone: '1144441003', email: 'ana.lopez@email.com', birth_date: '1990-11-08', insurance: 'Galeno', insurance_number: '3456789', notes: 'Alergia a penicilina', created_at: '2024-02-01' },
    { id: '4', first_name: 'Pedro', last_name: 'Martinez', dni: '27123456', phone: '1144441004', email: 'pedro.martinez@email.com', birth_date: '1981-05-30', insurance: 'OSDE', insurance_number: '4567890', notes: 'Diabetico tipo 2', created_at: '2024-02-10' },
    { id: '5', first_name: 'Laura', last_name: 'Fernandez', dni: '32567890', phone: '1144441005', email: 'laura.fernandez@email.com', birth_date: '1988-09-12', insurance: 'Preventel', insurance_number: '5678901', notes: '', created_at: '2024-02-20' },
    { id: '6', first_name: 'Roberto', last_name: 'Sanchez', dni: '25890123', phone: '1144441006', email: 'roberto.sanchez@email.com', birth_date: '1979-01-25', insurance: 'OSDE', insurance_number: '6789012', notes: 'Control clinico trimestral', created_at: '2024-03-01' },
    { id: '7', first_name: 'Camila', last_name: 'Torres', dni: '38012345', phone: '1144441007', email: 'camila.torres@email.com', birth_date: '1995-06-18', insurance: 'Federada', insurance_number: '7890123', notes: '', created_at: '2024-03-10' },
    { id: '8', first_name: 'Diego', last_name: 'Ramirez', dni: '31234567', phone: '1144441008', email: 'diego.ramirez@email.com', birth_date: '1986-12-03', insurance: 'Swiss Medical', insurance_number: '8901234', notes: 'Antecedente de arritmia', created_at: '2024-03-15' },
    { id: '9', first_name: 'Valentina', last_name: 'Diaz', dni: '36456789', phone: '1144441009', email: 'valentina.diaz@email.com', birth_date: '1992-04-27', insurance: 'OSDE', insurance_number: '9012345', notes: '', created_at: '2024-04-01' },
    { id: '10', first_name: 'Fernando', last_name: 'Morales', dni: '29345678', phone: '1144441010', email: 'fernando.morales@email.com', birth_date: '1984-08-14', insurance: 'AOMA', insurance_number: '0123456', notes: 'Primeva consulta', created_at: '2024-04-10' },
    { id: '11', first_name: 'Luciana', last_name: 'Acosta', dni: '33678901', phone: '1144441011', email: 'luciana.acosta@email.com', birth_date: '1989-02-09', insurance: 'Galeno', insurance_number: '1122334', notes: '', created_at: '2024-04-20' },
    { id: '12', first_name: 'Martin', last_name: 'Silva', dni: '26789012', phone: '1144441012', email: 'martin.silva@email.com', birth_date: '1980-10-21', insurance: 'OSDE', insurance_number: '2233445', notes: 'Control cardiologico', created_at: '2024-05-01' },
    { id: '13', first_name: 'Sofia', last_name: 'Luna', dni: '37890123', phone: '1144441013', email: 'sofia.luna@email.com', birth_date: '1993-07-06', insurance: 'Preventel', insurance_number: '3344556', notes: '', created_at: '2024-05-10' },
    { id: '14', first_name: 'Hernan', last_name: 'Castro', dni: '24567890', phone: '1144441014', email: 'hernan.castro@email.com', birth_date: '1977-11-29', insurance: 'Swiss Medical', insurance_number: '4455667', notes: 'Paciente cronico, control mensual', created_at: '2024-05-20' },
    { id: '15', first_name: 'Isabel', last_name: 'Ruiz', dni: '34901234', phone: '1144441015', email: 'isabel.ruiz@email.com', birth_date: '1991-03-17', insurance: 'OSDE', insurance_number: '5566778', notes: 'Embarazada, control prenatal', created_at: '2024-06-01' },
  ],

  appointments: [
    { id: '1', patient_id: '1', doctor_id: '1', date: todayStr, time: '09:00', status: 'confirmado', reason: 'Control de presion', notes: 'Traer ultimos estudios', reminder_sent: true },
    { id: '2', patient_id: '2', doctor_id: '1', date: todayStr, time: '09:30', status: 'confirmado', reason: 'Consulta general', notes: '', reminder_sent: true },
    { id: '3', patient_id: '3', doctor_id: '2', date: todayStr, time: '10:00', status: 'pendiente', reason: 'Control pediatrico', notes: 'Traer carnet de vacunacion', reminder_sent: false },
    { id: '4', patient_id: '4', doctor_id: '3', date: todayStr, time: '10:30', status: 'pendiente', reason: 'Control cardiologico', notes: '', reminder_sent: false },
    { id: '5', patient_id: '5', doctor_id: '1', date: todayStr, time: '11:00', status: 'confirmado', reason: 'Consulta dermatologica', notes: '', reminder_sent: true },
    { id: '6', patient_id: '6', doctor_id: '1', date: todayStr, time: '11:30', status: 'cancelado', reason: 'Control clinico', notes: 'Paciente cancelo por viaje', reminder_sent: true },
    { id: '7', patient_id: '7', doctor_id: '2', date: todayStr, time: '14:00', status: 'pendiente', reason: 'Consulta general', notes: '', reminder_sent: false },
    { id: '8', patient_id: '8', doctor_id: '3', date: todayStr, time: '14:30', status: 'confirmado', reason: 'Seguimiento arritmia', notes: 'Traer Holter', reminder_sent: true },
    { id: '9', patient_id: '9', doctor_id: '1', date: todayStr, time: '15:00', status: 'ausente', reason: 'Primera consulta', notes: '', reminder_sent: true },
    { id: '10', patient_id: '10', doctor_id: '3', date: todayStr, time: '15:30', status: 'atendido', reason: 'Consulta cardiologica', notes: 'EKG normal', reminder_sent: true },

    { id: '11', patient_id: '1', doctor_id: '1', date: dateOffset(1), time: '09:00', status: 'confirmado', reason: 'Seguimiento', notes: '', reminder_sent: true },
    { id: '12', patient_id: '11', doctor_id: '2', date: dateOffset(1), time: '10:00', status: 'pendiente', reason: 'Control pediatrico', notes: '', reminder_sent: false },
    { id: '13', patient_id: '12', doctor_id: '3', date: dateOffset(1), time: '11:00', status: 'confirmado', reason: 'Control cardiologico', notes: 'Traer estudios previos', reminder_sent: true },
    { id: '14', patient_id: '13', doctor_id: '1', date: dateOffset(1), time: '14:00', status: 'pendiente', reason: 'Consulta clinica', notes: '', reminder_sent: false },
    { id: '15', patient_id: '14', doctor_id: '3', date: dateOffset(1), time: '15:00', status: 'confirmado', reason: 'Control mensual', notes: '', reminder_sent: true },

    { id: '16', patient_id: '3', doctor_id: '1', date: dateOffset(2), time: '09:00', status: 'pendiente', reason: 'Consulta clinica', notes: '', reminder_sent: false },
    { id: '17', patient_id: '5', doctor_id: '2', date: dateOffset(2), time: '10:00', status: 'confirmado', reason: 'Control', notes: '', reminder_sent: true },
    { id: '18', patient_id: '15', doctor_id: '2', date: dateOffset(2), time: '11:00', status: 'pendiente', reason: 'Control prenatal', notes: 'Traer ecografia', reminder_sent: false },

    { id: '19', patient_id: '4', doctor_id: '1', date: dateOffset(-1), time: '09:00', status: 'atendido', reason: 'Control glucemia', notes: 'Glucemia en rango', reminder_sent: true },
    { id: '20', patient_id: '6', doctor_id: '3', date: dateOffset(-1), time: '10:00', status: 'atendido', reason: 'Control cardiaco', notes: 'EKG sin cambios', reminder_sent: true },
    { id: '21', patient_id: '9', doctor_id: '2', date: dateOffset(-1), time: '14:00', status: 'cancelado', reason: 'Consulta pediatrica', notes: 'Paciente cancelo', reminder_sent: true },
    { id: '22', patient_id: '2', doctor_id: '1', date: dateOffset(-2), time: '11:00', status: 'atendido', reason: 'Consulta general', notes: 'Paciente bien', reminder_sent: true },
    { id: '23', patient_id: '7', doctor_id: '2', date: dateOffset(-3), time: '09:00', status: 'atendido', reason: 'Control', notes: '', reminder_sent: true },
    { id: '24', patient_id: '10', doctor_id: '3', date: dateOffset(-3), time: '15:00', status: 'ausente', reason: 'Primera consulta cardiologica', notes: '', reminder_sent: true },
  ],

  doctorSchedules: [
    { id: '1', doctor_id: '1', day_of_week: 1, start_time: '08:00', end_time: '13:00' },
    { id: '2', doctor_id: '1', day_of_week: 3, start_time: '14:00', end_time: '19:00' },
    { id: '3', doctor_id: '1', day_of_week: 5, start_time: '08:00', end_time: '13:00' },
    { id: '4', doctor_id: '2', day_of_week: 1, start_time: '09:00', end_time: '14:00' },
    { id: '5', doctor_id: '2', day_of_week: 2, start_time: '09:00', end_time: '14:00' },
    { id: '6', doctor_id: '2', day_of_week: 4, start_time: '09:00', end_time: '14:00' },
    { id: '7', doctor_id: '3', day_of_week: 1, start_time: '10:00', end_time: '15:00' },
    { id: '8', doctor_id: '3', day_of_week: 3, start_time: '10:00', end_time: '15:00' },
    { id: '9', doctor_id: '3', day_of_week: 5, start_time: '14:00', end_time: '18:00' },
  ],

  blockedSchedules: [
    { id: '1', doctor_id: '1', date: dateOffset(3), time: '09:00', reason: 'Reunion staff' },
    { id: '2', doctor_id: '3', date: dateOffset(2), time: '11:00', reason: 'Congreso medico' },
  ],

  reminders: [
    { id: '1', appointment_id: '1', patient_id: '1', method: 'whatsapp', sent_at: dateOffset(0) + 'T08:00:00', sent_by: 'Lucia Martinez' },
    { id: '2', appointment_id: '2', patient_id: '2', method: 'whatsapp', sent_at: dateOffset(0) + 'T08:05:00', sent_by: 'Lucia Martinez' },
    { id: '3', appointment_id: '11', patient_id: '1', method: 'whatsapp', sent_at: dateOffset(0) + 'T08:10:00', sent_by: 'Lucia Martinez' },
  ],

  history: [
    { id: '1', appointment_id: '1', action: 'created', details: 'Turno creado', user: 'Lucia Martinez', timestamp: dateOffset(-2) + 'T10:00:00' },
    { id: '2', appointment_id: '1', action: 'confirmed', details: 'Turno confirmado', user: 'Lucia Martinez', timestamp: dateOffset(-1) + 'T09:00:00' },
    { id: '3', appointment_id: '1', action: 'reminder_sent', details: 'Recordatorio WhatsApp enviado', user: 'Lucia Martinez', timestamp: dateOffset(0) + 'T08:00:00' },
    { id: '4', appointment_id: '6', action: 'cancelled', details: 'Paciente cancelo por viaje', user: 'Lucia Martinez', timestamp: dateOffset(0) + 'T07:30:00' },
    { id: '5', appointment_id: '9', action: 'marked_absent', details: 'Paciente no se presento', user: 'Lucia Martinez', timestamp: dateOffset(0) + 'T10:30:00' },
    { id: '6', appointment_id: '19', action: 'completed', details: 'Paciente atendido - Control glucemia OK', user: 'Lucia Martinez', timestamp: dateOffset(-1) + 'T09:30:00' },
  ],

  users: [
    { id: '1', name: 'Lucia Martinez', email: 'lucia@consultorio.com', role: 'admin' },
    { id: '2', name: 'Sofia Gonzalez', email: 'sofia@consultorio.com', role: 'secretary' },
  ],
}
