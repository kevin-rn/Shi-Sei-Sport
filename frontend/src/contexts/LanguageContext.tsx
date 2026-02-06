import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Language = 'nl' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get from localStorage or default to Dutch
    const saved = localStorage.getItem('language') as Language;
    return saved && (saved === 'nl' || saved === 'en') ? saved : 'nl';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    // Update HTML lang attribute
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    // Set initial HTML lang attribute
    document.documentElement.lang = language;
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    const translations = language === 'en' ? translationsEn : translationsNl;
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Translation objects
const translationsNl: Record<string, string> = {
  // Navigation
  'nav.home': 'HOME',
  'nav.about': 'Over Ons',
  'nav.team': 'Het Team',
  'nav.history': 'Historie',
  'nav.info': 'INFORMATIE',
  'nav.schedule': 'Rooster',
  'nav.pricing': 'Tarieven',
  'nav.exam': 'Examen Eisen',
  'nav.news': 'Nieuws',
  'nav.contact': 'CONTACT',
  'nav.trial': 'GRATIS PROEFLES',
  
  // Hero
  'hero.founded': 'Opgericht in 1950',
  'hero.title': 'Judo',
  'hero.subtitle': 'SHI-SEI SPORT',
  'hero.description': 'De oudste judo club van Den Haag',
  'hero.text': 'Wij geven judo les op maandag, woensdag, donderdag en zaterdag. Ervaar de kracht van discipline, respect en zelfvertrouwen in onze dojo.',
  'hero.button': 'Probeer een Proefles →',
  'hero.scheduleButton': 'Rooster & Agenda',
  
  // News
  'news.latest': 'Laatste Nieuws',
  'news.all': 'Alle nieuws',
  'news.readMore': 'Lees meer',
  'news.clickToRead': 'Klik om het volledige bericht te lezen...',
  'news.loading': 'Laden...',
  'news.notFound': 'Nieuws niet gevonden',
  'news.back': 'Terug naar nieuws',
  'news.backAll': 'Terug naar alle nieuws',
  'news.noNews': 'Er is nog geen nieuws beschikbaar.',
  'news.title': 'Laatste Nieuws',
  'news.description': 'Blijf op de hoogte van het laatste nieuws en evenementen bij Shi-Sei Sport.',
  
  // Schedule
  'schedule.title': 'Lessen & Schema',
  'schedule.subtitle': 'Trainingsrooster',
  'schedule.description': 'Wij geven judo les op maandag, woensdag, donderdag en zaterdag',
  'schedule.loading': 'Rooster laden...',
  'schedule.error': 'Kon het rooster niet laden. Probeer het later opnieuw.',
  'schedule.retry': 'Opnieuw proberen',
  'schedule.noClasses': 'Er zijn nog geen lessen ingepland.',
  
  // Contact
  'contact.title': 'Neem Contact Op',
  'contact.subtitle': 'Contact',
  'contact.description': 'Heeft u vragen? Wij staan voor u klaar! Vul het formulier in of neem direct contact met ons op.',
  'contact.info': 'Contactgegevens',
  'contact.address': 'Adres',
  'contact.phone': 'Telefoon',
  'contact.email': 'Email',
  'contact.hours': 'Trainingsuren',
  'contact.hoursText': 'Maandag, Woensdag, Donderdag en Zaterdag',
  'contact.scheduleLink': 'rooster pagina',
  'contact.formTitle': 'Stuur een Bericht',
  'contact.name': 'Naam',
  'contact.subject': 'Onderwerp',
  'contact.message': 'Bericht',
  'contact.send': 'Verstuur Bericht',
  'contact.success': 'Bedankt voor uw bericht! Wij nemen zo spoedig mogelijk contact met u op.',
  'contact.subjectOptions.proefles': 'Gratis Proefles',
  'contact.subjectOptions.inschrijving': 'Inschrijving',
  'contact.subjectOptions.vraag': 'Algemene Vraag',
  'contact.subjectOptions.anders': 'Anders',
  'contact.subjectSelect': 'Selecteer een onderwerp',
  
  // Team
  'team.title': 'Ons Team',
  'team.subtitle': 'Het Team',
  'team.description': 'Ontmoet onze ervaren en gepassioneerde trainers die zich inzetten voor uw ontwikkeling in judo.',
  'team.cta': 'Interesse in Training?',
  'team.ctaText': 'Kom langs voor een gratis proefles en maak kennis met ons team!',
  'team.button': 'Boek een Gratis Proefles',
  
  // History
  'history.since': 'SINDS 1950',
  'history.title': 'Onze Rijke Geschiedenis',
  
  // Sectie 1: De Oprichting
  'history.section1.title': 'De Oprichting (1950)',
  'history.section1.p1': 'In november 1950 werd JUDOVERENIGING SHI-SEI opgericht. Een aantal enthousiaste judoka\'s van Johan v.d. Bruggen uit de Zoutmanstraat wilden een eigen club. Een club waar men goedkoper en ook meer kon trainen.',
  'history.section1.p2': 'Onder leiding van Jacques Brakel, Hans van Diggelen en nog enkele anderen, werd op 5 november 1950 de Judovereniging SHI-SEI geboren, aangemeld bij de Kamer van Koophandel en bij de Nederlandse Amateur Judo Associatie aangesloten.',
  'history.section1.p3': 'In de beginperiode werd geoefend in een gymzaal aan de Daal en Bergselaan, maar al vrij snel verhuisde men naar een permanente dojo in de Jan Hendrikstraat 9. Hier kon naar hartelust worden geoefend en zorgde de NAJA-bondstrainer Tokio Hirano, 6e dan, voor verbetering van de technieken. Er kon nu 7 dagen in de week worden getraind en desnoods de gehele dag. Het duurde dan ook niet lang of de trainingen brachten resultaat.',
  'history.section1.tokioHiranoLink': 'https://judoinfo.com/hirano/#:~:text=Tokio%20Hirano:%20The%20Man%20Who%20Revolutionized%20Judo%20%7C%20Judo%20Info.%20Judo%20Info.%20Online%20Dojo.',
  'history.section1.p4': 'Wil Wagner was de eerste zwartebandhouder van de club. Op een judo-zomerschool in Zwitserland ontving hij uit handen van grootmeester Hanno Rhi de fel begeerde band. Kort daarna behaalde Jan v.d. Toorn als tweede ook de 1e dan graad (zwarte band). Zij beiden waren in de beginperiode de technische leiding op de mat, aangevuld met bruine banden die fungeerden als oefenmeester op de diverse avonden.',
  'history.section1.p5': 'De organisatorische leiding onder aanvoering van voorzitter Jacques Brakel zorgde dat de club ook in dat opzicht uitstekend draaide. Zwarte- en bruine banden werden ingeschreven voor Oefenmeester- en scheidsrechterscursussen en zorgden op die wijze voor de nodige "know-how".',
  
  // Highlight Box: Groei in de Jaren Zestig
  'history.growth.title': 'Groei in de Jaren Zestig',
  'history.growth.description': 'In de jaren zestig was SHI-SEI een toonaangevende club in Den Haag en een geduchte tegenstander op de mat. Steeds groter werd het ledenaantal en ook het kader breidde zich al maar uit.',
  'history.growth.didYouKnow': 'Wist je dat SHI-SEI de moederclub werd van vele Haagse judoclubs zoals Lu-Gia-Jen, Guan-Tsui, Huan-Pi, De Doorkruiers, Guan Lin, Kagawa en Sumeju? Wil Wagner was de grondlegger van de meeste van deze clubs.',

  // Sectie 2: Succesvolle Judoka's
  'history.section2.title': 'Succesvolle Judoka\'s',
  'history.section2.p1': 'Honderden zwartebandhouders heeft de club inmiddels afgeleverd waaronder een aantal bijzonder goede wedstrijdjudoka zoals Wil Tap, Jan Hendriks, Jaap Zoutendijk, Jan Dotinga, Kees Toonen, Koos Tap, Koos Letterie, Wim Lut, Giel Groos, Beb de Waal, Nico Schoemaker, Koos v.d. Mark, Wil Wagner, Jan v.d. Toorn, Ed Beekink, Wim de Rooy, Barry Oudshoorn, Henk Ammerlaan, John Lut en nog vele anderen.',

  // Sectie 3: Wederopstanding & Nieuwe Locaties
  'history.section3.title': 'Wederopstanding & Nieuwe Locaties',
  'history.section3.p1': 'In 1970 ging de vereniging bijna ter ziele omdat een aantal leden op een buitengewone ledenvergadering het voltallige bestuur aan de kant zette. Dit liep uit op een falicante mislukking.',
  'history.section3.p2': 'Doch in 1972 werd onder de bezielende leiding van Wim Lut een nieuw bestuur gevormd en werd vooral door vestigingen in het Westland de club weer nieuw leven ingeblazen. Dit had echter tot gevolg dat de accommodatie veel te klein werd en niet meer voldeed aan de eisen van die tijd.',
  'history.section3.p3': 'Eindelijk in 1981 kreeg men door toedoen van wethouders Piet Vink en Adrie Duivestein de beschikking over een ruime accommodatie in de oude school aan de Nieuwe Schoolstraat 22-B.',
  'history.section3.p4': 'Hier hebben we de beschikking over een ruime oefenzaal, twee ruime douche-gelegenheden, kantoor, Kantine, kleine oefenzaal en heel veel bergruimte. In deze ruimte hebben we nu niet alleen judo maar ook al sinds 1990 een taekwondo-afdeling met diverse eigen-kweek 1e en 2e dans. Ook een dart-afdeling zorgt voor de nodige gezelligheid.',

  // Sectie 4: Verhuizingen & Recente Historie
  'history.section4.title': 'Verhuizingen & Recente Historie',
  'history.section4.p1': 'Helaas kwam in 2006 aan onze mooie eigen locatie een einde toen de gemeente besloot om ons huur contract op te zeggen om een drietal luxe woningen te bouwen op de plek van onze prachtige locatie. We konden helaas geen eigen nieuwe locatie vinden die wij konden bekostigen.',
  'history.section4.p2': 'Wij besloten gebruik te maken van een buurthuis in de Fluitenbergstraat te Den Haag en een gymzaal aan de Beresteinlaan te Den Haag. In 2011 werd ontmoetingscentrum Morgenstond onze nieuwe locatie en werd de Gymzaal aan de Beresteinlaan wederom noodgedwongen ingeruild voor een mooiere gymzaal aan de Pachtersdreef.',
  'history.section4.p3': 'Vanaf 2011 tot aan de corona crisis in 2020 gaven wij 6 dagen per week judo en taekwondo lessen. Ons ledental was gestaagd gegroeid naar ongeveer 140 judoleden en 40 taekwondoleden.',
  'history.section4.p4': 'Vanaf 16 maart 2020 waren wij noodgedwongen te sluiten voor een korte periode i.v.m. met de corona virus infectie. Maar inmiddels zijn we weer op volle toeren hardop aan het trainen.',
  
  'history.timeline.title': 'Tijdlijn',
  'history.stats.title': 'Vandaag de dag',
  'history.stats.members': 'Leden',
  'history.stats.region': 'Locatie',
  'history.stats.city': 'Den Haag',
  
  'history.milestones.1950.title': 'Oprichting',
  'history.milestones.1950.description': 'Start aan de Daal en Bergselaan.',
  'history.milestones.1960.title': 'Gouden Jaren',
  'history.milestones.1960.description': 'Moederclub van vele Haagse verenigingen.',
  'history.milestones.1980.title': 'Nieuwe Schoolstraat',
  'history.milestones.1980.description': 'Verhuizing naar de iconische dojo (1981).',
  'history.milestones.2011.title': 'Morgenstond',
  'history.milestones.2011.description': 'Nieuwe locatie aan de Pachtersdreef.',
  'history.milestones.2025.title': 'Heden',
  'history.milestones.2025.description': 'Nog steeds actief in Den Haag met 100+ leden.',
  
  // Pricing
  'pricing.title': 'Lidmaatschap & Tarieven',
  'pricing.subtitle': 'Tarieven',
  'pricing.description': 'Transparante prijzen voor iedereen.',
  'pricing.popular': 'Populair',
  'pricing.month': 'per maand',
  
  // Plans
  'pricing.plans.youth.name': 'Jeugd (t/m 12 jaar)',
  'pricing.plans.youth.price': '€27,50',
  'pricing.plans.youth.f1': 'Onbeperkt trainen',
  'pricing.plans.youth.f2': 'Toegang tot alle jeugdlessen',
  'pricing.plans.youth.f3': 'Examen mogelijkheden',
  'pricing.plans.youth.f4': 'Gratis judo pak t/m 17 jaar',
  
  'pricing.plans.adults.name': 'Volwassenen',
  'pricing.plans.adults.price': '€27,50',
  'pricing.plans.adults.f1': '2x per week trainen',
  'pricing.plans.adults.f2': 'Toegang tot alle lessen',
  'pricing.plans.adults.f3': 'Examen mogelijkheden',

  'pricing.year': 'per jaar',
  'pricing.plans.youth.yearly': '€330,-',
  'pricing.plans.adults.yearly': '€330,-',

  // Extra Info
  'pricing.ooievaarspas': 'Met de ooievaarspas tot 100% korting op de contributie mogelijk',
  'pricing.cta.title': 'Gratis Proefles',
  'pricing.cta.desc': 'Probeer eerst een gratis proefles voordat u zich inschrijft. Geen verplichtingen!',
  'pricing.cta.button': 'Boek een Gratis Proefles',
  
  // Exam
  'exam.title': 'Examen Eisen',
  'exam.subtitle': 'Examen Eisen',
  'exam.description': 'Overzicht van de exameneisen voor elke bandgraad. Bereid je goed voor op je volgende examen.',
  'exam.minAge': 'Minimale Leeftijd',
  'exam.minAgeValue': 'Vanaf 6 jaar',
  'exam.theory': 'Theorie',
  'exam.theoryValue': 'Kennis van technieken en regels',
  'exam.practice': 'Praktijk',
  'exam.practiceValue': 'Demonstratie van technieken',
  'exam.required': 'Vereiste Technieken:',
  'exam.info': 'Belangrijke Informatie',
  
  // Trial
  'trial.title': 'Boek een Gratis Proefles',
  'trial.subtitle': 'Gratis Proefles',
  'trial.description': 'Probeer judo bij Shi-Sei Sport. Geen verplichtingen, gewoon komen en ervaren!',
  'trial.benefits': 'Wat krijg je bij een proefles?',
  'trial.benefit1': 'Gratis en zonder verplichtingen',
  'trial.benefit2': 'Kennis maken met onze trainers',
  'trial.benefit3': 'Ervaren van onze trainingsstijl',
  'trial.benefit4': 'Informatie over lidmaatschap',
  'trial.benefit5': 'Direct kunnen starten met trainen',
  'trial.days': 'Trainingsdagen',
  'trial.daysText': 'Maandag, Woensdag, Donderdag en Zaterdag',
  'trial.scheduleLink': 'Bekijk volledige rooster',
  'trial.bring': 'Wat mee te nemen?',
  'trial.bring1': 'Comfortabele sportkleding',
  'trial.bring2': 'Waterfles',
  'trial.bring3': 'Handdoek (optioneel)',
  'trial.bring4': 'Judo-gi wordt de eerste keer geleend',
  'trial.forWho': 'Voor wie?',
  'trial.forWhoText': 'Iedereen vanaf 6 jaar is welkom! Of je nu beginner bent of al ervaring hebt, we hebben lessen voor alle niveaus.',
  'trial.formTitle': 'Boek je Proefles',
  'trial.age': 'Leeftijd',
  'trial.experience': 'Ervaring',
  'trial.experienceOptions.beginner': 'Beginner',
  'trial.experienceOptions.some': 'Enige ervaring',
  'trial.experienceOptions.advanced': 'Gevorderd',
  'trial.preferredDay': 'Voorkeur trainingsdag',
  'trial.preferredDayOptions.maandag': 'Maandag',
  'trial.preferredDayOptions.woensdag': 'Woensdag',
  'trial.preferredDayOptions.donderdag': 'Donderdag',
  'trial.preferredDayOptions.zaterdag': 'Zaterdag',
  'trial.preferredDayOptions.none': 'Geen voorkeur',
  'trial.message': 'Opmerkingen (optioneel)',
  'trial.messagePlaceholder': 'Heb je vragen of specifieke wensen?',
  'trial.button': 'Boek Gratis Proefles',
  'trial.success': 'Bedankt voor je aanmelding!',
  'trial.successText': 'We hebben je aanvraag ontvangen en nemen binnen 24 uur contact met je op om een geschikt tijdstip te plannen.',
  'trial.disclaimer': 'Door te boeken ga je akkoord met onze privacy policy. We nemen binnen 24 uur contact met je op.',
  
  // Footer
  'footer.club': 'Shi-Sei Sport',
  'footer.description': 'De oudste judo club van Den Haag. Judo lessen sinds 1950.',
  'footer.quickLinks': 'Snelle Links',
  'footer.contact': 'Contact',
  'footer.contactText': 'Voor vragen of meer informatie, neem contact met ons op via de contactpagina.',
  'footer.copyright': 'Alle rechten voorbehouden.',
  'footer.privacy': 'Privacy Policy',
  'footer.rules': 'Huishoudelijke Regels',
  'footer.terms': 'Algemene Voorwaarden',
  
  // Common
  'common.loading': 'Laden...',
  'common.required': '*',
  'common.select': 'Selecteer',
  'common.optional': '(optioneel)',
  
  // 404
  '404.title': 'Pagina niet gevonden',
  '404.description': 'De pagina die u zoekt bestaat niet of is verplaatst.',
  '404.home': 'Naar Homepage',
  '404.back': 'Terug',
};

