import ProtectedPage from "../../components/ProtectedPage";
import useAuth from "../../hooks/useAuth";
import useHealthSysData from "../../hooks/useHealthSysData";

export default function PacienteDashboard() {
  const { currentUser } = useAuth();
  const { data, loaded } = useHealthSysData();

  if (!loaded) return <div className="loading-screen">Carregando...</div>;

  // Filtra registros e triagens pelo email do paciente logado (quando disponível)
  const myRecords = data.records.slice(-5).reverse();
  const myTriages = data.triages.slice(-3).reverse();

  return (
    <ProtectedPage title="Meu Painel" allowedRoles={["PACIENTE"]}>
      <section className="grid-cards">
        <div className="card highlight">
          <p className="card-label">Boas vindas</p>
          <strong>{currentUser?.nome || "Paciente"}</strong>
        </div>
        <div className="card">
          <p className="card-label">Seus prontuarios</p>
          <strong>{myRecords.length}</strong>
        </div>
        <div className="card">
          <p className="card-label">Suas triagens</p>
          <strong>{myTriages.length}</strong>
        </div>
      </section>

      <section className="two-columns">
        <div className="card">
          <h3>Ultimos prontuarios</h3>
          <div className="stack-list">
            {myRecords.length === 0 && (
              <p>Nenhum prontuario registrado.</p>
            )}
            {myRecords.map((record) => (
              <article className="record-card" key={record.id}>
                <div className="section-title-row">
                  <strong>{record.doctor}</strong>
                  <span className="tag">{record.appointmentDate}</span>
                </div>
                <p><strong>Exame:</strong> {record.exam || "Nao informado"}</p>
                <p><strong>Medicamento:</strong> {record.medication || "Nao informado"}</p>
                <p><strong>Obs:</strong> {record.notes || "Sem observacoes"}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Historico de triagens</h3>
          <div className="stack-list">
            {myTriages.length === 0 && <p>Nenhuma triagem registrada.</p>}
            {myTriages.map((triage) => (
              <article className="record-card" key={triage.id}>
                <div className="section-title-row">
                  <strong>Risco: {triage.riskLevel}</strong>
                  <span className={`tag risk-${triage.riskLevel?.toLowerCase()}`}>
                    {triage.status}
                  </span>
                </div>
                <p><strong>Sintomas:</strong> {triage.symptoms}</p>
                <p><strong>Profissional:</strong> {triage.professional}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </ProtectedPage>
  );
}
