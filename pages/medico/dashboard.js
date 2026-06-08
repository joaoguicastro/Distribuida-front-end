import{useEffect,useState}from"react";
import Layout from"../../components/Layout";
import{fetchTriagens,fetchProntuarios}from"../../lib/api";
const gS=()=>{try{return JSON.parse(window.localStorage.getItem("hs-session"));}catch{return null;}};
export default function MedicoDash(){
  const[d,setD]=useState({t:[],r:[]});const[ok,setOk]=useState(false);
  useEffect(()=>{const s=gS();if(!s)return;Promise.all([fetchTriagens(s.token).catch(()=>[]),fetchProntuarios(s.token).catch(()=>[])]).then(([t,r])=>{setD({t:Array.isArray(t)?t:[],r:Array.isArray(r)?r:[]});setOk(true);});},[]);
  if(!ok)return<Layout title="Painel do Médico"><div style={{textAlign:"center",padding:40}}><div className="spinner" style={{margin:"0 auto"}}/></div></Layout>;
  const alto=d.t.filter(x=>(x.nivelRisco||"").toUpperCase()==="ALTO").length;
  return(
    <Layout title="Painel do Médico" sub="Prontuarios e triagem" crumb="Médico">
      <div className="stats">
        <div className="stat teal"><div className="stat-icon">📋</div><div className="stat-val">{d.r.length}</div><div className="stat-lbl">Prontuários</div></div>
        <div className="stat amber"><div className="stat-icon">🔺</div><div className="stat-val">{d.t.length}</div><div className="stat-lbl">Triagens</div></div>
        <div className="stat red"><div className="stat-icon">⚠️</div><div className="stat-val">{alto}</div><div className="stat-lbl">Alto risco</div></div>
      </div>
      <div className="g2">
        <div className="card">
          <div className="card-head"><div className="card-title">Triagens recentes</div></div>
          {d.t.length===0?<div className="empty"><span className="empty-icon">🔺</span><p>Nenhuma triagem</p></div>:d.t.slice(-8).reverse().map(t=>(
            <div key={t.id} className="p-row"><div className="p-av">{t.pacienteId}</div><div className="p-info"><div className="p-name">{t.nomePaciente||"Paciente #"+t.pacienteId}</div><div className="p-meta">{t.nivelRisco||"Pendente"} · Temp {t.temperaturaCelsius||"-"} C · PA {t.pressao||"-"} · {t.encaminhamento||"Sem encaminhamento"}</div></div></div>
          ))}
        </div>
        <div className="card">
          <div className="card-head"><div className="card-title">Prontuarios recentes</div></div>
          {d.r.length===0?<div className="empty"><span className="empty-icon">📋</span><p>Nenhum prontuario</p></div>:d.r.slice(-8).reverse().map(p=>(
            <div key={p.id} className="p-row"><div className="p-av">{(p.nomePaciente||"?")[0].toUpperCase()}</div><div className="p-info"><div className="p-name">{p.nomePaciente||"Paciente #"+p.pacienteId}</div><div className="p-meta">{(p.consultas||[]).length} consultas · {(p.exames||[]).length} exames · {(p.medicamentos||[]).length} prescricoes</div></div></div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
