import { CTA } from "../../components/page-components";
import { getSiteSettings } from "../../lib/site-settings";
import MediaGallery from "../../components/media-gallery";
export const metadata={title:"Photos & Videos"};
export default async function Videos(){const s=await getSiteSettings();return <><section className="editorial-hero"><p className="kicker">CLINIC GALLERY</p><h1>Photos & videos.</h1><p>A visual introduction to the clinic and its approach to patient care.</p></section><MediaGallery images={(s as any).galleryImages||[]} videos={s.videos||[]} showPhotos={(s as any).showPhotos!==false} showVideos={s.showVideos!==false}/><CTA/></>}
