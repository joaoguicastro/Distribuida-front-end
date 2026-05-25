import { useEffect, useState } from "react";
import ProtectedPage from "../components/ProtectedPage";
import { fetchTriagens } from "../lib/api";

const NIVEL_RISCO_LABEL = {
  BAIXO: "Baixo",
  MEDIO: "Médio",
  ALTO: "Alto"
};

const NIVEL_RISCO_CLASS = {
  BAIXO: "risk-baixo",
  MEDIO: "risk-medio",
  ALTO: "risk-alto"
};

const SESSION_KEY = "healthsys-session";

export default function TriagePage() {
  const [triagens, setTriagens] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(SESSION_KEY);
    const session = saved ? JSON.parse(saved) : null;
    const token = session?.token;

    if (!token || session?.devBypass) {
      setLoaded(true);
      return;
    }

    fetchTriagens(token)
      .then((data) => {
        setTriagens(data);
        setLoaded(true);
      })
      .catch((err) => {
        setError(err.message);
        setLoaded(true);
      });
  }, []);

  if (!loaded) {
    return <div className="loading-screen">Carregando triagens...</div>;
  }

  return (
    <ProtectedPage title="Painel de Triagem" allowedRoles={["MEDICO", "RECEPCIONISTA", "ADMIN"]}>
      <div className="card" style={{ marginBottom: "16px", background: "#f0f7ff", border: "1px solid #bdd6ee" }}>
        <p style={{ margin: 0, color: "#12344d" }}>
          <strong>Como funciona:</strong> A triagem é gerada automaticamente pelo sistema quando um
          paciente é cadastrado com sintomas. Os níveis de risco são classificados pelo backend como{" "}
          <strong>BAIXO</strong>, <strong>MEDIO</strong> ou <strong>ALTO</strong>.
        </p>
      </div>

      {error && <p className="error-text" style={{ marginBottom: "16px" }}>{error}</p>}

      {triagens.length === 0 ? (
        <div className="card">
          <p style={{ margin: 0, color: "#888" }}>Nenhuma triagem registrada ainda. Cadastre um paciente com sintomas para gerar a triagem automaticamente.</p>
        </div>
      ) : (
        <div className="stack-list">
          {triagens.slice().reverse().map((triagem) => (
            <article className="record-card" key={triagem.id}>
              <div className="section-title-row">
                <strong>Paciente ID: {triagem.pacienteId}</strong>
                <span className={`tag ${NIVEL_RISCO_CLASS[triagem.nivelRisco] || ""}`}>
                  {NIVEL_RISCO_LABEL[triagem.nivelRisco] || triagem.nivelRisco}
                </span>
              </div>
              <p>
                <strong>Status:</strong> {triagem.status || "—"}
              </p>
              <p>
                <strong>ID da Triagem:</strong> {triagem.id}
              </p>
            </article>
          ))}
        </div>
      )}
    </ProtectedPage>
  );
}