const translationsEn: Record<string, string> = {
  // Navigation
  'nav.home': 'HOME',
  'nav.about': 'About Us',
  'nav.team': 'The Team',
  'nav.history': 'History',
  'nav.info': 'INFORMATION',
  'nav.schedule': 'Schedule',
  'nav.pricing': 'Pricing',
  'nav.exam': 'Exam Requirements',
  'nav.news': 'News',
  'nav.contact': 'CONTACT',
  'nav.trial': 'FREE TRIAL',
  
  // Hero
  'hero.founded': 'Founded in 1950',
  'hero.title': 'Judo',
  'hero.subtitle': 'SHI-SEI SPORT',
  'hero.description': 'The oldest judo club in The Hague',
  'hero.text': 'We teach judo on Monday, Wednesday, Thursday and Saturday. Experience the power of discipline, respect and self-confidence in our dojo.',
  'hero.button': 'Try a Trial Lesson →',
  'hero.scheduleButton': 'Schedule & Agenda',
  
  // News
  'news.latest': 'Latest News',
  'news.all': 'All news',
  'news.readMore': 'Read more',
  'news.clickToRead': 'Click to read the full article...',
  'news.loading': 'Loading...',
  'news.notFound': 'News not found',
  'news.back': 'Back to news',
  'news.backAll': 'Back to all news',
  'news.noNews': 'No news available yet.',
  'news.title': 'Latest News',
  'news.description': 'Stay up to date with the latest news and events at Shi-Sei Sport.',
  
  // Schedule
  'schedule.title': 'Lessons & Schedule',
  'schedule.subtitle': 'Training Schedule',
  'schedule.description': 'We teach judo on Monday, Wednesday, Thursday and Saturday',
  'schedule.loading': 'Loading schedule...',
  'schedule.error': 'Could not load schedule. Please try again later.',
  'schedule.retry': 'Try again',
  'schedule.noClasses': 'No classes scheduled yet.',
  
  // Contact
  'contact.title': 'Contact Us',
  'contact.subtitle': 'Contact',
  'contact.description': 'Have questions? We are here for you! Fill out the form or contact us directly.',
  'contact.info': 'Contact Information',
  'contact.address': 'Address',
  'contact.phone': 'Phone',
  'contact.email': 'Email',
  'contact.hours': 'Training Hours',
  'contact.hoursText': 'Monday, Wednesday, Thursday and Saturday',
  'contact.scheduleLink': 'schedule page',
  'contact.formTitle': 'Send a Message',
  'contact.name': 'Name',
  'contact.subject': 'Subject',
  'contact.message': 'Message',
  'contact.send': 'Send Message',
  'contact.success': 'Thank you for your message! We will contact you as soon as possible.',
  'contact.subjectOptions.proefles': 'Free Trial',
  'contact.subjectOptions.inschrijving': 'Registration',
  'contact.subjectOptions.vraag': 'General Question',
  'contact.subjectOptions.anders': 'Other',
  'contact.subjectSelect': 'Select a subject',
  
  // Team
  'team.title': 'Our Team',
  'team.subtitle': 'The Team',
  'team.description': 'Meet our experienced and passionate trainers who are committed to your development in judo.',
  'team.cta': 'Interested in Training?',
  'team.ctaText': 'Come by for a free trial lesson and meet our team!',
  'team.button': 'Book a Free Trial',
  
  'history.since': 'SINCE 1950',
  'history.title': 'Our Rich History',
  
  // Section 1: The Foundation
  'history.section1.title': 'The Foundation (1950)',
  'history.section1.p1': 'In November 1950, JUDO ASSOCIATION SHI-SEI was founded. A group of enthusiastic judokas from Johan v.d. Bruggen in the Zoutmanstraat wanted their own club. A place where they could train more often and at a lower cost.',
  'history.section1.p2': 'Led by Jacques Brakel, Hans van Diggelen and several others, Judo Association SHI-SEI was born on November 5, 1950, registered with the Chamber of Commerce and affiliated with the Dutch Amateur Judo Association.',
  'history.section1.p3': 'Initially, training took place in a gym on Daal en Bergselaan, but the club soon moved to a permanent dojo at Jan Hendrikstraat 9. Here, members could train to their heart\'s content, and NAJA national trainer Tokio Hirano, 6th dan, ensured the improvement of techniques. Training was now possible seven days a week, all day if necessary. It didn\'t take long for the training to yield results.',
  'history.section1.tokioHiranoLink': 'https://judoinfo.com/hirano/#:~:text=Tokio%20Hirano:%20The%20Man%20Who%20Revolutionized%20Judo%20%7C%20Judo%20Info.%20Judo%20Info.%20Online%20Dojo.',
  'history.section1.p4': 'Wil Wagner was the club\'s first black belt holder. At a judo summer school in Switzerland, he received the coveted belt from grandmaster Hanno Rhi. Shortly after, Jan v.d. Toorn also achieved the 1st dan grade (black belt) as the second member. Both of them provided the technical leadership on the mat during the early period, supplemented by brown belts who acted as instructors on various evenings.',
  'history.section1.p5': 'The organizational leadership under chairman Jacques Brakel ensured the club ran excellently in that regard as well. Black and brown belts were enrolled in Instructor and referee courses, thus providing the necessary "know-how".',

  // Highlight Box: Growth in the Sixties
  'history.growth.title': 'Growth in the Sixties',
  'history.growth.description': 'In the sixties, SHI-SEI was a leading club in The Hague and a formidable opponent on the mat. The membership grew steadily larger and the staff also expanded continuously.',
  'history.growth.didYouKnow': 'Did you know that SHI-SEI became the mother club of many Hague judo clubs such as Lu-Gia-Jen, Guan-Tsui, Huan-Pi, De Doorkruiers, Guan Lin, Kagawa, and Sumeju? Wil Wagner was the founder of most of these clubs.',

  // Section 2: Successful Judokas
  'history.section2.title': 'Successful Judokas',
  'history.section2.p1': 'The club has produced hundreds of black belt holders, including a number of particularly good competition judokas such as Wil Tap, Jan Hendriks, Jaap Zoutendijk, Jan Dotinga, Kees Toonen, Koos Tap, Koos Letterie, Wim Lut, Giel Groos, Beb de Waal, Nico Schoemaker, Koos v.d. Mark, Wil Wagner, Jan v.d. Toorn, Ed Beekink, Wim de Rooy, Barry Oudshoorn, Henk Ammerlaan, John Lut and many others.',

  // Section 3: Resurrection & New Locations
  'history.section3.title': 'Resurrection & New Locations',
  'history.section3.p1': 'In 1970, the association almost ceased to exist when a number of members dismissed the entire board at an extraordinary general meeting. This turned out to be a disastrous failure.',
  'history.section3.p2': 'However, in 1972 a new board was formed under the inspiring leadership of Wim Lut, and the club was given new life, particularly through branches in Westland. This, however, resulted in the accommodation becoming far too small and no longer meeting the requirements of the time.',
  'history.section3.p3': 'Finally, in 1981, through aldermen Piet Vink and Adrie Duivestein, we obtained a spacious accommodation in the old school at Nieuwe Schoolstraat 22-B.',
  'history.section3.p4': 'Here we have a spacious training hall, two spacious shower facilities, office, canteen, small training hall and plenty of storage space. In this space we now have not only judo but also, since 1990, a taekwondo department with various home-grown 1st and 2nd dans. A darts department also provides the necessary conviviality.',

  // Section 4: Relocations & Recent History
  'history.section4.title': 'Relocations & Recent History',
  'history.section4.p1': 'Unfortunately, our beautiful own location came to an end in 2006 when the municipality decided to terminate our lease contract to build three luxury apartments on the site of our beautiful location. Unfortunately, we could not find our own new location that we could afford.',
  'history.section4.p2': 'We decided to use a community center in Fluitenbergstraat in The Hague and a gym at Beresteinlaan in The Hague. In 2011, the Morgenstond meeting center became our new location and the gym at Beresteinlaan was once again necessarily exchanged for a nicer gym at Pachtersdreef.',
  'history.section4.p3': 'From 2011 until the corona crisis in 2020, we taught judo and taekwondo 6 days a week. Our membership had grown steadily to approximately 140 judo members and 40 taekwondo members.',
  'history.section4.p4': 'From March 16, 2020, we were forced to close for a short period due to the corona virus infection. But now we are back to training at full speed.',
  
  // Timeline & Stats
  'history.timeline.title': 'Timeline',
  'history.stats.title': 'Current Status',
  'history.stats.members': 'Members',
  'history.stats.region': 'Location',
  'history.stats.city': 'The Hague',
  
  'history.milestones.1950.title': 'Foundation',
  'history.milestones.1950.description': 'Start at Daal en Bergselaan.',
  'history.milestones.1960.title': 'Golden Years',
  'history.milestones.1960.description': 'Mother club of many Hague associations.',
  'history.milestones.1980.title': 'Nieuwe Schoolstraat',
  'history.milestones.1980.description': 'Relocation to the iconic dojo (1981).',
  'history.milestones.2011.title': 'Morgenstond',
  'history.milestones.2011.description': 'New location at Pachtersdreef.',
  'history.milestones.2025.title': 'Present',
  'history.milestones.2025.description': 'Still active in The Hague with 100+ members.',

  // Pricing
  'pricing.title': 'Membership & Pricing',
  'pricing.subtitle': 'Pricing',
  'pricing.description': 'Transparent pricing for everyone.',
  'pricing.popular': 'Popular',
  'pricing.month': 'per month',
  
  // Plans
  'pricing.plans.youth.name': 'Youth (up to 12 years)',
  'pricing.plans.youth.price': '€27.50',
  'pricing.plans.youth.f1': 'Unlimited training',
  'pricing.plans.youth.f2': 'Access to all youth classes',
  'pricing.plans.youth.f3': 'Exam opportunities',
  'pricing.plans.youth.f4': 'Free judo suit up to 17 years',
  
  'pricing.plans.adults.name': 'Adults',
  'pricing.plans.adults.price': '€27.50',
  'pricing.plans.adults.f1': '2x per week training',
  'pricing.plans.adults.f2': 'Access to all classes',
  'pricing.plans.adults.f3': 'Exam opportunities',

  'pricing.year': 'per year',
  'pricing.plans.youth.yearly': '€330.-',
  'pricing.plans.adults.yearly': '€330.-',

  // Extra Info
  'pricing.ooievaarspas': 'Discounts up to 100% on membership fees possible with the Ooievaarspas',
  'pricing.cta.title': 'Free Trial Lesson',
  'pricing.cta.desc': 'Try a free trial lesson before signing up. No obligations!',
  'pricing.cta.button': 'Book a Free Trial',
  
  // Exam
  'exam.title': 'Exam Requirements',
  'exam.subtitle': 'Exam Requirements',
  'exam.description': 'Overview of exam requirements for each belt grade. Prepare well for your next exam.',
  'exam.minAge': 'Minimum Age',
  'exam.minAgeValue': 'From 6 years',
  'exam.theory': 'Theory',
  'exam.theoryValue': 'Knowledge of techniques and rules',
  'exam.practice': 'Practice',
  'exam.practiceValue': 'Demonstration of techniques',
  'exam.required': 'Required Techniques:',
  'exam.info': 'Important Information',
  
  // Trial
  'trial.title': 'Book a Free Trial',
  'trial.subtitle': 'Free Trial',
  'trial.description': 'Try judo at Shi-Sei Sport. No obligations, just come and experience!',
  'trial.benefits': 'What do you get with a trial lesson?',
  'trial.benefit1': 'Free and without obligations',
  'trial.benefit2': 'Meet our trainers',
  'trial.benefit3': 'Experience our training style',
  'trial.benefit4': 'Information about membership',
  'trial.benefit5': 'Can start training immediately',
  'trial.days': 'Training Days',
  'trial.daysText': 'Monday, Wednesday, Thursday and Saturday',
  'trial.scheduleLink': 'View full schedule',
  'trial.bring': 'What to bring?',
  'trial.bring1': 'Comfortable sportswear',
  'trial.bring2': 'Water bottle',
  'trial.bring3': 'Towel (optional)',
  'trial.bring4': 'Judo-gi will be loaned for the first time',
  'trial.forWho': 'For whom?',
  'trial.forWhoText': 'Everyone from 6 years old is welcome! Whether you are a beginner or already have experience, we have lessons for all levels.',
  'trial.formTitle': 'Book your Trial',
  'trial.age': 'Age',
  'trial.experience': 'Experience',
  'trial.experienceOptions.beginner': 'Beginner',
  'trial.experienceOptions.some': 'Some experience',
  'trial.experienceOptions.advanced': 'Advanced',
  'trial.preferredDay': 'Preferred training day',
  'trial.preferredDayOptions.maandag': 'Monday',
  'trial.preferredDayOptions.woensdag': 'Wednesday',
  'trial.preferredDayOptions.donderdag': 'Thursday',
  'trial.preferredDayOptions.zaterdag': 'Saturday',
  'trial.preferredDayOptions.none': 'No preference',
  'trial.message': 'Comments (optional)',
  'trial.messagePlaceholder': 'Do you have questions or specific wishes?',
  'trial.button': 'Book Free Trial',
  'trial.success': 'Thank you for your registration!',
  'trial.successText': 'We have received your request and will contact you within 24 hours to schedule a suitable time.',
  'trial.disclaimer': 'By booking you agree to our privacy policy. We will contact you within 24 hours.',
  
  // Footer
  'footer.club': 'Shi-Sei Sport',
  'footer.description': 'The oldest judo club in The Hague. Judo lessons since 1950.',
  'footer.quickLinks': 'Quick Links',
  'footer.contact': 'Contact',
  'footer.contactText': 'For questions or more information, contact us via the contact page.',
  'footer.copyright': 'All rights reserved.',
  'footer.privacy': 'Privacy Policy',
  'footer.rules': 'House Rules',
  'footer.terms': 'Terms & Conditions',
  
  // Common
  'common.loading': 'Loading...',
  'common.required': '*',
  'common.select': 'Select',
  'common.optional': '(optional)',
  
  // 404
  '404.title': 'Page not found',
  '404.description': 'The page you are looking for does not exist or has been moved.',
  '404.home': 'Go to Homepage',
  '404.back': 'Back',
};
