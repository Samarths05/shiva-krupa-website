"use client";
import { useState } from "react";

const fmt=(d:Date)=>d.toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"});
const add=(date:string,days:number)=>{const d=new Date(`${date}T12:00:00`);d.setDate(d.getDate()+days);return d};

export default function Calculators(){
  const [tab,setTab]=useState<"period"|"ovulation"|"pregnancy">("period");
  const [date,setDate]=useState(""); const [cycle,setCycle]=useState(28); const [periodLength,setPeriodLength]=useState(5);
  const [result,setResult]=useState<string[]>([]);
  const today=new Date().toISOString().slice(0,10);
  function calculate(){
    if(!date)return;
    if(tab==="period"){const next=add(date,cycle);setResult([`Expected next period: ${fmt(next)}`,`Estimated period: ${fmt(next)} – ${fmt(add(date,cycle+periodLength-1))}`,`Estimated ovulation: ${fmt(add(date,cycle-14))}`,`Fertile window: ${fmt(add(date,cycle-19))} – ${fmt(add(date,cycle-13))}`])}
    if(tab==="ovulation"){setResult([`Estimated ovulation: ${fmt(add(date,cycle-14))}`,`Fertile window: ${fmt(add(date,cycle-19))} – ${fmt(add(date,cycle-13))}`,`Expected next period: ${fmt(add(date,cycle))}`])}
    if(tab==="pregnancy"){const due=add(date,280);const today=new Date();const start=new Date(`${date}T12:00:00`);const weeks=Math.max(0,Math.floor((today.getTime()-start.getTime())/604800000));const trimester=weeks<14?"First":weeks<28?"Second":"Third";setResult([`Estimated due date: ${fmt(due)}`,`Estimated gestational age: ${weeks} weeks`,`Current trimester: ${trimester}`,`Approximate conception date: ${fmt(add(date,14))}`])}
  }
  return <div className="calculator">
    <div className="calculator-tabs"><button className={tab==="period"?"active":""} onClick={()=>{setTab("period");setResult([])}}>Period</button><button className={tab==="ovulation"?"active":""} onClick={()=>{setTab("ovulation");setResult([])}}>Ovulation</button><button className={tab==="pregnancy"?"active":""} onClick={()=>{setTab("pregnancy");setResult([])}}>Pregnancy</button></div>
    <div className="calculator-body"><div className="calculator-form"><h2>{tab==="period"?"Period Calculator":tab==="ovulation"?"Ovulation Calculator":"Pregnancy Due-Date Calculator"}</h2><p>{tab==="pregnancy"?"Enter the first day of your last menstrual period.":"Enter your cycle details for a personalised estimate."}</p><label>First day of last period<input type="date" max={today} value={date} onChange={e=>{setDate(e.target.value);setResult([])}}/></label>{tab!=="pregnancy"&&<label>Average cycle length<input type="number" min="21" max="45" value={cycle} onChange={e=>setCycle(Math.min(45,Math.max(21,Number(e.target.value))))}/><small>Enter a cycle length between 21 and 45 days.</small></label>}{tab==="period"&&<label>Average period duration<input type="number" min="2" max="10" value={periodLength} onChange={e=>setPeriodLength(Math.min(10,Math.max(2,Number(e.target.value))))}/></label>}<button className="btn" onClick={calculate}>Calculate dates →</button></div>
    <div className="calculator-result">{result.length?<><p className="kicker">YOUR ESTIMATES</p>{result.map(r=><div key={r}>{r}</div>)}<a className="inline-link" href="/contact">Discuss with Dr Aishwarya →</a></>:<><span className="result-icon">◎</span><h3>Your results will appear here</h3><p>These dates are estimates. Cycles and ovulation can vary.</p></>}</div></div>
    <p className="medical-note">This tool provides estimates only and does not diagnose pregnancy, infertility or menstrual conditions. Irregular cycles may make predictions less reliable.</p>
  </div>
}
