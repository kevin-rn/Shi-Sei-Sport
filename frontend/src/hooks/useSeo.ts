import { useEffect } from 'react';

interface SeoOptions {
  title: string;
  description?: string;
}

const SITE_NAME = 'Shi-Sei Sport';

export const useSeo = ({ title, description }: SeoOptions) => {
  useEffect(() => {
    document.title = `${title} | ${SITE_NAME}`;

    if (description) {
      let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (metaDesc) metaDesc.content = description;

      let ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
      if (ogTitle) ogTitle.content = `${title} | ${SITE_NAME}`;

      let ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
      if (ogDesc) ogDesc.content = description;
    }

    let ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    if (ogUrl) ogUrl.content = window.location.href;

    return () => {
      document.title = SITE_NAME;
    };
  }, [title, description]);
};
