import{useEffect,useMemo,useState}from"react";
import Layout from"../components/Layout";
import{classificarTriagem,fetchPacientes,fetchTriagens}from"../lib/api";

const gS=()=>{try{return JSON.parse(window.localStorage.getItem("hs-session"));}catch{return null;}};
const EMPTY={pacienteId:"",queixaPrincipal:"",temperaturaCelsius:"",frequenciaCardiaca:"",pressao:"",saturacaoOxigenio:"",nivelDor:"",dificuldadeRespiratoria:false,alteracaoConsciencia:false,sangramentoAtivo:false,convulsao:false,observacaoLivre:""};
function RB({n}){const v=(n||"").toUpperCase();if(v==="ALTO")return<span className="badge badge-red">● ALTO</span>;if(v==="MEDIO")return<span className="badge badge-amber">● MEDIO</span>;if(v==="BAIXO")return<span className="badge badge-green">● BAIXO</span>;return<span className="badge badge-gray">PENDENTE</span>;}
const idade=(d)=>{if(!d)return 0;const n=new Date();const b=new Date(d);let i=n.getFullYear()-b.getFullYear();const m=n.getMonth()-b.getMonth();if(m<0||(m===0&&n.getDate()<b.getDate()))i--;return Math.max(i,0);};
const num=(v)=>v===""||v===null||v===undefined?null:Math.round(Number(v));

