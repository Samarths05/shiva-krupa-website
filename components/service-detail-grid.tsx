"use client";

import { useEffect, useState } from "react";

type ServiceItem = {
  anchor?: string;
  title: string;
  text: string;
  more?: string;
  image?: string;
};

export default function ServiceDetailGrid({ items }: { items: ServiceItem[] }) {
  const [active, setActive] = useState<ServiceItem | null>(null);

  useEffect(()=>{
    const anchor=new URLSearchParams(window.location.search).get("focus")||window.location.hash.slice(1);
    if(!anchor)return;
    const selected=items.find(item=>item.anchor===anchor);
    if(selected){
      setActive(selected);
      requestAnimationFrame(()=>document.getElementById(anchor)?.scrollIntoView({behavior:"smooth",block:"center"}));
    }
  },[items]);

  useEffect(() => {
    if (!active) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setActive(null);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", close);
    };
  }, [active]);

  return <>
    <div className="detail-grid">
      {items.map((item, index) => <article id={item.anchor} key={`${item.title}-${index}`}>
        {item.image && <img className="service-card-image" src={item.image} alt=""/>}
        <span>0{index + 1}</span>
        <h3>{item.title}</h3>
        <p>{item.text}</p>
        {item.more && <button className="service-more-button" type="button" onClick={() => setActive(item)}>
          Read more <b aria-hidden="true">↗</b>
        </button>}
      </article>)}
    </div>

    {active && <div className="service-modal-backdrop" role="presentation" onMouseDown={() => setActive(null)}>
      <section className="service-modal" role="dialog" aria-modal="true" aria-labelledby="service-modal-title" onMouseDown={event => event.stopPropagation()}>
        <button className="service-modal-close" type="button" aria-label="Close" onClick={() => setActive(null)}>×</button>
        <p className="kicker">PERSONALISED CARE</p>
        <h2 id="service-modal-title">{active.title}</h2>
        <p className="service-modal-intro">{active.text}</p>
        <div className="service-modal-more">{active.more}</div>
        <div className="service-modal-actions">
          <a className="btn" href="/contact">Book an appointment</a>
          <button type="button" onClick={() => setActive(null)}>Continue browsing</button>
        </div>
      </section>
    </div>}
  </>;
}
