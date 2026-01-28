import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
          <Route path="/nieuws" element={<NieuwsPage />} />
          <Route path="/nieuws/:id" element={<NewsDetailPage />} />
          <Route path="/proefles" element={<ProeflesPage />} />
          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;