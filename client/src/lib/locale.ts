// Utility function for locale-aware date formatting
export function formatDateByLocale(timestamp: number, locale: string, t: (key: string) => string): string {
	if (!timestamp) return t('no_date');
	
	try {
		const date = new Date(timestamp);
		
		// Check if date is valid
		if (isNaN(date.getTime())) {
			return t('invalid_date');
		}
		
		// Configure date formatting options based on locale
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			calendar: locale === "ar" ? "islamic" : "gregory",
		};
		
		// Use Intl.DateTimeFormat for proper locale support
		return new Intl.DateTimeFormat(locale, options).format(date);
	} catch (error) {
		console.error('Error formatting date:', error);
		return t('invalid_date');
	}
}

export default {
    formatDateByLocale
}