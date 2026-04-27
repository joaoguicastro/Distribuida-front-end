import ProtectedPage from "../components/ProtectedPage";
import useHealthSysData from "../hooks/useHealthSysData";

function countByRisk(triages, riskLevel) {
  return triages.filter((triage) => triage.riskLevel === riskLevel).length;
}

export default function DashboardPage() {
  const { data, loaded, resetData } = useHealthSysData();

  if (!loaded) {
    return <div className="loading-screen">Carregando dados...</div>;
  }

  return (
    <ProtectedPage title="Dashboard Hospitalar">
      <section className="grid-cards">
        <div className="card highlight">
          <p className="card-label">Pacientes cadastrados</p>
          <strong>{data.patients.length}</strong>
        </div>

        <div className="card">
          <p className="card-label">Prontuarios registrados</p>
          <strong>{data.records.length}</strong>
        </div>

        <div className="card">
          <p className="card-label">Triagens realizadas</p>
          <strong>{data.triages.length}</strong>
        </div>

        <div className="card">
          <p className="card-label">Casos de maior risco</p>
          <strong>{countByRisk(data.triages, "Laranja") + countByRisk(data.triages, "Vermelho")}</strong>
        </div>
      </section>

      <section className="two-columns">
        <div className="card">
          <div className="section-title-row">
            <h3>Resumo rapido</h3>
            <button className="secondary-button" onClick={resetData}>
              Restaurar dados de exemplo
            </button>
          </div>

          <ul className="simple-list">
            <li>Triagens amarelas: {countByRisk(data.triages, "Amarelo")}</li>
            <li>Triagens laranja: {countByRisk(data.triages, "Laranja")}</li>
            <li>Triagens vermelhas: {countByRisk(data.triages, "Vermelho")}</li>
            <li>Monitoramento de leitos: 72% ocupado</li>
          </ul>
        </div>

        <div className="card">
          <h3>Pacientes recentes</h3>

          <div className="stack-list">
            {data.patients.slice(-3).reverse().map((patient) => (
              <div className="list-row" key={patient.id}>
                <div>
                  <strong>{patient.name}</strong>
                  <p>{patient.telefone || patient.phone}</p>
                </div>
                <span className="tag">{patient.vaccine || "Sem vacina"}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </ProtectedPage>
  );
}
