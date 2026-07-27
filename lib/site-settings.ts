import { defaultSettings } from "./default-settings";
import { localExportSettings } from "./local-settings.generated";
export { defaultSettings };
export type { SiteSettings } from "./default-settings";

export async function getSiteSettings(){
  const local=localExportSettings&&Object.keys(localExportSettings).length?localExportSettings:{};
  const localOrDefault=()=>normalise(
    Object.keys(local).length
      ?{...defaultSettings,...local,pages:{...defaultSettings.pages,...((local as any).pages||{})}}
      :defaultSettings,
    (local as any).faqExpansionVersion||1
  );
  try {
    const { env } = await import("cloudflare:workers");
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS site_settings (id INTEGER PRIMARY KEY, data TEXT NOT NULL DEFAULT '{}', updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
    const row = await env.DB.prepare("SELECT data FROM site_settings WHERE id = 1").first<{data:string}>();
    if (!row?.data) return localOrDefault();
    const saved = JSON.parse(row.data);
    if(!saved.homeBlogImagePreferenceVersion){saved.showBlogImagesHome=false;saved.homeBlogImagePreferenceVersion=1}
    if(!saved.homeHeroSizeVersion){saved.homeHeroTitleSize=66;saved.homeHeroSizeVersion=1}
    if(!saved.calculatorMoveVersion){saved.calculatorPlacement="blogs";saved.calculatorMoveVersion=1}
    if(!saved.consultationSlotsVersion){saved.consultationSlots=defaultSettings.consultationSlots;saved.consultationSlotsVersion=1}
    if(!saved.conditionsVersion){
      saved.conditions=defaultSettings.conditions;
      const order=[...(saved.homeSectionOrder||defaultSettings.homeSectionOrder)];
      if(!order.includes("conditions")) order.splice(Math.max(0,order.indexOf("awards")),0,"conditions");
      saved.homeSectionOrder=order;saved.showConditions=true;saved.conditionsVersion=1;
    }
    if(!saved.blogFourVersion){
      const current=saved.blogs||[];
      saved.blogs=[...current,...defaultSettings.blogs.filter((item:any)=>!current.some((x:any)=>x.slug===item.slug))];
      saved.blogFourVersion=1;
    }
    if((saved.instagramVideoVersion||0)<3){
      saved.videos=defaultSettings.videos;
      saved.instagramVideoVersion=3;
    }
    if((saved.instagramVideoVersion||0)<4){
      saved.videos=(saved.videos||defaultSettings.videos).filter((video:any)=>video.title!=="When should you check your fertility?");
      saved.instagramVideoVersion=4;
    }
    if(!saved.verifiedReviewsVersion){
      saved.testimonials=defaultSettings.testimonials;
      saved.verifiedReviewsVersion=1;
    }
    if(!saved.procedurePathwaysVersion){
      saved.pages={...(saved.pages||{}),procedures:{
        ...((saved.pages||{}).procedures||{}),
        eyebrow:defaultSettings.pages.procedures.eyebrow,
        title:defaultSettings.pages.procedures.title,
        intro:defaultSettings.pages.procedures.intro,
        sections:defaultSettings.pages.procedures.sections,
      }};
      saved.procedurePathwaysVersion=1;
    }
    if(!saved.procedureFaqsVersion){
      saved.pages={...(saved.pages||{}),procedures:{...((saved.pages||{}).procedures||{}),faqs:defaultSettings.pages.procedures.faqs}};
      saved.procedureFaqsVersion=1;
    }
    if((saved.mediaVisibilityVersion||0)<2){saved.showPhotos=true;saved.showVideos=true;saved.mediaVisibilityVersion=2}
    if(!saved.physicianFaqsVersion){
      saved.pages={...(saved.pages||{}),"general-medicine":{...((saved.pages||{})["general-medicine"]||{}),faqs:defaultSettings.pages["general-medicine"].faqs}};
      saved.physicianFaqsVersion=1;
    }
    if(!saved.blogStructureVersion){
      saved.blogs=(saved.blogs||defaultSettings.blogs).map((blog:any)=>{
        const base=defaultSettings.blogs.find((item:any)=>item.slug===blog.slug);
        return base?{...blog,sections:(blog.sections||[]).length?blog.sections:base.sections,faqs:(blog.faqs||[]).length?blog.faqs:base.faqs}:blog;
      });
      saved.blogStructureVersion=1;
    }
    if((saved.doctorApprovedContentVersion||0)<2){
      const approvedPage=(slug:string)=>{
        const approved=(defaultSettings.pages as any)[slug], existing=(saved.pages||{})[slug]||{};
        const old=existing.sections||[];
        return {...existing,eyebrow:approved.eyebrow,title:approved.title,intro:approved.intro,
          sections:approved.sections.map((section:any)=>{
            const previous=old.find((item:any)=>item.title===section.title);
            return previous?.image?{...section,image:previous.image}:section;
          }),faqs:approved.faqs};
      };
      saved.clinicName=defaultSettings.clinicName;
      saved.strapline=defaultSettings.strapline;
      saved.email=defaultSettings.email;
      saved.pages={...(saved.pages||{}),about:approvedPage("about"),
        "pregnancy-care":approvedPage("pregnancy-care"),
        "fertility-ivf":approvedPage("fertility-ivf"),
        procedures:approvedPage("procedures")};
      saved.doctorApprovedContentVersion=2;
    }
    if((saved.doctorPhotoVersion||0)<1){
      saved.pages={...(saved.pages||{}),about:{
        ...((saved.pages||{}).about||{}),
        image:"/doctors/dr-aishwarya.png",
        sections:((saved.pages||{}).about?.sections||defaultSettings.pages.about.sections).map((section:any,index:number)=>
          index===0?{...section,image:"/doctors/dr-aishwarya.png"}:section
        ),
      }};
      saved.doctorPhotoVersion=1;
    }
    return normalise({...defaultSettings,...saved,pages:{...defaultSettings.pages,...(saved.pages||{})}},saved.faqExpansionVersion||0);
  } catch {
    return localOrDefault();
  }
}

function normalise(settings:any,faqVersion:number){
  const specializationImages=Object.fromEntries(Object.entries(settings.specializationImages||{}).map(([key,value])=>[
    key,
    typeof value==="string"&&value.startsWith("/specializations/")?value.replace(/\.png$/,".webp"):value,
  ]));
  const pages=Object.fromEntries(Object.entries(settings.pages||{}).map(([slug,page]:any)=>{
   const defaultFaqs=(defaultSettings.pages as any)[slug]?.faqs||[];
   const savedFaqs=page.faqs||[];
   const faqs=faqVersion<1?[...savedFaqs,...defaultFaqs.filter((d:any)=>!savedFaqs.some((x:any)=>x.q===d.q))]:savedFaqs;
   const defaultSections=(defaultSettings.pages as any)[slug]?.sections||[];
   const sections=(settings.serviceDetailsVersion||0)<3?(page.sections||[]).map((item:any)=>({...item,more:item.more||defaultSections.find((x:any)=>x.title===item.title)?.more||""})):(page.sections||[]);
   return [slug,{
    heroVisible:true,heroHeight:600,heroTitleSize:76,heroIntroSize:18,
    contentVisible:true,contentPadding:100,sectionTitleSize:64,
    cardTitleSize:27,cardTextSize:12,faqsVisible:true,ctaVisible:true,
    ...page,faqs,sections,
   }];
  }));
  return {...settings,specializationImages,faqExpansionVersion:1,serviceDetailsVersion:3,pages};
}
