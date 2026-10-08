import LegalScreen from "@/components/legal/LegalScreen";
import { TERMS_VERSION, termsSections } from "@/constants/legal";

export default function TermsScreen() {
  return (
    <LegalScreen
      title="Terms of Service"
      subtitle="Please read these terms carefully before using ApusFly."
      version={TERMS_VERSION}
      sections={termsSections}
    />
  );
}
