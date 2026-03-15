import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration } from 'react-router-dom';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { NewsSection } from './components/NewsSection';
import { Footer } from './components/Footer';
import { LoadingDots } from './components/LoadingDots';
import { usePageTracking } from './hooks/usePageTracking';

// Lazy-loaded page components (code splitting)
const SchedulePage = lazy(() => import('./pages/SchedulePage').then(m => ({ default: m.SchedulePage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const TeamPage = lazy(() => import('./pages/TeamPage').then(m => ({ default: m.TeamPage })));
const HistoryPage = lazy(() => import('./pages/HistoryPage').then(m => ({ default: m.HistoryPage })));
const PricingPage = lazy(() => import('./pages/PricingPage').then(m => ({ default: m.PricingPage })));
const ExamRequirementsPage = lazy(() => import('./pages/ExamRequirementsPage').then(m => ({ default: m.ExamRequirementsPage })));
const NewsPage = lazy(() => import('./pages/NewsPage').then(m => ({ default: m.NewsPage })));
const NewsDetailPage = lazy(() => import('./pages/NewsDetailPage').then(m => ({ default: m.NewsDetailPage })));
const TrialLessonPage = lazy(() => import('./pages/TrialLessonPage').then(m => ({ default: m.TrialLessonPage })));
const LocationPage = lazy(() => import('./pages/LocationPage').then(m => ({ default: m.LocationPage })));
const RulesPage = lazy(() => import('./pages/RulesPage').then(m => ({ default: m.RulesPage })));
const EnrollmentPage = lazy(() => import('./pages/EnrollmentPage').then(m => ({ default: m.EnrollmentPage })));
const EventsPage = lazy(() => import('./pages/EventsPage').then(m => ({ default: m.EventsPage })));
const MediaPage = lazy(() => import('./pages/MediaPage').then(m => ({ default: m.MediaPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// The "Home" page combines the Hero and News sections
const Home = () => (
  <main id="main-content">
    <Hero />
    <NewsSection />
  </main>
);

// Layout component wrapping all routes
const RootLayout = () => {
  usePageTracking();
  return (
  <LanguageProvider>
    <div className="min-h-screen flex flex-col font-sans">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-white focus:text-judo-red focus:font-bold focus:rounded focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Navbar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center py-32"><LoadingDots /></div>}>
        <Outlet />
      </Suspense>
      <Footer />
      <ScrollRestoration />
    </div>
  </LanguageProvider>
  );
};

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/rooster', element: <SchedulePage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/team', element: <TeamPage /> },
      { path: '/locaties', element: <LocationPage /> },
      { path: '/geschiedenis', element: <HistoryPage /> },
      { path: '/tarieven', element: <PricingPage /> },
      { path: '/exameneisen', element: <ExamRequirementsPage /> },
      { path: '/regels', element: <RulesPage /> },
      { path: '/inschrijven', element: <EnrollmentPage /> },
      { path: '/nieuws', element: <NewsPage /> },
      { path: '/nieuws/:slug', element: <NewsDetailPage /> },
      { path: '/proefles', element: <TrialLessonPage /> },
      { path: '/agenda', element: <EventsPage /> },
      { path: '/media', element: <MediaPage /> },
      { path: '/privacy', element: <PrivacyPolicyPage /> },
      { path: '/voorwaarden', element: <TermsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

function App() {
  return (
    <DarkModeProvider>
      <RouterProvider router={router} />
    </DarkModeProvider>
  );
}

export default App;
