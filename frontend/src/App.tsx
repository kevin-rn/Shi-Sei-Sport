import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { NewsSection } from './components/NewsSection';
import { Footer } from './components/Footer';
import { SchedulePage } from './pages/SchedulePage';

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
          {/* Fallback route redirects to Home */}
          <Route path="*" element={<Home />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;