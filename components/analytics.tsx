import Script from 'next/script';

export default function Analytics() {
  const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER;
  const id = process.env.NEXT_PUBLIC_ANALYTICS_ID;

  if (!provider || provider === 'none' || !id) {
    return null;
  }

  if (provider === 'plausible') {
    return (
      <Script
        data-domain={id}
        src="https://plausible.io/js/script.js"
        strategy="afterInteractive"
      />
    );
  }

  if (provider === 'ga4') {
    return (
      <>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${id}');`}
        </Script>
      </>
    );
  }

  return null;
}
