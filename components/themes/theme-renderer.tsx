import { EditorialBrutalismTheme } from "@/components/themes/editorial-brutalism/editorial-brutalism-theme";
import { RawWabiSabiTheme } from "@/components/themes/raw-wabi-sabi/raw-wabi-sabi-theme";
import { CyberCelestialNoirTheme } from "@/components/themes/cyber-celestial-noir/cyber-celestial-noir-theme";
import { Groovy70sTheme } from "@/components/themes/70s-warm-groovy/groovy-theme";

type MediaAsset = { id: string; type: string; url: string; status: string };
type BankAccount = {
  id: string;
  bank_code: string;
  account_number: string;
  account_holder: string;
  bank: { name: string; logo_url: string };
};
type Invitation = {
  slug: string;
  theme_id: string;
  groom_name: string;
  bride_name: string;
  event_date: Date;
  location: string | null;
  media_assets: MediaAsset[];
  bank_accounts: BankAccount[];
};
type Guest = {
  name: string;
  slug_token: string;
  rsvp?: null | { attendance_status: string; pax_count: number; wish_message: string | null };
};
type Wish = { id: string; wish_message: string | null; guest: { name: string } };

export function ThemeRenderer({
  invitation,
  guest,
  wishes,
}: {
  invitation: Invitation;
  guest?: Guest | null;
  wishes?: Wish[];
}) {
  switch (invitation.theme_id) {
    case "raw-wabi-sabi":
      return <RawWabiSabiTheme invitation={invitation} guest={guest} wishes={wishes} />;
    case "cyber-celestial-noir":
      return <CyberCelestialNoirTheme invitation={invitation} guest={guest} wishes={wishes} />;
    case "70s-warm-groovy":
      return <Groovy70sTheme invitation={invitation} guest={guest} wishes={wishes} />;
    case "editorial-brutalism":
    default:
      return <EditorialBrutalismTheme invitation={invitation} guest={guest} wishes={wishes} />;
  }
}
