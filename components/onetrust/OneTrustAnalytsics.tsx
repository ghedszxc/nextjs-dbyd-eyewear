"use client"

import Script from "next/script";

declare global {
  interface Window {
    OptanonWrapper?: () => void;
  }
}

const OneTrustAnalytics = () => {
  return (
    <Script
      
      src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
      strategy="afterInteractive"
      data-domain-script="019c31c3-ce06-7968-ad6d-92e17123704a"
      //data-domain-script="019d42de-07fb-7a6f-b9e8-3ed0c34b5e28"
      //data-domain-script="019d42de-07fb-7a6f-b9e8-3ed0c34b5e28-test"
    />
  );
};

export default OneTrustAnalytics;
