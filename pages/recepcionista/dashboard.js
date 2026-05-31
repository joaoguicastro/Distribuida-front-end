import { useState } from "react";
import ProtectedPage from "../../components/ProtectedPage";
import useHealthSysData from "../../hooks/useHealthSysData";
import {
  validateNome,
  validatePhone,
  validateBirthDate,
  validateSintomas,
  formatPhone,
  todayISO,
} from "../../lib/validations";

const emptyForm = {
  name: "",
  birthDate: "",
  sexo: "",
  phone: "",
  sintomas: "",
};

function validateForm(fields) {
  const errs = {};
  const nomeErr = validateNome(fields.name);
  if (nomeErr) errs.name = nomeErr;

  const birthErr = validateBirthDate(fields.birthDate);
  if (birthErr) errs.birthDate = birthErr;

  if (!fields.sexo) errs.sexo = "Selecione o sexo.";

  const phoneErr = validatePhone(fields.phone);
  if (phoneErr) errs.phone = phoneErr;

  const sintomasErr = validateSintomas(fields.sintomas);
  if (sintomasErr) errs.sintomas = sintomasErr;

  return errs;
}

export default function RecepcionistaDashboard() {
  const { data, loaded, addPatient } = useHealthSysData();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [saving, setSaving] = useState(false);

  if (!loaded) return <div className="loading-screen">Carregando...</div>;

  function handleChange(event) {
    let { name, value } = event.target;
    if (name === "phone") value = formatPhone(value);
    const updated = { ...form, [name]: value };
    setForm(updated);
    if (touched[name]) setErrors(validateForm(updated));
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validateForm(form));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const allTouched = Object.keys(emptyForm).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);
    const errs = validateForm(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setErrorMessage("");
    setSuccessMessage("");
    setSaving(true);
    try {
      await addPatient(form);
      setSuccessMessage("Paciente cadastrado com sucesso. Triagem gerada automaticamente.");
      setForm(emptyForm);
      setTouched({});
      setErrors({});
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  function fieldStyle(name) {
    return errors[name] && touched[name] ? { borderColor: "#c0392b" } : {};
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
        <form className="card form-card" onSubmit={handleSubmit} noValidate>
          <h3>Cadastrar novo paciente</h3>

          <label>
            Nome completo
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ex: João da Silva"
              style={fieldStyle("name")}
            />
            {errors.name && touched.name && (
              <span className="error-text" style={{ fontSize: "0.82rem" }}>{errors.name}</span>
            )}
          </label>

          <label>
            Data de nascimento
            <input
              type="date"
              name="birthDate"
              value={form.birthDate}
              onChange={handleChange}
              onBlur={handleBlur}
              max={todayISO()}
              style={fieldStyle("birthDate")}
            />
            {errors.birthDate && touched.birthDate && (
              <span className="error-text" style={{ fontSize: "0.82rem" }}>{errors.birthDate}</span>
            )}
          </label>

          <label>
            Sexo
            <select
              name="sexo"
              value={form.sexo}
              onChange={handleChange}
              onBlur={handleBlur}
              style={fieldStyle("sexo")}
            >
              <option value="">Selecione</option>
              <option value="FEMININO">FEMININO</option>
              <option value="MASCULINO">MASCULINO</option>
              <option value="OUTROS">OUTROS</option>
            </select>
            {errors.sexo && touched.sexo && (
              <span className="error-text" style={{ fontSize: "0.82rem" }}>{errors.sexo}</span>
            )}
          </label>

          <label>
            Telefone
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="(XX) XXXXX-XXXX"
              maxLength={15}
              inputMode="numeric"
              style={fieldStyle("phone")}
            />
            {errors.phone && touched.phone && (
              <span className="error-text" style={{ fontSize: "0.82rem" }}>{errors.phone}</span>
            )}
          </label>

          <label>
            Sintomas iniciais
            <textarea
              name="sintomas"
              value={form.sintomas}
              onChange={handleChange}
              onBlur={handleBlur}
              rows="3"
              placeholder="Descreva os sintomas (dispara a triagem automatica)"
              style={fieldStyle("sintomas")}
            />
            {errors.sintomas && touched.sintomas && (
              <span className="error-text" style={{ fontSize: "0.82rem" }}>{errors.sintomas}</span>
            )}
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
