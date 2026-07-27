"use client";
import { FormEvent, useState } from "react";
export default function AccessLogin({admin=false}:{admin?:boolean}){
 const [status,setStatus]=useState("");
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setStatus("Signing in…");const form=new FormData(e.currentTarget);const r=await fetch("/api/auth/login",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:form.get("email"),password:form.get("password")})});const j=await r.json();if(!r.ok){setStatus(j.error||"Could not sign in.");return}location.href=admin&&j.role==="admin"?"/admin":"/"}
 return <section className="access-page"><form className="access-card" onSubmit={submit}><img src="/clinic-logo.png" alt="Shiva Krupa Polyclinic"/><p className="kicker">{admin?"PRIVATE ADMIN":"PRIVATE PREVIEW"}</p><h1>{admin?"Sign in to edit":"Sign in to view"}</h1><p>Use the email address and temporary password provided by the website owner.</p><label>Email address<input name="email" type="email" required autoComplete="email"/></label><label>Password<input name="password" type="password" required minLength={8} autoComplete="current-password"/></label><button className="btn">Sign in</button>{status&&<p className="access-status" role="status">{status}</p>}{admin&&<a href="/signin-with-chatgpt?return_to=/admin">Owner emergency sign-in</a>}</form></section>
}
