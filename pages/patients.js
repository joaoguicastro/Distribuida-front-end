import { useState } from "react";
import ProtectedPage from "../components/ProtectedPage";
import useHealthSysData from "../hooks/useHealthSysData";

const emptyForm = {
  name: "",
  birthDate: "",
  sexo: "",
  phone: "",
  sintomas: ""
};

export default function PatientsPage() {
  const { data, loaded, addPatient } = useHealthSysData();
  const [form, setForm] = useState(emptyForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [saving, setSaving] = useState(false);

  if (!loaded) {
    return <div className="loading-screen">Carregando dados...</div>;
  }

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
      setSuccessMessage("Paciente cadastrado com sucesso.");
      setForm(emptyForm);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedPage title="Gestao de Pacientes" allowedRoles={["MEDICO", "RECEPCIONISTA", "ADMIN"]}>
      <section className="two-columns">
        <form className="card form-card" onSubmit={handleSubmit}>
          <h3>Novo paciente</h3>

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
              placeholder="Descreva os sintomas do paciente (dispara a triagem automatica)"
            />
          </label>

          {errorMessage && <p className="error-text">{errorMessage}</p>}
          {successMessage && <p className="success-text">{successMessage}</p>}

          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? "Salvando..." : "Salvar paciente"}
          </button>
        </form>

        <div className="card">
          <h3>Lista de pacientes</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>Sexo</th>
                </tr>
              </thead>
              <tbody>
                {data.patients.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", color: "#888" }}>
                      Nenhum paciente cadastrado.
                    </td>
                  </tr>
                )}
                {data.patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.id}</td>
                    <td>{patient.nome || patient.name}</td>
                    <td>{patient.telefone || patient.phone}</td>
                    <td>{patient.sexo || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </ProtectedPage>
  );
}