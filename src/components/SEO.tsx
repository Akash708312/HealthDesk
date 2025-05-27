
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  type?: string;
  name?: string;
  imageUrl?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'HealthDesk',
  description = 'HealthDesk: Pioneering smart health solutions.',
  type = 'website',
  name = 'HealthDesk',
  imageUrl = '/og-image.png'
}) => {
  const location = useLocation();
  const currentUrl = `https://healthdesk-ten.vercel.app/${location.pathname}`;

  // Create JSON-LD structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HealthDesk Technologies',
    url: 'https://healthdesk-ten.vercel.app/',
    logo: '/activity.png',
    description: 'Pioneering smart engineering solutions with textile sensors',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'info@HealthDesk.com'
    },
    sameAs: [
      'https://www.linkedin.com/company/HealthDesk-technologies',
      'https://twitter.com/HealthDesktechnologies'
    ]
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      
      {/* JSON-LD structured data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
