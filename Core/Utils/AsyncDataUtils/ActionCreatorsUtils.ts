import {Dispatch} from 'redux';
import {EProcessActionTypeSuffixes} from '../../Enums';
import {IErrorsResult} from '../../Models';

/**
 * Возвращаем функцию диспатча экшена с суффиксом BEGIN для передачи ее в стор.
 *
 * @param dispatch Функция для диспатча экшенов в redux.
 * @param actionType Тип экшена (без префиксов).
 */
export const dispatchBegin = <TBeginPayload>(dispatch: Dispatch, actionType: string) =>
    /**
     * Возвращаем функцию для диспатча actionType + EActionTypeSuffixes.BEGIN.
     *
     * @param [actionPayload] Опциональные данные, которые требуется прокинуть при старте запроса.
     */
    (actionPayload: TBeginPayload): TBeginPayload => {
        dispatch({
            type: actionType + EProcessActionTypeSuffixes.BEGIN,
            payload: {
                response: null,
                actionPayload,
            },
        });

        return actionPayload;
    };

/**
 * Возвращаем функцию диспатча экшена с суффиксом SUCCESS для передачи полученных данных в стор.
 *
 * @param dispatch Функция для диспатча экшенов в redux.
 * @param actionType Тип экшена (без префиксов).
 */
export const dispatchSuccess = <TBeginPayload, TResponsePayload>(dispatch: Dispatch, actionType: string) =>
    /**
     * Возвращаем функцию для диспатча actionType + EActionTypeSuffixes.SUCCESS.
     *
     * @param data Данные с сервера.
     * @param actionPayload Опциональные данные, которые требуется прокинуть при старте запроса.
     */
    (data: TResponsePayload, actionPayload: TBeginPayload): TResponsePayload => {
        dispatch({
            type: actionType + EProcessActionTypeSuffixes.SUCCESS,
            payload: {
                response: data,
                actionPayload,
            },
        });

        return data;
    };

/**
 * Возвращаем функцию диспатча экшена с суффиксом FAILURE для передачи информации об ошибке в стор.
 *
 * @param dispatch Функция для диспатча экшенов в redux.
 * @param actionType Тип экшена (без префиксов).
 */
export const dispatchError = <TBeginPayload>(dispatch: Dispatch, actionType: string) =>
    /**
     * Возвращаем функцию для диспатча actionType + EActionTypeSuffixes.FAILURE.
     *
     * @param error Объект ошибки полученный от сервера.
     * @param actionPayload Опциональные данные, которые требуется прокинуть при старте запроса.
     */
    (error: IErrorsResult, actionPayload: TBeginPayload): Promise<never> => {
        dispatch({
            type: actionType + EProcessActionTypeSuffixes.FAILURE,
            payload: {
                error,
                actionPayload,
            },
            error: true,
        });

        return Promise.reject(error);
    };

/**
 * Реализация типовой схемы получения асинхронных данных, при обработке схемы асинхронного выхова апи, через обёртку с промисами.
 *
 * @param actionType Тип экшена (без префиксов).
 * @param asyncCall Вызов апи. Возвращает промис, вокруг которого строится дальнейшая работа.
 * @param [payload] Опциональные данные, которые требуется прокинуть при старте запроса.
 */
export const dispatchAsync = <TBeginPayload, TResponsePayload>(
    actionType: string,
    asyncCall: () => Promise<TResponsePayload>,
    payload?: TBeginPayload
) =>
    /**
     * Возвращаем функцию реализации типовой схемы поулчения асинхронных данных.
     *
     * @param dispatch Функция для диспатча экшенов в redux.
     */
    (dispatch: Dispatch): Promise<TResponsePayload> => {
        dispatchBegin<TBeginPayload>(dispatch, actionType)(payload);

        const responseData: Promise<TResponsePayload> = asyncCall();

        if (responseData) {
            responseData.then(
                (data: TResponsePayload) => dispatchSuccess<TBeginPayload, TResponsePayload>(dispatch, actionType)(data, payload),
                (error: IErrorsResult) => dispatchError<TBeginPayload>(dispatch, actionType)(error, payload)
            );
        }

        return responseData;
    };

/**
 * Реализация типовой схемы получения асинхронных данных, при обработке схемы асинхронного выхова апи, через обёртку с промисами.
 *
 * Типовая цепочка экшенов выглядит следующим образом:
 * EActionTypeSuffixes.BEGIN -> EActionTypeSuffixes.SUCCESS || EActionTypeSuffixes.FAILURE.
 *
 * @param dispatch Функция для диспатча экшенов в redux.
 * @param actionType Тип экшена (без префиксов).
 * @param asyncCall Вызов апи. Возвращает промис, вокруг которого строится дальнейшая работа.
 * @param [payload] Опциональные данные, которые требуется прокинуть при старте запроса.
 */
export const dispatchAsyncResponseBound = <TResponsePayload, TBeginPayload = unknown>(
    dispatch: Dispatch,
    actionType: string,
    asyncCall: () => Promise<TResponsePayload>,
    payload?: TBeginPayload
): Promise<TResponsePayload> => dispatchAsync<TBeginPayload, TResponsePayload>(actionType, asyncCall, payload)(dispatch);
