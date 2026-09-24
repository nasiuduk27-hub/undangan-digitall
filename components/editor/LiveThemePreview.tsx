"use client";

import { useState } from "react";
import { PreviewToggle, type PreviewMode } from "@/components/editor/PreviewToggle";
import { IPhoneFrame } from "@/components/editor/IPhoneFrame";
import { BrowserFrame } from "@/components/editor/BrowserFrame";
import { ThemeRenderer } from "@/components/themes/theme-renderer";

type MediaAsset = { id: string; type: string; url: string; status: string };
type BankAccount = {
  id: string;
  bank_code: string;
  account_number: string;
  account_holder: string;
  bank: { name: string; logo_url: string };
};

type LiveInvitationData = {
  slug: string;
  theme_id: string;
  groom_name: string;
  bride_name: string;
  event_date: Date;
  location: string | null;
  media_assets: MediaAsset[];
  bank_accounts: BankAccount[];
};

export function LiveThemePreview({
  invitation,
  mode: controlledMode,
  onModeChange,
}: {
  invitation: LiveInvitationData;
  mode?: PreviewMode;
  onModeChange?: (mode: PreviewMode) => void;
}) {
  const [internalMode, setInternalMode] = useState<PreviewMode>("mobile");

  const currentMode = controlledMode ?? internalMode;
  const handleModeChange = onModeChange ?? setInternalMode;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center justify-between w-full border-b border-[#e7ddd0] pb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#7a6f63]">
          Live Preview Editor
        </span>
        <PreviewToggle mode={currentMode} onChange={handleModeChange} />
      </div>

      <div className="w-full transition-all duration-300">
        {currentMode === "mobile" ? (
          <IPhoneFrame>
            <ThemeRenderer invitation={invitation} />
          </IPhoneFrame>
        ) : (
          <BrowserFrame invitationSlug={invitation.slug}>
            <ThemeRenderer invitation={invitation} />
          </BrowserFrame>
        )}
      </div>
    </div>
  );
}
