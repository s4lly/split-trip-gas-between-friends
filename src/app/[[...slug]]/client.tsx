"use client";

import React from "react";
import dynamic from "next/dynamic";

const Root = dynamic(() => import("../../Root"), { ssr: false });

export function ClientOnly() {
  return <Root />;
}
