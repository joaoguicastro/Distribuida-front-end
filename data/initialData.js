export const initialPatients = [
  {
    id: 1,
    name: "Maria Oliveira",
    birthDate: "1988-06-12",
    gender: "Feminino",
    phone: "(61) 99999-1111",
    allergy: "Dipirona",
    vaccine: "Influenza"
  },
  {
    id: 2,
    name: "Joao Santos",
    birthDate: "1975-09-03",
    gender: "Masculino",
    phone: "(61) 98888-2222",
    allergy: "Nenhuma",
    vaccine: "COVID-19"
  }
];

export const initialRecords = [
  {
    id: 1,
    patientId: 1,
    doctor: "Dra. Carla",
    appointmentDate: "2026-04-10",
    exam: "Hemograma",
    medication: "Paracetamol",
    notes: "Paciente com melhora no quadro clinico."
  },
  {
    id: 2,
    patientId: 2,
    doctor: "Dr. Paulo",
    appointmentDate: "2026-04-11",
    exam: "Raio-X",
    medication: "Ibuprofeno",
    notes: "Necessita retorno em 7 dias."
  }
];

export const initialTriages = [
  {
    id: 1,
    patientId: 1,
    symptoms: "Febre e dor no corpo",
    riskLevel: "Amarelo",
    status: "Em observacao",
    professional: "Enf. Luciana"
  },
  {
    id: 2,
    patientId: 2,
    symptoms: "Dor toracica leve",
    riskLevel: "Laranja",
    status: "Encaminhado para consulta",
    professional: "Enf. Renato"
  }
];
