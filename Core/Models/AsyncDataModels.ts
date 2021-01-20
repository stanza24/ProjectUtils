import {EProcessStatus} from '../Enums';

/**
 * Общий интерфейс любых ошибок возникших в результате обращения к серверу.
 *
 * @prop clientMessage Клиентское сообщение об ошибке (можно показать клиенту).
 * @prop technicalMessage Системное сообщение об ошибке (не показываем клиенту).
 * @prop errorCode Код ошибки.
 * @prop httpErrorCode HTTP код ошибки.
 */
export interface IErrorsResult<TErrorCode = string> {
    clientMessage?: string;
    technicalMessage?: string;
    errorCode: TErrorCode;
    httpErrorCode: number;
}

/**
 * Интерфейс контейнера блока асинхронных данных, для обмена между клиентом и сервером.
 *
 * @prop status Статус процесса загрузки асинхронных данных.
 * @prop data Данные.
 * @prop [errors] Ошибка.
 */
export interface IAsyncData<TData = unknown, TErrors = IErrorsResult> {
    status: EProcessStatus;
    data: TData;
    errors?: TErrors;
}
