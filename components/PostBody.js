import sanitizeHtml from "sanitize-html";

const postHtmlOptions = {
  allowedTags: ["h1", "h2", "h3", "strong", "em", "code", "a", "li", "ul", "br"],
  allowedAttributes: { a: ["href"] },
  allowedSchemes: ["http", "https", "mailto"],
  allowProtocolRelative: false
};

export default function PostBody({ html }) {
  const safeHtml = sanitizeHtml(String(html ?? ""), postHtmlOptions);
  return <div className="post-body" dangerouslySetInnerHTML={{ __html: safeHtml }} />;
}
