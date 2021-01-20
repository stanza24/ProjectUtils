import i18next from 'i18next';
import {trn} from './locales';

const options = {
    lng: 'ru',
    fallbackLng: 'ru',
    resources: {
        ru: {
            common: trn.ru,
        },
    },
    interpolation: {
        escapeValue: false,
    },
    ns: 'common',
    defaultNS: 'common',
};

i18next.init(options);

export {i18next};
