"use client";
import { FormEvent,useEffect,useMemo,useState } from "react";

type AppointmentConfig={appointmentDelivery:string;whatsapp:string;email:string;consultationSlots:{doctor:string;label:string;time:string}[];googleBookingEnabled?:boolean;googleBookingUrls?:{aishwarya?:string;nagarajaiah?:string}};
export default function AppointmentForm({settings}:{settings:AppointmentConfig}){
 const [status,setStatus]=useState<"idle"|"opening"|"error">("idle");
 const [doctor,setDoctor]=useState("Dr Aishwarya V Mathikatti");
 const [specialisation,setSpecialisation]=useState("Gynaecology");
 const today=useMemo(()=>new Date().toISOString().slice(0,10),[]);
 const lastBookableDate=useMemo(()=>{const value=new Date();value.setDate(value.getDate()+30);return value.toISOString().slice(0,10)},[]);
 useEffect(()=>{
  const selected=new URLSearchParams(window.location.search).get("doctor")?.toLowerCase()||"";
  if(selected.includes("nagarajaiah")){
   setDoctor("Dr L. P. Nagarajaiah");
   setSpecialisation("General Medicine");
  }
 },[]);
 const rawBookingUrl=doctor.includes("Nagarajaiah")?settings.googleBookingUrls?.nagarajaiah:settings.googleBookingUrls?.aishwarya;
 const bookingUrl=rawBookingUrl&&/^https:\/\/calendar\.app\.google\//i.test(rawBookingUrl)?rawBookingUrl:"";
 const doctorSlots=settings.consultationSlots.filter(slot=>doctor.includes("Nagarajaiah")?slot.doctor.includes("Nagarajaiah"):slot.doctor.includes("Aishwarya"));
 function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();const f=e.currentTarget;
  if(!f.reportValidity())return;
  setStatus("opening");
  const values=Object.fromEntries(new FormData(f).entries()) as Record<string,string>;
  const message=`Hello Shiva Krupa Polyclinic,\n\nI would like to book an appointment.\n\nPatient name: ${values.name}\nPhone: ${values.phone}\nPreferred doctor: ${values.doctor}\nSpecialisation: ${values.specialisation}\nPreferred date: ${values.preferredDate||"Flexible"}\nPreferred time: ${values.preferredTime||"Flexible"}\nAdditional information: ${values.message||"None"}\n\nPlease confirm an available appointment time.`;
  const target=settings.appointmentDelivery==="email"
   ?`mailto:${settings.email}?subject=${encodeURIComponent("Appointment request")}&body=${encodeURIComponent(message)}`
   :`https://wa.me/${String(settings.whatsapp||"").replace(/\D/g,"")}?text=${encodeURIComponent(message)}`;
  if(!target){setStatus("error");return;}
  const opened=window.open(target,"_blank","noopener,noreferrer");
  if(opened){setStatus("idle");f.reset();setDoctor(values.doctor);setSpecialisation(values.specialisation)}
  else{window.location.assign(target)}
 }
 return <>
  {settings.googleBookingEnabled&&bookingUrl&&<section className="google-booking-panel">
   <div><p className="kicker">LIVE AVAILABILITY</p><h3>Choose an open appointment with {doctor.includes("Nagarajaiah")?"Dr Nagarajaiah":"Dr Aishwarya"}.</h3><p>View the doctor’s current availability on the secure Google booking page. Booked times are removed automatically.</p></div>
   <label>Select doctor<select value={doctor} onChange={e=>{const value=e.target.value;setDoctor(value);setSpecialisation(value.includes("Nagarajaiah")?"General Medicine":"Gynaecology")}}><option>Dr Aishwarya V Mathikatti</option><option>Dr L. P. Nagarajaiah</option></select></label>
   <a className="btn calendar-booking-link" href={bookingUrl} target="_blank" rel="noreferrer">View available slots ↗</a>
   <p className="calendar-or">Alternatively, use the appointment form below to contact the clinic through WhatsApp.</p>
  </section>}
  <form className="booking-form" onSubmit={submit}>
   <div className="form-row"><label>Full name<input required name="name" placeholder="Your name"/></label><label>Phone number<input required name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="10-digit mobile number" pattern="[6-9][0-9]{9}" minLength={10} maxLength={10} title="Enter a valid 10-digit Indian mobile number"/></label></div>
   <div className="form-row"><label>Preferred doctor<select name="doctor" value={doctor} onChange={e=>{const value=e.target.value;setDoctor(value);setSpecialisation(value.includes("Nagarajaiah")?"General Medicine":"Gynaecology")}}><option>Dr Aishwarya V Mathikatti</option><option>Dr L. P. Nagarajaiah</option></select></label><label>Specialisation<select required name="specialisation" value={specialisation} onChange={e=>setSpecialisation(e.target.value)}><option>Gynaecology</option><option>Pregnancy Care</option><option>Fertility & IVF</option><option>General Medicine</option><option>Other</option></select></label></div>
   <div className="form-row"><label>Preferred date<input name="preferredDate" type="date" min={today} max={lastBookableDate}/><small>Choose a date within the next 30 days.</small></label><label>Preferred time<select name="preferredTime"><option value="">Flexible / clinic to confirm</option>{doctorSlots.map((x,i)=><option key={`${x.doctor}-${x.label}-${i}`} value={`${x.label} · ${x.time}`}>{x.label} · {x.time}</option>)}</select></label></div>
   <label>Message<textarea name="message" rows={4} placeholder="Anything you would like the clinic to know?"/></label>
   <button className="btn form-submit" disabled={status==="opening"}>{status==="opening"?(settings.appointmentDelivery==="email"?"Opening email…":"Opening WhatsApp…"):"Book an appointment →"}</button>
   {status==="error"&&<p className="error">WhatsApp could not be opened. Please use the floating WhatsApp button or call the clinic.</p>}
   <small>Your appointment details will open in {settings.appointmentDelivery==="email"?"your email app":"WhatsApp"}. Review the message and tap Send to contact the clinic.</small>
  </form>
 </>;
}
