import i18next from 'i18next';

declare global {
    namespace Express {
        interface Request {
            _locale: string,
            i18n: {
                t: i18next.TFunction
            },
            requestId: string;
            userAgent: string;
            originalPath: string | null;
            getLocale(): string,
            setLocale(locale: string): void
        }
    }
}
