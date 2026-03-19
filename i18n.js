import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization"; // Importa o cara que lê o sistema

import pt from "./locales/pt.json";
import en from "./locales/en.json";

const systemLng = Localization.getLocales()[0].languageCode;

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  lng: systemLng, // Define a língua do sistema como padrão
  fallbackLng: "pt", // Se o sistema estiver em Russo (e você não tiver russo), ele usa PT
  resources: {
    pt: { translation: pt },
    en: { translation: en },
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
