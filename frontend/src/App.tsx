import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DarkModeProvider } from './contexts/DarkModeContext';
import './dark.css';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { NewsSection } from './components/NewsSection';
import { SocialSection } from './components/SocialSection';
import { Footer } from './components/Footer';
import { SchedulePage } from './pages/SchedulePage';
import { ContactPage } from './pages/ContactPage';
import { TeamPage } from './pages/TeamPage';
import { HistoryPage } from './pages/HistoryPage';
import { PricingPage } from './pages/PricingPage';
import { ExamRequirementsPage } from './pages/ExamRequirementsPage';
import { NewsPage } from './pages/NewsPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { TrialLessonPage } from './pages/TrialLessonPage';
import { LocationPage } from './pages/LocationPage';
import { RulesPage } from './pages/RulesPage';
import { EnrollmentPage } from './pages/EnrollmentPage';
import { EventsPage } from './pages/EventsPage';
import { MediaPage } from './pages/MediaPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// The "Home" page combines the Hero, News, and Social sections
const Home = () => (
  <main>
    <Hero />
    <NewsSection />
    <SocialSection />
  </main>
);

function App() {
  return (
    <DarkModeProvider>
    <BrowserRouter>
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/locations" element={<LocationPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/exam-requirements" element={<ExamRequirementsPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/enrollment" element={<EnrollmentPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/trial-lesson" element={<TrialLessonPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/media" element={<MediaPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;
