import { useState } from "react";
import ProtectedPage from "../components/ProtectedPage";
import useHealthSysData from "../hooks/useHealthSysData";

const emptyForm = {
  patientId: "",
  symptoms: "",
  riskLevel: "",
  status: "",
  professional: ""
};

export default function TriagePage() {
  const { data, loaded, addTriage } = useHealthSysData();
  const [form, setForm] = useState(emptyForm);

  if (!loaded) {
    return <div className="loading-screen">Carregando dados...</div>;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    addTriage({
      ...form,
      patientId: Number(form.patientId)
    });
    setForm(emptyForm);
  }

  function findPatientName(patientId) {
    const patient = data.patients.find((item) => item.id === patientId);
    return patient ? patient.name : "Paciente nao encontrado";
  }

  return (
    <ProtectedPage title="Teletriagem e Classificacao de Risco" allowedRoles={["MEDICO","RECEPCIONISTA","ADMIN"]}>
      <section className="two-columns">
        <form className="card form-card" onSubmit={handleSubmit}>
          <h3>Nova triagem</h3>

          <label>
            Paciente
            <select name="patientId" value={form.patientId} onChange={handleChange} required>
              <option value="">Selecione</option>
              {data.patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Sintomas
            <textarea name="symptoms" value={form.symptoms} onChange={handleChange} rows="4" required />
          </label>

          <label>
            Nivel de risco
            <select name="riskLevel" value={form.riskLevel} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="Verde">Verde</option>
              <option value="Amarelo">Amarelo</option>
              <option value="Laranja">Laranja</option>
              <option value="Vermelho">Vermelho</option>
            </select>
          </label>

          <label>
            Status
            <input name="status" value={form.status} onChange={handleChange} required />
          </label>

          <label>
            Profissional
            <input name="professional" value={form.professional} onChange={handleChange} required />
          </label>

          <button className="primary-button" type="submit">
            Salvar triagem
          </button>
        </form>

        <div className="card">
          <h3>Painel de triagens</h3>

          <div className="stack-list">
            {data.triages
              .slice()
              .reverse()
              .map((triage) => (
                <article className="record-card" key={triage.id}>
                  <div className="section-title-row">
                    <strong>{findPatientName(triage.patientId)}</strong>
                    <span className={`tag risk-${triage.riskLevel.toLowerCase()}`}>
                      {triage.riskLevel}
                    </span>
                  </div>
                  <p>
                    <strong>Sintomas:</strong> {triage.symptoms}
                  </p>
                  <p>
                    <strong>Status:</strong> {triage.status}
                  </p>
                  <p>
                    <strong>Profissional:</strong> {triage.professional}
                  </p>
                </article>
              ))}
          </div>
        </div>
      </section>
    </ProtectedPage>
  );
}
