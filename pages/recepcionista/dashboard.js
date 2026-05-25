import { useState } from "react";
import ProtectedPage from "../../components/ProtectedPage";
import useHealthSysData from "../../hooks/useHealthSysData";

const emptyForm = {
  name: "",
  birthDate: "",
  sexo: "",
  phone: "",
  sintomas: ""
};

export default function RecepcionistaDashboard() {
  const { data, loaded, addPatient } = useHealthSysData();
  const [form, setForm] = useState(emptyForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [saving, setSaving] = useState(false);

  if (!loaded) return <div className="loading-screen">Carregando...</div>;

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setSaving(true);
    try {
      await addPatient(form);
      setSuccessMessage("Paciente cadastrado com sucesso. Triagem gerada automaticamente.");
      setForm(emptyForm);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedPage title="Painel da Recepcionista" allowedRoles={["RECEPCIONISTA", "ADMIN"]}>
      <section className="grid-cards">
        <div className="card highlight">
          <p className="card-label">Pacientes cadastrados</p>
          <strong>{data.patients.length}</strong>
        </div>
        <div className="card">
          <p className="card-label">Triagens realizadas</p>
          <strong>{data.triages.length}</strong>
        </div>
        <div className="card">
          <p className="card-label">Triagens alto risco</p>
          <strong>
            {data.triages.filter((t) => t.nivelRisco === "ALTO").length}
          </strong>
        </div>
      </section>

      <section className="two-columns">
        <form className="card form-card" onSubmit={handleSubmit}>
          <h3>Cadastrar novo paciente</h3>

          <label>
            Nome
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Data de nascimento
            <input
              type="date"
              name="birthDate"
              value={form.birthDate}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Sexo
            <select name="sexo" value={form.sexo} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="FEMININO">FEMININO</option>
              <option value="MASCULINO">MASCULINO</option>
              <option value="OUTROS">OUTROS</option>
            </select>
          </label>
          <label>
            Telefone
            <input name="phone" value={form.phone} onChange={handleChange} required />
          </label>
          <label>
            Sintomas iniciais
            <textarea
              name="sintomas"
              value={form.sintomas}
              onChange={handleChange}
              rows="3"
              placeholder="Descreva os sintomas (dispara a triagem automatica)"
            />
          </label>

          {errorMessage && <p className="error-text">{errorMessage}</p>}
          {successMessage && <p className="success-text">{successMessage}</p>}

          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? "Cadastrando..." : "Cadastrar paciente"}
          </button>
        </form>

        <div className="card">
          <h3>Pacientes recentes</h3>
          <div className="stack-list">
            {data.patients.length === 0 && (
              <p style={{ color: "#888" }}>Nenhum paciente cadastrado.</p>
            )}
            {data.patients.slice(-5).reverse().map((patient) => (
              <div className="list-row" key={patient.id}>
                <div>
                  <strong>{patient.nome || patient.name}</strong>
                  <p>{patient.telefone || patient.phone}</p>
                </div>
                <span className="tag">{patient.sexo || "—"}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ProtectedPage>
  );
}