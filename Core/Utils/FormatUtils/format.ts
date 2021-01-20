import {includes} from 'lodash';
import {RegExpPattern} from 'Core';

/**
 * Функция, форматирующая количество в байт в формат NUM SIZE
 *
 * @param bytes количество байт
 * @param decimals символы после запятой
 */

export const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Функция возвращает результат проверки электронной почты.
 *
 * @param emailString Строка потенциально содержащая электронную почту.
 */
export const isValidEmail = (emailString: string): boolean => new RegExp(RegExpPattern.EMAIL).test(emailString);

export const isValidUrl = (urlString: string): boolean => new RegExp(RegExpPattern.URL).test(urlString);

export const isValidDate = (dateString: string): boolean => new RegExp(RegExpPattern.DATE).test(dateString);

export const isValidTel = (telString: string): boolean => new RegExp(RegExpPattern.TEL).test(telString);

/**
 * Функция возвращает валидную электронную почту, или undefined.
 *
 * @param emailString Строка потенциально содержащая электронную почту.
 */
export const getValidEmail = (emailString: string): string => {
    const emailStringTrim: string = emailString.trim();

    return isValidEmail(emailStringTrim) ? emailStringTrim : undefined;
};

const fewDigits = [2, 3, 4];
const notFewDigits = [12, 13, 14];
const manyDigits = [5, 6, 7, 8, 9];
const notManyDigits = [11, 12, 13, 14];

/** Функция плюрализации русских числительных. */
export const ruPlural = (key: string, count: number): string => {
    let pluralPostfix = '_other';

    if (count % 10 === 1 && count % 1000 !== 11) pluralPostfix = '_one';

    if (includes(fewDigits, count % 10) && includes(notFewDigits, count % 100)) pluralPostfix = '_few';

    if (count % 10 === 0 || includes(manyDigits, count % 10) || includes(notManyDigits, count % 100)) pluralPostfix = '_many';

    return key + pluralPostfix;
};
