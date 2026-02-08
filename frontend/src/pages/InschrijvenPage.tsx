import { useState, useEffect } from 'react';
import { ChevronDown, Download, FileText, AlertCircle, ClipboardList, FileEdit } from 'lucide-react';
import { getDocuments, getImageUrl } from '../lib/api';
import type { Document, Media } from '../types/payload-types';
import { useLanguage } from '../contexts/LanguageContext';
import { EnrollmentForm } from '../components/EnrollmentForm';
import { Icon } from '../components/Icon';

export const InschrijvenPage = () => {
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

  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-32 max-w-6xl">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-judo-red"></div>
          <p className="mt-4 text-judo-gray">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-32 max-w-6xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-red-900 mb-2">{t('inschrijven.error')}</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-24 pb-32 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-3xl font-extrabold text-judo-dark mb-4 flex items-center justify-center gap-4">
          <Icon name="edit" size={20} className="text-judo-red" />
          {t('inschrijven.title')}
          </h1>
        <p className="text-judo-gray text-lg max-w-2xl mx-auto">
          {t('inschrijven.description')}
        </p>
      </div>

      {/* Toggle between Download and Online Form */}
      <div className="flex justify-center gap-4 mb-12">
        <button
          onClick={() => setShowForm(false)}
          className={`px-6 py-3 rounded-lg font-bold transition-colors ${
            !showForm
              ? 'bg-judo-red text-white'
              : 'bg-gray-200 text-judo-dark hover:bg-gray-300'
          }`}
        >
          <Download className="w-5 h-5 inline-block mr-2" />
          {t('inschrijven.downloadOption')}
        </button>
        <button
          onClick={() => setShowForm(true)}
          className={`px-6 py-3 rounded-lg font-bold transition-colors ${
            showForm
              ? 'bg-judo-red text-white'
              : 'bg-gray-200 text-judo-dark hover:bg-gray-300'
          }`}
        >
          <FileEdit className="w-5 h-5 inline-block mr-2" />
          {t('inschrijven.onlineOption')}
        </button>
      </div>

      {/* Online Form */}
      {showForm ? (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-judo-dark mb-4">
              {t('inschrijven.formTitle')}
            </h2>
            <p className="text-judo-gray">
              {t('inschrijven.formDescription')}
            </p>
          </div>
          <EnrollmentForm />
        </div>
      ) : (
        <>
          {/* Info Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex items-start gap-4">
              <ClipboardList className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">{t('inschrijven.infoTitle')}</h3>
                <p className="text-blue-700">{t('inschrijven.infoText')}</p>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-start gap-4">
              <Download className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-green-900 mb-2">{t('inschrijven.downloadTitle')}</h3>
                <p className="text-green-700">{t('inschrijven.downloadText')}</p>
              </div>
            </div>
          </div>

          {/* Documents List */}
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
                className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Header - Always Visible */}
                <div
                  className="flex items-center justify-between p-6 cursor-pointer"
                  onClick={() => toggleExpanded(doc.id)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="bg-judo-red/10 p-3 rounded-lg">
                      <FileText className="w-6 h-6 text-judo-red" />
                    </div>
                    <h3 className="text-xl font-bold text-judo-dark">{doc.title}</h3>
                  </div>

                  <div className="flex items-center gap-3">
                    {downloadUrl && (
                      <a
                        href={downloadUrl}
                        download
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 bg-judo-red text-white px-4 py-2 rounded-lg hover:bg-judo-red/90 transition-colors"
                        aria-label={`${t('inschrijven.download')} ${doc.title}`}
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">{t('inschrijven.download')}</span>
                      </a>
                    )}
                    <ChevronDown
                      className={`w-6 h-6 text-judo-gray transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Body - Collapsible */}
                {isExpanded && doc.description && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <div className="pt-6">{renderRichText(doc.description)}</div>
                  </div>
                )}
              </div>
            );
          })}
          </div>
        )}
        </>
      )}

      {/* Additional CTA */}
      <div className="mt-16 bg-gradient-to-r from-judo-red to-red-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">{t('inschrijven.ctaTitle')}</h2>
        <p className="text-lg mb-6 opacity-90">
          {t('inschrijven.ctaText')}
        </p>
        <a
          href="/contact"
          className="inline-block bg-white text-judo-red px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
        >
          {t('inschrijven.ctaButton')}
        </a>
      </div>
    </div>
  );
};
