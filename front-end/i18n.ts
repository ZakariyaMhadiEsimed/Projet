////////LIBRARY/////////
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import commonTranslationFrench from './locales/fr/common.json'
import loginTranslationFrench from './locales/fr/login.json'

i18n
	// pass tes i18n instance to react-i18next.
	.use(initReactI18next)
	// init i18next
	// for all options read: https://www.i18next.com/overview/configuration-options
	.init({
		supportedLngs: ['fr'],
		debug: true,
		fallbackLng: 'fr',
		interpolation: {
			escapeValue: false, // not needed for react as it escapes by default
		},
		load: 'all',
		resources: {
			fr: {
				common: commonTranslationFrench,
				login: loginTranslationFrench,
			},
		},
	})

export default i18n
