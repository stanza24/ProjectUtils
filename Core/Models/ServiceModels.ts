import {AxiosRequestConfig} from 'axios';

/**
 * Интерфейс источника данных для запроса через axios.
 *
 * @prop url адрес REST.
 * @prop mock путь к моку, если restActive is false или forceMock is true.
 * @prop forceMock путь к моку.
 */
export interface IServiceSource {
    url: string;
    mock?: string;
    forceMock?: boolean;
}

/**
 * Интерфейс времени ожидания для получения моков через ServiceWrapper.
 *
 * @prop minDelay Минимальное время ожидания мока.
 * @prop maxDelay Максимальное время ожидания мока.
 */
export interface IServiceMockDelay {
    minDelay: number;
    maxDelay: number;
}

/**
 * Интерфейс источника данных для запроса через axios.
 *
 * TODO через Pick выбрать то что можно менять
 */
export interface IAxiosRequestConfig extends Omit<AxiosRequestConfig, 'params'> {}

/**
 * Более жеская типизация params query
 */
export type TParams = {
    [key: string]: string | number | boolean;
};
