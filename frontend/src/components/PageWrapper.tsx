import logoSvg from '../assets/logo/shi-sei-logo.svg';

interface PageWrapperProps {
  children: React.ReactNode;
  maxWidth?: string;
}

export const PageWrapper = ({ children, maxWidth = 'max-w-5xl' }: PageWrapperProps) => (
  <div className="relative">
    <div
      className="fixed inset-0 pointer-events-none select-none flex items-center justify-center"
      style={{ zIndex: 0 }}
    >
      <img src={logoSvg} alt="" aria-hidden="true" className="w-[min(80vw,80vh)] opacity-[0.04]" />
    </div>
    <main id="main-content" className={`container mx-auto px-6 pt-28 pb-32 ${maxWidth} relative`} style={{ zIndex: 1 }}>
      {children}
    </main>
  </div>
);
