import { useEffect, useState } from "react";
import { loginUser, registerUser } from "../lib/api";
const KEY = "hs-session";
const ROUTES = {ADMIN:"/admin/dashboard",MEDICO:"/medico/dashboard",PACIENTE:"/paciente/dashboard",RECEPCIONISTA:"/recepcionista/dashboard"};
function parseJwt(t){try{const p=t.split(".")[1];const n=p.replace(/-/g,"+").replace(/_/g,"/").padEnd(Math.ceil(p.length/4)*4,"=");return JSON.parse(window.atob(n));}catch{return {};}}
function getDashboardRoute(perfil){return ROUTES[perfil]||"/";}
export default function useAuth(){
  const [user,setUser]=useState(null);
  const [loaded,setLoaded]=useState(false);
  useEffect(()=>{const s=window.localStorage.getItem(KEY);if(s)setUser(JSON.parse(s));setLoaded(true);},[]);
  const save=(u)=>{setUser(u);window.localStorage.setItem(KEY,JSON.stringify(u));};
  async function login(email,senha){
    try{
      const res=await loginUser({email,senha});
      const token=res.token_acesso;
      const td=parseJwt(token);
      const perfil=res.perfil||td.role||"USUARIO";
      const u={id:res.id||td.id||null,nome:res.nome||td.name||email,perfil,email:res.email||td.sub||email,token,redirectUrl:getDashboardRoute(perfil)};
      save(u);return{success:true,redirectUrl:u.redirectUrl};
    }catch(e){return{success:false,message:e.message};}
  }
  async function register(data){
    if(!["MEDICO","PACIENTE","ADMIN","RECEPCIONISTA"].includes(data.perfil))return{success:false,message:"Perfil inválido."};
    try{await registerUser(data);return{success:true};}catch(e){return{success:false,message:e.message};}
  }
  function loginAsDev(perfil){
    const u={id:null,nome:`Usuario ${perfil}`,perfil,email:`${perfil.toLowerCase()}@healthsys.local`,token:null,redirectUrl:getDashboardRoute(perfil)};
    save(u);
    return u.redirectUrl;
  }
  function logout(){setUser(null);window.localStorage.removeItem(KEY);}
  return{currentUser:user,loaded,login,register,loginAsDev,logout,getDashboardRoute};
}
