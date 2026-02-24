import { useState, useEffect } from 'react';
import { ChevronDown, Download, FileText, FileEdit, ArrowRight } from 'lucide-react';
import { getDocuments, getImageUrl } from '../lib/api';
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
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getDocuments('enrollment', language);
        setDocuments(response.docs);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError(t('inschrijven.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [language, t]);

  const toggleExpanded = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getDownloadUrl = (attachment: number | Media | null | undefined): string | null => {
    if (!attachment) return null;
    if (typeof attachment === 'number') return null;
    return getImageUrl(attachment);
  };

  const renderRichText = (richText: Document['description']) => {
    if (!richText) return null;

    // Simple rich text renderer - you can enhance this based on your needs
    const content = richText.root.children
      .map((child: any) => {
        if (child.type === 'paragraph') {
          const text = child.children
            .map((c: any) => c.text || '')
            .join('');
          return text;
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
        <h1 className="text-3xl font-extrabold text-judo-dark mb-4 flex items-center justify-center gap-4">
          <Icon name="edit" size={42} className="text-judo-red" />
          {t('inschrijven.title')}
          </h1>
        <p className="text-judo-gray text-lg max-w-2xl mx-auto">
          {t('inschrijven.description')}
        </p>
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
          <h3 className={`text-lg font-bold mb-2 ${!showForm ? 'text-judo-dark' : 'text-judo-gray'}`}>
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
          <h3 className={`text-lg font-bold mb-2 ${showForm ? 'text-judo-dark' : 'text-judo-gray'}`}>
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
              <h2 className="text-2xl font-bold text-judo-dark mb-2">
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
        <>
          {/* Steps Info */}
          <div className="max-w-4xl mx-auto mb-10">
            <div className="bg-light-gray rounded-2xl p-6 sm:p-8">
              <h3 className="font-bold text-lg text-judo-dark mb-4">{t('inschrijven.infoTitle')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-judo-red text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                  <p className="text-sm text-judo-gray">{t('inschrijven.step1')}</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-judo-red text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                  <p className="text-sm text-judo-gray">{t('inschrijven.step2')}</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-judo-red text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                  <p className="text-sm text-judo-gray">{t('inschrijven.step3')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents List */}
          <div className="max-w-4xl mx-auto">
            {documents.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-judo-gray">{t('inschrijven.noDocuments')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {documents.map((doc) => {
                  const isExpanded = expandedId === doc.id;
                  const downloadUrl = getDownloadUrl(doc.attachment);

                  return (
                    <div
                      key={doc.id}
                      className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div
                        className="flex items-center justify-between p-5 sm:p-6 cursor-pointer"
                        onClick={() => toggleExpanded(doc.id)}
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="bg-judo-red/10 p-3 rounded-xl flex-shrink-0">
                            <FileText className="w-6 h-6 text-judo-red" />
                          </div>
                          <h3 className="text-lg font-bold text-judo-dark truncate">{doc.title}</h3>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                          {downloadUrl && (
                            <a
                              href={downloadUrl}
                              download
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-2 bg-judo-red text-white px-4 py-2 rounded-lg hover:bg-judo-red/90 transition-colors text-sm font-medium"
                              aria-label={`${t('inschrijven.download')} ${doc.title}`}
                            >
                              <Download className="w-4 h-4" />
                              <span className="hidden sm:inline">{t('inschrijven.download')}</span>
                            </a>
                          )}
                          <ChevronDown
                            className={`w-5 h-5 text-judo-gray transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </div>

                      {isExpanded && doc.description && (
                        <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-gray-100">
                          <div className="pt-5">{renderRichText(doc.description)}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Additional CTA */}
      <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-r from-judo-red to-red-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">{t('inschrijven.ctaTitle')}</h2>
        <p className="text-lg mb-6 opacity-90">
          {t('inschrijven.ctaText')}
        </p>
        <FillButton
          to="/contact"
          pressedClass="nav-btn--pressed"
          className="nav-btn bg-white text-judo-red px-8 py-4 rounded-lg hover:bg-gray-100 font-bold text-lg"
        >
          <span className="nav-btn-arrow"><ArrowRight className="w-5 h-5" /></span>
          <span className="nav-btn-text">{t('inschrijven.ctaButton')}</span>
        </FillButton>
      </div>
    </PageWrapper>
  );
};
