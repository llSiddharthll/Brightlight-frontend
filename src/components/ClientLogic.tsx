"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Loader from "./ui/loader";

interface RedirectRule {
  from: string;
  to: string;
}

export default function ClientLogic({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [redirectsData, setRedirectsData] = useState<RedirectRule[]>([]);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. GA and FB Pixel tracking on route change
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "PageView");
    }
    // GTAG usually handles history-based routing automatically if configured, 
    // but we can trigger it manually if needed. 
    // The old code only triggered fbq manually.
  }, [pathname, searchParams]);

  // 2. Global loading logic (API awake check)
  useEffect(() => {
    let isDone = false;
    const timeout = setTimeout(() => {
      if (!isDone) setIsLoading(false);
    }, 4000);

    fetch("https://brightlight-node.onrender.com")
      .then(() => {
        isDone = true;
        setIsLoading(false);
      })
      .catch(() => {
        isDone = true;
        setIsLoading(false);
      });

    return () => clearTimeout(timeout);
  }, []);

  // 3. Fetch Redirects
  useEffect(() => {
    async function fetchRedirects() {
      try {
        const response = await fetch("https://brightlight-node.onrender.com/redirects");
        if (!response.ok) throw new Error("API Response Not OK");

        const data = await response.json();
        if (!data || !Array.isArray(data) || data.length === 0) return;

        const mappedData = Object.keys(data[0])
          .filter((key) => key.startsWith("redirectFrom"))
          .map((key) => ({
            from: data[0][key],
            to: data[0][key.replace("redirectFrom", "redirectTo")],
          }))
          .filter((redirect) => redirect.from && redirect.to);

        if (mappedData.length > 0) setRedirectsData(mappedData);
      } catch (error) {
        console.error("Redirect Fetch Error:", error);
      }
    }

    fetchRedirects();
  }, []);

  // 4. Apply Redirects
  useEffect(() => {
    const currentPath = window.location.pathname;
    redirectsData.forEach((redirect) => {
      if (currentPath === redirect.from && currentPath !== `/${redirect.to}`) {
        window.history.replaceState(null, "", `/${redirect.to}`);
      }
    });
  }, [redirectsData, pathname]);

  // 5. Background color logic
  useEffect(() => {
    const updateBackgroundColor = () => {
      document.body.style.backgroundColor =
        window.location.pathname.startsWith("/admin") ? "rgb(241, 241, 241)" : "white";
    };

    updateBackgroundColor();
    // In App Router, pathname change covers most cases
  }, [pathname]);

  if (isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
}
