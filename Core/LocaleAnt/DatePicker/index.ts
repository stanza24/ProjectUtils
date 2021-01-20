import {PickerLocale as DatePickerLocale} from 'antd/es/date-picker/generatePicker';
import ruRU from 'antd/es/locale/ru_RU';
import {lang} from './lang';

export const DatePicker: DatePickerLocale = {
    ...ruRU.DatePicker,
    lang,
};
