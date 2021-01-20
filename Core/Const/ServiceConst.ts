import {AxiosRequestConfig} from 'axios';
import {IServiceMockDelay} from '../Models';

/**
 * Основная конфигурация для клиент-серверного взаимодействия.
 *
 * TODO Заполнить как появится стенд, или понимание того что тут должно быть
 */
export const serviceConfiguration: AxiosRequestConfig = {
    headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
    },
};

/**
 * Стандартное время ожидания для .
 */
export const DEFAULT_SERVICE_MOCK_DELAY: IServiceMockDelay = {
    minDelay: 500,
    maxDelay: 1500,
};
