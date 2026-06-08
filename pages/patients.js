import{useEffect,useState}from"react";
import Layout from"../components/Layout";
import{fetchPacientes,createPatient}from"../lib/api";
import{validateNome,validatePhone,validateBirthDate,validateSintomas,formatPhone}from"../lib/validations";
const gS=()=>{try{return JSON.parse(window.localStorage.getItem("hs-session"));}catch{return null;}};
const E={nome:"",dataNascimento:"",sexo:"",telefone:"",usuarioId:"",alergias:"",vacinas:"",sintomas:""};
function val(f){const e={};const n=validateNome(f.nome);if(n)e.nome=n;const b=validateBirthDate(f.dataNascimento);if(b)e.dataNascimento=b;if(!f.sexo)e.sexo="Selecione.";const p=validatePhone(f.telefone);if(p)e.telefone=p;if(!f.usuarioId||Number(f.usuarioId)<=0)e.usuarioId="Informe o ID do usuario paciente.";const s=validateSintomas(f.sintomas);if(s)e.sintomas=s;return e;}
export default function Patients(){
  const[pacientes,setP]=useState([]);const[form,setF]=useState(E);const[errors,setE]=useState({});const[msg,setM]=useState({t:"",x:""});const[saving,setSv]=useState(false);const[loaded,setL]=useState(false);const[search,setSr]=useState("");
  useEffect(()=>{const s=gS();if(!s)return;fetchPacientes(s.token).then(d=>{setP(Array.isArray(d)?d:[]);setL(true);}).catch(()=>setL(true));},[]);
  function hc(e){let{name,value}=e.target;if(name==="telefone")value=formatPhone(value);const u={...form,[name]:value};setF(u);if(Object.keys(errors).length)setE(val(u));}
  async function hs(e){e.preventDefault();const er=val(form);if(Object.keys(er).length){setE(er);return;}setSv(true);setM({t:"",x:""});const s=gS();
    try{const n=await createPatient({nome:form.nome.trim(),dataNascimento:form.dataNascimento,sexo:form.sexo,telefone:form.telefone.replace(/\D/g,""),usuarioId:Number(form.usuarioId),alergias:form.alergias.trim()||undefined,vacinas:form.vacinas.trim()||undefined,sintomas:form.sintomas.trim()||undefined},s?.token);setP(p=>[...p,n]);setF(E);setE({});setM({t:"ok",x:"Paciente cadastrado com sucesso!"});}
    catch(err){setM({t:"err",x:err.message});}finally{setSv(false);}
  }
  const filtered=pacientes.filter(p=>(p.nome||"").toLowerCase().includes(search.toLowerCase()));
  return(
    <Layout title="Pacientes" sub="Cadastro e listagem completa" crumb="Gestão">
      <div className="g2">
        <div className="card">
          <div className="card-head"><div><div className="card-title">Novo paciente</div><div className="card-sub">Triagem gerada automaticamente</div></div></div>
          {msg.x&&<div className={"alert alert-"+msg.t}>{msg.t==="ok"?"✓":"⚠"} {msg.x}</div>}
          <form onSubmit={hs}>
            <div className="fg"><label className="flabel">Nome <span className="req">*</span></label><input className={"finput"+(errors.nome?" err":"")} name="nome" placeholder="Ex: João da Silva" value={form.nome} onChange={hc}/>{errors.nome&&<span className="ferr">{errors.nome}</span>}</div>
            <div className="frow">
              <div className="fg"><label className="flabel">Data nasc. <span className="req">*</span></label><input className={"finput"+(errors.dataNascimento?" err":"")} type="date" name="dataNascimento" value={form.dataNascimento} onChange={hc}/>{errors.dataNascimento&&<span className="ferr">{errors.dataNascimento}</span>}</div>
              <div className="fg"><label className="flabel">Sexo <span className="req">*</span></label><select className={"fselect"+(errors.sexo?" err":"")} name="sexo" value={form.sexo} onChange={hc}><option value="">Selecione</option><option value="MASCULINO">Masculino</option><option value="FEMININO">Feminino</option></select>{errors.sexo&&<span className="ferr">{errors.sexo}</span>}</div>
            </div>
            <div className="fg"><label className="flabel">Telefone <span className="req">*</span></label><input className={"finput"+(errors.telefone?" err":"")} name="telefone" placeholder="(85) 99999-9999" value={form.telefone} onChange={hc}/>{errors.telefone&&<span className="ferr">{errors.telefone}</span>}</div>
            <div className="fg"><label className="flabel">ID do usuario paciente <span className="req">*</span></label><input className={"finput"+(errors.usuarioId?" err":"")} name="usuarioId" type="number" min="1" placeholder="Ex: 7" value={form.usuarioId} onChange={hc}/>{errors.usuarioId&&<span className="ferr">{errors.usuarioId}</span>}<span className="fhint">Use o ID do usuario criado com perfil PACIENTE para vincular o acesso ao prontuario.</span></div>
            <div className="frow">
              <div className="fg"><label className="flabel">Alergias</label><input className="finput" name="alergias" placeholder="Ex: Dipirona, amendoim" value={form.alergias} onChange={hc}/></div>
              <div className="fg"><label className="flabel">Vacinas</label><input className="finput" name="vacinas" placeholder="Ex: COVID, tetano" value={form.vacinas} onChange={hc}/></div>
            </div>
            <div className="fg"><label className="flabel">Sintomas iniciais</label><textarea className="ftextarea" name="sintomas" placeholder="Descreva os sintomas para triagem automática..." value={form.sintomas} onChange={hc}/>{errors.sintomas&&<span className="ferr">{errors.sintomas}</span>}<span className="fhint">💡 Sintomas com &quot;dor&quot; classificam como risco ALTO</span></div>
            <button className="btn btn-blue btn-full" type="submit" disabled={saving}>{saving?"Salvando...":"Cadastrar paciente"}</button>
          </form>
        </div>
        <div className="card">
          <div className="card-head"><div><div className="card-title">Lista de pacientes</div><div className="card-sub">{pacientes.length} cadastrados</div></div></div>
          <div className="fg" style={{marginBottom:16}}><input className="finput" placeholder="🔍  Buscar por nome..." value={search} onChange={e=>setSr(e.target.value)}/></div>
          {!loaded?<div style={{textAlign:"center",padding:32}}><div className="spinner" style={{margin:"0 auto"}}/></div>:filtered.length===0?<div className="empty"><span className="empty-icon">👥</span><p>Nenhum paciente encontrado</p></div>:(
            <div style={{maxHeight:460,overflowY:"auto"}}>
              {filtered.map(p=>(
                <div key={p.id} className="p-row"><div className="p-av">{(p.nome||"?")[0].toUpperCase()}</div><div className="p-info"><div className="p-name">{p.nome}</div><div className="p-meta">#{p.id} · {p.sexo} · {p.telefone}</div></div></div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
