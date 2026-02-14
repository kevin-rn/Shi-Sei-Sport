import { useState, useEffect } from 'react';
import { Award, Download, AlertCircle, ExternalLink, X, ZoomIn } from 'lucide-react';
import { Icon } from '../components/Icon';
import { getKyuGrades, getDanGradesInfo, getImageUrl, type Grade } from '../lib/api';
import type { Media } from '../types/payload-types';
import { useLanguage } from '../contexts/LanguageContext';
import { LoadingDots } from '../components/LoadingDots';
import { RichTextRenderer } from '../components/RichTextRenderer';
import { FillButton } from '../components/FillButton';

export const ExamenEisenPage = () => {
  const { t, language } = useLanguage();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [danInfo, setDanInfo] = useState<Grade | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<{ url: string; alt: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [gradesResponse, danInfoResponse] = await Promise.all([
          getKyuGrades(language),
          getDanGradesInfo(language),
        ]);
        setGrades(gradesResponse.docs);
        setDanInfo(danInfoResponse);
      } catch (err) {
        console.error('Error fetching exam data:', err);
        setError(t('exam.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language, t]);

  const getDocumentUrl = (doc: number | Media | null | undefined): string | null => {
    if (!doc) return null;
    if (typeof doc === 'number') return null;
    return getImageUrl(doc);
  };

  const renderRichText = (richText: Grade['description']) => {
    if (!richText) return null;

    // Simple rich text renderer
    const content = richText.root.children
      .map((child: any) => {
        if (child.type === 'paragraph') {
          const text = child.children
            .map((c: any) => c.text || '')
            .join('');
          return text;
        }
        if (child.type === 'list') {
          const listItems = child.children
            .map((item: any) => {
              if (item.type === 'listitem') {
                const itemText = item.children
                  .map((c: any) => {
                    if (c.type === 'paragraph') {
                      return c.children.map((t: any) => t.text || '').join('');
                    }
                    return '';
                  })
                  .join('');
                return itemText;
              }
              return '';
            })
            .filter((text: string) => text.length > 0);

          return { type: 'list', items: listItems };
        }
        return '';
      });

    return content.map((item: any, index: number) => {
      if (typeof item === 'string' && item.length > 0) {
        return (
          <p key={index} className="text-judo-gray mb-3">
            {item}
          </p>
        );
      }
      if (item.type === 'list') {
        return (
          <ul key={index} className="space-y-2 mb-4">
            {item.items.map((listItem: string, liIndex: number) => (
              <li key={liIndex} className="flex items-start gap-2 text-judo-gray">
                <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
                <span>{listItem}</span>
              </li>
            ))}
          </ul>
        );
      }
      return null;
    });
  };

  const getBeltLabel = (beltLevel?: string): string => {
    if (!beltLevel) return '';
    const labels: Record<string, string> = {
      'yellow-5kyu': '5e Kyu (Geel)',
      'orange-4kyu': '4e Kyu (Oranje)',
      'green-3kyu': '3e Kyu (Groen)',
      'blue-2kyu': '2e Kyu (Blauw)',
      'brown-1kyu': '1e Kyu (Bruin)',
    };
    return labels[beltLevel] || beltLevel;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-32 max-w-6xl">
        <div className="text-center">
          <LoadingDots />
          <p className="mt-4 text-judo-gray">{t('exam.loading')}</p>
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
            <h3 className="font-bold text-red-900 mb-2">{t('exam.error')}</h3>
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
          <Icon name="belt" size={42} className="text-judo-red" />
          {t('exam.title')}
        </h1>
        <div className="w-24 h-1 bg-judo-red mx-auto rounded-full"></div>
      </div>

      {/* Info Boxes */}
      <div className="bg-light-gray border border-gray-200 rounded-2xl p-8 mb-16 w-full flex items-start gap-6">
        <div className="shrink-0 bg-judo-red/10 p-4 rounded-2xl">
          <Icon name="info" className="w-8 h-8 text-judo-red" />
        </div>
        <div className="text-left">
          <h3 className="text-xl font-bold text-judo-red mb-2">
            {t('exam.participationTitle')}
          </h3>
          <p className="text-judo-gray leading-relaxed">
            {t('exam.participationText')}
          </p>
        </div>
      </div>

      {/* Belt Levels */}
      {grades.length === 0 ? (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-judo-gray">{t('exam.noGrades')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {grades.map((grade) => {
            const examDocUrl = getDocumentUrl(grade.examDocument);

            return (
              <div
                key={grade.id}
                className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-6">
                  <div className="bg-judo-red/10 p-4 rounded-full flex-shrink-0">
                    <Award className="w-8 h-8 text-judo-red" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-judo-dark mb-1">
                          {getBeltLabel(grade.beltLevel)}
                        </h3>
                        {grade.minimumAge && (
                          <p className="text-sm text-judo-gray">
                            {t('exam.minAge')}: {grade.minimumAge}
                          </p>
                        )}
                      </div>
                      {examDocUrl && (
                        <FillButton
                          href={examDocUrl}
                          download
                          className="download-button-fill flex items-center gap-2 bg-judo-red text-white px-4 py-2 rounded-lg border-2 border-judo-red hover:bg-white hover:text-judo-red flex-shrink-0 overflow-hidden"
                          aria-label={`${t('exam.download')} ${grade.title}`}
                        >
                          <Download className="w-4 h-4" />
                          Download PDF
                        </FillButton>
                      )}
                    </div>

                    {/* Description / Requirements */}
                    <div className="mb-4">
                      {renderRichText(grade.description)}
                    </div>

                    {/* Image Preview Section - Display PNG from supplementary documents */}
                    {grade.supplementaryDocuments && grade.supplementaryDocuments.length > 0 && (
                      (() => {
                        // Find the first image in supplementary documents
                        const imageDoc = grade.supplementaryDocuments.find((supDoc) => {
                          const doc = supDoc.document;
                          if (typeof doc === 'object' && doc !== null && 'mimeType' in doc) {
                            return doc.mimeType?.startsWith('image/');
                          }
                          return false;
                        });

                        if (imageDoc) {
                          const imageUrl = getDocumentUrl(imageDoc.document);
                          if (imageUrl) {
                            return (
                              <div className="mt-4 pt-4 border-t border-gray-100">
                                <div
                                  className="relative border border-gray-200 rounded-lg overflow-hidden bg-white cursor-pointer group hover:border-judo-red transition-colors"
                                  onClick={() => setZoomedImage({ url: imageUrl, alt: `${grade.title} - ${t('exam.preview')}` })}
                                >
                                  <img
                                    src={imageUrl}
                                    alt={`${grade.title} - ${t('exam.preview')}`}
                                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <ZoomIn className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        }
                        return null;
                      })()
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Black Belt (Dan Grades) Section */}
      {danInfo && (
        <div className="mt-16">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Award size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">{danInfo.title}</h2>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-6 mb-6">
              <RichTextRenderer content={danInfo.description as any} className="text-white" />
            </div>

            {danInfo.externalUrl && danInfo.externalUrlText && (
              <div className="flex justify-center">
                <FillButton
                  href={danInfo.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-button-fill inline-flex items-center gap-2 bg-white text-gray-100 px-6 py-3 rounded-lg border-2 border-gray-500 hover:bg-judo-red hover:text-white hover:border-judo-red font-semibold overflow-hidden"
                >
                  <ExternalLink size={20} />
                  {danInfo.externalUrlText}
                </FillButton>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setZoomedImage(null)}
        >
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div
            className="relative flex items-center justify-center max-w-[95vw] max-h-[95vh] animate-zoomIn"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={zoomedImage.url}
              alt={zoomedImage.alt}
              className="max-w-full max-h-[95vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};