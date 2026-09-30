import type { ComponentType } from "react";

export type MediaAsset = { id: string; type: string; url: string; status: string };
export type BankAccount = {
  id: string;
  bank_code: string;
  account_number: string;
  account_holder: string;
  bank: { name: string; logo_url: string };
};
export type Invitation = {
  slug: string;
  theme_id: string;
  groom_name: string;
  bride_name: string;
  event_date: Date;
  location: string | null;
  media_assets: MediaAsset[];
  bank_accounts: BankAccount[];
};
export type Guest = {
  name: string;
  slug_token: string;
  rsvp?: null | { attendance_status: string; pax_count: number; wish_message: string | null };
};
export type Wish = { id: string; wish_message: string | null; guest: { name: string } };

export type FloralPalette = {
  bg: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  accentText: string;
  accentStrong: string;
  border: string;
};

export type FloralCopy = {
  coverTagline: string;
  coverQuote: string;
  galleryTitle: string;
  profileTitle: string;
  scheduleTitle: string;
  bankTitle: string;
  wishesTitle: string;
  nav: { gallery: string; profile: string; schedule: string; gift: string };
};

export type CoverAnimationProps = {
  groomName: string;
  brideName: string;
  guestName?: string | null;
  opened: boolean;
  disableHeavyAnim: boolean;
  config: FloralThemeConfig;
  onComplete: () => void;
};

export type FloralThemeConfig = {
  id: string;
  palette: FloralPalette;
  headerFontFamily: string;
  bodyFontFamily: string;
  copy: FloralCopy;
  OrnamentCorner: ComponentType<{ className?: string }>;
  OrnamentDivider: ComponentType<{ className?: string }>;
  CoverAnimation: ComponentType<CoverAnimationProps>;
};
