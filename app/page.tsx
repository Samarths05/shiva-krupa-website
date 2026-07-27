import { aishwaryaPhoto, awardPhoto } from "../lib/site-content";
import { CTA } from "../components/page-components";
import { getSiteSettings } from "../lib/site-settings";
import Calculators from "../components/calculators";
import AppointmentForm from "../components/appointment-form";
import ConditionsRail from "../components/conditions-rail";

const services = [
  ["01", "Gynaecology", "Respectful, evidence-led care through every stage of a woman’s life.", "/gynaecology","gynaecology"],
  ["02", "Pregnancy Care", "Continuity from pre-conception and the first trimester through delivery.", "/pregnancy-care","pregnancy-care"],
  ["03", "Fertility & IVF", "Clear evaluation and honest guidance without rushing into treatment.", "/fertility-ivf","fertility-ivf"],
  ["04", "General Medicine", "Experienced care for everyday and long-term health needs.", "/general-medicine","general-medicine"],
];

const conditionDetails:Record<string,{anchor:string;category:string;summary:string;pathways:string[]}>={
  "pcos/pcod":{anchor:"pcos-management",category:"Hormonal health",summary:"Irregular cycles, acne, excess hair, weight or metabolic concerns and fertility planning.",pathways:["Evaluation","Cycle care","Ovulation support"]},
  "vaginal tightening":{anchor:"functional-aesthetic-gynaecology",category:"Functional gynaecology",summary:"Private assessment of functional, post-delivery or intimate-health concerns before discussing appropriate options.",pathways:["Clinical review","Non-surgical options","Procedure guidance"]},
  "menopause care":{anchor:"menopause-care",category:"Midlife health",summary:"Support for hot flushes, sleep, vaginal health, bone health and changing long-term health risks.",pathways:["Health review","Symptom care","Preventive screening"]},
  "high-risk pregnancy":{anchor:"high-risk-pregnancy",category:"Pregnancy care",summary:"Closer planning and monitoring when medical history or the current pregnancy needs additional attention.",pathways:["Risk assessment","Targeted monitoring","Coordinated care"]},
  "infertility evaluation":{anchor:"fertility-assessment",category:"Fertility",summary:"A structured assessment of both partners before deciding whether simple treatment, IUI or IVF may be appropriate.",pathways:["Ovulation support","IUI","IVF / ICSI"]},
  "male infertility":{anchor:"male-fertility-evaluation",category:"Fertility",summary:"Evaluation of semen factors, health and lifestyle influences, with focused referral or treatment guidance.",pathways:["Semen analysis","Medical review","ART guidance"]},
};

