import { useState } from "react";
import ProtectedPage from "../../components/ProtectedPage";
import useHealthSysData from "../../hooks/useHealthSysData";

const emptyForm = {
  name: "", birthDate: "", sexo: "", phone: "", allergy: "", vaccine: ""
};

export default function RecepcionistaDashboard() {
  const { data, loaded, addPatient } = useHealthSysData();
  const [form, setForm] = useState(emptyForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  if (!loaded) return <div className="loading-screen">Carregando...</div>;

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
      setSuccessMessage("Paciente cadastrado com sucesso.");
      setForm(emptyForm);
    } catch (error) {
      setErrorMessage(error.message);
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
          <p className="card-label">Aguardando atendimento</p>
          <strong>
            {data.triages.filter((t) => t.status === "Em observacao").length}
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
            <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} required />
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

          {errorMessage && <p className="error-text">{errorMessage}</p>}
          {successMessage && <p className="success-text">{successMessage}</p>}

          <button className="primary-button" type="submit">Cadastrar paciente</button>
        </form>

        <div className="card">
          <h3>Pacientes cadastrados hoje</h3>
          <div className="stack-list">
            {data.patients.slice(-5).reverse().map((patient) => (
              <div className="list-row" key={patient.id}>
                <div>
                  <strong>{patient.name}</strong>
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