export default function Triage(){
  const[triagens,setTriagens]=useState([]);const[pacientes,setPacientes]=useState([]);const[loaded,setL]=useState(false);const[filter,setFl]=useState("TODOS");
  const[form,setForm]=useState(EMPTY);const[msg,setMsg]=useState({t:"",x:""});const[saving,setSaving]=useState(false);
  useEffect(()=>{const s=gS();if(!s)return;Promise.all([fetchTriagens(s.token).catch(()=>[]),fetchPacientes(s.token).catch(()=>[])]).then(([t,p])=>{setTriagens(Array.isArray(t)?t:[]);setPacientes(Array.isArray(p)?p:[]);setL(true);});},[]);
  const paciente=useMemo(()=>pacientes.find(p=>p.id===Number(form.pacienteId)),[pacientes,form.pacienteId]);
  const filtered=filter==="TODOS"?triagens:triagens.filter(t=>(t.nivelRisco||"").toUpperCase()===filter);
  const c=(v)=>triagens.filter(t=>(t.nivelRisco||"").toUpperCase()===v).length;
  function change(e){const{name,value,type,checked}=e.target;setForm(f=>({...f,[name]:type==="checkbox"?checked:value}));}
  async function submit(e){
    e.preventDefault();
    if(!paciente){setMsg({t:"err",x:"Selecione um paciente."});return;}
    if(!form.queixaPrincipal.trim()){setMsg({t:"err",x:"Informe a queixa principal."});return;}
    setSaving(true);setMsg({t:"",x:""});
    const s=gS();
    const payload={
      pacienteId:paciente.id,
      nomePaciente:paciente.nome,
      idade:idade(paciente.dataNascimento),
      queixaPrincipal:form.queixaPrincipal.trim(),
      temperaturaCelsius:num(form.temperaturaCelsius),
      frequenciaCardiaca:num(form.frequenciaCardiaca),
      pressao:num(form.pressao),
      saturacaoOxigenio:num(form.saturacaoOxigenio),
      nivelDor:num(form.nivelDor),
      dificuldadeRespiratoria:form.dificuldadeRespiratoria,
      alteracaoConsciencia:form.alteracaoConsciencia,
      sangramentoAtivo:form.sangramentoAtivo,
      convulsao:form.convulsao,
      observacaoLivre:form.observacaoLivre.trim()||null
    };
    try{
      const nova=await classificarTriagem(payload,s?.token);
      setTriagens(t=>[...t,nova]);
      setForm(EMPTY);
      setMsg({t:"ok",x:"Triagem classificada com sucesso."});
    }catch(err){setMsg({t:"err",x:err.message});}finally{setSaving(false);}
  }
  return(
    <Layout title="Triagem" sub="Classificacao com sinais vitais e risco clinico" crumb="Medico">
      <div className="stats" style={{marginBottom:22}}>
        <div className="stat red"><div className="stat-icon">🔴</div><div className="stat-val">{c("ALTO")}</div><div className="stat-lbl">Alto risco</div></div>
        <div className="stat amber"><div className="stat-icon">🟡</div><div className="stat-val">{c("MEDIO")}</div><div className="stat-lbl">Medio risco</div></div>
        <div className="stat green"><div className="stat-icon">🟢</div><div className="stat-val">{c("BAIXO")}</div><div className="stat-lbl">Baixo risco</div></div>
      </div>
      <div className="g2">
        <div className="card">
          <div className="card-head"><div><div className="card-title">Nova triagem</div><div className="card-sub">Temperatura, pressao, saturacao e sintomas</div></div></div>
          {msg.x&&<div className={"alert alert-"+msg.t}>{msg.t==="ok"?"✓":"⚠"} {msg.x}</div>}
          <form onSubmit={submit}>
            <div className="fg"><label className="flabel">Paciente <span className="req">*</span></label><select className="fselect" name="pacienteId" value={form.pacienteId} onChange={change}><option value="">Selecione...</option>{pacientes.map(p=><option key={p.id} value={p.id}>{p.nome} #{p.id}</option>)}</select>{paciente&&<span className="fhint">{idade(paciente.dataNascimento)} anos · Alergias: {paciente.alergias||"nenhuma"} · Vacinas: {paciente.vacinas||"nao informado"}</span>}</div>
            <div className="fg"><label className="flabel">Queixa principal <span className="req">*</span></label><textarea className="ftextarea" name="queixaPrincipal" placeholder="Ex: dor no peito, febre, falta de ar..." value={form.queixaPrincipal} onChange={change}/></div>
            <div className="frow">
              <div className="fg"><label className="flabel">Temperatura C</label><input className="finput" type="number" min="30" max="45" name="temperaturaCelsius" value={form.temperaturaCelsius} onChange={change}/></div>
              <div className="fg"><label className="flabel">Pressao sistolica</label><input className="finput" type="number" min="50" max="260" name="pressao" value={form.pressao} onChange={change}/></div>
            </div>
            <div className="frow">
              <div className="fg"><label className="flabel">Frequencia cardiaca</label><input className="finput" type="number" min="20" max="220" name="frequenciaCardiaca" value={form.frequenciaCardiaca} onChange={change}/></div>
              <div className="fg"><label className="flabel">Saturacao O2</label><input className="finput" type="number" min="50" max="100" name="saturacaoOxigenio" value={form.saturacaoOxigenio} onChange={change}/></div>
            </div>
            <div className="fg"><label className="flabel">Nivel de dor: {form.nivelDor||0}</label><input type="range" min="0" max="10" name="nivelDor" value={form.nivelDor||0} onChange={change}/></div>
            <div className="checks">
              <label><input type="checkbox" name="dificuldadeRespiratoria" checked={form.dificuldadeRespiratoria} onChange={change}/> Dificuldade respiratoria</label>
              <label><input type="checkbox" name="alteracaoConsciencia" checked={form.alteracaoConsciencia} onChange={change}/> Alteracao de consciencia</label>
              <label><input type="checkbox" name="sangramentoAtivo" checked={form.sangramentoAtivo} onChange={change}/> Sangramento ativo</label>
              <label><input type="checkbox" name="convulsao" checked={form.convulsao} onChange={change}/> Convulsao</label>
            </div>
            <div className="fg"><label className="flabel">Observacoes</label><textarea className="ftextarea" name="observacaoLivre" value={form.observacaoLivre} onChange={change}/></div>
            <button className="btn btn-blue btn-full" type="submit" disabled={saving}>{saving?"Classificando...":"Classificar triagem"}</button>
          </form>
        </div>
        <div className="card">
          <div className="card-head"><div><div className="card-title">Registros de triagem</div><div className="card-sub">{triagens.length} classificacoes</div></div></div>
          <div className="tabs">{["TODOS","ALTO","MEDIO","BAIXO"].map(v=><button key={v} className={"tab"+(filter===v?" on":"")} onClick={()=>setFl(v)}>{v==="TODOS"?"Todos":v} ({v==="TODOS"?triagens.length:c(v)})</button>)}</div>
          {!loaded?<div style={{textAlign:"center",padding:32}}><div className="spinner" style={{margin:"0 auto"}}/></div>:filtered.length===0?<div className="empty"><span className="empty-icon">🔺</span><p>Nenhuma triagem nesta categoria</p></div>:(
            <div style={{maxHeight:620,overflowY:"auto"}}>{filtered.slice().reverse().map(t=>(
              <div key={t.id} className="p-row">
                <div className="p-av">{t.pacienteId}</div>
                <div className="p-info"><div className="p-name">{t.nomePaciente||"Paciente #"+t.pacienteId} <RB n={t.nivelRisco}/></div><div className="p-meta">Temp {t.temperaturaCelsius||"-"} C · PA {t.pressao||"-"} · Sat {t.saturacaoOxigenio||"-"}% · Dor {t.nivelDor??"-"} · {t.encaminhamento||"Sem encaminhamento"}</div></div>
              </div>
            ))}</div>
          )}
        </div>
      </div>
    </Layout>
  );
}
