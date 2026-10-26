"use client";
import NextLink from "next/link";
import type { ComponentProps } from "react";
import { localizeHref } from "@/lib/i18n/config";
import { useLocale } from "./locale-provider";

/** next/link that points to the current language: pass canonical (French) paths. */
export default function Link({ href, ...props }: ComponentProps<typeof NextLink>) {
  const locale = useLocale();
  return <NextLink href={typeof href === "string" ? localizeHref(href, locale) : href} {...props} />;
}
