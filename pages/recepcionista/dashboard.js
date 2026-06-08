import{useEffect,useState}from"react";
import Layout from"../../components/Layout";
import{fetchPacientes,createPatient}from"../../lib/api";
import{validateNome,validatePhone,validateBirthDate,validateSintomas,formatPhone}from"../../lib/validations";
const gS=()=>{try{return JSON.parse(window.localStorage.getItem("hs-session"));}catch{return null;}};
const E={nome:"",dataNascimento:"",sexo:"",telefone:"",usuarioId:"",alergias:"",vacinas:"",sintomas:""};
function val(f){const e={};const n=validateNome(f.nome);if(n)e.nome=n;const b=validateBirthDate(f.dataNascimento);if(b)e.dataNascimento=b;if(!f.sexo)e.sexo="Selecione.";const p=validatePhone(f.telefone);if(p)e.telefone=p;if(!f.usuarioId||Number(f.usuarioId)<=0)e.usuarioId="Informe o ID do usuario paciente.";const s=validateSintomas(f.sintomas);if(s)e.sintomas=s;return e;}
export default function RecepDash(){
  const[pacientes,setP]=useState([]);const[form,setF]=useState(E);const[errors,setE]=useState({});const[msg,setM]=useState({t:"",x:""});const[saving,setSv]=useState(false);
  useEffect(()=>{const s=gS();if(!s)return;fetchPacientes(s.token).then(d=>setP(Array.isArray(d)?d:[])).catch(()=>{});},[]);
  function hc(e){let{name,value}=e.target;if(name==="telefone")value=formatPhone(value);const u={...form,[name]:value};setF(u);if(Object.keys(errors).length)setE(val(u));}
  async function hs(e){e.preventDefault();const er=val(form);if(Object.keys(er).length){setE(er);return;}setSv(true);setM({t:"",x:""});const s=gS();
    try{const n=await createPatient({nome:form.nome.trim(),dataNascimento:form.dataNascimento,sexo:form.sexo,telefone:form.telefone.replace(/\D/g,""),usuarioId:Number(form.usuarioId),alergias:form.alergias.trim()||undefined,vacinas:form.vacinas.trim()||undefined,sintomas:form.sintomas.trim()||undefined},s?.token);setP(p=>[...p,n]);setF(E);setE({});setM({t:"ok",x:"Paciente cadastrado! Agora ele pode acompanhar triagem e prontuario pelo login vinculado."});}
    catch(err){setM({t:"err",x:err.message});}finally{setSv(false);}
  }
  return(
    <Layout title="Recepção" sub="Dashboard dos pacientes e cadastro" crumb="Recepção">
      <div className="stats">
        <div className="stat blue"><div className="stat-icon">👥</div><div className="stat-val">{pacientes.length}</div><div className="stat-lbl">Pacientes cadastrados</div></div>
        <div className="stat teal"><div className="stat-icon">🧾</div><div className="stat-val">{pacientes.filter(p=>p.usuarioId).length}</div><div className="stat-lbl">Vinculados a usuarios</div></div>
        <div className="stat amber"><div className="stat-icon">💉</div><div className="stat-val">{pacientes.filter(p=>p.vacinas).length}</div><div className="stat-lbl">Com vacinas registradas</div></div>
      </div>
      <div className="g2">
        <div className="card">
          <div className="card-head"><div><div className="card-title">Novo paciente</div><div className="card-sub">A triagem é gerada automaticamente ao salvar</div></div></div>
          {msg.x&&<div className={"alert alert-"+msg.t}>{msg.t==="ok"?"✓":"⚠"} {msg.x}</div>}
          <form onSubmit={hs}>
            <div className="fg"><label className="flabel">Nome <span className="req">*</span></label><input className={"finput"+(errors.nome?" err":"")} name="nome" placeholder="Nome completo" value={form.nome} onChange={hc}/>{errors.nome&&<span className="ferr">{errors.nome}</span>}</div>
            <div className="frow">
              <div className="fg"><label className="flabel">Data de nascimento <span className="req">*</span></label><input className={"finput"+(errors.dataNascimento?" err":"")} type="date" name="dataNascimento" value={form.dataNascimento} onChange={hc}/>{errors.dataNascimento&&<span className="ferr">{errors.dataNascimento}</span>}</div>
              <div className="fg"><label className="flabel">Sexo <span className="req">*</span></label><select className={"fselect"+(errors.sexo?" err":"")} name="sexo" value={form.sexo} onChange={hc}><option value="">Selecione</option><option value="MASCULINO">Masculino</option><option value="FEMININO">Feminino</option></select>{errors.sexo&&<span className="ferr">{errors.sexo}</span>}</div>
            </div>
            <div className="fg"><label className="flabel">Telefone <span className="req">*</span></label><input className={"finput"+(errors.telefone?" err":"")} name="telefone" placeholder="(85) 99999-9999" value={form.telefone} onChange={hc}/>{errors.telefone&&<span className="ferr">{errors.telefone}</span>}</div>
            <div className="fg"><label className="flabel">ID do usuario paciente <span className="req">*</span></label><input className={"finput"+(errors.usuarioId?" err":"")} type="number" min="1" name="usuarioId" placeholder="ID do usuario com perfil PACIENTE" value={form.usuarioId} onChange={hc}/>{errors.usuarioId&&<span className="ferr">{errors.usuarioId}</span>}</div>
            <div className="frow">
              <div className="fg"><label className="flabel">Alergias</label><input className="finput" name="alergias" placeholder="Ex: penicilina" value={form.alergias} onChange={hc}/></div>
              <div className="fg"><label className="flabel">Vacinas</label><input className="finput" name="vacinas" placeholder="Ex: COVID, tetano" value={form.vacinas} onChange={hc}/></div>
            </div>
            <div className="fg"><label className="flabel">Sintomas iniciais</label><textarea className="ftextarea" name="sintomas" placeholder="Descreva os sintomas — isso dispara a triagem automática..." value={form.sintomas} onChange={hc}/>{errors.sintomas&&<span className="ferr">{errors.sintomas}</span>}<span className="fhint">💡 Sintomas com "dor" classificam como risco ALTO</span></div>
            <button className="btn btn-blue btn-full" type="submit" disabled={saving}>{saving?"Salvando...":"Cadastrar paciente"}</button>
          </form>
        </div>
        <div className="card">
          <div className="card-head"><div><div className="card-title">Pacientes</div><div className="card-sub">{pacientes.length} cadastrados</div></div></div>
          {pacientes.length===0?<div className="empty"><span className="empty-icon">👥</span><p>Nenhum paciente ainda</p></div>:(
            pacientes.slice(-10).reverse().map(p=>(
	              <div key={p.id} className="p-row"><div className="p-av">{(p.nome||"?")[0].toUpperCase()}</div><div className="p-info"><div className="p-name">{p.nome}</div><div className="p-meta">#{p.id} · Usuario #{p.usuarioId||"-"} · Alergias: {p.alergias||"nenhuma"} · Vacinas: {p.vacinas||"nao informado"}</div></div></div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
