import ruRU from 'antd/es/locale/ru_RU';
import {DAY_FORMAT, FRONTEND_DATETIME_FORMAT, FRONTEND_DATE_FORMAT, YEAR_FORMAT} from '../../Const';

export const lang = {
    // @ts-ignore Типизация переводов оставляет желать лучшего, календарь представлен как объект
    ...ruRU.Calendar?.lang,
    yearFormat: YEAR_FORMAT,
    dateFormat: FRONTEND_DATE_FORMAT,
    dayFormat: DAY_FORMAT,
    dateTimeFormat: FRONTEND_DATETIME_FORMAT,
};
