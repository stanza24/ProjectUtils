import {AdditionalPickerLocaleLangProps} from 'antd/es/date-picker/generatePicker';
import ruRU from 'antd/es/locale/ru_RU';
import {Locale as RcPickerLocale} from 'rc-picker/lib/interface';
import {DAY_FORMAT, FRONTEND_DATETIME_FORMAT, FRONTEND_DATE_FORMAT, YEAR_FORMAT} from '../../Const';

export const lang: RcPickerLocale & AdditionalPickerLocaleLangProps = {
    ...ruRU.DatePicker.lang,
    yearFormat: YEAR_FORMAT,
    dateFormat: FRONTEND_DATE_FORMAT,
    dayFormat: DAY_FORMAT,
    dateTimeFormat: FRONTEND_DATETIME_FORMAT,
};
