import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DarkModeProvider } from './contexts/DarkModeContext';
import './dark.css';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { NewsSection } from './components/NewsSection';
import { Footer } from './components/Footer';
import { SchedulePage } from './pages/SchedulePage';
import { ContactPage } from './pages/ContactPage';
import { TeamPage } from './pages/TeamPage';
import { HistoriePage } from './pages/HistoriePage';
import { TarievenPage } from './pages/TarievenPage';
import { ExamenEisenPage } from './pages/ExamenEisenPage';
import { NieuwsPage } from './pages/NieuwsPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { ProeflesPage } from './pages/ProeflesPage';
import { LocationPage } from './pages/LocationPage';
import { RegelsPage } from './pages/RegelsPage';
import { InschrijvenPage } from './pages/InschrijvenPage';
import { AgendaPage } from './pages/AgendaPage';
import { MediaPage } from './pages/MediaPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// The "Home" page combines the Hero and News components
const Home = () => (
  <main>
    <Hero />
    <NewsSection />
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
          <Route path="/rooster" element={<SchedulePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/locaties" element={<LocationPage />} />
          <Route path="/historie" element={<HistoriePage />} />
          <Route path="/tarieven" element={<TarievenPage />} />
          <Route path="/examen-eisen" element={<ExamenEisenPage />} />
          <Route path="/regels" element={<RegelsPage />} />
          <Route path="/inschrijven" element={<InschrijvenPage />} />
          <Route path="/nieuws" element={<NieuwsPage />} />
          <Route path="/nieuws/:id" element={<NewsDetailPage />} />
          <Route path="/proefles" element={<ProeflesPage />} />
          <Route path="/agenda" element={<AgendaPage />} />
          <Route path="/media" element={<MediaPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/voorwaarden" element={<TermsPage />} />
          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;