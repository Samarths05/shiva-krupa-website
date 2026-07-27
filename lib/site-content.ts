export const clinic = {
  name: "Shiva Krupa Polyclinic",
  strapline: "Women’s Health, Fertility & General Medicine",
  phone: "080 2348 9363",
  phoneHref: "08023489363",
  whatsapp: "919187392697",
  address: "1st Floor, 131/3, 80 Feet Ring Road, KHB Colony, Basaveshwar Nagar, Bengaluru 560079",
  hours: "Monday–Saturday · 10:00 AM–7:00 PM",
};

export const aishwaryaPhoto =
  "/doctors/dr-aishwarya.png";
export const awardPhoto =
  "https://udvyhptpcjclxrjtbzlm.supabase.co/storage/v1/object/public/demo-images/dr-aishwarya-v-mathikatti/1784567377760.png";

export const servicePages: Record<string, {
  eyebrow: string; title: string; intro: string; image: string;
  sections: { title: string; text: string; more?: string }[];
  faqs: { q: string; a: string }[];
}> = {
  "about": {
    eyebrow: "OUR DOCTORS",
    title: "Experience you can trust. Care that feels personal.",
    intro: "Two generations of clinical experience, united by careful listening, honest guidance and continuity of care.",
    image: aishwaryaPhoto,
    sections: [
      { title: "Dr Aishwarya V Mathikatti", text: "Obstetrician, Gynaecologist and Fertility Specialist with 19 years of overall experience, including 13 years as a specialist. She completed her MBBS at M. R. Medical College, Gulbarga, and MS in Obstetrics & Gynaecology at Vydehi Institute of Medical Sciences, Bengaluru. Her advanced training includes a Diploma in Reproductive Medicine from Kiel, Germany (2013), a Masters in Reproductive Medicine from IBC School, Dubai (NHS–UK associated, 2019), and training in ultrasonography, aesthetic and cosmetic gynaecology. Registration No. 82373. Her professional memberships include FOGSI, ISAR, ICOG, FIAMS and FRCOG." },
      { title: "Dr L. P. Nagarajaiah", text: "A Senior General Physician and trusted Family Doctor with 47+ years of experience, he provides considered, compassionate and practical care for common illnesses, preventive health and long-term medical conditions. His approach is grounded in continuity, careful listening and a deep understanding of the families he has served across generations." },
      { title: "Her philosophy of care", text: "I believe every woman deserves compassionate, personalised and evidence-based healthcare at every stage of her life. Whether she is visiting for adolescent or menstrual concerns, pregnancy, infertility or menopause, my goal is to make her feel heard, respected and supported. I understand the challenges involved in the journey to parenthood—emotionally and physically. I am committed to providing a thorough evaluation, clear guidance and an individualised treatment plan using the latest advances in reproductive medicine, while ensuring honest advice and empathetic care." },
      { title: "Why she chose Obstetrics & Gynaecology", text: "Medicine has always been more than a profession to me—it is a calling to care, support and make a meaningful difference in people’s lives. I chose Obstetrics and Gynaecology because it allows me to care for women through every stage of life, from adolescence and reproductive health to pregnancy, childbirth and menopause." },
    ],
    faqs: [],
  },
  "gynaecology": {
    eyebrow: "WOMEN’S HEALTH",
    title: "Gynaecology care that sees the whole person.",
    intro: "From first periods to menopause, receive evidence-led care in a respectful and comfortable setting.",
    image: aishwaryaPhoto,
    sections: [
      { title: "PCOS & irregular periods", text: "Detailed evaluation of cycles, hormones, metabolic health, symptoms and future fertility goals—not a one-size-fits-all prescription.", more:"Assessment may include menstrual history, signs of excess androgen, thyroid and metabolic factors, ultrasound findings when appropriate, and whether pregnancy is currently a goal. Treatment is matched to what matters most: predictable cycles, skin and hair symptoms, metabolic health or fertility." },
      { title: "Endometriosis & pelvic pain", text: "Careful assessment of persistent pain, painful periods and related symptoms, followed by a clear treatment plan.", more:"The consultation considers the pattern of pain, bowel or bladder symptoms, painful intercourse, previous scans and fertility plans. Options can range from symptom control and hormonal treatment to further imaging or minimally invasive evaluation when appropriate." },
      { title: "Fibroids, cysts & infections", text: "Evaluation, monitoring and treatment decisions based on symptoms, imaging and your stage of life.", more:"Not every fibroid or ovarian cyst needs surgery. Size, appearance, pain, bleeding, age and fertility plans help determine whether observation, medicines, further tests or a procedure is the safest next step." },
      { title: "Adolescent & menopause care", text: "Age-appropriate support for menstrual concerns, preventive health, perimenopause and menopause.", more:"Care is private, respectful and adapted to the patient’s stage of life—from first-period concerns and cycle education to hot flushes, sleep changes, bone health and safe treatment choices around menopause." },
    ],
    faqs: [
      { q: "When should I consult a gynaecologist?", a: "Seek advice for persistent pelvic pain, very heavy or irregular bleeding, missed periods, unusual discharge, fertility concerns or symptoms affecting daily life." },
      { q: "Can PCOS be cured permanently?", a: "PCOS is usually managed rather than permanently cured. Symptoms and long-term risks can often be controlled effectively with personalised treatment and lifestyle support." },
      { q: "How often should I have a gynaecology check-up?", a: "The right interval depends on age, symptoms and screening history. A consultation is useful sooner when cycles, pain, discharge or bleeding patterns change." },
      { q: "When is heavy menstrual bleeding a concern?", a: "Consult when bleeding soaks through protection very frequently, lasts longer than usual, causes clots, dizziness or tiredness, or interferes with daily life." },
      { q: "Can menopause symptoms be treated?", a: "Yes. Treatment can include lifestyle measures, non-hormonal options or hormone therapy when appropriate after reviewing symptoms and individual health risks." },
    ],
  },
  "pregnancy-care": {
    eyebrow: "MATERNITY",
    title: "Confident pregnancy care, from the first test to delivery.",
    intro: "Personalised antenatal care with clear explanations, timely screening and continuity through every trimester.",
    image: awardPhoto,
    sections: [
      { title: "Pre-pregnancy counselling", text: "Review health conditions, medicines, nutrition, vaccinations and fertility factors before trying to conceive.", more: "A pre-conception visit helps identify concerns before pregnancy begins. The review can include medical and menstrual history, current medicines, folic acid, vaccination status, thyroid or diabetes risk, previous pregnancies and whether either partner may benefit from further evaluation." },
      { title: "Routine antenatal care", text: "Planned consultations, scans and tests with guidance on nutrition, activity, symptoms and birth preparation.", more: "Care is planned trimester by trimester, with appropriate blood tests, ultrasound scans, blood-pressure and growth monitoring. Each visit is also an opportunity to discuss nutrition, exercise, travel, medicines, common symptoms and preparation for labour and newborn care." },
      { title: "High-risk pregnancy", text: "Closer monitoring for diabetes, hypertension, thyroid conditions, multiple pregnancy, previous complications and other risk factors.", more: "A pregnancy may need additional monitoring because of an existing condition, a complication in the current pregnancy or a previous obstetric history. The plan is individualised and may include more frequent reviews, targeted scans, medication adjustment and coordination with other specialists." },
      { title: "Normal delivery", text: "Preparation and continuity of care supporting a safe vaginal birth whenever clinically appropriate.", more: "Birth planning considers maternal health, the baby’s wellbeing, pregnancy progress and personal concerns. Decisions during labour are guided by safety and the clinical situation." },
      { title: "Caesarean section", text: "Clear counselling and appropriate surgical care when Caesarean birth is the safer option for mother or baby.", more: "A Caesarean may be planned or become necessary during labour. The indication, expected process, recovery and future-pregnancy considerations are explained clearly." },
      { title: "Postnatal support", text: "Recovery, breastfeeding guidance, contraception and follow-up after delivery.", more: "Postnatal care reviews physical recovery, bleeding, wound healing, blood pressure, emotional wellbeing, breastfeeding concerns and contraception. It also creates space to discuss sleep, nutrition and symptoms that should not be dismissed after delivery." },
    ],
    faqs: [
      { q: "When should the first pregnancy visit happen?", a: "Book after a positive pregnancy test, and sooner if you have pain, bleeding, previous pregnancy complications or an existing medical condition." },
      { q: "Which symptoms during pregnancy need urgent attention?", a: "Heavy bleeding, severe abdominal pain, fainting, persistent vomiting, fever, severe headache, reduced fetal movement later in pregnancy or fluid leakage require prompt medical advice." },
      { q: "How many scans are needed during pregnancy?", a: "Scan timing depends on the pregnancy and medical history. Common milestones include an early dating scan, first-trimester screening and an anomaly scan, with additional scans when clinically needed." },
      { q: "Can I continue my regular medicines after becoming pregnant?", a: "Do not stop essential medicine suddenly, but arrange an early review because some medicines are continued, changed or adjusted during pregnancy." },
    ],
  },
  "fertility-ivf": {
    eyebrow: "FERTILITY",
    title: "Fertility care with clarity—not pressure.",
    intro: "A structured evaluation and honest discussion of options, timelines and expected outcomes for both partners.",
    image: aishwaryaPhoto,
    sections: [
      { title: "Fertility evaluation", text: "A focused review of ovulation, ovarian reserve, tubes, uterus and semen factors to identify what needs attention.", more: "Evaluation begins with both partners and is guided by age, how long you have been trying, cycle pattern and previous treatment. Tests are selected purposefully and may include ultrasound, ovarian reserve assessment, tubal evaluation and semen analysis—not every patient needs every test." },
      { title: "Ovulation support", text: "Cycle tracking and medically appropriate ovulation induction with careful monitoring.", more: "When ovulation is irregular or absent, treatment may combine cycle tracking, lifestyle and metabolic review, and carefully selected medication. Monitoring helps confirm response, guide timing and reduce avoidable risks rather than relying on medication alone." },
      { title: "Follicular monitoring", text: "Ultrasound-led tracking of follicle development and ovulation to guide natural conception, medication or fertility treatment.", more: "Monitoring can assess response to ovulation medicines, identify the likely ovulation window and support safer, better-timed treatment decisions." },
      { title: "IUI & IVF guidance", text: "Understand when assisted reproduction may help, what it involves and how to choose the right next step.", more: "The consultation explains where IUI or IVF may fit, expected steps, likely timelines, limitations and alternatives. Recommendations are based on the couple’s clinical findings and priorities; assisted reproduction is not automatically the first option." },
      { title: "Recurrent pregnancy loss", text: "Thoughtful evaluation of possible contributing factors with sensitive counselling and a plan for future pregnancy.", more: "The review considers pregnancy history, uterine factors, selected hormonal, genetic or clotting concerns when clinically indicated, and the health of both partners. The aim is to avoid unnecessary testing while creating a clear monitoring and care plan for the next pregnancy." },
    ],
    faqs: [
      { q: "When should we seek fertility advice?", a: "Usually after 12 months of trying if the woman is under 35, or after 6 months if 35 or older. Consult earlier for irregular cycles, known conditions or previous treatment." },
      { q: "Does a fertility consultation always lead to IVF?", a: "No. Many couples need assessment, cycle guidance, treatment of an underlying condition or simpler options before IVF is considered." },
      { q: "Are both partners evaluated?", a: "Yes. Fertility depends on factors affecting either partner, so a structured evaluation commonly includes menstrual and ovulation assessment alongside semen analysis." },
      { q: "Does age affect fertility treatment options?", a: "Age influences egg quantity and quality, timelines and expected outcomes. Early assessment helps patients make informed choices without assuming advanced treatment is immediately necessary." },
      { q: "How long does a fertility evaluation take?", a: "Many initial tests can be completed within one menstrual cycle, although the exact timeline depends on cycle regularity, previous reports and which investigations are appropriate." },
    ],
  },
  "procedures": {
    eyebrow: "TREATMENTS & PROCEDURES",
    title: "The right pathway begins with the right diagnosis.",
    intro: "Understand when medicines, monitoring, IUI, IVF, surgery or another pathway may be considered—and why treatment is always individualised.",
    image: awardPhoto,
    sections: [
      { anchor:"fertility-assessment", title: "Fertility assessment", text: "A structured evaluation of both partners before choosing any fertility treatment.", more: "This may be considered when pregnancy is taking longer than expected, cycles are irregular, there is a known reproductive condition or previous treatment has not worked. The assessment may review ovulation, ovarian reserve, the uterus and tubes, semen factors and relevant medical history. The outcome may be reassurance, timed intercourse, treatment of an underlying issue, ovulation support, IUI or IVF—not automatically advanced treatment." },
      { anchor:"ovulation-support", title: "Ovulation induction", text: "Medication and monitoring to support predictable ovulation when clinically appropriate.", more: "Ovulation induction may be considered when ovulation is irregular or absent, including in selected patients with PCOS. Treatment is planned around diagnosis, age and fertility goals, and may involve ultrasound or hormonal monitoring. It is not suitable for every fertility factor and should be prescribed and monitored rather than self-started." },
      { anchor:"iui", title: "IUI — Intrauterine insemination", text: "Prepared sperm is placed inside the uterus close to ovulation in a carefully timed cycle.", more: "IUI may be considered in selected cases such as unexplained infertility, mild male-factor concerns, ovulation problems or when donor sperm is legally and clinically appropriate. It usually requires at least one usable fallopian tube and an individual assessment of sperm parameters, age and treatment history. It may not be the right choice for severe tubal disease or significant sperm-factor concerns." },
      { anchor:"ivf-icsi", title: "IVF & ICSI", text: "Eggs are collected and fertilised in a laboratory before an embryo is transferred to the uterus.", more: "IVF or ICSI may be considered for blocked or damaged tubes, significant male-factor infertility, reduced ovarian reserve, endometriosis, repeated treatment failure, genetic indications or when simpler options are unlikely to help. The plan can include ovarian stimulation, egg retrieval, fertilisation, embryo culture and transfer. Expected success, risks, costs and alternatives should be discussed for the individual couple." },
      { anchor:"embryo-transfer", title: "Embryo transfer & frozen cycles", text: "A selected embryo is placed in the uterus during a fresh or carefully prepared frozen cycle.", more: "A frozen embryo transfer may be considered after embryo freezing, when transfer is deferred for medical reasons, or during a later attempt. Preparation depends on cycle regularity, the uterine lining, previous treatment and the clinical plan. The number and timing of embryos transferred are decided according to medical guidance and applicable regulations." },
      { anchor:"surrogacy-guidance", title: "Surrogacy eligibility & referral guidance", text: "Clinical and regulatory guidance when carrying a pregnancy is medically impossible or unsafe.", more: "Surrogacy is not a routine alternative to IVF and is strictly regulated in India. It may be explored only after specialist evaluation identifies a recognised medical indication and the intending parent or couple meets the applicable legal eligibility, certification and clinic requirements. Commercial surrogacy is prohibited. The clinic can explain the medical pathway and arrange appropriate legal or registered-centre guidance; eligibility cannot be promised through a website enquiry." },
      { anchor:"pcos-management", title: "PCOS/PCOD management", text: "Treatment is matched to cycle concerns, metabolic health, skin symptoms and fertility goals.", more: "The care plan may include lifestyle and metabolic assessment, cycle regulation, treatment for acne or excess hair, endometrial protection and ovulation support when pregnancy is desired. Ultrasound appearance alone does not determine treatment, and not everyone with PCOS needs fertility procedures." },
      { anchor:"high-risk-pregnancy", title: "High-risk pregnancy care", text: "Additional monitoring and coordinated care when maternal or pregnancy factors increase risk.", more: "Closer care may be considered with diabetes, hypertension, thyroid disorders, multiple pregnancy, previous complications, maternal age concerns or findings in the current pregnancy. The plan may include targeted scans, laboratory monitoring, medication review and coordination with maternal-fetal medicine or other specialists." },
      { anchor:"menopause-care", title: "Menopause care", text: "Individual support for symptoms, sexual health, bone health and long-term risk assessment.", more: "Management may include lifestyle measures, vaginal treatments, non-hormonal medicines or menopausal hormone therapy when appropriate. Decisions depend on symptoms, age, medical history, time since menopause and individual risks. Preventive care may also address bone, breast and cardiovascular health." },
      { anchor:"functional-aesthetic-gynaecology", title: "Functional & aesthetic gynaecology", text: "Confidential assessment before considering treatment for intimate or post-delivery concerns.", more: "Symptoms such as discomfort, dryness, laxity concerns, scarring or changes after childbirth require a clinical assessment before any procedure is recommended. Options may include pelvic-floor support, medical treatment, non-surgical approaches or surgery in selected cases. The consultation should cover realistic outcomes, evidence, recovery, risks and alternatives." },
      { anchor:"male-fertility-evaluation", title: "Male fertility evaluation", text: "Focused review of semen factors, health conditions, medicines and lifestyle influences.", more: "This may be considered when conception is delayed, semen analysis is abnormal or there is a history of testicular, hormonal, sexual or medical concerns. Evaluation may include repeat semen analysis under correct conditions and targeted specialist tests. Treatment can range from addressing a reversible factor to IUI, IVF or ICSI guidance." },
      { anchor:"copper-t", title: "Copper-T insertion & removal", text: "Counselling, insertion and removal of a Copper-T intrauterine contraceptive when clinically appropriate.", more: "The consultation reviews contraceptive goals, menstrual history, suitability, expected bleeding changes, warning signs and follow-up." },
      { anchor:"endometrial-biopsy", title: "Endometrial biopsy", text: "A small sample from the uterine lining may be taken to investigate selected bleeding or endometrial concerns.", more: "The reason for testing, preparation, discomfort, aftercare and expected results are discussed beforehand." },
      { anchor:"colposcopy", title: "Colposcopy", text: "A closer examination of the cervix following selected screening findings or persistent symptoms.", more: "Magnification is used to assess the cervix and a small biopsy may be taken when indicated. An abnormal screening result does not automatically mean cancer." },
      { anchor:"ultrasound-services", title: "Ultrasound services", text: "Gynaecology, fertility and pregnancy ultrasound assessment when clinically indicated and available.", more: "The appropriate scan depends on the clinical question and stage of the menstrual cycle or pregnancy. Availability should be confirmed while booking." },
    ],
    faqs: [
      { q: "When is IUI usually considered?", a: "IUI may be considered for unexplained infertility, ovulation problems, mild male-factor infertility, cervical factors or when donor sperm is clinically and legally appropriate. At least one fallopian tube generally needs to be open, and the overall decision also depends on age, ovarian reserve and treatment history." },
      { q: "If sperm motility is low, can we consider IUI?", a: "Possibly, when the reduction is mild and enough progressively motile sperm remain after laboratory preparation. Markedly low count or motility, very poor morphology or repeated unsuccessful IUI may make IVF with ICSI more appropriate. A semen report should be interpreted by a fertility specialist rather than by one number alone." },
      { q: "What sperm count is needed for IUI?", a: "There is no single cut-off that guarantees success. Clinics consider the total motile sperm count before and especially after washing, along with motility, morphology and the female partner’s factors. Lower numbers generally reduce the chance of success and may change the recommended pathway." },
      { q: "How many IUI cycles should we try before considering IVF?", a: "Many couples reassess after about three well-timed cycles, although fewer or more may be reasonable depending on age, ovarian reserve, diagnosis, sperm factors and previous treatment. Continuing repeatedly without reviewing the chance of success can waste valuable time." },
      { q: "When may IVF be recommended instead of IUI?", a: "IVF may be considered with blocked or severely damaged tubes, significant male-factor infertility, reduced ovarian reserve, moderate-to-severe endometriosis, advanced reproductive age, genetic indications or unsuccessful simpler treatment. It is not automatically the first treatment for every couple." },
      { q: "What is the difference between IVF and ICSI?", a: "In conventional IVF, eggs and sperm are placed together for fertilisation. With ICSI, an embryologist injects one selected sperm into an egg. ICSI is commonly considered for significant sperm problems, previous fertilisation failure or certain laboratory indications; it is not necessarily required for every IVF cycle." },
      { q: "Does low AMH mean I must immediately undergo IVF?", a: "No. AMH mainly helps estimate ovarian reserve and likely response to stimulation; it does not by itself measure egg quality or predict natural pregnancy. Age, ultrasound follicle count, cycle pattern, tubes, semen factors and how long you have been trying must be considered together." },
      { q: "Can PCOS be treated with ovulation induction instead of IVF?", a: "Often, yes. When irregular or absent ovulation is the main problem and other fertility factors are reassuring, monitored ovulation induction may be an appropriate first step. The medicine, dose and monitoring plan should be individualised to reduce risks such as multiple pregnancy or excessive ovarian response." },
      { q: "Do both partners need fertility testing?", a: "Yes. Evaluating both partners early avoids unnecessary delay and treatment. The initial assessment may include menstrual and ovulation history, ovarian reserve or ultrasound when appropriate, tubal assessment and semen analysis." },
      { q: "Do blocked fallopian tubes always require IVF?", a: "The answer depends on whether one or both tubes are affected, where the blockage is, whether hydrosalpinx is present, age and other fertility factors. Bilateral significant tubal blockage commonly leads to IVF consideration, while selected findings may need confirmation or surgical discussion first." },
      { q: "When is a frozen embryo transfer considered?", a: "Frozen transfer may be planned after embryos were cryopreserved, when a fresh transfer is medically deferred, after genetic testing, or during a later attempt. Preparation may follow a natural or medicated cycle depending on ovulation, uterine lining and the clinical plan." },
      { q: "Is IVF guaranteed to work?", a: "No fertility treatment can guarantee pregnancy or live birth. Chances vary with age, egg and sperm factors, embryo development, uterine health, diagnosis and previous treatment. A responsible consultation should discuss realistic personalised expectations rather than only headline success rates." },
      { q: "When should a couple seek a fertility evaluation?", a: "Typically after 12 months of trying when the woman is under 35, after 6 months when she is 35 or older, and sooner with irregular periods, pelvic pain, known endometriosis, previous pelvic surgery, recurrent pregnancy loss, sexual difficulties or known male-factor concerns." },
      { q: "How will I know whether a procedure is necessary?", a: "The diagnosis, alternatives, expected benefit, limitations, risks and likely outcome should be explained before you decide. Not every fertility or gynaecological concern requires a procedure." },
      { q: "What should I ask before starting treatment?", a: "Ask why the treatment is being recommended, what alternatives exist, expected success for your situation, medicines and monitoring required, risks, total cost, cancellation criteria, embryo or sample storage, recovery and what happens if the first attempt is unsuccessful." },
    ],
  },
  "general-medicine": {
    eyebrow: "GENERAL MEDICINE",
    title: "Experienced everyday care for the whole family.",
    intro: "Practical, attentive medical care from Dr L. P. Nagarajaiah, Senior General Physician with 47+ years of experience.",
    image: "/doctors/dr-nagarajaiah.jpg",
    sections: [
      { title: "General consultations", text: "Assessment and treatment for fever, infections, respiratory symptoms, digestive complaints, weakness and common acute illnesses.", more: "The consultation looks beyond a single symptom by reviewing its duration, associated signs, current medicines and relevant medical history. Investigations are advised when they are likely to clarify the diagnosis or change treatment." },
      { title: "Diabetes, BP & thyroid", text: "Long-term monitoring, medication review, preventive advice and coordination of care when specialist input is needed.", more: "Regular reviews bring together home readings, laboratory results, symptoms, adherence and medicine tolerance. The goal is steady long-term control, early identification of complications and timely specialist referral when required." },
      { title: "Preventive health", text: "Health-risk review, age-appropriate screening advice and practical guidance for maintaining wellbeing.", more: "Preventive care is tailored to age, family history, lifestyle and existing conditions. It may include guidance on appropriate screening, vaccination, weight, sleep, activity and cardiovascular or metabolic risk—without unnecessary blanket testing." },
      { title: "Continuity of care", text: "A familiar physician who understands your history and helps coordinate ongoing treatment.", more: "Long-term continuity reduces fragmented treatment and repeated explanations. Previous illnesses, investigations, medicine responses and specialist recommendations can be considered together when planning each next step." },
    ],
    faqs: [
      { q: "When should a fever be evaluated by a doctor?", a: "Seek medical advice when fever is persistent, very high, associated with breathing difficulty, severe weakness, dehydration, confusion, rash or significant underlying illness." },
      { q: "How often should blood pressure and diabetes be reviewed?", a: "Review frequency depends on current readings, medicines and complications. Stable patients still benefit from regular monitoring rather than waiting for symptoms." },
      { q: "Can I consult for several health concerns in one visit?", a: "Yes. Bring your medicine list and recent reports so the doctor can prioritise concerns and create a practical follow-up plan." },
      { q: "When is high blood pressure an emergency?", a: "Very high readings accompanied by chest pain, severe headache, breathlessness, weakness, confusion, vision changes or neurological symptoms require urgent assessment. A single unexpected reading without symptoms should still be repeated correctly and discussed promptly." },
      { q: "How often should thyroid tests be repeated?", a: "It depends on the diagnosis, medicine changes, symptoms, pregnancy status and previous results. After a dose adjustment, testing is commonly repeated after enough time has passed for levels to stabilise; stable patients may need less frequent monitoring." },
      { q: "Should I take antibiotics for a cold or cough?", a: "Most uncomplicated colds are viral and do not benefit from antibiotics. Examination is useful when symptoms are severe, persistent, worsening, associated with breathing difficulty or occur in someone with significant underlying illness." },
      { q: "What reports should I bring for a diabetes review?", a: "Bring recent glucose readings, HbA1c and other laboratory reports, your complete medicine list, details of low-sugar episodes and any eye, kidney, foot or cardiovascular evaluations available." },
      { q: "Can several medicines interact with each other?", a: "Yes. Prescription medicines, painkillers, supplements and herbal products can interact or duplicate effects. Carry an updated list to every consultation and avoid stopping long-term treatment without medical advice." },
      { q: "When should unexplained weakness or tiredness be investigated?", a: "Seek assessment when fatigue is persistent, limits daily activity or occurs with weight change, fever, breathlessness, palpitations, bleeding, sleep problems or other new symptoms. The evaluation is guided by history and examination rather than a blanket panel of tests." },
    ],
  },
};

export const posts = [
  { slug: "pcos-can-it-be-cured", category: "PCOS", title: "Can PCOS be cured?", summary: "What treatment can—and cannot—do, and why thyroid testing may matter when weight gain is a concern.", date: "July 2026" },
  { slug: "fertility-evaluation", category: "Fertility", title: "When should you consider a fertility evaluation?", summary: "A calm guide to timelines, common tests and what to expect during your first visit.", date: "July 2026" },
  { slug: "first-trimester", category: "Pregnancy", title: "Your first trimester: what is normal?", summary: "Common symptoms, important check-ups and warning signs that should never be ignored.", date: "June 2026" },
];
