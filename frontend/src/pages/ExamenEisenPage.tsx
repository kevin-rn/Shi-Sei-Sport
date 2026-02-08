import { useState, useEffect } from 'react';
import { Award, Book, Target, Download, AlertCircle } from 'lucide-react';
import { Icon } from '../components/Icon';
import { getKyuGrades, getImageUrl, type KyuGrade } from '../lib/api';
import type { Media } from '../types/payload-types';
import { useLanguage } from '../contexts/LanguageContext';
import { LoadingDots } from '../components/LoadingDots';

export const ExamenEisenPage = () => {
  const { t, language } = useLanguage();
  const [grades, setGrades] = useState<KyuGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getKyuGrades(language);
        setGrades(response.docs);
      } catch (err) {
        console.error('Error fetching kyu grades:', err);
        setError(t('exam.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [language, t]);

  const getDocumentUrl = (doc: number | Media | null | undefined): string | null => {
    if (!doc) return null;
    if (typeof doc === 'number') return null;
    return getImageUrl(doc);
  };

  const renderRichText = (richText: KyuGrade['description']) => {
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

  const getBeltLabel = (beltLevel: string): string => {
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
        <span className="text-judo-red font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 mb-3">
          <Icon name="martial-arts" size={20} className="text-judo-red" />
          {t('exam.subtitle')}
        </span>
        <h1 className="text-5xl font-extrabold text-judo-dark mb-4">{t('exam.title')}</h1>
        <p className="text-judo-gray text-lg max-w-2xl mx-auto">
          {t('exam.description')}
        </p>
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-light-gray rounded-lg p-6 text-center">
          <Target className="w-10 h-10 text-judo-red mx-auto mb-3" />
          <h3 className="font-bold mb-2">{t('exam.minAge')}</h3>
          <p className="text-sm text-judo-gray">{t('exam.minAgeValue')}</p>
        </div>
        <div className="bg-light-gray rounded-lg p-6 text-center">
          <Book className="w-10 h-10 text-judo-red mx-auto mb-3" />
          <h3 className="font-bold mb-2">{t('exam.theory')}</h3>
          <p className="text-sm text-judo-gray">{t('exam.theoryValue')}</p>
        </div>
        <div className="bg-light-gray rounded-lg p-6 text-center">
          <Award className="w-10 h-10 text-judo-red mx-auto mb-3" />
          <h3 className="font-bold mb-2">{t('exam.practice')}</h3>
          <p className="text-sm text-judo-gray">{t('exam.practiceValue')}</p>
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
                        <a
                          href={examDocUrl}
                          download
                          className="flex items-center gap-2 bg-judo-red text-white px-4 py-2 rounded-lg hover:bg-judo-red/90 transition-colors flex-shrink-0"
                          aria-label={`${t('exam.download')} ${grade.title}`}
                        >
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline">{t('exam.download')}</span>
                        </a>
                      )}
                    </div>

                    {/* Description / Requirements */}
                    <div className="mb-4">
                      {renderRichText(grade.description)}
                    </div>

                    {/* Supplementary Documents */}
                    {grade.supplementaryDocuments && grade.supplementaryDocuments.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="font-semibold mb-3 text-judo-dark flex items-center gap-2">
                          <Book className="w-5 h-5 text-judo-red" />
                          {t('exam.supplementary')}
                        </h4>
                        <div className="space-y-2">
                          {grade.supplementaryDocuments.map((supDoc, idx) => {
                            const docUrl = getDocumentUrl(supDoc.document);
                            if (!docUrl) return null;

                            return (
                              <a
                                key={supDoc.id || idx}
                                href={docUrl}
                                download
                                className="flex items-center gap-2 text-judo-red hover:text-judo-red/80 transition-colors"
                              >
                                <Download className="w-4 h-4" />
                                <span>{supDoc.description || `Document ${idx + 1}`}</span>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
