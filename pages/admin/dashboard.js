import ProtectedPage from "../../components/ProtectedPage";
import useHealthSysData from "../../hooks/useHealthSysData";

function countByRisk(triages, riskLevel) {
  return triages.filter((t) => t.riskLevel === riskLevel).length;
}

export default function AdminDashboard() {
  const { data, loaded, resetData } = useHealthSysData();

  if (!loaded) return <div className="loading-screen">Carregando...</div>;

  return (
    <ProtectedPage title="Painel Administrativo" allowedRoles={["ADMIN"]}>
      <section className="grid-cards">
        <div className="card highlight">
          <p className="card-label">Total de pacientes</p>
          <strong>{data.patients.length}</strong>
        </div>
        <div className="card">
          <p className="card-label">Prontuarios</p>
          <strong>{data.records.length}</strong>
        </div>
        <div className="card">
          <p className="card-label">Triagens</p>
          <strong>{data.triages.length}</strong>
        </div>
        <div className="card">
          <p className="card-label">Alto risco</p>
          <strong>
            {countByRisk(data.triages, "Laranja") + countByRisk(data.triages, "Vermelho")}
          </strong>
        </div>
      </section>

      <section className="two-columns">
        <div className="card">
          <div className="section-title-row">
            <h3>Visao geral do sistema</h3>
            <button className="secondary-button" onClick={resetData}>
              Restaurar dados de exemplo
            </button>
          </div>
          <ul className="simple-list">
            <li>Triagens verdes: {countByRisk(data.triages, "Verde")}</li>
            <li>Triagens amarelas: {countByRisk(data.triages, "Amarelo")}</li>
            <li>Triagens laranja: {countByRisk(data.triages, "Laranja")}</li>
            <li>Triagens vermelhas: {countByRisk(data.triages, "Vermelho")}</li>
            <li>Ocupacao de leitos: 72%</li>
          </ul>
        </div>

        <div className="card">
          <h3>Pacientes recentes</h3>
          <div className="stack-list">
            {data.patients.slice(-5).reverse().map((patient) => (
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
