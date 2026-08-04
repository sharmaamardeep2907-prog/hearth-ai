"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Analytics } from "@/lib/analytics";

export function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => { const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ""); Analytics.pageView(url); }, [pathname, searchParams]);
  return null;
}