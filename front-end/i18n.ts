////////LIBRARY/////////
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import commonTranslationFrench from './locales/fr/common.json'
import loginTranslationFrench from './locales/fr/login.json'
import usersTranslationFrench from './locales/fr/users.json'
import usersCreateTranslationFrench from './locales/fr/usersCreate.json'
import usersEditTranslationFrench from './locales/fr/usersEdit.json'
import poseTrackingsTranslationFrench from './locales/fr/poseTrackings.json'
import returnTrackingsTranslationFrench from './locales/fr/returnTrackings.json'
import gcaStocksTranslationFrench from './locales/fr/gcaStocks.json'
import inventoryTrackingsTranslationFrench from './locales/fr/inventoryTrackings.json'
import inventoryDetailTranslationFrench from './locales/fr/inventoryDetail.json'

import commonTranslationEnglish from './locales/en/common.json'
import loginTranslationEnglish from './locales/en/login.json'
import usersTranslationEnglish from './locales/en/users.json'
import usersCreateTranslationEnglish from './locales/en/usersCreate.json'
import usersEditTranslationEnglish from './locales/en/usersEdit.json'
import poseTrackingsTranslationEnglish from './locales/en/poseTrackings.json'
import returnTrackingsTranslationEnglish from './locales/en/returnTrackings.json'
import gcaStocksTranslationEnglish from './locales/en/gcaStocks.json'
import inventoryTrackingsTranslationEnglish from './locales/en/inventoryTrackings.json'
import inventoryDetailTranslationEnglish from './locales/en/inventoryDetail.json'

import commonTranslationSpanish from './locales/es/common.json'
import loginTranslationSpanish from './locales/es/users.json'
import usersTranslationSpanish from './locales/es/users.json'
import usersCreateTranslationSpanish from './locales/es/usersCreate.json'
import usersEditTranslationSpanish from './locales/es/usersEdit.json'
import poseTrackingsTranslationSpanish from './locales/es/poseTrackings.json'
import returnTrackingsTranslationSpanish from './locales/es/returnTrackings.json'
import gcaStocksTranslationSpanish from './locales/es/gcaStocks.json'
import inventoryTrackingsTranslationSpanish from './locales/es/inventoryTrackings.json'
import inventoryDetailTranslationSpanish from './locales/es/inventoryDetail.json'

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
			}
		},
	})

export default i18n
