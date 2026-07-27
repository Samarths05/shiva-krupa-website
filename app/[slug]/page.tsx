import { notFound } from "next/navigation";
import { CTA, FAQ, PageHero } from "../../components/page-components";
import { servicePages } from "../../lib/site-content";
import DoctorsAbout from "../../components/doctors-about";
import Calculators from "../../components/calculators";
import AppointmentForm from "../../components/appointment-form";
import ServiceDetailGrid from "../../components/service-detail-grid";
import { getSiteSettings } from "../../lib/site-settings";

export function generateStaticParams() { return Object.keys(servicePages).map(slug => ({ slug })); }

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const settings=await getSiteSettings();
  const page = settings.pages[slug] || servicePages[slug];
  if (!page) notFound();
  if (slug === "about") return <><DoctorsAbout settings={settings}/>{settings.calculatorPlacement==="about"&&<section className="content-section calculator-section"><Calculators/></section>}{settings.appointmentPlacement==="about"&&<section className="content-section embedded-booking"><AppointmentForm settings={settings}/></section>}</>;
  return <>
    <PageHero eyebrow={page.eyebrow} title={page.title} intro={page.intro} image={(settings.specializationImages as any)?.[slug]||page.image} phone={settings.phone} phoneHref={settings.phoneHref} controls={page}/>
    {(page as any).contentVisible!==false&&<section className={`content-section service-layout-${settings.servicesLayout} page-controlled-content ${slug==="procedures"?"procedure-pathways":""}`} style={{"--page-section-padding":`${(page as any).contentPadding||100}px`,"--page-section-title":`${(page as any).sectionTitleSize||64}px`,"--page-card-title":`${(page as any).cardTitleSize||27}px`,"--page-card-text":`${(page as any).cardTextSize||12}px`} as React.CSSProperties}><div className="section-title"><p className="kicker">{slug==="procedures"?"TREATMENTS & PROCEDURES":"HOW WE CAN HELP"}</p><h2>{slug==="procedures"?"Treatment pathways, clearly explained.":"Care built around your needs."}</h2></div><ServiceDetailGrid items={page.sections}/></section>}
    {(page as any).faqsVisible!==false&&<FAQ items={page.faqs} />}
    {settings.calculatorPlacement===slug&&<section className="content-section calculator-section"><Calculators/></section>}
    {settings.appointmentPlacement===slug&&<section className="content-section embedded-booking"><div className="wide-heading"><div><p className="kicker">BOOK A VISIT</p><h2>Book an appointment.</h2></div><p>The clinic team will contact you to confirm a suitable time.</p></div><AppointmentForm settings={settings}/></section>}
    {(page as any).ctaVisible!==false&&<CTA />}
  </>;
}
