import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export function SEO({ 
  title = "XYN - Professional Web & Mobile Development",
  description = "A premium software house mapping the future through precise engineering. We build web applications, mobile developments, and robust enterprise server architectures. Base of operations: Solo, Jogja, Jawa Tengah.",
  keywords = "software house, web development, mobile development, jasa pembuatan web, aplikasi server, coding, solo, jogja, jawa tengah",
  image = "/og-xynhub.png",
  url = "https://xynhub.com"
}: SEOProps) {
  const finalTitle = title.includes("XYN") ? title : `${title} | XYN`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={finalTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
}
