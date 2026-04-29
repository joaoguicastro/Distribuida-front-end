import { useState } from "react";
import ProtectedPage from "../components/ProtectedPage";
import useHealthSysData from "../hooks/useHealthSysData";

const emptyForm = {
  patientId: "",
  doctor: "",
  appointmentDate: "",
  exam: "",
  medication: "",
  notes: ""
};

export default function RecordsPage() {
  const { data, loaded, addRecord } = useHealthSysData();
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
    addRecord({
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
    <ProtectedPage title="Prontuario Eletronico" allowedRoles={["MEDICO","ADMIN"]}>
      <section className="two-columns">
        <form className="card form-card" onSubmit={handleSubmit}>
          <h3>Novo registro medico</h3>

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
            Profissional responsavel
            <input name="doctor" value={form.doctor} onChange={handleChange} required />
          </label>

          <label>
            Data do atendimento
            <input
              type="date"
              name="appointmentDate"
              value={form.appointmentDate}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Exame
            <input name="exam" value={form.exam} onChange={handleChange} />
          </label>

          <label>
            Medicamento
            <input name="medication" value={form.medication} onChange={handleChange} />
          </label>

          <label>
            Observacoes
            <textarea name="notes" value={form.notes} onChange={handleChange} rows="5" />
          </label>

          <button className="primary-button" type="submit">
            Salvar prontuario
          </button>
        </form>

        <div className="card">
          <h3>Historico registrado</h3>

          <div className="stack-list">
            {data.records
              .slice()
              .reverse()
              .map((record) => (
                <article className="record-card" key={record.id}>
                  <div className="section-title-row">
                    <strong>{findPatientName(record.patientId)}</strong>
                    <span className="tag">{record.appointmentDate}</span>
                  </div>
                  <p>
                    <strong>Profissional:</strong> {record.doctor}
                  </p>
                  <p>
                    <strong>Exame:</strong> {record.exam || "Nao informado"}
                  </p>
                  <p>
                    <strong>Medicamento:</strong> {record.medication || "Nao informado"}
                  </p>
                  <p>
                    <strong>Observacoes:</strong> {record.notes || "Sem observacoes"}
                  </p>
                </article>
              ))}
          </div>
        </div>
      </section>
    </ProtectedPage>
  );
}
