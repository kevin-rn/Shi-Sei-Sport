import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Download, FileText, AlertCircle, Mail, Shield } from 'lucide-react';
import { getDocuments, getImageUrl, getVCPInfo, type VCPInfo } from '../lib/api';
import type { Document, Media } from '../types/payload-types';
import { useLanguage } from '../contexts/LanguageContext';
import { Icon } from '../components/Icon';
import { RichTextRenderer } from '../components/RichTextRenderer';
import { LoadingDots } from '../components/LoadingDots';
import { FillButton } from '../components/FillButton';

export const RulesPage = () => {
  const { t, language } = useLanguage();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [vcpInfo, setVcpInfo] = useState<VCPInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [documentsResponse, vcpResponse] = await Promise.all([
          getDocuments('regulation', language),
          getVCPInfo(language),
        ]);
        setDocuments(documentsResponse.docs);
        setVcpInfo(vcpResponse);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(t('regels.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language, t]);

  const toggleExpanded = (id: number) => {
    const isOpening = expandedId !== id;
    setExpandedId(isOpening ? id : null);
    if (isOpening) {
      setTimeout(() => {
        itemRefs.current.get(id)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 0);
    }
  };

  const getDownloadUrl = (attachment: number | Media | null | undefined): string | null => {
    if (!attachment) return null;
    if (typeof attachment === 'number') return null;
    return getImageUrl(attachment);
  };


  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-32 max-w-6xl">
        <div className="text-center">
          <LoadingDots />
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
            <h3 className="font-bold text-red-900 mb-2">{t('regels.error')}</h3>
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
          <Icon name="clipboard" size={42} className="text-judo-red" />
          {t('regels.title')}
        </h1>
        <p className="text-judo-gray text-lg max-w-2xl mx-auto">
          {t('regels.description')}
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-light-gray border border-gray-200 rounded-2xl p-8 mb-12 flex items-start gap-6">
        <div className="shrink-0 bg-judo-red/10 p-4 rounded-2xl">
          <FileText className="w-8 h-8 text-judo-red" />
        </div>
        <div>
          <h3 className="font-bold text-judo-red text-xl mb-2">{t('regels.infoTitle')}</h3>
          <p className="text-judo-gray leading-relaxed">{t('regels.infoText')}</p>
        </div>
      </div>

      {/* Documents List */}
      {documents.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-judo-gray">{t('regels.noDocuments')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => {
            const isExpanded = expandedId === doc.id;
            const downloadUrl = getDownloadUrl(doc.attachment);

            return (
              <div
                key={doc.id}
                ref={(el: HTMLDivElement | null) => { if (el) itemRefs.current.set(doc.id, el); else itemRefs.current.delete(doc.id); }}
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
                      <FillButton
                        href={downloadUrl}
                        download
                        onClick={(e) => e.stopPropagation()}
                        className="download-button-fill flex items-center gap-2 bg-judo-red text-white px-4 py-2 rounded-lg border-2 border-judo-red hover:bg-white hover:text-judo-red flex-shrink-0 overflow-hidden"
                        aria-label={`${t('regels.download')} ${doc.title}`}
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">{t('regels.download')}</span>
                      </FillButton>
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
                    <div className="pt-6">
                      <RichTextRenderer content={doc.description as any} className="text-judo-gray" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* VCP Section */}
      {vcpInfo && (
        <div className="mt-16">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 md:p-12 text-white mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Shield size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">{t('vcp.title')}</h2>
                <p className="text-white/90 text-lg">{t('vcp.subtitle')}</p>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-6 mb-6">
              <RichTextRenderer content={vcpInfo.introduction as any} className="text-white" />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Contact Info Card */}
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="font-bold text-xl mb-4">{t('vcp.contact')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded">
                      <Shield size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-white/80">{t('vcp.vcpName')}</p>
                      <p className="font-semibold">{vcpInfo.vcpName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-white/80">{t('vcp.email')}</p>
                      <a
                        href={`mailto:${vcpInfo.vcpEmail}`}
                        className="font-semibold hover:underline"
                      >
                        {vcpInfo.vcpEmail}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* What does VCP do */}
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="font-bold text-xl mb-4">{t('vcp.whatDoesVcpDo')}</h3>
                <RichTextRenderer content={vcpInfo.whatDoesVcpDo as any} className="text-white/90" />
              </div>
            </div>
          </div>

          {/* Detailed Info Sections */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* For Whom */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-xl mb-4 text-judo-dark">{t('vcp.forWhom')}</h3>
              <RichTextRenderer content={vcpInfo.forWhom as any} className="text-judo-gray" />
            </div>

            {/* Why Contact */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-xl mb-4 text-judo-dark">{t('vcp.whyContact')}</h3>
              <RichTextRenderer content={vcpInfo.whyContact as any} className="text-judo-gray" />
            </div>
          </div>

          {/* VCP Bio */}
          {vcpInfo.vcpBio && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="font-bold text-xl mb-4 text-blue-900">{t('vcp.aboutVcp')}</h3>
              <RichTextRenderer content={vcpInfo.vcpBio as any} className="text-blue-800" />
            </div>
          )}

          {/* Collapsible Additional Sections */}
          <div className="space-y-4">
            {/* Preventive Policy */}
            {vcpInfo.preventivePolicy && (
              <details
              className="bg-white border border-gray-200 rounded-lg overflow-hidden group"
              onToggle={(e: any) => { const el = e.currentTarget as HTMLDetailsElement; if (el.open) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }}
            >
                <summary className="p-6 cursor-pointer font-bold text-lg text-judo-dark hover:bg-gray-50 transition-colors flex items-center justify-between">
                  {t('vcp.preventivePolicy')}
                  <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="pt-4">
                    <RichTextRenderer content={vcpInfo.preventivePolicy as any} className="text-judo-gray" />
                  </div>
                </div>
              </details>
            )}

            {/* Crossing Behavior */}
            {vcpInfo.crossingBehavior && (
              <details
              className="bg-white border border-gray-200 rounded-lg overflow-hidden group"
              onToggle={(e: any) => { const el = e.currentTarget as HTMLDetailsElement; if (el.open) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }}
            >
                <summary className="p-6 cursor-pointer font-bold text-lg text-judo-dark hover:bg-gray-50 transition-colors flex items-center justify-between">
                  {t('vcp.crossingBehavior')}
                  <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="pt-4">
                    <RichTextRenderer content={vcpInfo.crossingBehavior as any} className="text-judo-gray" />
                  </div>
                </div>
              </details>
            )}

            {/* VCP Tasks */}
            {vcpInfo.vcpTasks && (
              <details
              className="bg-white border border-gray-200 rounded-lg overflow-hidden group"
              onToggle={(e: any) => { const el = e.currentTarget as HTMLDetailsElement; if (el.open) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }}
            >
                <summary className="p-6 cursor-pointer font-bold text-lg text-judo-dark hover:bg-gray-50 transition-colors flex items-center justify-between">
                  {t('vcp.vcpTasks')}
                  <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="pt-4">
                    <RichTextRenderer content={vcpInfo.vcpTasks as any} className="text-judo-gray" />
                  </div>
                </div>
              </details>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
