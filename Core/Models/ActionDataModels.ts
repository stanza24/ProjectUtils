import {Action} from 'redux-actions';

/**
 * Интерфейс объекта payload, приходящего для асинхронных экшенов
 *
 * @prop response Ответ от запрашиваемого сервиса
 * @prop actionPayload Пользовательские данные из функции вызова экшна
 */
export interface IAsyncPayload<TData, TPayload> {
    response: TData;
    actionPayload?: TPayload;
}

/**
 * Обычный асинхронный Экшен.
 */
export type TAsyncAction<TData = unknown, TPayload = undefined> = Action<IAsyncPayload<TData, TPayload>>;

/**
 * Интерфейс объекта payload, для типовых экшенов обновления данных.
 *
 * @prop id Идентификатор обновляемого объекта.
 * @prop partialData Объект новых данных которые требуется обновить.
 */
export interface IPayloadUpdatePartialData<TData> {
    id: string;
    partialData: Partial<TData>;
}
