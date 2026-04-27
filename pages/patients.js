import { useState } from "react";
import ProtectedPage from "../components/ProtectedPage";
import useHealthSysData from "../hooks/useHealthSysData";

const emptyForm = {
  name: "",
  birthDate: "",
  sexo: "",
  phone: "",
  allergy: "",
  vaccine: ""
};

export default function PatientsPage() {
  const { data, loaded, addPatient } = useHealthSysData();
  const [form, setForm] = useState(emptyForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

    try {
      await addPatient(form);
      setSuccessMessage("Paciente cadastrado no backend com sucesso.");
    } catch (error) {
      setErrorMessage(error.message);
      return;
    }

    setForm(emptyForm);
  }

  return (
    <ProtectedPage title="Gestao de Pacientes">
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
            Alergia
            <input name="allergy" value={form.allergy} onChange={handleChange} />
          </label>

          <label>
            Vacina
            <input name="vaccine" value={form.vaccine} onChange={handleChange} />
          </label>

          <button className="primary-button" type="submit">
            Salvar paciente
          </button>

          {errorMessage && <p className="error-text">{errorMessage}</p>}
          {successMessage && <p className="success-text">{successMessage}</p>}
        </form>

        <div className="card">
          <h3>Lista de pacientes</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>Alergia</th>
                  <th>Vacina</th>
                </tr>
              </thead>
              <tbody>
                {data.patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.name}</td>
                    <td>{patient.telefone || patient.phone}</td>
                    <td>{patient.allergy || "Nao informado"}</td>
                    <td>{patient.vaccine || "Nao informado"}</td>
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
