import React from "react";

// TypeScript version of react-https-redirect 1.1.0
// Acquired via https://www.npmjs.com/package/react-https-redirect
// MIT Licence

const isLocalHost = (hostname: string) =>
  !!(
    hostname === "localhost" ||
    hostname === "[::1]" ||
    hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
  );

const HttpsRedirect: React.FC<{ disabled?: boolean, children?: React.ReactNode }> = (props) => {
  if (
    !props.disabled &&
    typeof window !== "undefined" &&
    window.location &&
    window.location.protocol === "http:" &&
    !isLocalHost(window.location.hostname)
  ) {
    window.location.href = window.location.href.replace(/^http(?!s)/, "https");
    return null;
  }

  return <>{props.children}</>;
};

export default HttpsRedirect;