export default async function Home() {
  const s = await getSiteSettings();
  const blocks:Record<string,React.ReactNode>={
    intro:s.showIntro?<section className="content-section doctor-intro home-intro-controlled" style={{"--home-section-heading":`${s.homeIntroHeadingSize}px`,"--home-section-body":`${s.homeIntroBodySize}px`} as React.CSSProperties}><div className="section-title"><p className="kicker">LED BY DR AISHWARYA</p><h2>Advanced care.<br/><em>Genuinely personal.</em></h2></div><div className="prose"><p className="quote">“Every woman deserves to feel heard, respected and supported—never rushed through her care.”</p><p>Dr Aishwarya is an Obstetrician, Gynaecologist and Fertility Specialist with 19 years of experience. She combines careful clinical judgement with clear explanations and treatment shaped around each patient.</p><a className="inline-link" href="/about">Read her full profile →</a></div></section>:null,
    services:s.showServices?<section className={`content-section soft service-layout-${s.servicesLayout} home-services-controlled`} style={{"--home-section-heading":`${s.homeServicesHeadingSize}px`,"--home-card-heading":`${s.homeServiceCardTitleSize}px`,"--home-card-body":`${s.homeServiceCardBodySize}px`} as React.CSSProperties}><div className="wide-heading"><div><p className="kicker">SPECIALIST CARE</p><h2>One clinic. Care for every chapter.</h2></div><p>Choose a speciality to understand symptoms, consultation options and how we can help.</p></div><div className="service-cards">{services.map(x => <a className="service-tile service-tile-with-image" href={x[3]} key={x[1]}><img src={(s.specializationImages as any)?.[x[4]]} alt=""/><div><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p><b>Explore care →</b></div></a>)}</div></section>:null,
    conditions:s.showConditions?<section className="conditions-section"><div className="conditions-heading"><div><p className="kicker">CARE PATHWAYS</p><h2>Conditions we treat</h2></div><p>Select a concern to view its evaluation and treatment options.</p></div><ConditionsRail items={s.conditions.map((condition:string)=>{const meta=conditionDetails[condition.toLowerCase()]||{anchor:"diagnostic-procedures",category:"Specialist care"};return {condition,anchor:meta.anchor,category:meta.category}})}/></section>:null,
    awards:s.showAwards?<section className="recognition home-awards-controlled" style={{"--home-section-heading":`${s.homeAwardsHeadingSize}px`,"--home-section-body":`${s.homeAwardsBodySize}px`} as React.CSSProperties}><div className="recognition-photo"><img src={awardPhoto} alt="Dr Aishwarya at the Indian Medical Awards" /></div><div className="recognition-copy"><p className="kicker pale">RECOGNISED EXCELLENCE</p><h2>Clinical excellence,<br/><em>grounded in compassion.</em></h2><p>International training, continued learning and recognition for contributions to women’s health—all brought back to everyday patient care.</p><ul><li>Diploma in Reproductive Medicine · Kiel, Germany (2013)</li><li>Masters in Reproductive Medicine · IBC, Dubai (2019)</li><li>Best Women’s Health Advancement · Indian Medical Awards 2025</li><li>Best Paper Award · ICUOG</li><li>Dr P. N. Tandon Award · Dr S. N. Daftary Award</li></ul></div></section>:null,
    insights:s.showInsights?<section className="content-section home-insights-controlled" style={{"--home-section-heading":`${s.homeInsightsHeadingSize}px`,"--home-card-heading":`${s.homeBlogCardTitleSize}px`,"--home-card-body":`${s.homeBlogCardBodySize}px`} as React.CSSProperties}><div className="wide-heading"><div><p className="kicker">HEALTH INSIGHTS</p><h2>Evidence-led guidance for informed health decisions.</h2></div><a className="inline-link" href="/blogs">View all insights →</a></div><div className="post-grid post-grid-four">{s.blogs.slice(0,4).map((p,i) => <a href={`/blogs/${p.slug||i}`} className="post-card blog-card" key={`${p.title}-${i}`}>{s.showBlogImagesHome&&p.image&&<img src={p.image} alt=""/>}<span>{p.category}</span><h3>{p.title}</h3><p>{p.summary}</p><small>{p.date} · Read article →</small></a>)}</div></section>:null,
  };
  return <>
    <section className={`home-hero hero-${s.heroLayout}`} style={{"--home-hero-title":`${s.homeHeroTitleSize}px`,"--home-hero-subtitle":`${s.homeHeroSubtitleSize}px`,"--home-hero-copy-width":`${s.homeHeroTextWidth}%`,"--home-image-x":`${s.homeHeroImageX}%`,"--home-image-y":`${s.homeHeroImageY}%`,"--hero-overlay":s.homeHeroOverlay/100} as React.CSSProperties}>
      <div className="home-copy"><p className="kicker">WOMEN’S HEALTH · FERTILITY · FAMILY MEDICINE</p><h1>{s.heroTitle}</h1><p className="lead">{s.heroSubtitle}</p><div className="hero-buttons"><a className="btn" href="/contact">Book an appointment</a><a className="inline-link" href="/about">Meet our doctors →</a></div><div className="metrics"><div><b>19+</b><span>Years · Dr Aishwarya</span></div><div><b>47+</b><span>Years · Dr Nagarajaiah</span></div><div><b>4.9★</b><span>Patient rating</span></div></div></div>
      <div className="home-image"><img src={s.heroImage || aishwaryaPhoto} alt="Dr Aishwarya V Mathikatti" /><div className="image-badge"><b>Internationally trained</b><span>Kiel, Germany · IBC, Dubai</span></div></div>
    </section>
    {s.homeSectionOrder.map((key:string)=><div key={key}>{blocks[key]}</div>)}
    {s.calculatorPlacement==="home"&&<section className="content-section calculator-section"><Calculators/></section>}
    {s.appointmentPlacement==="home"&&<section className="content-section embedded-booking"><AppointmentForm settings={s}/></section>}
    <CTA />
  </>;
}
