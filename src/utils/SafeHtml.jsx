import React from "react";
import DOMPurify from "dompurify";

const SafeHtml = ({ html, className }) => {
  const sanitized = React.useMemo(() => DOMPurify.sanitize(html || ""), [html]);
  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitized }} />;
};

export default SafeHtml;
