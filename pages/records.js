import { useEffect, useState, useMemo } from "react";
import Layout from "../components/Layout";
import {
  fetchPacientes,
  fetchProntuarioByPaciente,
  addConsulta,
  addExame,
  addMedicamento,
} from "../lib/api";

const gS = () => {
  try { return JSON.parse(window.localStorage.getItem("hs-session")); } catch { return null; }
};

const TABS = ["Consulta", "Exame", "Medicamento"];

const EMPTY_CONSULTA = { tipo: "", queixaPrincipal: "", exameFisico: "", hipoteseDiagnostica: "", conduta: "" };
const EMPTY_EXAME    = { tipoExame: "", resultado: "", observacoes: "" };
const EMPTY_MED      = { nomeMedicamento: "", dosagem: "", frequencia: "" };

export default function Records() {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteId, setPacienteId] = useState("");
  const [prontuario, setProntuario] = useState(null);
  const [loadingPront, setLoadingPront] = useState(false);
  const [tab, setTab] = useState("Consulta");
  const [formC, setFormC] = useState(EMPTY_CONSULTA);
  const [formE, setFormE] = useState(EMPTY_EXAME);
  const [formM, setFormM] = useState(EMPTY_MED);
  const [msg, setMsg] = useState({ t: "", x: "" });
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const s = gS();
    if (!s) return;
    fetchPacientes(s.token)
      .then(d => { setPacientes(Array.isArray(d) ? d : []); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!pacienteId) { setProntuario(null); return; }
    const s = gS();
    setLoadingPront(true);
    fetchProntuarioByPaciente(pacienteId, s?.token)
      .then(d => { setProntuario(d); setLoadingPront(false); })
      .catch(() => { setProntuario(null); setLoadingPront(false); });
  }, [pacienteId]);

  async function salvar(e) {
    e.preventDefault();
    if (!pacienteId) { setMsg({ t: "err", x: "Selecione um paciente." }); return; }
    const s = gS();
    setSaving(true); setMsg({ t: "", x: "" });
    try {
      let novo;
      if (tab === "Consulta") novo = await addConsulta(pacienteId, formC, s?.token);
      else if (tab === "Exame") novo = await addExame(pacienteId, formE, s?.token);
      else novo = await addMedicamento(pacienteId, formM, s?.token);
      setProntuario(novo);
      setFormC(EMPTY_CONSULTA); setFormE(EMPTY_EXAME); setFormM(EMPTY_MED);
      setMsg({ t: "ok", x: `${tab} adicionado(a) com sucesso.` });
    } catch (err) {
      setMsg({ t: "err", x: err.message });
    } finally { setSaving(false); }
  }

  const paciente = useMemo(() => pacientes.find(p => p.id === Number(pacienteId)), [pacientes, pacienteId]);

  return (
    <Layout title="Prontuários" sub="Consultas, exames e medicamentos" crumb="Médico">
      <div className="g2">
        {/* FORMULÁRIO */}
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Adicionar registro</div>
              <div className="card-sub">Selecione o paciente e o tipo de registro</div>
            </div>
          </div>

          <div className="fg" style={{ marginBottom: 16 }}>
            <label className="flabel">Paciente <span className="req">*</span></label>
            <select className="fselect" value={pacienteId} onChange={e => setPacienteId(e.target.value)}>
              <option value="">Selecione...</option>
              {pacientes.map(p => <option key={p.id} value={p.id}>{p.nome} #{p.id}</option>)}
            </select>
          </div>

          <div className="tabs" style={{ marginBottom: 16 }}>
            {TABS.map(t => (
              <button key={t} className={"tab" + (tab === t ? " on" : "")} onClick={() => { setTab(t); setMsg({ t: "", x: "" }); }}>
                {t}
              </button>
            ))}
          </div>

          {msg.x && <div className={"alert alert-" + msg.t}>{msg.t === "ok" ? "✓" : "⚠"} {msg.x}</div>}

          <form onSubmit={salvar}>
            {tab === "Consulta" && (
              <>
                <div className="fg"><label className="flabel">Tipo</label><input className="finput" placeholder="Ex: Clínica geral" value={formC.tipo} onChange={e => setFormC(f => ({ ...f, tipo: e.target.value }))} /></div>
                <div className="fg"><label className="flabel">Queixa principal</label><textarea className="ftextarea" value={formC.queixaPrincipal} onChange={e => setFormC(f => ({ ...f, queixaPrincipal: e.target.value }))} /></div>
                <div className="fg"><label className="flabel">Exame físico</label><textarea className="ftextarea" value={formC.exameFisico} onChange={e => setFormC(f => ({ ...f, exameFisico: e.target.value }))} /></div>
                <div className="fg"><label className="flabel">Hipótese diagnóstica</label><input className="finput" value={formC.hipoteseDiagnostica} onChange={e => setFormC(f => ({ ...f, hipoteseDiagnostica: e.target.value }))} /></div>
                <div className="fg"><label className="flabel">Conduta</label><textarea className="ftextarea" value={formC.conduta} onChange={e => setFormC(f => ({ ...f, conduta: e.target.value }))} /></div>
              </>
            )}
            {tab === "Exame" && (
              <>
                <div className="fg"><label className="flabel">Tipo de exame</label><input className="finput" placeholder="Ex: Hemograma, Raio-X..." value={formE.tipoExame} onChange={e => setFormE(f => ({ ...f, tipoExame: e.target.value }))} /></div>
                <div className="fg"><label className="flabel">Resultado</label><textarea className="ftextarea" value={formE.resultado} onChange={e => setFormE(f => ({ ...f, resultado: e.target.value }))} /></div>
                <div className="fg"><label className="flabel">Observações</label><textarea className="ftextarea" value={formE.observacoes} onChange={e => setFormE(f => ({ ...f, observacoes: e.target.value }))} /></div>
              </>
            )}
            {tab === "Medicamento" && (
              <>
                <div className="fg"><label className="flabel">Medicamento</label><input className="finput" placeholder="Ex: Amoxicilina" value={formM.nomeMedicamento} onChange={e => setFormM(f => ({ ...f, nomeMedicamento: e.target.value }))} /></div>
                <div className="frow">
                  <div className="fg"><label className="flabel">Dosagem</label><input className="finput" placeholder="Ex: 500mg" value={formM.dosagem} onChange={e => setFormM(f => ({ ...f, dosagem: e.target.value }))} /></div>
                  <div className="fg"><label className="flabel">Frequência</label><input className="finput" placeholder="Ex: 8/8h" value={formM.frequencia} onChange={e => setFormM(f => ({ ...f, frequencia: e.target.value }))} /></div>
                </div>
              </>
            )}
            <button className="btn btn-blue btn-full" type="submit" disabled={saving || !pacienteId}>
              {saving ? "Salvando..." : `Salvar ${tab}`}
            </button>
          </form>
        </div>

        {/* PRONTUÁRIO */}
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Prontuário</div>
              <div className="card-sub">{paciente ? paciente.nome : "Selecione um paciente"}</div>
            </div>
          </div>

          {!pacienteId && (
            <div className="empty"><span className="empty-icon">📋</span><p>Selecione um paciente ao lado</p></div>
          )}

          {loadingPront && <div style={{ textAlign: "center", padding: 32 }}><div className="spinner" style={{ margin: "0 auto" }} /></div>}

          {prontuario && !loadingPront && (
            <>
              {/* Consultas */}
              <div style={{ marginBottom: 16 }}>
                <div className="card-title" style={{ fontSize: 13, marginBottom: 8 }}>Consultas ({prontuario.consultas?.length || 0})</div>
                {(!prontuario.consultas || prontuario.consultas.length === 0)
                  ? <p style={{ color: "#888", fontSize: 13 }}>Nenhuma consulta registrada.</p>
                  : prontuario.consultas.slice().reverse().map(c => (
                    <div key={c.id} className="p-row" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                      <strong>{c.tipo || "Consulta"}</strong>
                      {c.queixaPrincipal && <p style={{ margin: "2px 0", fontSize: 12, color: "#555" }}>Queixa: {c.queixaPrincipal}</p>}
                      {c.hipoteseDiagnostica && <p style={{ margin: "2px 0", fontSize: 12, color: "#555" }}>Diagnóstico: {c.hipoteseDiagnostica}</p>}
                    </div>
                  ))
                }
              </div>

              {/* Exames */}
              <div style={{ marginBottom: 16 }}>
                <div className="card-title" style={{ fontSize: 13, marginBottom: 8 }}>Exames ({prontuario.exames?.length || 0})</div>
                {(!prontuario.exames || prontuario.exames.length === 0)
                  ? <p style={{ color: "#888", fontSize: 13 }}>Nenhum exame registrado.</p>
                  : prontuario.exames.slice().reverse().map(ex => (
                    <div key={ex.id} className="p-row" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                      <strong>{ex.tipoExame || "Exame"}</strong>
                      {ex.resultado && <p style={{ margin: "2px 0", fontSize: 12, color: "#555" }}>Resultado: {ex.resultado}</p>}
                    </div>
                  ))
                }
              </div>

              {/* Medicamentos */}
              <div>
                <div className="card-title" style={{ fontSize: 13, marginBottom: 8 }}>Medicamentos ({prontuario.medicamentos?.length || 0})</div>
                {(!prontuario.medicamentos || prontuario.medicamentos.length === 0)
                  ? <p style={{ color: "#888", fontSize: 13 }}>Nenhum medicamento registrado.</p>
                  : prontuario.medicamentos.slice().reverse().map(m => (
                    <div key={m.id} className="p-row" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                      <strong>{m.nomeMedicamento || "Medicamento"}</strong>
                      <p style={{ margin: "2px 0", fontSize: 12, color: "#555" }}>{m.dosagem} · {m.frequencia}</p>
                    </div>
                  ))
                }
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
