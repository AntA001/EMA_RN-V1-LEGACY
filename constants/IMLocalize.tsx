import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import en from '../translations/en';
import al from '../translations/al';
import mk from '../translations/mk';
import bg from '../translations/bg';
import el from '../translations/el';

const LANGUAGES = {
  en,
  al,
  mk,
  bg,
  el,
};

const LANG_CODES = Object.keys(LANGUAGES);
const LANGUAGE_DETECTOR: any = {
  type: 'languageDetector',
  async: true,
  detect: (callback: any) => {
    AsyncStorage.getItem('user-language', (err, language) => {
      // if error fetching stored data or no language was stored
      // display errors when in DEV mode as console statements
      if (err || !language) {
        if (err) {
          console.log('Error fetching Languages from asyncstorage ', err);
        } else {
          console.log(
            'No language is set, choosing Locale Language as fallback',
          );
        }
        let locale = RNLocalize.getLocales();
        if (locale[0].languageCode === 'sq') {
          callback('al');
        } else if (locale[0].languageCode === 'el') {
          callback('el');
        }else if (locale[0].languageCode === 'mk') {
          callback('mk');
        }else if (locale[0].languageCode === 'bg') {
          callback('bg');
        } else {
          callback('en');
        }
        // const findBestAvailableLanguage =
        //   RNLocalize.findBestAvailableLanguage(LANG_CODES);

        // callback(findBestAvailableLanguage.languageTag || 'en');
        return;
      }
      callback(language);
    });
  },
  init: () => {},
  cacheUserLanguage: (language: any) => {
    AsyncStorage.setItem('user-language', language);
  },
};

i18n
  // detect language
  .use(LANGUAGE_DETECTOR)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // set options
  .init({
    compatibilityJSON: 'v3',
    resources: LANGUAGES,
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
  });
