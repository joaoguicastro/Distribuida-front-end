import { useEffect, useState } from "react";
import {
  initialPatients,
  initialRecords,
  initialTriages
} from "../data/initialData";
import { createPatient } from "../lib/api";

const STORAGE_KEY = "healthsys-data";
const SESSION_KEY = "healthsys-session";

const initialState = {
  patients: initialPatients,
  records: initialRecords,
  triages: initialTriages
};

export default function useHealthSysData() {
  const [data, setData] = useState(initialState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedData = window.localStorage.getItem(STORAGE_KEY);

    if (savedData) {
      setData(JSON.parse(savedData));
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
    }

    setLoaded(true);
  }, []);

  function saveData(nextData) {
    setData(nextData);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
  }

  async function addPatient(patient) {
    const savedSession = window.localStorage.getItem(SESSION_KEY);
    const session = savedSession ? JSON.parse(savedSession) : null;
    const patientPayload = {
      nome: patient.name,
      dataNascimento: patient.birthDate,
      sexo: patient.sexo,
      telefone: patient.phone,
      usuarioId: session?.id ?? null
    };
    const savedPatient = await createPatient(patientPayload, session?.token);
    const nextData = {
      ...data,
      patients: [
        ...data.patients,
        {
          ...savedPatient,
          name: savedPatient.nome,
          birthDate: savedPatient.dataNascimento,
          phone: savedPatient.telefone,
          allergy: patient.allergy,
          vaccine: patient.vaccine
        }
      ]
    };

    saveData(nextData);
    return savedPatient;
  }

  function addRecord(record) {
    const nextData = {
      ...data,
      records: [...data.records, { id: Date.now(), ...record }]
    };

    saveData(nextData);
  }

  function addTriage(triage) {
    const nextData = {
      ...data,
      triages: [...data.triages, { id: Date.now(), ...triage }]
    };

    saveData(nextData);
  }

  function resetData() {
    saveData(initialState);
  }

  return {
    data,
    loaded,
    addPatient,
    addRecord,
    addTriage,
    resetData
  };
}
