import { notFound } from "next/navigation";
import { getSiteSettings } from "../../../lib/site-settings";

export const dynamic="force-dynamic";
const fallbacks:Record<string,string>={"pcos-can-it-be-cured":"/specializations/gynaecology.webp","fertility-evaluation":"/media/fertility-assessment.webp","first-trimester":"/specializations/pregnancy-care.webp","male-infertility-causes-treatment":"/specializations/fertility-ivf.webp"};

export default async function BlogArticle({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params,s=await getSiteSettings();
 const blog=s.blogs.find((x,i)=>(x.slug||String(i))===slug);
 if(!blog)notFound();
 const heroImage=blog.image||fallbacks[blog.slug]||"/specializations/gynaecology.webp";
 return <article className="blog-article">
  <header className="blog-hero has-blog-image"><div className="blog-hero-copy"><p className="kicker">{blog.category}</p><h1>{blog.title}</h1><p>{blog.heroShort||blog.summary}</p><small>{blog.date} · Doctor-reviewed patient education</small></div><div className="blog-hero-image"><img src={heroImage} alt={blog.title}/></div></header>
  <div className="blog-body">
   <aside><b>In this article</b><a href="#nutshell">In a nutshell</a><a href="#introduction">Introduction</a>{(blog.sections||[]).map((x,i)=><a href={`#section-${i}`} key={i}>{x.heading}</a>)}{blog.faqs?.length>0&&<a href="#questions">Common questions</a>}<a href="#when-to-consult">When to consult</a><a href="#takeaway">Final takeaway</a></aside>
   <main>
    <section id="nutshell" className="nutshell"><p className="kicker">IN A NUTSHELL</p><p>{blog.nutshell}</p></section>
    <section id="introduction"><h2>Introduction</h2><p>{blog.introduction}</p></section>
    {(blog.sections||[]).map((x,i)=><section className="article-content-section" id={`section-${i}`} key={i}><p className="section-number">SECTION {i+1}</p><h2>{x.heading}</h2><p>{x.body}</p>{x.simple&&<blockquote>{x.simple}</blockquote>}</section>)}
    {blog.faqs?.length>0&&<section id="questions"><p className="section-number">COMMON QUESTIONS</p><h2>Questions patients often ask</h2>{blog.faqs.map((x,i)=><details key={i}><summary>{x.q}</summary><p>{x.a}</p></details>)}</section>}
    <section id="when-to-consult"><h2>When should you consult a doctor?</h2><p>{blog.whenToSeek}</p></section>
    <section className="clinic-note"><p className="kicker">AT SHIVA KRUPA POLYCLINIC</p><p>{blog.clinicCta}</p><a className="btn" href="/contact">Book an appointment</a></section>
    <section id="takeaway" className="takeaway"><p className="kicker">FINAL TAKEAWAY</p><blockquote>{blog.takeaway}</blockquote></section>
   </main>
  </div>
 </article>
}
