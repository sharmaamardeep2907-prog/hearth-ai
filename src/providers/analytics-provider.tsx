"use client";

import * as React from "react";
import { Analytics } from "@/lib/analytics";

interface AnalyticsProviderProps { children: React.ReactNode; ga4Id?: string; clarityId?: string; }

export function AnalyticsProvider({ children, ga4Id, clarityId }: AnalyticsProviderProps) {
  React.useEffect(() => { Analytics.init(ga4Id, clarityId); }, [ga4Id, clarityId]);
  return <>{children}</>;
}