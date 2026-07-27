"use client";
import { useState } from "react";
export default function MediaGallery({images,videos,showPhotos=true,showVideos=true}:{images:any[];videos:any[];showPhotos?:boolean;showVideos?:boolean}){
 const [allPhotos,setAllPhotos]=useState(false),[allVideos,setAllVideos]=useState(false);
 const availableVideos=videos.filter(v=>v.url||v.image);
 return <section className="content-section media-page">
  {showPhotos&&<div className="media-section" id="photos"><div className="wide-heading"><div><p className="kicker">PHOTO GALLERY</p><h2>A closer look at our clinic and care.</h2></div></div>
   <div className="gallery-grid">{images.slice(0,allPhotos?images.length:6).map((x,i)=>x.image?<figure key={`${x.title}-${i}`}><img src={x.image} alt={x.title}/><figcaption><small>{x.category}</small><b>{x.title}</b></figcaption></figure>:null)}</div>
   {images.length>6&&<button className="media-more" onClick={()=>setAllPhotos(!allPhotos)}>{allPhotos?"Show fewer photos":"View more photos"}</button>}
   {!images.some(x=>x.image)&&<p className="empty-media">Photos can be uploaded directly from the private Content Studio.</p>}
  </div>}
  {showVideos&&<div className="media-section" id="videos"><div className="wide-heading"><div><p className="kicker">VIDEOS & INSTAGRAM</p><h2>Health information, explained simply.</h2></div><a className="inline-link" href="https://www.instagram.com/dr.aishwarya02/" target="_blank" rel="noreferrer">Follow Dr Aishwarya on Instagram ↗</a></div>
   <div className="video-grid">{availableVideos.slice(0,allVideos?availableVideos.length:6).map((v,i)=>{const instagram=v.url?.includes("instagram.com");return <article className={instagram?"instagram-media-card":""} key={`${v.title}-${i}`}>{v.url?<a className="video-placeholder" href={v.url} target="_blank" rel="noreferrer" aria-label={`Open ${v.title}${instagram?" on Instagram":""}`} style={v.image?{backgroundImage:`linear-gradient(180deg,rgba(55,20,36,.02),rgba(55,20,36,.28)),url(${v.image})`,backgroundSize:"cover",backgroundPosition:"center"}:{}}><span aria-hidden="true">▶</span></a>:<div className="video-placeholder" style={v.image?{backgroundImage:`url(${v.image})`,backgroundSize:"cover"}:{}}><span>▶</span></div>}<small>{v.category}</small><h3>{v.title}</h3><p>{v.summary}</p>{instagram&&<a className="instagram-link" href={v.url} target="_blank" rel="noreferrer">Watch on Instagram ↗</a>}</article>})}</div>
   {availableVideos.length>6&&<button className="media-more" onClick={()=>setAllVideos(!allVideos)}>{allVideos?"Show fewer videos":"View more videos"}</button>}
   {!availableVideos.length&&<p className="empty-media">Videos can be added from the private Content Studio.</p>}
  </div>}
 </section>
}
