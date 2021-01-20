import {debounce} from 'lodash';
import React from 'react';
import {BASE_DEBOUNCE_CALLBACK_TIME} from 'Core';

/**
 * Объявляем и экспортируем тип для описания обрабатываемого евента Ant.
 */
export type TEventType = React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>;

/**
 * Объявляем ожидаемый в утилитах колбек.
 */
type TStringCallback = (value: string | number) => void;

/**
 * Объявляем колбек который ждёт Ant.
 */
type TChangeEventCallback = (event: TEventType) => void;

/**
 * Возвращает строку из события onChange для Input
 *
 * @param event Событие изменения инпута
 */
export const transformEventToValue = (event: TEventType): string => event.target.value;

/**
 * Функция возвращает переданный колбек, с предварительно обработанным эфентом.
 *
 * @param callback Колбк для которого требуется обернуть эвент.
 */
export const getTransformedHandleInputChange = (callback: TStringCallback): TChangeEventCallback => (event: TEventType) =>
    callback(transformEventToValue(event));

/**
 * Возвращает обработчик инпута с отложенным вызовом колбека
 *
 * @param callback Колбек для обновления текстового поля
 */
export const getDebounceHandleInputChange = (callback: TStringCallback): TChangeEventCallback => {
    const debouncedCallback = debounce(callback, BASE_DEBOUNCE_CALLBACK_TIME);

    return getTransformedHandleInputChange(debouncedCallback);
};

/**
 * Возвращает обработчик инпута с отложенным вызовом колбека
 *
 * @param callback Колбек для обновления текстового поля
 * @param debounceCallBackTime Время через которое требуется вызывать функцию, по умолчанию BASE_DEBOUNCE_CALLBACK_TIME
 */
export const getDebounceSimpleInputCallbackHandleOnChange = (
    callback: TStringCallback,
    debounceCallBackTime: number = BASE_DEBOUNCE_CALLBACK_TIME
): TStringCallback => {
    const debouncedCallback = debounce(callback, debounceCallBackTime);

    return (searchString: string | number) => debouncedCallback(searchString);
};

/**
 * Функция возвращает случайное число от 0 до max.
 *
 * @param [min] Минимальное значение случайного положительного числа - по умолчанию 100.
 * @param [max] Максимальное значение случайного положительного числа - по умолчанию 100.
 */
export const randomInteger = (min = 0, max = 100): number => Math.round(Math.random() * (max - min) + min);
