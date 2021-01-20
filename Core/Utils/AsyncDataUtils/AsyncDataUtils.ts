import {EProcessStatus} from '../../Enums';
import {IAsyncData} from '../../Models';

// Статусы загрузки данных страницы, т.е. статусы при которых надо показывать спиннер.
export const LOADING_STATUSES = [EProcessStatus.IDLE, EProcessStatus.RUNNING];

// Статусы отсутствия данных страницы, т.е. статусы когда можно запускать (повторное) получение данных.
export const NOT_LOADED_STATUSES = [EProcessStatus.IDLE, EProcessStatus.FAIL];

/**
 * Хелпер позволяющий определить что загрузка данных еще не производилась.
 *
 * @param data Объект асинхронных данных.
 */
export const asyncDataIdle = <TData>(data: IAsyncData<TData>): boolean => data.status === EProcessStatus.IDLE;

/**
 * Хелпер позволяющий определить что загрузка данных находится в процессе.
 *
 * @param data Объект асинхронных данных.
 */
export const asyncDataLoading = <TData>(data: IAsyncData<TData>): boolean => data.status === EProcessStatus.RUNNING;

/**
 * Хелпер позволяющий определить что загрузка данных была завершена и вернула данные.
 *
 * @param data Объект асинхронных данных.
 */
export const asyncDataLoaded = <TData>(data: IAsyncData<TData>): boolean => data.status === EProcessStatus.SUCCESS;

/**
 * Хелпер позволяющий определить что загрузка данных была завершена и вернула ошибку.
 *
 * @param data Объект асинхронных данных.
 */
export const asyncDataFailed = <TData>(data: IAsyncData<TData>): boolean => data.status === EProcessStatus.FAIL;

/**
 * Хелпер позволяющий определить что загрузка данных еще не производилась или находится в процессе.
 *
 * @description необходимо для кейсов отображения спинера по данным загружаемым автоматически.
 *
 * @param data Объект асинхронных данных.
 */
export const asyncDataLoadingOrIdle = <TData>(data: IAsyncData<TData>): boolean => LOADING_STATUSES.includes(data.status);

/**
 * Хелпер позволяющий определить что загрузка данных еще не производилась или была завершена с ошибкой.
 *
 * @description необходимо для кейсов загрузки или перезагрузки данных, которые не стартуют автоматически.
 *
 * @param data Объект асинхронных данных.
 */
export const asyncDataIdleOrFailed = <TData>(data: IAsyncData<TData>): boolean => NOT_LOADED_STATUSES.includes(data.status);
