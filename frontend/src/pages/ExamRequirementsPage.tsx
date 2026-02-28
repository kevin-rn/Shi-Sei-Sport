import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Award, Download, ExternalLink, X, ZoomIn } from 'lucide-react';
import { Icon } from '../components/Icon';
import { getKyuGrades, getDanGradesInfo, getImageUrl, getMediaByFilename, type Grade } from '../lib/api';
import type { Media } from '../types/payload-types';
import { useLanguage } from '../contexts/LanguageContext';
import { useSeo } from '../hooks/useSeo';
import { RichTextRenderer } from '../components/RichTextRenderer';
import { FillButton } from '../components/FillButton';
import { PageWrapper } from '../components/PageWrapper';
import { PageHeader } from '../components/PageHeader';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';

export const ExamRequirementsPage = () => {
  const { t, language } = useLanguage();
  useSeo({ title: t('exam.title') });
  const [grades, setGrades] = useState<Grade[]>([]);
  const [danInfo, setDanInfo] = useState<Grade | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<{ url: string; alt: string } | null>(null);
  const [headerImage, setHeaderImage] = useState<Media | null>(null);
  const [bannerHovered, setBannerHovered] = useState(false);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (zoomedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [zoomedImage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [gradesResponse, danInfoResponse, media] = await Promise.all([
          getKyuGrades(language),
          getDanGradesInfo(language),
          getMediaByFilename('exam.webp'),
        ]);
        setGrades(gradesResponse.docs);
        setDanInfo(danInfoResponse);
        setHeaderImage(media);
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
    type TextNode = { text?: string };
    type ParagraphNode = { type: string; children?: TextNode[] };
    type ListItemNode = { type: string; children?: ParagraphNode[] };
    type ListNode = { type: string; children?: ListItemNode[] };
    type RichChild = ParagraphNode | ListNode;
    type ContentItem = string | { type: 'list'; items: string[] };

    const content = richText.root.children
      .map((child: RichChild) => {
        if (child.type === 'paragraph') {
          const text = (child as ParagraphNode).children
            ?.map((c: TextNode) => c.text || '')
            .join('') ?? '';
          return text;
        }
        if (child.type === 'list') {
          const listItems = (child as ListNode).children
            ?.map((item: ListItemNode) => {
              if (item.type === 'listitem') {
                const itemText = item.children
                  ?.map((c: ParagraphNode) => {
                    if (c.type === 'paragraph') {
                      return c.children?.map((t: TextNode) => t.text || '').join('') ?? '';
                    }
                    return '';
                  })
                  .join('') ?? '';
                return itemText;
              }
              return '';
            })
            .filter((text: string) => text.length > 0) ?? [];

          return { type: 'list' as const, items: listItems };
        }
        return '';
      });

    return content.map((item: ContentItem, index: number) => {
      if (typeof item === 'string' && item.length > 0) {
        return (
          <p key={index} className="text-judo-gray mb-3">
            {item}
          </p>
        );
      }
      if (typeof item !== 'string' && item.type === 'list') {
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

  const getBeltColors = (beltLevel?: string): { bg: string; icon: string } => {
    const map: Record<string, { bg: string; icon: string }> = {
      'yellow-5kyu': { bg: 'bg-yellow-100',  icon: 'text-yellow-500' },
      'orange-4kyu': { bg: 'bg-orange-100',  icon: 'text-orange-500' },
      'green-3kyu':  { bg: 'bg-green-100',   icon: 'text-green-600'  },
      'blue-2kyu':   { bg: 'bg-blue-100',    icon: 'text-blue-500'   },
      'brown-1kyu':  { bg: 'bg-amber-100',   icon: 'text-amber-800'  },
    };
    return map[beltLevel ?? ''] ?? { bg: 'bg-judo-red/10', icon: 'text-judo-red' };
  };

  if (loading) return <LoadingState message={t('exam.loading')} maxWidth="max-w-6xl" />;
  if (error) return <ErrorState title={t('exam.error')} message={error} maxWidth="max-w-6xl" />;

  return (
    <PageWrapper maxWidth="max-w-6xl">
      <PageHeader icon={<Icon name="belt" size={42} className="text-judo-red" />} title={t('exam.title')} />

      {/* Info Box */}
      {headerImage ? (
        <div
          className="relative -mx-6 sm:mx-0 sm:rounded-2xl overflow-hidden shadow-lg mb-16 group"
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
          <div 
            className="absolute w-[200%] h-[30px] bg-judo-red pointer-events-none" 
            style={{
              opacity: 0.65,
              top: bannerHovered ? 'calc(100% - 40px)' : '40px',
              left: bannerHovered ? 'calc(100% - 40px)' : '40px',
              transform: 'translate(-50%, -50%) rotate(-45deg)',
              transition: 'top 500ms ease-in-out, left 500ms ease-in-out',
            }} 
          />
          {/* Text overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end gap-6 p-6 sm:p-8 pointer-events-none">
            <div className="shrink-0 bg-white/10 p-4 rounded-2xl">
              <Icon name="info" className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-lg text-white mb-1">
                {t('exam.participationTitle')}
              </p>
              <p className="text-sm leading-relaxed text-white/80">
                {t('exam.participationText')}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-light-gray border border-gray-200 rounded-2xl p-6 sm:p-8 mb-16 flex items-end gap-6 shadow-lg">
          <div className="shrink-0 bg-white/10 p-4 rounded-2xl">
            <Icon name="info" className="w-8 h-8 text-gray-400" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold mb-2 text-gray-500">
              {t('exam.participationTitle')}
            </h3>
            <p className="leading-relaxed text-judo-gray">
              {t('exam.participationText')}
            </p>
          </div>
        </div>
      )}

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
                className="bg-white border border-gray-100 rounded-2xl shadow-lg p-4 sm:p-8 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                  {(() => { const { bg, icon } = getBeltColors(grade.beltLevel); return (
                  <div className={`${bg} p-4 rounded-full flex-shrink-0`}>
                    <Award className={`w-8 h-8 ${icon}`} />
                  </div>
                  ); })()}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-judo-dark mb-1">
                          {grade.title}
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
                          <span className="hidden sm:inline">Download PDF</span>
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
                <h2 className="text-2xl font-bold mb-2">{danInfo.title}</h2>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-6 mb-6">
              <RichTextRenderer content={danInfo.description as unknown as Parameters<typeof RichTextRenderer>[0]['content']} className="text-white" />
            </div>

            {danInfo.externalUrl && danInfo.externalUrlText && (
              <div className="flex justify-center">
                <FillButton
                  href={danInfo.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-btn bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-base shadow-lg"
                  pressedClass="nav-btn--pressed-white"
                  aria-label={danInfo.externalUrlText}
                >
                  <span className="nav-btn-arrow"><ExternalLink className="w-5 h-5" /></span>
                  <span className="nav-btn-text">{danInfo.externalUrlText}</span>
                </FillButton>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Zoom Modal — rendered via portal to escape any stacking context */}
      {zoomedImage && createPortal(
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-fadeIn"
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
        </div>,
        document.body
      )}
    </PageWrapper>
  );
};
