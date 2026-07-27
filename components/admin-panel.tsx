"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import { defaultSettings, type SiteSettings } from "../lib/default-settings";
import AccessManager from "./access-manager";
import { aishwaryaPhoto, awardPhoto } from "../lib/site-content";

const routes=[
 ["home","Homepage"],["about","Doctors / About"],["gynaecology","Gynaecology"],["pregnancy-care","Pregnancy Care"],
 ["fertility-ivf","Fertility & IVF"],["procedures","Procedures"],["general-medicine","General Medicine"],
 ["blogs","Blogs & Calculators"],["contact","Contact"],
];
const themePresets=[
 {name:"Soft Blush",mode:"light",primary:"#b54f76",accent:"#c79660",background:"#fff8fb",ink:"#402532",muted:"#77636c",surface:"#ffffff",soft:"#fdf0f5",deep:"#702a47"},
 {name:"Clinical Luxe",mode:"light",primary:"#963e62",accent:"#b88a53",background:"#fffdfb",ink:"#30232a",muted:"#70636a",surface:"#ffffff",soft:"#f8edf1",deep:"#542439"},
 {name:"Warm Minimal",mode:"light",primary:"#9a5369",accent:"#a77b50",background:"#fbf7f2",ink:"#382b2d",muted:"#776a68",surface:"#fffdfa",soft:"#f2e9e3",deep:"#56353d"},
 {name:"Midnight Rose",mode:"dark",primary:"#f08aaf",accent:"#e1b477",background:"#171116",ink:"#fff5f8",muted:"#cdbbc2",surface:"#241a21",soft:"#2d2028",deep:"#0d090c"},
 {name:"Deep Plum",mode:"dark",primary:"#e2a0c2",accent:"#d6ad78",background:"#21131e",ink:"#fff5fb",muted:"#cfb9c8",surface:"#301d2b",soft:"#3a2434",deep:"#120a10"},
 {name:"Graphite & Rose",mode:"dark",primary:"#ec789f",accent:"#d4a868",background:"#141517",ink:"#f8f5f6",muted:"#bbb8ba",surface:"#202226",soft:"#292b30",deep:"#090a0b"},
];
const blogImageFallbacks:Record<string,string>={"pcos-can-it-be-cured":"/specializations/gynaecology.webp","fertility-evaluation":"/media/fertility-assessment.webp","first-trimester":"/specializations/pregnancy-care.webp","male-infertility-causes-treatment":"/specializations/fertility-ivf.webp"};
function sectionImageFallback(slug:string,index:number){
 if(slug==="about")return [aishwaryaPhoto,"/doctors/dr-nagarajaiah.jpg",awardPhoto][index]||awardPhoto;
 return "";
}

function ImageField({label,value,onChange,recommend}:{label:string;value:string;onChange:(url:string)=>void;recommend:string}){
 const [state,setState]=useState("");
 async function prepareImage(file:File){
  if(file.size>35_000_000)throw new Error("This photo is over 35 MB. Please choose a smaller original.");
  const bitmap=await createImageBitmap(file);
  const maxSide=2000;
  const scale=Math.min(1,maxSide/Math.max(bitmap.width,bitmap.height));
  const width=Math.max(1,Math.round(bitmap.width*scale)),height=Math.max(1,Math.round(bitmap.height*scale));
  const canvas=document.createElement("canvas");canvas.width=width;canvas.height=height;
  const context=canvas.getContext("2d");if(!context)throw new Error("This browser could not prepare the image.");
  context.drawImage(bitmap,0,0,width,height);bitmap.close();
  let quality=.86;
  let blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,"image/webp",quality));
  while(blob&&blob.size>4_500_000&&quality>.56){quality-=.1;blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,"image/webp",quality))}
  if(!blob)throw new Error("This image format could not be processed. Please use JPG, PNG or WebP.");
  return new File([blob],`${file.name.replace(/\.[^.]+$/,"")||"clinic-image"}.webp`,{type:"image/webp"});
 }
 async function choose(e:React.ChangeEvent<HTMLInputElement>){
  const file=e.target.files?.[0];if(!file)return;setState("Optimising image…");
  try{
   const prepared=await prepareImage(file);setState("Uploading optimised image…");
   const form=new FormData();form.append("file",prepared);
   const r=await fetch("/api/admin/media",{method:"POST",body:form});
   const raw=await r.text();let j:any={};try{j=raw?JSON.parse(raw):{}}catch{}
   if(!r.ok)throw new Error(j.error||(r.status===413?"The image is still too large. Please use an image below 35 MB.":raw||"Upload failed"));
   if(!j.url)throw new Error("Upload finished but no image was returned. Please try again.");
   onChange(j.url);setState(`Image uploaded and optimised to ${Math.round(prepared.size/1024)} KB. Save changes when ready.`);
  }catch(e){setState(e instanceof Error?e.message:"Upload failed")}finally{e.target.value=""}
 }
 return <div className="image-field"><div className="image-field-head"><b>{label}</b><span>Recommended: {recommend}</span></div><div className="image-preview">{value?<img src={value} alt="Current upload"/>:<span>No image uploaded</span>}</div><label className="image-upload-button">Choose or replace image<input type="file" accept="image/jpeg,image/png,image/webp" onChange={choose}/></label>{state&&<small>{state}</small>}</div>
}

