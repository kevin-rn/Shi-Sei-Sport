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
  'history.title': 'Onze Geschiedenis',
  'history.subtitle': 'Historie',
  'history.description': 'Sinds 1950 is Shi-Sei Sport een begrip in Den Haag. Ontdek onze rijke geschiedenis en traditie.',
  'history.years': 'Jaar Ervaring',
  'history.members': 'Actieve Leden',
  'history.days': 'Trainingsdagen',
  
  // Pricing
  'pricing.title': 'Lidmaatschap & Tarieven',
  'pricing.subtitle': 'Tarieven',
  'pricing.description': 'Transparante prijzen voor iedereen. Kies het lidmaatschap dat bij u past.',
  'pricing.popular': 'Populair',
  'pricing.start': 'Start Nu',
  'pricing.month': 'per maand',
  'pricing.ctaTitle': 'Gratis Proefles',
  'pricing.ctaText': 'Probeer eerst een gratis proefles voordat u zich inschrijft. Geen verplichtingen!',
  'pricing.ctaButton': 'Boek een Gratis Proefles',
  
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
  
  // History
  'history.title': 'Our History',
  'history.subtitle': 'History',
  'history.description': 'Since 1950, Shi-Sei Sport has been a household name in The Hague. Discover our rich history and tradition.',
  'history.years': 'Years Experience',
  'history.members': 'Active Members',
  'history.days': 'Training Days',
  
  // Pricing
  'pricing.title': 'Membership & Pricing',
  'pricing.subtitle': 'Pricing',
  'pricing.description': 'Transparent pricing for everyone. Choose the membership that suits you.',
  'pricing.popular': 'Popular',
  'pricing.start': 'Start Now',
  'pricing.month': 'per month',
  'pricing.ctaTitle': 'Free Trial',
  'pricing.ctaText': 'Try a free trial lesson first before signing up. No obligations!',
  'pricing.ctaButton': 'Book a Free Trial',
  
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

