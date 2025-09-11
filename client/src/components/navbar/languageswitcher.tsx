import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { Globe } from "lucide-react"
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

  function getLanguageDisplay(lang: string) {
    switch (lang) {
      case 'en':
        return { name: t('english'), flag: '🇺🇸', code: 'EN' };
      case 'ar':
        return { name: t('arabic'), flag: '🇸🇦', code: 'AR' };
      default:
        return { name: t('english'), flag: '🇺🇸', code: 'EN' };
    }
  }

  const currentLang = getBrowserLanguage();
  const currentDisplay = getLanguageDisplay(i18n.language || currentLang);

  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="cursor-pointer h-9 w-auto min-w-[120px] border-none bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors focus:ring-0 focus:ring-offset-0">
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-emerald-500" />
          <span className="text-sm font-medium">{currentDisplay.code}</span>
        </div>
      </SelectTrigger>
      <SelectContent align={i18n.dir() === 'rtl' ? "start" : "end"} className="min-w-[160px]">
        <SelectItem value="en" className="cursor-pointer group">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <span className="text-lg">🇺🇸</span>
              <span className="font-medium">{t('english')}</span>
            </div>
          </div>
        </SelectItem>
        <SelectItem value="ar" className="cursor-pointer group">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <span className="text-lg">🇸🇦</span>
              <span className="font-medium">{t('arabic')}</span>
            </div>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}