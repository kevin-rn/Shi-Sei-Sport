import { useState, useEffect } from 'react';
import { Download, FileText, FileEdit, ArrowRight } from 'lucide-react';
import { getDocuments, getImageUrl, getMediaByFilename } from '../lib/api';
import type { Document, Media } from '../types/payload-types';
import { useLanguage } from '../contexts/LanguageContext';
import { EnrollmentForm } from '../components/EnrollmentForm';
import { Icon } from '../components/Icon';
import { FillButton } from '../components/FillButton';
import { PageWrapper } from '../components/PageWrapper';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';

export const EnrollmentPage = () => {
  const { t, language } = useLanguage();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [headerImage, setHeaderImage] = useState<Media | null>(null);
  const [bannerHovered, setBannerHovered] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [docsResponse, media] = await Promise.all([
          getDocuments('enrollment', language),
          getMediaByFilename('tournament.webp'),
        ]);
        setDocuments(docsResponse.docs);
        setHeaderImage(media);
      } catch (err) {
        console.error('Error fetching enrollment data:', err);
        setError(t('inschrijven.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language, t]);

  const getDownloadUrl = (attachment: number | Media | null | undefined): string | null => {
    if (!attachment) return null;
    if (typeof attachment === 'number') return null;
    return getImageUrl(attachment);
  };

  const renderRichText = (richText: Document['description']) => {
    if (!richText) return null;

    type RichChild = { type: string; version: number; children?: { text?: string }[]; [k: string]: unknown };
    const content = richText.root.children
      .map((child: RichChild) => {
        if (child.type === 'paragraph') {
          return (child.children ?? []).map((c) => c.text || '').join('');
        }
        return '';
      })
      .filter((text: string) => text.length > 0)
      .join('\n\n');

    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className="text-judo-gray mb-3">
        {paragraph}
      </p>
    ));
  };

  if (loading) return <LoadingState message={t('common.loading')} maxWidth="max-w-6xl" />;
  if (error) return <ErrorState title={t('inschrijven.error')} message={error} maxWidth="max-w-6xl" />;

  return (
    <PageWrapper maxWidth="max-w-6xl">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-2xl font-extrabold text-judo-dark mb-4 flex items-center justify-center gap-4">
          <Icon name="edit" size={42} className="text-judo-red" />
          {t('inschrijven.title')}
        </h1>
        <p className="text-judo-gray text-base max-w-2xl mx-auto mb-8">
          {t('inschrijven.description')}
        </p>
        {headerImage && (
          <div
            className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-lg group"
            onMouseEnter={() => setBannerHovered(true)}
            onMouseLeave={() => setBannerHovered(false)}
          >
            <img
              src={getImageUrl(headerImage, 'thumbnail')}
              alt={typeof headerImage.alt === 'string' ? headerImage.alt : ''}
              className="w-full h-64 sm:h-80 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
            {/* Dark overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 pointer-events-none" />
            {/* Diagonal red stripe: top-left → bottom-right on hover */}
            <div className="absolute w-[200%] h-3 bg-judo-red pointer-events-none" style={{
              opacity: 0.65,
              top: bannerHovered ? 'calc(100% - 40px)' : '40px',
              left: bannerHovered ? 'calc(100% - 40px)' : '40px',
              transform: 'translate(-50%, -50%) rotate(-45deg)',
              transition: 'top 500ms ease-in-out, left 500ms ease-in-out',
            }} />
            {/* Text overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end gap-6 p-6 sm:p-8 pointer-events-none">
              <div className="shrink-0 bg-white/10 p-4 rounded-2xl">
                <Icon name="clipboard" className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-sm uppercase tracking-widest mb-1">{t('inschrijven.heroSub')}</p>
                <h2 className="text-white text-2xl sm:text-3xl font-extrabold leading-tight">{t('inschrijven.heroTagline')}</h2>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Method Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
        <button
          onClick={() => setShowForm(false)}
          className={`relative text-left p-6 rounded-2xl border-2 transition-all ${
            !showForm
              ? 'border-judo-red bg-judo-red/5 shadow-md'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
          }`}
        >
          <div className={`inline-flex p-3 rounded-xl mb-4 ${!showForm ? 'bg-judo-red/10' : 'bg-gray-100'}`}>
            <Download className={`w-6 h-6 ${!showForm ? 'text-judo-red' : 'text-judo-gray'}`} />
          </div>
          <h3 className={`text-base font-bold mb-2 ${!showForm ? 'text-judo-dark' : 'text-judo-gray'}`}>
            {t('inschrijven.downloadOption')}
          </h3>
          <p className={`text-sm ${!showForm ? 'text-judo-gray' : 'text-gray-400'}`}>
            {t('inschrijven.downloadOptionDesc')}
          </p>
          {!showForm && (
            <div className="absolute top-4 right-4 w-3 h-3 bg-judo-red rounded-full" />
          )}
        </button>
        <button
          onClick={() => setShowForm(true)}
          className={`relative text-left p-6 rounded-2xl border-2 transition-all ${
            showForm
              ? 'border-judo-red bg-judo-red/5 shadow-md'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
          }`}
        >
          <div className={`inline-flex p-3 rounded-xl mb-4 ${showForm ? 'bg-judo-red/10' : 'bg-gray-100'}`}>
            <FileEdit className={`w-6 h-6 ${showForm ? 'text-judo-red' : 'text-judo-gray'}`} />
          </div>
          <h3 className={`text-base font-bold mb-2 ${showForm ? 'text-judo-dark' : 'text-judo-gray'}`}>
            {t('inschrijven.onlineOption')}
          </h3>
          <p className={`text-sm ${showForm ? 'text-judo-gray' : 'text-gray-400'}`}>
            {t('inschrijven.onlineOptionDesc')}
          </p>
          {showForm && (
            <div className="absolute top-4 right-4 w-3 h-3 bg-judo-red rounded-full" />
          )}
        </button>
      </div>

      {/* Online Form */}
      {showForm ? (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="mb-8 text-center">
              <h2 className="text-xl font-bold text-judo-dark mb-2">
                {t('inschrijven.formTitle')}
              </h2>
              <p className="text-judo-gray text-sm">
                {t('inschrijven.formDescription')}
              </p>
            </div>
            <EnrollmentForm />
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-judo-gray">{t('inschrijven.noDocuments')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => {
                const downloadUrl = getDownloadUrl(doc.attachment);
                return (
                  <div
                    key={doc.id}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6 flex items-start justify-between gap-6"
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="bg-judo-red/10 p-3 rounded-xl flex-shrink-0 mt-0.5">
                        <FileText className="w-6 h-6 text-judo-red" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-judo-dark mb-1">{doc.title}</h3>
                        {doc.description && (
                          <div className="text-sm">{renderRichText(doc.description)}</div>
                        )}
                      </div>
                    </div>
                    {downloadUrl && (
                      <a
                        href={downloadUrl}
                        download
                        className="flex-shrink-0 flex items-center gap-2 bg-judo-red text-white px-4 py-2 rounded-lg hover:bg-judo-red/90 transition-colors text-sm font-medium"
                        aria-label={`${t('inschrijven.download')} ${doc.title}`}
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">{t('inschrijven.download')}</span>
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Additional CTA */}
      <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-r from-judo-red to-red-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-xl font-bold mb-4">{t('inschrijven.ctaTitle')}</h2>
        <p className="text-base mb-6 opacity-90">
          {t('inschrijven.ctaText')}
        </p>
        <FillButton
          to="/contact"
          pressedClass="nav-btn--pressed"
          className="nav-btn bg-white text-judo-red px-8 py-4 rounded-lg hover:bg-gray-100 font-bold text-base"
        >
          <span className="nav-btn-arrow"><ArrowRight className="w-5 h-5" /></span>
          <span className="nav-btn-text">{t('inschrijven.ctaButton')}</span>
        </FillButton>
      </div>
    </PageWrapper>
  );
};
