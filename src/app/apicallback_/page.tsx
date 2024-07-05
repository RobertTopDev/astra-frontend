"use client"

import { parse } from 'cookie-es';
import { useState, useEffect } from 'react';

export default function Page() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      if (window.location.pathname.endsWith('/apicallback_') && !started) {
        setStarted(true);

        try {
          const queryString = window.location.search.substring(1);
          const params = new URLSearchParams(queryString);

          if (!params.has('i')) {
            throw new Error('Parameter "i" is missing.');
          }

          const comebackAtCookie = parse(document.cookie).comebackAt;

          if (!comebackAtCookie) {
            throw new Error('"comebackAt" cookie is missing.');
          }

          // Clear the "comebackAt" cookie after reading it
          document.cookie = 'comebackAt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

          // Construct the redirect URL with the "twitter_confirm" parameter
          const redirectUrl = `${comebackAtCookie}?twitter_confirm=${params.get('i')}`;
          window.location.href = redirectUrl;
        } catch (error) {
          console.error('Error processing API callback:', error);
          // Handle the error (e.g., redirect to a fallback URL)
          window.location.href = '/';
        }
      }
    };

    handleCallback();
  }, [started]);

  return <center className="py-8">Redirecting...</center>;
}