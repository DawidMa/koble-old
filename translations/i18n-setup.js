import {I18n} from 'i18n-js';
import de from './de.json';
import pl from './pl.json';
import en from './en.json';
import {getLocales} from "expo-localization";

// Set up i18n
const i18n = new I18n({en, de, pl})
let locales = getLocales();
if (locales.length > 0) {
    i18n.locale = locales[0].languageCode;
} else {
    i18n.locale = 'en'
}

i18n.fallbacks = true;

export default i18n;
