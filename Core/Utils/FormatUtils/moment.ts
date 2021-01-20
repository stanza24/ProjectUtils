import {isString} from 'lodash';
import moment, {Moment} from 'moment';
import {
    CALENDAR_INPUT_DATE_FORMAT,
    FRONTEND_DATE_FORMAT,
    FRONTEND_TIME_FORMAT,
    SERVER_DATETIME_FORMAT,
    SERVER_DATE_FORMAT,
} from 'Core/Const/DateFormatConst';

/**
 * Переводит переданную js Date в Moment Date.;
 *
 * @param date Дата.
 */
export const jsDateToMoment = (date: Date): Moment => moment(date);

/**
 * Переводит переданную строку дату (время) в js Date.;
 *
 * @param dateString Дата.
 * @param [format] формат даты времени передаваемый с сервера по умолчанию serverFormat"
 */
export const strToMoment = (dateString: string, format: string = SERVER_DATE_FORMAT): Moment => moment(dateString, format);

/**
 * Переводит переданную серверную дату в js Date.;
 *
 * @param dateString Дата.
 */
export const serverDateToMoment = (dateString: string): Moment => strToMoment(dateString, SERVER_DATE_FORMAT);

/**
 * Переводит переданную серверную дата-время в js Date.;
 *
 * @param dateString Дата.
 */
export const serverDatetimeToMoment = (dateString: string): Moment => strToMoment(dateString, SERVER_DATETIME_FORMAT);

/**
 * Возвращает дату в формате "ДД.ММ.ГГГГ";
 *
 * @param fullDate полная дата
 * @param withFormat нужно ли получать дату со словами вчера/завтра/сегодня
 */
export const getRuDate = (fullDate: string | Moment, withFormat = false): string => {
    return moment(fullDate).calendar({
        sameDay: withFormat ? '[Сегодня]' : FRONTEND_DATE_FORMAT,
        nextDay: FRONTEND_DATE_FORMAT,
        lastDay: withFormat ? '[Вчера]' : FRONTEND_DATE_FORMAT,
        nextWeek: FRONTEND_DATE_FORMAT,
        lastWeek: FRONTEND_DATE_FORMAT,
        sameElse: FRONTEND_DATE_FORMAT,
    });
};

/**
 * Возвращает время в формате "ЧЧ:ММ".
 *
 * @param fullDate полная дата.
 */
export const getRuTime = (fullDate: string | Moment): string => moment(fullDate).format(FRONTEND_TIME_FORMAT);

/**
 * Возвращает сегодняшнюю дату объектом Moment.
 */
export const getTodayDate = (): Moment => moment();

/**
 * Возвращает дату в формате ГГГГ-ММ-ДД для календарного инпута.
 *
 * @param fullDate дата строкой или объектом Moment.
 */
export const getInputDate = (fullDate: string | Moment): string => moment(fullDate).format(CALENDAR_INPUT_DATE_FORMAT);

/**
 * Возвращает дату в формате YYYYMMDDTHHmmss для передачи по JSON.
 *
 * @param fullDate дата строкой или объектом Moment.
 */
export const getJSONDate = (fullDate: string | Moment = getTodayDate()): string => moment(fullDate).format(SERVER_DATETIME_FORMAT);

/**
 * Возвращает текущие дату и время в формате YYYYMMDDTHHmmss для передачи по JSON.
 */
export const getJSONTodayDate = (): string => getTodayDate().format(SERVER_DATETIME_FORMAT);

/**
 * Возвращает интервал между датами в разбивке по дням, часам, минутам.
 *
 * @param earlyDate Ранняя дата.
 * @param lDate Поздняя дата.
 */
export const getDiff = (
    earlyDate: string | Moment,
    lDate: string | Moment = getTodayDate()
): {days: number; hours: number; minutes: number} => {
    const laterDate = isString(lDate) ? strToMoment(lDate) : lDate;
    const days = laterDate.diff(earlyDate, 'days');
    const hours = laterDate.diff(earlyDate, 'hours') - days * 24;
    const minutes = laterDate.diff(earlyDate, 'minutes') - (days * 24 * 60 + hours * 60);
    return {days, hours, minutes};
};

/**
 * Возвращает разницу между датой и текущим моментом.
 *
 * @param fullDate дата строкой или объектом момент.
 */
export const timeFromNow = (fullDate: string | Moment): string => {
    moment.updateLocale('ru', {});
    return moment(fullDate).fromNow(true);
};

/**
 * Переводит переданную js Date в формат JSON.
 *
 * @param date Дата.
 */
export const jsDateToServerDatetime = (date: Date): string => getJSONDate(jsDateToMoment(date));
