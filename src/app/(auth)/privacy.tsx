import LegalScreen from "@/components/legal/LegalScreen";
import { PRIVACY_VERSION, privacySections } from "@/constants/legal";

export default function PrivacyScreen() {
  return (
    <LegalScreen
      title="Privacy Policy"
      subtitle="Learn how ApusFly handles and protects your personal information."
      version={PRIVACY_VERSION}
      sections={privacySections}
    />
  );
}
