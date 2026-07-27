"use client";

import { useState } from "react";
import type { SiteSettings } from "../lib/default-settings";
import { PhoneIcon, WhatsAppIcon } from "./icons";

export function Header({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const [submenu,setSubmenu]=useState<"specialities"|"resources"|null>(null);
  const toggleSubmenu=(key:"specialities"|"resources")=>setSubmenu(current=>current===key?null:key);
  const closeMenu=()=>{setOpen(false);setSubmenu(null)};
  return <>
    {settings.showAnnouncementBar===true&&<div className="topbar">{settings.announcement}{settings.announcement&&settings.phone?" · ":""}<a href={`tel:${settings.phoneHref}`}>{settings.phone}</a></div>}
    <header className={`header header-${settings.headerStyle}`}>
      <a className="logo brand-lockup" href="/"><img className="brand-logo-image" src="/clinic-logo.png" alt={`${settings.clinicName} logo`}/><span><b>{settings.clinicName}</b><small>{settings.strapline}</small></span></a>
      <button className="menu-button" aria-label="Toggle menu" aria-expanded={open} onClick={() => {setOpen(!open);setSubmenu(null)}}>{open ? "×" : "☰"}</button>
      <nav className={open ? "nav open" : "nav"} aria-label="Primary">
        <a href="/" onClick={closeMenu}>Home</a>
        {settings.navDoctors&&<a href="/about" onClick={closeMenu}>Doctors</a>}
        {settings.navSpecialities&&<div className={`nav-group ${submenu==="specialities"?"expanded":""}`}><button type="button" aria-expanded={submenu==="specialities"} onClick={()=>toggleSubmenu("specialities")}>Specialities <span aria-hidden="true">⌄</span></button><div className="dropdown">
          <a href="/gynaecology" onClick={closeMenu}>Gynaecology</a><a href="/pregnancy-care" onClick={closeMenu}>Pregnancy Care</a><a href="/fertility-ivf" onClick={closeMenu}>Fertility & IVF</a><a href="/procedures" onClick={closeMenu}>Procedures</a><a href="/general-medicine" onClick={closeMenu}>General Medicine</a>
        </div></div>}
        {settings.navResources&&<div className={`nav-group ${submenu==="resources"?"expanded":""}`}><button type="button" aria-expanded={submenu==="resources"} onClick={()=>toggleSubmenu("resources")}>Resources <span aria-hidden="true">⌄</span></button><div className="dropdown">
          <a href="/blogs" onClick={closeMenu}>{settings.blogNavLabel} & Calculators</a>{(settings.showPhotos||settings.showVideos)&&<a href="/videos" onClick={closeMenu}>Photos & Videos</a>}<a href="/patient-stories" onClick={closeMenu}>Patient Stories</a>
        </div></div>}
        {settings.navContact&&<a href="/contact" onClick={closeMenu}>Contact</a>}
      </nav>
      <a className="btn header-cta" href="/contact">Book an appointment</a>
    </header>
  </>;
}

export function Footer({settings}:{settings:SiteSettings}) {
  const maps=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`;
  return <footer className="footer">
    <div className="footer-shell">
     <div className="footer-brand"><a className="footer-logo" href="/"><img src="/clinic-logo.png" alt={`${settings.clinicName} logo`}/><span><b>{settings.clinicName}</b><small>{settings.strapline}</small></span></a><p>Thoughtful care, clear guidance and continuity at every stage.</p></div>
     <div className="footer-nav"><div><h4>Specialities</h4><a href="/gynaecology">Gynaecology</a><a href="/pregnancy-care">Pregnancy Care</a><a href="/fertility-ivf">Fertility & IVF</a><a href="/general-medicine">General Medicine</a></div><div><h4>Resources</h4><a href="/blogs">{settings.blogNavLabel} & Calculators</a>{(settings.showPhotos||settings.showVideos)&&<a href="/videos">Photos & Videos</a>}<a href="/patient-stories">Patient Stories</a></div></div>
     <div className="footer-contact"><h4>Contact & visit</h4><a className="footer-phone" href={`tel:${settings.phoneHref}`} aria-label={`Call the clinic on ${settings.phone}`}>{settings.phone}</a><p>{settings.address}</p><div><a href="/contact">Book an appointment</a><a href={maps} target="_blank" rel="noreferrer">Directions ↗</a></div></div>
    </div>
    <div className="footer-bottom"><span>© 2026 {settings.clinicName}</span><span>Medical information is educational and not a substitute for consultation.</span></div>
  </footer>;
}

export function FloatingActions({ settings }: { settings: SiteSettings }) {
  const href = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hello Shiva Krupa Polyclinic, I would like to book an appointment. Please share the available slots.")}`;
  return <div className="floating-actions">
    {settings.showFloatingCall&&<a className="floating-action call-action" href={`tel:${settings.phoneHref}`} aria-label={`Call ${settings.clinicName}`}><PhoneIcon/><span>Call</span></a>}
    {settings.showFloatingWhatsapp&&<a className="floating-action whatsapp-action" href={href} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${settings.clinicName}`}><WhatsAppIcon/><span>WhatsApp</span></a>}
  </div>;
}
