"use client";

type ConditionItem = {
  condition: string;
  anchor: string;
  category: string;
};

export default function ConditionsRail({items}:{items:ConditionItem[]}){
  const loop=[...items,...items];
  return <div className="conditions-viewport" aria-label="Conditions we treat">
    <div className="conditions-track">
      {loop.map((item,index)=><a className="condition-card" key={`${item.condition}-${index}`} href={`/procedures?focus=${encodeURIComponent(item.anchor)}#${item.anchor}`} aria-hidden={index>=items.length} tabIndex={index>=items.length?-1:undefined}>
        <span className="condition-label"><small>{item.category}</small><h3>{item.condition}</h3></span>
        <span className="condition-arrow" aria-hidden="true">↗</span>
      </a>)}
    </div>
  </div>;
}
