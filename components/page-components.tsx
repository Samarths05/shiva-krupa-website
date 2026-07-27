export function PageHero({ eyebrow, title, intro, image, phone, phoneHref, controls }: { eyebrow: string; title: string; intro: string; image: string; phone:string; phoneHref:string; controls?:any }) {
  if(controls?.heroVisible===false)return null;
  const style={"--page-hero-height":`${controls?.heroHeight||600}px`,"--page-title-size":`${controls?.heroTitleSize||76}px`,"--page-intro-size":`${controls?.heroIntroSize||18}px`} as React.CSSProperties;
  return <section className="page-hero" style={style}>
    <div className="page-hero-copy"><p className="kicker">{eyebrow}</p><h1>{title}</h1><p>{intro}</p><div className="hero-buttons"><a className="btn" href="/contact">Book an appointment</a><a className="inline-link clinic-call-link" href={`tel:${phoneHref}`} aria-label={`Call the clinic on ${phone}`}>Speak to the clinic →</a></div></div>
    <div className="page-hero-image"><img src={image} alt="" /></div>
  </section>;
}

export function CTA() {
  return <section className="cta-band"><div><p className="kicker pale">PERSONALISED CARE</p><h2>Have a concern you would like to discuss?</h2></div><div><p>Book a consultation and the clinic team will call to confirm a suitable time.</p><a className="btn btn-light" href="/contact">Book an appointment →</a></div></section>;
}

export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  if (!items.length) return null;
  return <section className="content-section soft"><div className="section-title"><p className="kicker">COMMON QUESTIONS</p><h2>Clear answers, before your visit.</h2></div><div className="faq-list">{items.map(i => <details key={i.q}><summary>{i.q}<span>+</span></summary><p>{i.a}</p></details>)}</div></section>;
}
