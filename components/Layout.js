import { useRouter } from "next/router";
import Link from "next/link";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
const NAV={
  ADMIN:[{h:"/admin/dashboard",i:"⬡",l:"Dashboard"},{h:"/patients",i:"👥",l:"Pacientes"},{h:"/records",i:"📋",l:"Prontuários"},{h:"/triage",i:"🔺",l:"Triagem"},{h:"/notificacoes",i:"🔔",l:"Notificações"}],
  MEDICO:[{h:"/medico/dashboard",i:"⬡",l:"Dashboard"},{h:"/records",i:"📋",l:"Prontuários"},{h:"/triage",i:"🔺",l:"Triagem"}],
  RECEPCIONISTA:[{h:"/recepcionista/dashboard",i:"⬡",l:"Dashboard"},{h:"/patients",i:"👥",l:"Cadastro de pacientes"}],
  PACIENTE:[{h:"/paciente/dashboard",i:"⬡",l:"Meu Painel"}],
};
const ROUTES={ADMIN:"/admin/dashboard",MEDICO:"/medico/dashboard",RECEPCIONISTA:"/recepcionista/dashboard",PACIENTE:"/paciente/dashboard"};
const PAGE_ROLES=[
  {p:"/admin",r:["ADMIN"]},
  {p:"/medico",r:["ADMIN","MEDICO"]},
  {p:"/recepcionista",r:["ADMIN","RECEPCIONISTA"]},
  {p:"/paciente",r:["ADMIN","PACIENTE"]},
  {p:"/patients",r:["ADMIN","RECEPCIONISTA"]},
  {p:"/records",r:["ADMIN","MEDICO"]},
  {p:"/triage",r:["ADMIN","MEDICO"]},
  {p:"/notificacoes",r:["ADMIN"]}
];
const ini=(n)=>n?n.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase():"?";
export default function Layout({children,title,sub,crumb}){
  const {currentUser,loaded,logout}=useAuth();
  const router=useRouter();
  useEffect(()=>{
    if(!loaded)return;
    if(!currentUser){router.replace("/login");return;}
    const rule=PAGE_ROLES.find(x=>router.pathname.startsWith(x.p));
    if(rule&&!rule.r.includes(currentUser.perfil))router.replace(ROUTES[currentUser.perfil]||"/login");
  },[loaded,currentUser,router.pathname]);
  if(!loaded||!currentUser)return<div className="loading-screen"><div className="spinner"/><span>Carregando...</span></div>;
  const rule=PAGE_ROLES.find(x=>router.pathname.startsWith(x.p));
  if(rule&&!rule.r.includes(currentUser.perfil))return<div className="loading-screen"><div className="spinner"/><span>Redirecionando...</span></div>;
  const nav=NAV[currentUser.perfil]||[];
  return(
    <div className="shell">
      <aside className="sidebar">
        <div className="sb-brand">
          <div className="sb-logo">
            <div className="sb-logo-icon">🏥</div>
            <div><h2>HealthSys</h2><span>Gestão Hospitalar</span></div>
          </div>
        </div>
        <nav className="sb-nav">
          <div className="sb-section-title">Menu</div>
          {nav.map(n=>(
            <Link key={n.h} href={n.h} className={"sb-link"+(router.pathname===n.h?" active":"")}>
              <span className="sb-icon">{n.i}</span>{n.l}
            </Link>
          ))}
        </nav>
        <div className="sb-footer">
          <div className="sb-user">
            <div className="sb-avatar">{ini(currentUser.nome)}</div>
            <div className="sb-user-info"><div className="sb-uname">{currentUser.nome}</div><div className="sb-urole">{currentUser.perfil}</div></div>
            <button className="sb-logout" onClick={()=>{logout();router.replace("/login");}} title="Sair">✕</button>
          </div>
        </div>
      </aside>
      <div className="main">
        <div className="page-head">
          <div>{crumb&&<div className="page-crumb">{crumb}</div>}<h1 className="page-title">{title}</h1>{sub&&<p className="page-sub">{sub}</p>}</div>
        </div>
        <div className="page-body">{children}</div>
      </div>
    </div>
  );
}
