import { useEffect, useState } from "react";
import {
  initialPatients,
  initialRecords,
  initialTriages
} from "../data/initialData";

const STORAGE_KEY = "healthsys-data";

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

  function addPatient(patient) {
    const nextData = {
      ...data,
      patients: [...data.patients, { id: Date.now(), ...patient }]
    };

    saveData(nextData);
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
