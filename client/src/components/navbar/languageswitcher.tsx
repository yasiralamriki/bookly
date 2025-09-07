import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import LanguageDetector from 'i18next-browser-languagedetector';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  function handleLanguageChange(language: string) {
    i18n.changeLanguage(language);
  }

  function getBrowserLanguage() {
    const detector = new LanguageDetector();
    const language = detector.detect();
    const supportedLanguages = ["en", "ar"]; // Define supported languages
    
    // Handle case where language is an array or string
    const detectedLang = Array.isArray(language) ? language[0] : language;
    
    if (detectedLang && supportedLanguages.includes(detectedLang)) {
      return detectedLang; // Return the detected language if it's supported
    } else {
      return "en"; // Default to English if the detected language is not supported
    }
  }

  return (
    <Select defaultValue={getBrowserLanguage()} onValueChange={handleLanguageChange}>
      <SelectTrigger className="cursor-pointer">
        <SelectValue placeholder="Language"></SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en" className="cursor-pointer">
          {t('english')}
        </SelectItem>
        <SelectItem value="ar" className="cursor-pointer">
          {t('arabic')}
        </SelectItem>
      </SelectContent>
    </Select>
  )
}