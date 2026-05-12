export const siteUrl = "https://eloyye.com";
export const siteName = "Eloy Ye";
export const defaultDescription =
  "Personal site for Eloy Ye: software work, writing, and ways to get in touch.";
export const defaultOgImagePath = "/og-default.webp";

export const absoluteUrl = (path: string) => new URL(path, siteUrl).toString();

type SeoMetaInput = {
  description: string;
  image?: string;
  path: string;
  title: string;
  type?: "article" | "website";
};

export const createMeta = ({
  description,
  image = defaultOgImagePath,
  path,
  title,
  type = "website",
}: SeoMetaInput) => {
  const url = absoluteUrl(path);
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:site_name", content: siteName },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:image", content: imageUrl },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
  ];
};
