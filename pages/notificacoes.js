import { useEffect, useState } from "react";
import ProtectedPage from "../components/ProtectedPage";
import { fetchNotificacoes } from "../lib/api";

const SESSION_KEY = "healthsys-session";

const NIVEL_LABEL = { BAIXO: "Baixo", MEDIO: "Médio", ALTO: "Alto" };
const NIVEL_CLASS = { BAIXO: "risk-baixo", MEDIO: "risk-medio", ALTO: "risk-alto" };

function formatarData(dataHora) {
  if (!dataHora) return "—";
  try {
    return new Date(dataHora).toLocaleString("pt-BR");
  } catch {
    return dataHora;
  }
}

export default function NotificacoesPage() {
  const [notificacoes, setNotificacoes] = useState([]);
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

    fetchNotificacoes(token)
      .then((data) => {
        setNotificacoes(data);
        setLoaded(true);
      })
      .catch((err) => {
        setError(err.message);
        setLoaded(true);
      });
  }, []);

  if (!loaded) {
    return <div className="loading-screen">Carregando notificacoes...</div>;
  }

  return (
    <ProtectedPage title="Notificacoes" allowedRoles={["MEDICO", "RECEPCIONISTA", "ADMIN"]}>
      {error && <p className="error-text" style={{ marginBottom: "16px" }}>{error}</p>}

      <div className="card" style={{ marginBottom: "16px", background: "#f0f7ff", border: "1px solid #bdd6ee" }}>
        <p style={{ margin: 0, color: "#12344d" }}>
          <strong>Notificacoes automaticas:</strong> Geradas pelo sistema sempre que uma triagem
          e realizada via RabbitMQ.
        </p>
      </div>

      {notificacoes.length === 0 ? (
        <div className="card">
          <p style={{ margin: 0, color: "#888" }}>
            Nenhuma notificacao registrada. Elas aparecem automaticamente apos o cadastro de pacientes com sintomas.
          </p>
        </div>
      ) : (
        <div className="stack-list">
          {notificacoes.slice().reverse().map((notif) => (
            <article className="record-card" key={notif.id}>
              <div className="section-title-row">
                <strong>{notif.nomePaciente || `Paciente ${notif.pacienteId}`}</strong>
                <span className={`tag ${NIVEL_CLASS[notif.nivelRisco] || ""}`}>
                  {NIVEL_LABEL[notif.nivelRisco] || notif.nivelRisco || "—"}
                </span>
              </div>
              <p><strong>Mensagem:</strong> {notif.mensagem}</p>
              <p><strong>Data:</strong> {formatarData(notif.dataHora)}</p>
            </article>
          ))}
        </div>
      )}
    </ProtectedPage>
  );
}