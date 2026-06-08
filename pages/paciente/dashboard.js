import{useEffect,useMemo,useState}from"react";
import Layout from"../../components/Layout";
import{fetchPacienteByUsuario,fetchTriagemByPaciente,fetchProntuarioByPaciente}from"../../lib/api";

const gS=()=>{try{return JSON.parse(window.localStorage.getItem("hs-session"));}catch{return null;}};
const arr=(v)=>Array.isArray(v)?v:(v?[v]:[]);
const fmt=(v)=>v?new Date(v).toLocaleString("pt-BR"):"Sem data";
const badge=(nivel)=>{
  const n=(nivel||"").toUpperCase();
  if(n.includes("ALTO")||n.includes("VERMELHO"))return"badge badge-red";
  if(n.includes("MEDIO")||n.includes("AMARELO"))return"badge badge-amber";
  if(n.includes("BAIXO")||n.includes("VERDE"))return"badge badge-green";
  return"badge badge-gray";
};

export default function PacienteDash(){
  const[paciente,setPaciente]=useState(null);
  const[triagens,setTriagens]=useState([]);
  const[pront,setPront]=useState(null);
  const[erro,setErro]=useState("");
  const[ok,setOk]=useState(false);

  useEffect(()=>{
    const s=gS();
    if(!s?.id){setErro("Faca login novamente para carregar seus dados.");setOk(true);return;}
    fetchPacienteByUsuario(s.id,s.token)
      .then(async(p)=>{
        setPaciente(p);
        const[triagem,prontuario]=await Promise.all([
          fetchTriagemByPaciente(p.id,s.token).catch(()=>[]),
          fetchProntuarioByPaciente(p.id,s.token).catch(()=>null)
        ]);
        setTriagens(arr(triagem));
        setPront(prontuario);
      })
      .catch(()=>setErro("Seu usuario ainda nao esta vinculado a um cadastro de paciente. Peca para a recepcao vincular seu ID de usuario."))
      .finally(()=>setOk(true));
  },[]);

  const triagemAtual=useMemo(()=>{
    return[...triagens].sort((a,b)=>new Date(b.dataCriacao||b.dataHora||0)-new Date(a.dataCriacao||a.dataHora||0))[0]||null;
  },[triagens]);
  const consultas=pront?.consultas||[];
  const exames=pront?.exames||[];
  const medicamentos=pront?.medicamentos||[];

  if(!ok)return<Layout title="Meu acompanhamento"><div style={{textAlign:"center",padding:40}}><div className="spinner" style={{margin:"0 auto"}}/></div></Layout>;

  return(
    <Layout title="Meu acompanhamento" sub="Triagem, prontuario e prescricoes" crumb="Paciente">
      {erro?(
        <div className="card"><div className="empty"><span className="empty-icon">⚠</span><p>{erro}</p></div></div>
      ):(
        <>
          <div className="stats">
            <div className="stat blue"><div className="stat-icon">🩺</div><div className="stat-val">{consultas.length}</div><div className="stat-lbl">Consultas no prontuario</div></div>
            <div className="stat teal"><div className="stat-icon">🔬</div><div className="stat-val">{exames.length}</div><div className="stat-lbl">Exames registrados</div></div>
            <div className="stat amber"><div className="stat-icon">💊</div><div className="stat-val">{medicamentos.length}</div><div className="stat-lbl">Prescricoes</div></div>
          </div>

          <div className="g2">
            <div className="card">
              <div className="card-head"><div><div className="card-title">Dados do paciente</div><div className="card-sub">Cadastro vinculado ao seu usuario</div></div></div>
              <table className="tbl"><tbody>
                <tr><td><strong>Nome</strong></td><td>{paciente?.nome}</td></tr>
                <tr><td><strong>Telefone</strong></td><td>{paciente?.telefone||"Nao informado"}</td></tr>
                <tr><td><strong>Sexo</strong></td><td>{paciente?.sexo||"Nao informado"}</td></tr>
                <tr><td><strong>Alergias</strong></td><td>{paciente?.alergias||"Nenhuma registrada"}</td></tr>
                <tr><td><strong>Vacinas</strong></td><td>{paciente?.vacinas||"Nenhuma registrada"}</td></tr>
              </tbody></table>
            </div>

            <div className="card">
              <div className="card-head"><div><div className="card-title">Relatorio de triagem</div><div className="card-sub">Ultima avaliacao recebida</div></div></div>
              {!triagemAtual?<div className="empty"><span className="empty-icon">🩺</span><p>Nenhuma triagem registrada ainda</p></div>:(
                <div>
                  <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:14}}>
                    <span className={badge(triagemAtual.nivelRisco)}>{triagemAtual.nivelRisco||"PENDENTE"}</span>
                    <span className="badge badge-blue">{triagemAtual.status||"Sem status"}</span>
                    {triagemAtual.pontuacaoRisco!==undefined&&<span className="badge badge-gray">Score {triagemAtual.pontuacaoRisco}</span>}
                  </div>
                  <table className="tbl"><tbody>
                    <tr><td><strong>Queixa</strong></td><td>{triagemAtual.queixaPrincipal||"Nao informada"}</td></tr>
                    <tr><td><strong>Encaminhamento</strong></td><td>{triagemAtual.encaminhamento||"Aguardando"}</td></tr>
                    <tr><td><strong>Temperatura</strong></td><td>{triagemAtual.temperaturaCelsius?`${triagemAtual.temperaturaCelsius} C`:"Nao informada"}</td></tr>
                    <tr><td><strong>Pressao</strong></td><td>{triagemAtual.pressao||"Nao informada"}</td></tr>
                    <tr><td><strong>Saturacao</strong></td><td>{triagemAtual.saturacaoOxigenio?`${triagemAtual.saturacaoOxigenio}%`:"Nao informada"}</td></tr>
                    <tr><td><strong>Observacao</strong></td><td>{triagemAtual.observacaoLivre||"Sem observacoes"}</td></tr>
                  </tbody></table>
                </div>
              )}
            </div>
          </div>

          <div className="g2" style={{marginTop:18}}>
            <div className="card">
              <div className="card-head"><div><div className="card-title">Prontuario</div><div className="card-sub">Consultas e exames realizados</div></div></div>
              {consultas.length===0&&exames.length===0?<div className="empty"><span className="empty-icon">📋</span><p>Nenhum registro clinico ainda</p></div>:(
                <div>
                  {consultas.slice().reverse().map(c=>(
                    <div key={c.id} className="p-row">
                      <div className="p-av">C</div>
                      <div className="p-info"><div className="p-name">{(c.tipo||"Consulta").replace(/_/g," ")}</div><div className="p-meta">{fmt(c.dataConsulta)} · {c.queixaPrincipal||"Sem queixa"} · {c.conduta||"Sem conduta"}</div></div>
                    </div>
                  ))}
                  {exames.slice().reverse().map(e=>(
                    <div key={e.id} className="p-row">
                      <div className="p-av">E</div>
                      <div className="p-info"><div className="p-name">{e.tipoExame||"Exame"}</div><div className="p-meta">{fmt(e.dataExame)} · {e.resultado||"Resultado pendente"} · {e.observacoes||"Sem observacoes"}</div></div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-head"><div><div className="card-title">Prescricoes</div><div className="card-sub">Medicamentos indicados pelo medico</div></div></div>
              {medicamentos.length===0?<div className="empty"><span className="empty-icon">💊</span><p>Nenhuma prescricao registrada</p></div>:(
                medicamentos.slice().reverse().map(m=>(
                  <div key={m.id} className="p-row">
                    <div className="p-av">Rx</div>
                    <div className="p-info"><div className="p-name">{m.nomeMedicamento} · {m.dosagem}</div><div className="p-meta">{m.frequencia||"Frequencia nao informada"} · Inicio {fmt(m.dataInicio)}{m.dataFim?` · Fim ${fmt(m.dataFim)}`:""}</div></div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
