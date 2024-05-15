import i18n from "@/translations/i18n-setup";

export const useTranslation = () => {
    const t = (key: string): string => {
        return i18n.t(key);
    };

    return { t };
};