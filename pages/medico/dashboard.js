import ProtectedPage from "../../components/ProtectedPage";
import useHealthSysData from "../../hooks/useHealthSysData";

function countByRisk(triages, riskLevel) {
  return triages.filter((t) => t.riskLevel === riskLevel).length;
}

export default function MedicoDashboard() {
  const { data, loaded, resetData } = useHealthSysData();

  if (!loaded) return <div className="loading-screen">Carregando...</div>;

  return (
    <ProtectedPage title="Painel do Medico" allowedRoles={["MEDICO", "ADMIN"]}>
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
          <p className="card-label">Casos de alto risco</p>
          <strong>
            {countByRisk(data.triages, "Laranja") + countByRisk(data.triages, "Vermelho")}
          </strong>
        </div>
      </section>

      <section className="two-columns">
        <div className="card">
          <div className="section-title-row">
            <h3>Resumo de triagens</h3>
            <button className="secondary-button" onClick={resetData}>
              Restaurar dados
            </button>
          </div>
          <ul className="simple-list">
            <li>Verde: {countByRisk(data.triages, "Verde")}</li>
            <li>Amarelo: {countByRisk(data.triages, "Amarelo")}</li>
            <li>Laranja: {countByRisk(data.triages, "Laranja")}</li>
            <li>Vermelho: {countByRisk(data.triages, "Vermelho")}</li>
          </ul>
        </div>

        <div className="card">
          <h3>Ultimos prontuarios</h3>
          <div className="stack-list">
            {data.records.slice(-3).reverse().map((record) => {
              const patient = data.patients.find((p) => p.id === record.patientId);
              return (
                <div className="list-row" key={record.id}>
                  <div>
                    <strong>{patient?.name || "Paciente"}</strong>
                    <p>{record.doctor}</p>
                  </div>
                  <span className="tag">{record.appointmentDate}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </ProtectedPage>
  );
}
