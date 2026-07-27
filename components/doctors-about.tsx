import { aishwaryaPhoto } from "../lib/site-content";
import { CTA } from "./page-components";
import type { SiteSettings } from "../lib/default-settings";

export default function DoctorsAbout({settings}:{settings:SiteSettings}){
 const page=settings.pages.about;
 const a=page.sections[0],father=page.sections[1];
 const philosophy=page.sections[2],motivation=page.sections[3];
 const aishwaryaBiography=a?.text?.replace(/\s*Registration No\.\s*82373\.?/i,"").trim();
 const c=page as any;
 return <>
  {c.heroVisible!==false&&<section className="editorial-hero doctors-heading page-controlled-about-hero" style={{"--page-hero-height":`${settings.aboutHeroHeight||420}px`,"--page-title-size":`${c.heroTitleSize||76}px`,"--page-intro-size":`${c.heroIntroSize||18}px`} as React.CSSProperties}><p className="kicker">{page.eyebrow}</p><h1>{page.title}</h1><p>{page.intro}</p></section>}
  {c.contentVisible!==false&&<section className="content-section doctors-list page-controlled-content" style={{"--page-section-padding":`${c.contentPadding||100}px`,"--page-card-title":`${c.cardTitleSize||27}px`,"--page-card-text":`${c.cardTextSize||12}px`} as React.CSSProperties}>
   <article className="doctor-profile primary-doctor">
    <div className="doctor-photo"><img src={(a as any)?.image||page.image||aishwaryaPhoto} alt="Dr Aishwarya V Mathikatti"/></div>
    <div className="doctor-copy"><p className="kicker">OBSTETRICIAN · GYNAECOLOGIST · FERTILITY SPECIALIST</p><h2>{a?.title||"Dr Aishwarya V Mathikatti"}</h2><p className="doctor-credentials">MBBS · MS (Obstetrics & Gynaecology) · Diploma in Reproductive Medicine, Kiel, Germany (2013) · Masters in Reproductive Medicine, IBC Dubai (2019)<span className="registration-line">Registration No. <strong>82373</strong></span></p><p>{aishwaryaBiography}</p><div className="doctor-facts"><span><b>19+</b> years overall</span><span><b>13+</b> years as specialist</span><span><b>International</b> fertility training</span></div><a className="btn doctor-booking-cta" href="/contact?doctor=aishwarya">Book an appointment with Dr Aishwarya</a></div>
   </article>
   <article className="doctor-profile">
    <div className="doctor-photo father-photo"><img src={(father as any)?.image||"/doctors/dr-nagarajaiah.jpg"} alt="Dr L. P. Nagarajaiah"/></div>
    <div className="doctor-copy"><p className="kicker">SENIOR GENERAL PHYSICIAN · FAMILY DOCTOR</p><h2>{father?.title||"Dr L. P. Nagarajaiah"}</h2><p className="doctor-credentials">MBBS · Government Medical College, Bellary (1979)<span className="registration-line">Registration No. <strong>17248</strong></span></p><p>{father?.text}</p><div className="doctor-facts"><span><b>47+</b> years’ experience</span><span><b>General Medicine</b> and family care</span><span><b>Continuity</b> across generations</span></div><a className="btn doctor-booking-cta" href="/contact?doctor=nagarajaiah">Book an appointment with Dr Nagarajaiah</a></div>
   </article>
  </section>}
  {c.contentVisible!==false&&(philosophy||motivation)&&<section className="content-section doctor-philosophy">
   <div className="philosophy-heading"><p className="kicker">HER APPROACH</p><h2>Care that begins with listening.</h2><p>Clinical expertise matters most when every woman feels understood, informed and supported.</p></div>
   <div className="philosophy-stack">
    {philosophy&&<article className="philosophy-statement"><span className="quote-mark quote-open" aria-hidden="true">“</span><div><p className="philosophy-label">HER PHILOSOPHY OF CARE</p><blockquote>{philosophy.text}</blockquote><p className="philosophy-signature">Dr Aishwarya V Mathikatti</p></div><span className="quote-mark quote-close" aria-hidden="true">”</span></article>}
    {motivation&&<article className="philosophy-story"><div className="story-ornament" aria-hidden="true"><span>WHY</span><i/></div><div><p className="philosophy-label">A CALLING TO CARE</p><h3>{motivation.title}</h3><p>{motivation.text}</p></div></article>}
   </div>
  </section>}
  {c.ctaVisible!==false&&<CTA/>}
 </>;
}