export default function AdminPanel(){
 const [data,setData]=useState<SiteSettings>(defaultSettings);const [status,setStatus]=useState("Loading…");
 const [downloadStatus,setDownloadStatus]=useState("");
 const [pageSlug,setPageSlug]=useState("gynaecology");const importRef=useRef<HTMLInputElement>(null);
 useEffect(()=>{fetch("/api/admin/settings",{cache:"no-store"}).then(async r=>{if(!r.ok)throw new Error((await r.json()).error||"Could not load settings");return r.json()}).then(j=>{
  const raw=j.settings||{};
  if(!raw.homeBlogImagePreferenceVersion){raw.showBlogImagesHome=false;raw.homeBlogImagePreferenceVersion=1}
  if(!raw.homeHeroSizeVersion){raw.homeHeroTitleSize=66;raw.homeHeroSizeVersion=1}
  if(!raw.calculatorMoveVersion){raw.calculatorPlacement="blogs";raw.calculatorMoveVersion=1}
  if(!raw.consultationSlotsVersion){raw.consultationSlots=defaultSettings.consultationSlots;raw.consultationSlotsVersion=1}
  if(!raw.conditionsVersion){
   raw.conditions=defaultSettings.conditions;
   const order=[...(raw.homeSectionOrder||defaultSettings.homeSectionOrder)];
   if(!order.includes("conditions")) order.splice(Math.max(0,order.indexOf("awards")),0,"conditions");
   raw.homeSectionOrder=order;raw.showConditions=true;raw.conditionsVersion=1;
  }
  if(!raw.blogFourVersion){
   const current=raw.blogs||[];
   raw.blogs=[...current,...defaultSettings.blogs.filter((item:any)=>!current.some((x:any)=>x.slug===item.slug))];
   raw.blogFourVersion=1;
  }
  if((raw.instagramVideoVersion||0)<3){
   raw.videos=defaultSettings.videos;
   raw.instagramVideoVersion=3;
  }
  if(!raw.verifiedReviewsVersion){
   raw.testimonials=defaultSettings.testimonials;
   raw.verifiedReviewsVersion=1;
  }
  if(!raw.procedurePathwaysVersion){
   raw.pages={...(raw.pages||{}),procedures:{
    ...((raw.pages||{}).procedures||{}),
    eyebrow:defaultSettings.pages.procedures.eyebrow,
    title:defaultSettings.pages.procedures.title,
    intro:defaultSettings.pages.procedures.intro,
    sections:defaultSettings.pages.procedures.sections,
   }};
   raw.procedurePathwaysVersion=1;
  }
  if(!raw.procedureFaqsVersion){
   raw.pages={...(raw.pages||{}),procedures:{...((raw.pages||{}).procedures||{}),faqs:defaultSettings.pages.procedures.faqs}};
   raw.procedureFaqsVersion=1;
  }
  if((raw.mediaVisibilityVersion||0)<2){raw.showPhotos=true;raw.showVideos=true;raw.mediaVisibilityVersion=2}
  if(!raw.physicianFaqsVersion){
   raw.pages={...(raw.pages||{}),"general-medicine":{...((raw.pages||{})["general-medicine"]||{}),faqs:defaultSettings.pages["general-medicine"].faqs}};
   raw.physicianFaqsVersion=1;
  }
  if(!raw.blogStructureVersion){
   raw.blogs=(raw.blogs||defaultSettings.blogs).map((blog:any)=>{
    const base=defaultSettings.blogs.find((item:any)=>item.slug===blog.slug);
    return base?{...blog,sections:(blog.sections||[]).length?blog.sections:base.sections,faqs:(blog.faqs||[]).length?blog.faqs:base.faqs}:blog;
   });
   raw.blogStructureVersion=1;
  }
  if((raw.doctorPhotoVersion||0)<1){
   const about={...defaultSettings.pages.about,...((raw.pages||{}).about||{})} as any;
   const sections=[...(about.sections||defaultSettings.pages.about.sections)];
   sections[0]={...sections[0],image:"/doctors/dr-aishwarya.png"};
   sections[1]={...sections[1],image:sections[1]?.image||"/doctors/dr-nagarajaiah.jpg"};
   raw.pages={...(raw.pages||{}),about:{...about,sections}};
   raw.doctorPhotoVersion=1;
  }
  const blogs=(raw.blogs||defaultSettings.blogs).map((x:any,i:number)=>({...defaultSettings.blogs[Math.min(i,defaultSettings.blogs.length-1)],...x,slug:x.slug||`article-${i+1}`,image:x.image||"",sections:x.sections||[],faqs:x.faqs||[]}));
  const sourcePages={...defaultSettings.pages,...(raw.pages||{})};
  const pages=Object.fromEntries(Object.entries(sourcePages).map(([slug,p]:any)=>{
   const savedFaqs=p.faqs||[],defaultFaqs=(defaultSettings.pages as any)[slug]?.faqs||[];
   const faqs=(raw.faqExpansionVersion||0)<1?[...savedFaqs,...defaultFaqs.filter((d:any)=>!savedFaqs.some((x:any)=>x.q===d.q))]:savedFaqs;
   const defaultSections=(defaultSettings.pages as any)[slug]?.sections||[];
   const sections=(raw.serviceDetailsVersion||0)<3?(p.sections||[]).map((item:any)=>({...item,more:item.more||defaultSections.find((x:any)=>x.title===item.title)?.more||""})):(p.sections||[]);
   return [slug,{heroVisible:true,heroHeight:600,heroTitleSize:76,heroIntroSize:18,contentVisible:true,contentPadding:100,sectionTitleSize:64,cardTitleSize:27,cardTextSize:12,faqsVisible:true,ctaVisible:true,...p,faqs,sections}];
  }));
  setData({...defaultSettings,...raw,faqExpansionVersion:1,serviceDetailsVersion:3,blogs,pages} as any);setStatus("");
 }).catch(e=>setStatus(e.message))},[]);
 useEffect(()=>{const root=document.documentElement;root.style.setProperty("--primary",data.primary);root.style.setProperty("--gold",data.accent);root.style.setProperty("--cream",data.background);root.style.setProperty("--ink",data.ink);root.style.setProperty("--muted",data.muted);root.style.setProperty("--surface",data.surface);root.style.setProperty("--soft",data.soft);root.style.setProperty("--deep",data.deep);root.style.setProperty("--radius",`${data.radius}px`);root.style.setProperty("--serif",`"${data.headingFont}", Georgia, serif`);root.style.setProperty("--sans",`"${data.bodyFont}", Arial, sans-serif`)},[data]);
 const set=(k:keyof SiteSettings,v:any)=>setData(d=>({...d,[k]:v}));
 const setPage=(k:string,v:any)=>setData(d=>({...d,pages:{...d.pages,[pageSlug]:{...d.pages[pageSlug], [k]:v}}}));
 const setDoctorImage=(index:number,v:string)=>setData(d=>{
  const about=d.pages.about;
  const sections=[...about.sections];
  sections[index]={...sections[index],image:v};
  return {...d,pages:{...d.pages,about:{...about,sections}}};
 });
 const setSpecializationImage=(slug:string,v:string)=>setData(d=>({...d,specializationImages:{...d.specializationImages,[slug]:v}}));
 const setSlot=(index:number,k:"doctor"|"label"|"time",v:string)=>setData(d=>{const a=[...d.consultationSlots];a[index]={...a[index],[k]:v};return {...d,consultationSlots:a}});
 const setGoogleBookingUrl=(doctor:"aishwarya"|"nagarajaiah",v:string)=>setData(d=>({...d,googleBookingUrls:{...d.googleBookingUrls,[doctor]:v}}));
 const validBookingUrl=(value:string)=>!value||/^https:\/\/calendar\.app\.google\//i.test(value.trim());
 const setCondition=(index:number,v:string)=>setData(d=>{const conditions=[...d.conditions];conditions[index]=v;return {...d,conditions}});
 const setPageItem=(group:"sections"|"faqs",index:number,k:string,v:string)=>setData(d=>{const arr=[...(d.pages[pageSlug]?.[group]||[])];arr[index]={...arr[index],[k]:v};return {...d,pages:{...d.pages,[pageSlug]:{...d.pages[pageSlug],[group]:arr}}}});
 const setCollection=(group:"blogs"|"videos"|"testimonials"|"galleryImages",index:number,k:string,v:string)=>setData(d=>{const arr=[...(d[group]||[])] as any[];arr[index]={...arr[index],[k]:v};return {...d,[group]:arr}});
 async function save(e?:FormEvent){e?.preventDefault();setStatus("Saving…");try{if(data.googleBookingEnabled&&(!validBookingUrl(data.googleBookingUrls.aishwarya)||!validBookingUrl(data.googleBookingUrls.nagarajaiah)))throw new Error("Use a public Google Appointment Schedule link beginning with https://calendar.app.google/. A normal Google Calendar link cannot be embedded.");const r=await fetch("/api/admin/settings",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(data)});const j=await r.json();if(!r.ok)throw new Error(j.error||"Could not save");setStatus("Saved. Refresh the public website to see the update.");}catch(e){setStatus(e instanceof Error?e.message:"Could not save")}}
 function moveSection(key:string,dir:number){const a=[...data.homeSectionOrder],i=a.indexOf(key),n=i+dir;if(n<0||n>=a.length)return;[a[i],a[n]]=[a[n],a[i]];set("homeSectionOrder",a)}
 function exportJson(){const b=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="shiva-krupa-site-backup.json";a.click();URL.revokeObjectURL(a.href)}
 async function downloadCompleteSite(){
  setDownloadStatus("Preparing the complete website ZIP…");
  try{
   const response=await fetch("/api/admin/export-site",{cache:"no-store"});
   if(!response.ok){const raw=await response.text();let message=raw;try{message=JSON.parse(raw).error||raw}catch{}throw new Error(message||`Download failed (${response.status})`)}
   const total=Number(response.headers.get("content-length")||0),reader=response.body?.getReader();
   if(!reader)throw new Error("Your browser could not start this download.");
   const chunks:Uint8Array[]=[];let received=0;
   while(true){
    const {done,value}=await reader.read();if(done)break;
    chunks.push(value);received+=value.length;
    setDownloadStatus(total?`Downloading ${Math.round(received/total*100)}%…`:`Downloading ${(received/1024/1024).toFixed(1)} MB…`);
   }
   const blob=new Blob(chunks as BlobPart[],{type:"application/zip"}),url=URL.createObjectURL(blob),a=document.createElement("a");
   a.href=url;a.download="shiva-krupa-complete-website.zip";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
   setDownloadStatus("Complete website ZIP downloaded.");
  }catch(error){setDownloadStatus(error instanceof Error?`Download failed: ${error.message}`:"Download failed. Please try again.")}
 }
 async function importJson(e:React.ChangeEvent<HTMLInputElement>){const file=e.target.files?.[0];if(!file)return;try{setData({...defaultSettings,...JSON.parse(await file.text())});setStatus("Backup imported. Click Save and publish changes.")}catch{setStatus("That backup file is not valid.")}}
 const page=data.pages[pageSlug];
 return <div className="admin-shell">
  <aside><h2>Content Studio</h2><p>Private website editor</p><a href="#identity">Clinic details</a><a href="#doctor-photos">Doctor photos</a><a href="#access">Access control</a><a href="#brand">Theme & layout</a><a href="#home">Homepage</a><a href="#pages">Page editor</a><a href="#collections">Blogs & media</a><a href="#placement">Combine pages</a><a href="#backup">Backup</a><a href="#stack">Technology</a><a href="/" target="_blank">View website ↗</a></aside>
  <div className="admin-main"><div className="admin-head"><div><p className="kicker">PRIVATE ADMIN</p><h1>Complete website controls</h1></div><a href="/api/auth/logout">Sign out</a></div>
  <form onSubmit={save}>
   <div className="admin-floating-save"><button className="btn" type="submit">Save changes</button><span className="admin-status" role="status">{status}</span></div>
   <section className="admin-card" id="identity"><h3>Clinic and contact details</h3><p>These values update the header, footer, contact page and floating buttons.</p><div className="admin-grid">
    <label>Clinic name<input value={data.clinicName} onChange={e=>set("clinicName",e.target.value)}/></label>
    <label>Tagline<input value={data.strapline} onChange={e=>set("strapline",e.target.value)}/></label>
    <label>Announcement bar<select value={data.showAnnouncementBar?"visible":"hidden"} onChange={e=>set("showAnnouncementBar",e.target.value==="visible")}><option value="hidden">Hidden on all pages</option><option value="visible">Visible on all pages</option></select></label>
    <label>Announcement text<input value={data.announcement} onChange={e=>set("announcement",e.target.value)}/></label>
    <label>Displayed phone<input value={data.phone} onChange={e=>set("phone",e.target.value)}/></label>
    <label>Dialling phone<input value={data.phoneHref} onChange={e=>set("phoneHref",e.target.value.replace(/[^\d+]/g,""))}/></label>
    <label>WhatsApp number<input value={data.whatsapp} onChange={e=>set("whatsapp",e.target.value.replace(/\D/g,""))}/><small>Country code + number, digits only. Example: 919876543210</small></label>
    <label>Email<input type="email" value={data.email} onChange={e=>set("email",e.target.value)}/></label>
    <label>General opening hours<input value={data.hours} onChange={e=>set("hours",e.target.value)}/></label>
    <label>Clinic receives appointment requests through<select value={data.appointmentDelivery} onChange={e=>set("appointmentDelivery",e.target.value)}><option value="whatsapp">Clinic WhatsApp number</option><option value="email">Clinic email address</option></select><small>You choose where the prepared patient message is sent. It is also saved privately.</small></label>
    <label className="span-3">Address<textarea value={data.address} onChange={e=>set("address",e.target.value)}/></label>
   </div><div className="check-row"><label><input type="checkbox" checked={data.showFloatingCall} onChange={e=>set("showFloatingCall",e.target.checked)}/> Floating Call</label><label><input type="checkbox" checked={data.showFloatingWhatsapp} onChange={e=>set("showFloatingWhatsapp",e.target.checked)}/> Floating WhatsApp</label></div>
   <h4>Google Calendar live availability</h4><div className="check-row"><label><input type="checkbox" checked={data.googleBookingEnabled} onChange={e=>set("googleBookingEnabled",e.target.checked)}/> Show Google Appointment Schedule</label></div><div className="admin-grid"><label>Dr Aishwarya booking-page URL<input className={!validBookingUrl(data.googleBookingUrls.aishwarya)?"input-invalid":""} type="url" value={data.googleBookingUrls.aishwarya} onChange={e=>setGoogleBookingUrl("aishwarya",e.target.value.trim())} placeholder="https://calendar.app.google/..."/>{!validBookingUrl(data.googleBookingUrls.aishwarya)&&<small className="field-error">This is not an Appointment Schedule link.</small>}</label><label>Dr Nagarajaiah booking-page URL<input className={!validBookingUrl(data.googleBookingUrls.nagarajaiah)?"input-invalid":""} type="url" value={data.googleBookingUrls.nagarajaiah} onChange={e=>setGoogleBookingUrl("nagarajaiah",e.target.value.trim())} placeholder="https://calendar.app.google/..."/>{!validBookingUrl(data.googleBookingUrls.nagarajaiah)&&<small className="field-error">This is not an Appointment Schedule link.</small>}</label></div><p className="admin-note"><b>Do not paste the URL from your normal calendar screen.</b> In Google Calendar, create an Appointment Schedule, open its booking page and copy the public link beginning with <b>https://calendar.app.google/</b>. The website opens this secure booking page in a new tab because Google does not permit it to be displayed inside another website. The WhatsApp appointment form remains available below it.</p>
   <h4>Doctor consultation timings</h4><p>Add as many windows as required—for example morning and evening timings for the same doctor.</p>{data.consultationSlots.map((x,i)=><div className="timing-editor" key={i}><label>Doctor<input value={x.doctor} onChange={e=>setSlot(i,"doctor",e.target.value)}/></label><label>Session name<input value={x.label} onChange={e=>setSlot(i,"label",e.target.value)} placeholder="Morning / Evening"/></label><label>Time window<input value={x.time} onChange={e=>setSlot(i,"time",e.target.value)} placeholder="10:00 AM–1:00 PM"/></label><button type="button" onClick={()=>set("consultationSlots",data.consultationSlots.filter((_,n)=>n!==i))}>Remove</button></div>)}<button type="button" className="admin-add" onClick={()=>set("consultationSlots",[...data.consultationSlots,{doctor:"Dr Aishwarya V Mathikatti",label:"New session",time:""}])}>+ Add consultation timing</button>
   <p className="admin-note">If Email is selected, enter the clinic email above. The announcement-bar setting is global across every page.</p></section>

   <section className="admin-card" id="doctor-photos"><h3>Doctor photos</h3><p>Replace either doctor’s About-page portrait independently. These controls do not change the homepage family banner.</p><div className="admin-grid doctor-photo-controls"><ImageField label="Dr Aishwarya V Mathikatti photo" value={data.pages.about.sections[0]?.image||aishwaryaPhoto} onChange={v=>setDoctorImage(0,v)} recommend="1200 × 1500 px, portrait"/><ImageField label="Dr L. P. Nagarajaiah photo" value={data.pages.about.sections[1]?.image||"/doctors/dr-nagarajaiah.jpg"} onChange={v=>setDoctorImage(1,v)} recommend="1200 × 1500 px, portrait"/></div><p className="admin-note">After uploading, click the floating <b>Save changes</b> button. Refresh the About page to see the update.</p></section>

   <section className="admin-card" id="brand"><h3>Theme and layout system</h3><p>Choose a genuinely different light or dark preset, or customise individual colours. The active preset is clearly marked.</p><div className="theme-preset-row">{themePresets.map(t=>{const active=data.primary.toLowerCase()===t.primary&&data.background.toLowerCase()===t.background;return <button type="button" className={active?"active":""} aria-pressed={active} key={t.name} onClick={()=>setData(d=>({...d,...t,themeMode:t.mode} as any))}><i style={{background:`linear-gradient(135deg,${t.primary} 0 35%,${t.surface} 35% 68%,${t.background} 68%)`}}/><span>{t.name}<small>{t.mode==="dark"?"Dark theme":"Light theme"}</small></span>{active&&<strong>✓ Selected</strong>}</button>})}</div><div className="admin-grid">
    <label>Primary colour<input type="color" value={data.primary} onChange={e=>set("primary",e.target.value)}/></label><label>Accent colour<input type="color" value={data.accent} onChange={e=>set("accent",e.target.value)}/></label><label>Background<input type="color" value={data.background} onChange={e=>set("background",e.target.value)}/></label>
    <label>Heading font<select value={data.headingFont} onChange={e=>set("headingFont",e.target.value)}><option>Cormorant Garamond</option><option>Playfair Display</option><option>Libre Baskerville</option></select></label>
    <label>Body font<select value={data.bodyFont} onChange={e=>set("bodyFont",e.target.value)}><option>Inter</option><option>Manrope</option><option>Source Sans 3</option></select></label>
    <label>Corner radius<input type="range" min="0" max="28" value={data.radius} onChange={e=>set("radius",e.target.value)}/></label>
    <label>Content width<select value={data.contentWidth} onChange={e=>set("contentWidth",e.target.value)}><option value="wide">Wide editorial</option><option value="contained">Contained</option></select></label>
    <label>Cards<select value={data.cardStyle} onChange={e=>set("cardStyle",e.target.value)}><option value="soft">Soft shadow</option><option value="outline">Clean outline</option><option value="flat">Flat</option></select></label>
    <label>Buttons<select value={data.buttonStyle} onChange={e=>set("buttonStyle",e.target.value)}><option value="rounded">Rounded</option><option value="pill">Pill</option><option value="square">Square</option></select></label>
    <label>Animations<select value={data.animationStyle} onChange={e=>set("animationStyle",e.target.value)}><option value="soft">Subtle</option><option value="expressive">Expressive</option><option value="none">None</option></select></label>
    <label>Header<select value={data.headerStyle} onChange={e=>set("headerStyle",e.target.value)}><option value="classic">Classic</option><option value="compact">Compact</option></select></label>
    <label>Service cards<select value={data.servicesLayout} onChange={e=>set("servicesLayout",e.target.value)}><option value="grid">Grid</option><option value="list">List</option><option value="alternating">Alternating</option></select></label>
   </div></section>

   <section className="admin-card" id="home"><h3>Homepage</h3><div className="admin-grid"><label>Hero layout<select value={data.heroLayout} onChange={e=>set("heroLayout",e.target.value)}><option value="split">Split photo</option><option value="full">Full image banner</option><option value="editorial">Editorial text</option></select></label><div className="span-2"><ImageField label="Homepage hero image" value={data.heroImage||aishwaryaPhoto} onChange={v=>set("heroImage",v)} recommend={data.heroLayout==="full"?"1920 × 1080 px, landscape":"1200 × 1500 px, portrait"}/></div><label className="span-3">Main heading<textarea value={data.heroTitle} onChange={e=>set("heroTitle",e.target.value)}/></label><label className="span-3">Hero introduction<textarea value={data.heroSubtitle} onChange={e=>set("heroSubtitle",e.target.value)}/></label></div>
   <h4>Hero typography and image framing</h4><div className="admin-grid"><label>Hero title size <b>{data.homeHeroTitleSize}px</b><input type="range" min="38" max="88" step="2" value={data.homeHeroTitleSize} onChange={e=>set("homeHeroTitleSize",Number(e.target.value))}/></label><label>Hero description size <b>{data.homeHeroSubtitleSize}px</b><input type="range" min="12" max="25" value={data.homeHeroSubtitleSize} onChange={e=>set("homeHeroSubtitleSize",Number(e.target.value))}/></label><label>Text area width <b>{data.homeHeroTextWidth}%</b><input type="range" min="35" max="70" value={data.homeHeroTextWidth} onChange={e=>set("homeHeroTextWidth",Number(e.target.value))}/></label><label>Image horizontal position <b>{data.homeHeroImageX}%</b><input type="range" min="0" max="100" value={data.homeHeroImageX} onChange={e=>set("homeHeroImageX",Number(e.target.value))}/></label><label>Image vertical position <b>{data.homeHeroImageY}%</b><input type="range" min="0" max="100" value={data.homeHeroImageY} onChange={e=>set("homeHeroImageY",Number(e.target.value))}/></label><label>Image dark overlay <b>{data.homeHeroOverlay}%</b><input type="range" min="20" max="85" value={data.homeHeroOverlay} onChange={e=>set("homeHeroOverlay",Number(e.target.value))}/></label></div>
   <h4>Section-wise font sizes</h4><div className="font-section-grid"><fieldset><legend>Doctor introduction</legend><label>Heading <b>{data.homeIntroHeadingSize}px</b><input type="range" min="30" max="72" value={data.homeIntroHeadingSize} onChange={e=>set("homeIntroHeadingSize",Number(e.target.value))}/></label><label>Body text <b>{data.homeIntroBodySize}px</b><input type="range" min="11" max="20" value={data.homeIntroBodySize} onChange={e=>set("homeIntroBodySize",Number(e.target.value))}/></label></fieldset><fieldset><legend>Services</legend><label>Section heading <b>{data.homeServicesHeadingSize}px</b><input type="range" min="30" max="72" value={data.homeServicesHeadingSize} onChange={e=>set("homeServicesHeadingSize",Number(e.target.value))}/></label><label>Card heading <b>{data.homeServiceCardTitleSize}px</b><input type="range" min="17" max="38" value={data.homeServiceCardTitleSize} onChange={e=>set("homeServiceCardTitleSize",Number(e.target.value))}/></label><label>Card text <b>{data.homeServiceCardBodySize}px</b><input type="range" min="10" max="19" value={data.homeServiceCardBodySize} onChange={e=>set("homeServiceCardBodySize",Number(e.target.value))}/></label></fieldset><fieldset><legend>Awards</legend><label>Heading <b>{data.homeAwardsHeadingSize}px</b><input type="range" min="30" max="72" value={data.homeAwardsHeadingSize} onChange={e=>set("homeAwardsHeadingSize",Number(e.target.value))}/></label><label>Body text <b>{data.homeAwardsBodySize}px</b><input type="range" min="11" max="20" value={data.homeAwardsBodySize} onChange={e=>set("homeAwardsBodySize",Number(e.target.value))}/></label></fieldset><fieldset><legend>Blog/Insights</legend><label className="visibility-select">Homepage blog images<select value={data.showBlogImagesHome?"show":"hide"} onChange={e=>set("showBlogImagesHome",e.target.value==="show")}><option value="hide">Hide images on homepage</option><option value="show">Show images on homepage</option></select><small>Images remain visible on the Blogs page and inside each article.</small></label><label>Section heading <b>{data.homeInsightsHeadingSize}px</b><input type="range" min="30" max="72" value={data.homeInsightsHeadingSize} onChange={e=>set("homeInsightsHeadingSize",Number(e.target.value))}/></label><label>Blog-card heading <b>{data.homeBlogCardTitleSize}px</b><input type="range" min="17" max="38" value={data.homeBlogCardTitleSize} onChange={e=>set("homeBlogCardTitleSize",Number(e.target.value))}/></label><label>Blog-card text <b>{data.homeBlogCardBodySize}px</b><input type="range" min="10" max="19" value={data.homeBlogCardBodySize} onChange={e=>set("homeBlogCardBodySize",Number(e.target.value))}/></label></fieldset></div>
   <h4>Homepage sections and order</h4><div className="section-order">{data.homeSectionOrder.map((k,i)=><div key={k}><label><input type="checkbox" checked={(data as any)[`show${k[0].toUpperCase()}${k.slice(1)}`]??true} onChange={e=>set(`show${k[0].toUpperCase()}${k.slice(1)}` as keyof SiteSettings,e.target.checked)}/>{k}</label><button type="button" onClick={()=>moveSection(k,-1)} disabled={!i}>↑</button><button type="button" onClick={()=>moveSection(k,1)} disabled={i===data.homeSectionOrder.length-1}>↓</button></div>)}</div>
   <h4>Conditions We Treat</h4><p>These appear as a dedicated homepage section and can be reordered or rewritten here.</p>{data.conditions.map((condition,i)=><div className="condition-editor" key={i}><input value={condition} onChange={e=>setCondition(i,e.target.value)}/><button type="button" onClick={()=>set("conditions",data.conditions.filter((_,n)=>n!==i))}>Remove</button></div>)}<button type="button" className="admin-add" onClick={()=>set("conditions",[...data.conditions,"New condition"])}>+ Add condition</button></section>

   <section className="admin-card" id="pages"><h3>Page-by-page layout and content</h3><p>Choose a page, then hide, reduce or enlarge its top section and independently control its content, cards, FAQs and final call-to-action.</p><label>Choose page<select value={pageSlug} onChange={e=>setPageSlug(e.target.value)}>{routes.filter(r=>data.pages[r[0]]).map(r=><option key={r[0]} value={r[0]}>{r[1]}</option>)}</select></label>{page&&<div className="page-editor">
    <div className="page-control-panel"><h4>Top section</h4><div className="check-row"><label><input type="checkbox" checked={page.heroVisible!==false} onChange={e=>setPage("heroVisible",e.target.checked)}/> Show top section</label></div><div className="admin-grid"><label>Top section height <b>{pageSlug==="about"?data.aboutHeroHeight:(page.heroHeight||600)}px</b><input type="range" min="260" max="800" step="20" value={pageSlug==="about"?data.aboutHeroHeight:(page.heroHeight||600)} onChange={e=>pageSlug==="about"?set("aboutHeroHeight",Number(e.target.value)):setPage("heroHeight",Number(e.target.value))}/><small>Reduce this to reveal more of the next section without scrolling.</small></label><label>Page title size <b>{page.heroTitleSize||76}px</b><input type="range" min="34" max="90" step="2" value={page.heroTitleSize||76} onChange={e=>setPage("heroTitleSize",Number(e.target.value))}/></label><label>Introduction size <b>{page.heroIntroSize||18}px</b><input type="range" min="12" max="26" value={page.heroIntroSize||18} onChange={e=>setPage("heroIntroSize",Number(e.target.value))}/></label></div>
    <h4>Main content</h4><div className="check-row"><label><input type="checkbox" checked={page.contentVisible!==false} onChange={e=>setPage("contentVisible",e.target.checked)}/> Show service/content section</label><label><input type="checkbox" checked={page.faqsVisible!==false} onChange={e=>setPage("faqsVisible",e.target.checked)}/> Show FAQs</label><label><input type="checkbox" checked={page.ctaVisible!==false} onChange={e=>setPage("ctaVisible",e.target.checked)}/> Show final appointment section</label></div><div className="admin-grid"><label>Section spacing <b>{page.contentPadding||100}px</b><input type="range" min="40" max="150" step="5" value={page.contentPadding||100} onChange={e=>setPage("contentPadding",Number(e.target.value))}/></label><label>Section heading size <b>{page.sectionTitleSize||64}px</b><input type="range" min="30" max="76" step="2" value={page.sectionTitleSize||64} onChange={e=>setPage("sectionTitleSize",Number(e.target.value))}/></label><label>Card heading size <b>{page.cardTitleSize||27}px</b><input type="range" min="17" max="40" value={page.cardTitleSize||27} onChange={e=>setPage("cardTitleSize",Number(e.target.value))}/></label><label>Card text size <b>{page.cardTextSize||12}px</b><input type="range" min="10" max="20" value={page.cardTextSize||12} onChange={e=>setPage("cardTextSize",Number(e.target.value))}/></label></div></div>
    <div className="admin-grid"><label>Small heading above the page title<input value={page.eyebrow} onChange={e=>setPage("eyebrow",e.target.value)}/><small>Example: WOMEN’S HEALTH. Designers sometimes call this an “eyebrow”.</small></label>{pageSlug!=="about"&&<div className="span-2"><ImageField label="Specialization hero image" value={(data.specializationImages as any)[pageSlug]||page.image} onChange={v=>setSpecializationImage(pageSlug,v)} recommend="1536 × 1024 px, landscape, without text"/></div>}<label className="span-3">Page title<textarea value={page.title} onChange={e=>setPage("title",e.target.value)}/></label><label className="span-3">Introduction<textarea value={page.intro} onChange={e=>setPage("intro",e.target.value)}/></label></div>
    {pageSlug==="about"&&<><h4>Doctor photographs</h4><p>These two controls update only the doctor profiles on the About page. They do not change the homepage family banner.</p><div className="admin-grid doctor-photo-controls"><ImageField label="Dr Aishwarya V Mathikatti photo" value={page.sections[0]?.image||aishwaryaPhoto} onChange={v=>setPageItem("sections",0,"image",v)} recommend="1200 × 1500 px, portrait"/><ImageField label="Dr L. P. Nagarajaiah photo" value={page.sections[1]?.image||"/doctors/dr-nagarajaiah.jpg"} onChange={v=>setPageItem("sections",1,"image",v)} recommend="1200 × 1500 px, portrait"/></div></>}
    <h4>{pageSlug==="about"?"Doctor profiles and philosophy":"Service content blocks"}</h4>{page.sections.map((x:any,i:number)=><div className="repeat-editor service-editor" key={i}>{pageSlug!=="about"&&<ImageField label={`Service image ${i+1}`} value={x.image||sectionImageFallback(pageSlug,i)} onChange={v=>setPageItem("sections",i,"image",v)} recommend="1200 × 800 px, landscape"/>}<label>{pageSlug==="about"?(i<2?"Doctor name":"Section heading"):"Heading"}<input value={x.title} onChange={e=>setPageItem("sections",i,"title",e.target.value)}/></label><div><label>{pageSlug==="about"?(i<2?"Doctor profile":"Section text"):"Short description"}<textarea value={x.text} onChange={e=>setPageItem("sections",i,"text",e.target.value)}/></label>{pageSlug!=="about"&&<label>Read-more details<textarea value={x.more||""} onChange={e=>setPageItem("sections",i,"more",e.target.value)} placeholder="Add useful detail shown after Read more"/></label>}</div><button type="button" className="danger-link" onClick={()=>setPage("sections",page.sections.filter((_:any,n:number)=>n!==i))}>Remove</button></div>)}{pageSlug!=="about"&&<button type="button" className="admin-add" onClick={()=>setPage("sections",[...page.sections,{title:"New section",text:"Add the section content here.",more:"",image:""}])}>+ Add service block</button>}
    <h4>FAQs</h4>{page.faqs.map((x:any,i:number)=><div className="repeat-editor" key={i}><label>Question<input value={x.q} onChange={e=>setPageItem("faqs",i,"q",e.target.value)}/></label><label>Answer<textarea value={x.a} onChange={e=>setPageItem("faqs",i,"a",e.target.value)}/></label><button type="button" className="danger-link" onClick={()=>setPage("faqs",page.faqs.filter((_:any,n:number)=>n!==i))}>Remove</button></div>)}<button type="button" className="admin-add" onClick={()=>setPage("faqs",[...page.faqs,{q:"New question",a:"Add the answer here."}])}>+ Add FAQ</button>
   </div>}</section>

   <section className="admin-card" id="collections"><h3>Blogs, videos and testimonials</h3><p>“Blogs” is clearer in the public menu. “Health Insights” can remain as the more premium page heading. You can edit both names below.</p><div className="admin-grid"><label>Menu name<input value={data.blogNavLabel} onChange={e=>set("blogNavLabel",e.target.value)}/><small>Recommended: Blogs</small></label><label>Small page heading<input value={data.blogPageLabel} onChange={e=>set("blogPageLabel",e.target.value)}/></label><label>Blog page title<input value={data.blogPageTitle} onChange={e=>set("blogPageTitle",e.target.value)}/></label></div><p>Every blog supports a directly uploaded hero photo plus a complete production article structure.</p><h4>Blogs</h4>{data.blogs.map((x:any,i:number)=><details className="blog-admin-editor" key={i} open={i===0}><summary>{x.title||`Blog ${i+1}`}<span>{x.category}</span></summary><div className="blog-admin-body">
    <ImageField label="Blog hero image" value={x.image||blogImageFallbacks[x.slug]||"/specializations/gynaecology.webp"} onChange={v=>setCollection("blogs",i,"image",v)} recommend="1600 × 900 px, landscape"/>
    <div className="admin-grid"><label>Category tag<input value={x.category} onChange={e=>setCollection("blogs",i,"category",e.target.value)}/></label><label>URL name<input value={x.slug} onChange={e=>setCollection("blogs",i,"slug",e.target.value.replace(/[^a-z0-9-]/g,"-"))}/></label><label>Published date<input value={x.date} onChange={e=>setCollection("blogs",i,"date",e.target.value)}/></label><label className="span-3">Article title<textarea value={x.title} onChange={e=>setCollection("blogs",i,"title",e.target.value)}/></label><label className="span-3">Hero short description<textarea value={x.heroShort||""} onChange={e=>setCollection("blogs",i,"heroShort",e.target.value)}/></label><label className="span-3">Listing-card summary<textarea value={x.summary} onChange={e=>setCollection("blogs",i,"summary",e.target.value)}/></label><label className="span-3">In a nutshell<textarea value={x.nutshell||""} onChange={e=>setCollection("blogs",i,"nutshell",e.target.value)}/></label><label className="span-3">Introduction<textarea value={x.introduction||""} onChange={e=>setCollection("blogs",i,"introduction",e.target.value)}/></label></div>
    <h5>Numbered article sections</h5>{(x.sections||[]).map((s:any,n:number)=><div className="article-section-editor" key={n}><label>Section heading<input value={s.heading} onChange={e=>{const a=[...x.sections];a[n]={...a[n],heading:e.target.value};setCollection("blogs",i,"sections",a as any)}}/></label><label>Medical explanation<textarea value={s.body} onChange={e=>{const a=[...x.sections];a[n]={...a[n],body:e.target.value};setCollection("blogs",i,"sections",a as any)}}/></label><label>Simple patient-friendly takeaway<textarea value={s.simple||""} onChange={e=>{const a=[...x.sections];a[n]={...a[n],simple:e.target.value};setCollection("blogs",i,"sections",a as any)}}/></label><button type="button" onClick={()=>setCollection("blogs",i,"sections",x.sections.filter((_:any,z:number)=>z!==n) as any)}>Remove section</button></div>)}<button type="button" className="admin-add" onClick={()=>setCollection("blogs",i,"sections",[...(x.sections||[]),{heading:"New section",body:"Add the medical explanation.",simple:"Add a simple takeaway."}] as any)}>+ Add article section</button>
    <h5>Patient FAQs</h5>{(x.faqs||[]).map((q:any,n:number)=><div className="repeat-editor" key={n}><label>Question<input value={q.q} onChange={e=>{const a=[...x.faqs];a[n]={...a[n],q:e.target.value};setCollection("blogs",i,"faqs",a as any)}}/></label><label>Answer<textarea value={q.a} onChange={e=>{const a=[...x.faqs];a[n]={...a[n],a:e.target.value};setCollection("blogs",i,"faqs",a as any)}}/></label><button type="button" onClick={()=>setCollection("blogs",i,"faqs",x.faqs.filter((_:any,z:number)=>z!==n) as any)}>Remove</button></div>)}<button type="button" className="admin-add" onClick={()=>setCollection("blogs",i,"faqs",[...(x.faqs||[]),{q:"New question",a:"Add the answer."}] as any)}>+ Add FAQ</button>
    <div className="admin-grid"><label className="span-3">When should patients consult a doctor?<textarea value={x.whenToSeek||""} onChange={e=>setCollection("blogs",i,"whenToSeek",e.target.value)}/></label><label className="span-3">Clinic CTA text<textarea value={x.clinicCta||""} onChange={e=>setCollection("blogs",i,"clinicCta",e.target.value)}/></label><label className="span-3">Final takeaway<textarea value={x.takeaway||""} onChange={e=>setCollection("blogs",i,"takeaway",e.target.value)}/></label></div>
    <button type="button" className="danger-link" onClick={()=>set("blogs",data.blogs.filter((_,n)=>n!==i))}>Remove entire blog</button>
   </div></details>)}<button type="button" className="admin-add" onClick={()=>set("blogs",[...data.blogs,{slug:`new-article-${data.blogs.length+1}`,category:"Women’s Health",title:"New article",heroShort:"Add the hero description.",summary:"Add the listing summary.",date:"July 2026",image:"",nutshell:"Add the concise summary.",introduction:"Add the introduction.",sections:[],faqs:[],whenToSeek:"Add consultation guidance.",clinicCta:"Add the clinic CTA.",takeaway:"Add the final takeaway."}])}>+ Add complete blog</button>
   <h4>Photo gallery</h4><div className="check-row"><label><input type="checkbox" checked={data.showPhotos!==false} onChange={e=>set("showPhotos",e.target.checked)}/> Show photos publicly</label></div><p>Images used elsewhere are now shown directly in their correct Homepage, Doctors, Services, Procedures and Blogs editors above. This section controls only the public photo gallery.</p>{(data.galleryImages||[]).map((x:any,i:number)=><div className="video-admin-editor" key={i}><ImageField label="Gallery photo" value={x.image||""} onChange={v=>setCollection("galleryImages",i,"image",v)} recommend="1600 × 1000 px, landscape"/><div><input value={x.category||""} onChange={e=>setCollection("galleryImages",i,"category",e.target.value)} placeholder="Category"/><input value={x.title||""} onChange={e=>setCollection("galleryImages",i,"title",e.target.value)} placeholder="Caption"/></div><button type="button" onClick={()=>set("galleryImages",data.galleryImages.filter((_:any,n:number)=>n!==i))}>Remove</button></div>)}<button type="button" className="admin-add" onClick={()=>set("galleryImages",[...(data.galleryImages||[]),{title:"New photo",category:"Clinic",image:""}])}>+ Upload a new photo</button>
   <h4>Videos</h4><div className="check-row"><label><input type="checkbox" checked={data.showVideos} onChange={e=>set("showVideos",e.target.checked)}/> Show videos publicly</label></div><p>Keep this hidden until every title, link and thumbnail has been personally verified.</p>{data.videos.map((x,i)=><div className="video-admin-editor" key={i}><ImageField label="Video thumbnail" value={x.image} onChange={v=>setCollection("videos",i,"image",v)} recommend="1280 × 720 px"/><div><input aria-label="Video category" value={x.category} onChange={e=>setCollection("videos",i,"category",e.target.value)} placeholder="Category"/><input aria-label="Video title" value={x.title} onChange={e=>setCollection("videos",i,"title",e.target.value)} placeholder="Title"/><textarea aria-label="Video summary" value={x.summary} onChange={e=>setCollection("videos",i,"summary",e.target.value)} placeholder="Summary"/><input aria-label="Video URL" value={x.url} onChange={e=>setCollection("videos",i,"url",e.target.value)} placeholder="YouTube or Instagram URL"/></div><button type="button" onClick={()=>set("videos",data.videos.filter((_,n)=>n!==i))}>Remove</button></div>)}<button type="button" className="admin-add" onClick={()=>set("videos",[...data.videos,{category:"Category",title:"New video",summary:"Add the video summary.",url:"",image:""}])}>+ Add video</button>
   <h4>Testimonials</h4><p>Add only reviews you can verify. The public card can show the source and a 4- or 5-star rating.</p>{data.testimonials.map((x:any,i)=><div className="collection-editor compact" key={i}><input aria-label="Patient display name" value={x.name} onChange={e=>setCollection("testimonials",i,"name",e.target.value)} placeholder="Display name"/><input aria-label="Review source" value={x.source||""} onChange={e=>setCollection("testimonials",i,"source",e.target.value)} placeholder="e.g. Google · Verified"/><select aria-label="Review rating" value={x.rating||5} onChange={e=>setCollection("testimonials",i,"rating",e.target.value)}><option value="5">5 stars</option><option value="4">4 stars</option></select><textarea aria-label="Testimonial" value={x.quote} onChange={e=>setCollection("testimonials",i,"quote",e.target.value)} placeholder="Testimonial"/><button type="button" onClick={()=>set("testimonials",data.testimonials.filter((_,n)=>n!==i))}>Remove</button></div>)}<button type="button" className="admin-add" onClick={()=>set("testimonials",[...data.testimonials,{name:"Patient",quote:"Add the verified patient experience here.",source:"Google · Verified",rating:5}])}>+ Add testimonial</button></section>

   <section className="admin-card" id="placement"><h3>Combine content across pages</h3><p>Place the calculators and appointment form on the same page or on separate pages without rebuilding anything.</p><div className="admin-grid"><label>Show all 3 calculators on<select value={data.calculatorPlacement} onChange={e=>set("calculatorPlacement",e.target.value)}>{routes.map(r=><option key={r[0]} value={r[0]}>{r[1]}</option>)}</select></label><label>Show appointment form on<select value={data.appointmentPlacement} onChange={e=>set("appointmentPlacement",e.target.value)}>{routes.map(r=><option key={r[0]} value={r[0]}>{r[1]}</option>)}</select></label></div><p className="admin-note">Selecting the same page clubs both sections together. Contact details remain available through the header, footer and floating icons.</p></section>

   <section className="admin-card" id="navigation"><h3>Navigation visibility</h3><div className="check-row"><label><input type="checkbox" checked={data.navDoctors} onChange={e=>set("navDoctors",e.target.checked)}/> Doctors</label><label><input type="checkbox" checked={data.navSpecialities} onChange={e=>set("navSpecialities",e.target.checked)}/> Specialities</label><label><input type="checkbox" checked={data.navResources} onChange={e=>set("navResources",e.target.checked)}/> Resources</label><label><input type="checkbox" checked={data.navContact} onChange={e=>set("navContact",e.target.checked)}/> Contact</label></div></section>
   <section className="admin-card"><h3>Website visibility</h3><div className="check-row"><label><input type="checkbox" checked={(data as any).websitePrivate===true} onChange={e=>set("websitePrivate" as keyof SiteSettings,e.target.checked)}/> Require approved email and password to view the website</label></div><p className="admin-note">Leave this off when the website should be public. Turn it on for private customer reviews or controlled testing, then save changes.</p></section>
   <div className="admin-savebar"><button className="btn" type="submit">Save and publish changes</button><span className="admin-status" role="status">{status}</span><a href="/" target="_blank">Open public website ↗</a></div>
  </form>

  <AccessManager/>
  <section className="admin-card" id="backup"><h3>Backup and transfer</h3><p>Download a complete editable handover package containing the Next.js source, built-in assets, current website settings, uploaded media and setup instructions. The smaller JSON option remains useful for content-only backups.</p><div className="admin-actions"><button className="admin-export-primary" type="button" onClick={downloadCompleteSite} disabled={downloadStatus.startsWith("Preparing")||downloadStatus.startsWith("Downloading")}>Download complete website ZIP</button><button onClick={exportJson}>Download settings JSON</button><button onClick={()=>importRef.current?.click()}>Import settings JSON</button><input ref={importRef} hidden type="file" accept="application/json" onChange={importJson}/></div>{downloadStatus&&<p className={downloadStatus.startsWith("Download failed")?"export-progress export-error":"export-progress"} role="status">{downloadStatus}</p>}</section>
  <section className="admin-card stack-card" id="stack"><h3>Technology stack</h3><div className="stack-grid"><div><b>Website</b><span>Next.js 16, React 19, TypeScript</span></div><div><b>Hosting runtime</b><span>Cloudflare Workers through Sites</span></div><div><b>Database</b><span>Cloudflare D1 for settings, access and appointments</span></div><div><b>Images</b><span>Cloudflare R2 media storage</span></div><div><b>Admin security</b><span>Independent email/password access with encrypted passwords and revocable sessions</span></div><div><b>Portability</b><span>Complete source, settings and media ZIP plus JSON content backup</span></div></div></section>
  </div>
 </div>
}
