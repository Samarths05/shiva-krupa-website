"use client";
export default function StoriesCarousel({items}:{items:any[]}){
 const loop=[...items,...items];
 return <div className="stories-viewport" aria-label="Patient stories"><div className="stories-track">{loop.map((x,i)=><blockquote key={`${x.name}-${i}`}><span>{"★".repeat(x.rating||5)}</span><p>“{x.quote}”</p><cite>— {x.name}{x.source?` · ${x.source}`:", Bengaluru"}</cite></blockquote>)}</div></div>
}
