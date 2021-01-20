import {isFunction} from 'lodash';
import {Action} from 'redux-actions';
import {EProcessActionTypeSuffixes, EProcessStatus} from '../../Enums';
import {IAsyncData, IErrorsResult, IReducerGroupPrepare, IStandardAsyncReducer, TAsyncAction} from '../../Models';

/**
 * Небольшой хелпер для получения функции генерации нового состояния.
 *
 * @param prevState Предыдущее состояние.
 * @param action Экшен, передаваемый в редюсеры.
 */
const createAsyncDataHelper = <TStateData, TResponseData, TActionPayload>(
    prevState: IAsyncData<TStateData>,
    action: TAsyncAction<TResponseData | IErrorsResult, TActionPayload>
) =>
    /**
     * Функция для создания нового состояния.
     *
     * @param status Предыдущее состояние.
     * @param prepareCallback Предобработчик данных.
     * @param [errors] Ошибки при выполнении запроса.
     */
    (
        status: EProcessStatus,
        prepareCallback: IStandardAsyncReducer<TStateData, TResponseData | IErrorsResult, TActionPayload>,
        errors?: IErrorsResult
    ): IAsyncData<TStateData> => ({
        status,
        data: prepareCallback ? prepareCallback(prevState, action) : prevState.data,
        errors: errors || null,
    });

/**
 * Хелпер для вызова кастомных редюсеров в createAsyncReducer и createMultiAsyncReducer.
 *
 * @param prevState Предыдущее состояние.
 * @param action Экшен, передаваемый в редюсеры.
 * @param [prepare] Предобработчики данных для этапов ЖЦ запроса.
 */
const customPrepareReducerHelper = <TStateData, TPayload = unknown>(
    prevState: IAsyncData<TStateData>,
    action: Action<TPayload | IErrorsResult>,
    prepare: IReducerGroupPrepare<TStateData, TPayload | IErrorsResult> = {}
): IAsyncData<TStateData> | void => {
    const {custom} = prepare;

    if (custom && action.type in custom && isFunction(custom[action.type])) {
        return custom[action.type](prevState, action);
    }

    return undefined;
};

/**
 * Хелпер отрезает от экшен тайпа суффикс асинхронного процесса запроса данных из EProcessActionTypeSuffixes.
 *
 * @param actionType - Экшен тайп из которого требуется вырезать суффикс.
 */
const cutAsynPrefix = (actionType: string): string => {
    // Заберем все строки из нашего енама
    const suffixes: string[] = Object.values(EProcessActionTypeSuffixes);

    // Увы for, forEach неостановим......
    for (let i = 0, n = suffixes.length; i < n; i++) {
        const suffix: string = suffixes[i];

        /**
         * Смотрим что получится если из текущего экшен тайпа забрать строку длинной в текущий суффикс
         * разумно выдвинуть гипотезу что если суффикс и подстрока равны, то мы избавили строку от суффикса.
         */
        if (actionType.substr(actionType.length - suffix.length) === suffix) {
            return actionType.substr(0, actionType.length - suffix.length);
        }
    }

    //  Ну, мы пытались....
    return actionType;
};

/**
 * Хелпер для обработки цепочки редюсеров в createAsyncReducer и createMultiAsyncReducer.
 *
 * Функция обрабатывает следующую цепочку экшенов:
 * EProcessActionTypeSuffixes.BEGIN -> EProcessActionTypeSuffixes.SUCCESS || EProcessActionTypeSuffixes.FAILURE
 *
 * @param actionType Тип экшена (без префиксов).
 * @param prevState Предыдущее состояние.
 * @param action Экшен, передаваемый в редюсеры.
 * @param [prepare] Предобработчики данных для этапов ЖЦ запроса.
 */
const chainPrepareReducerHelper = <TStateData, TResponseData = unknown, TActionPayload = undefined>(
    actionType: string,
    prevState: IAsyncData<TStateData>,
    action: TAsyncAction<TResponseData | IErrorsResult, TActionPayload>,
    prepare: IReducerGroupPrepare<TStateData, TResponseData | IErrorsResult, TActionPayload> = {}
): IAsyncData<TStateData> | void => {
    const {begin, success, failure} = prepare;
    const getNewAsyncState = createAsyncDataHelper<TStateData, TResponseData, TActionPayload>(prevState, action);

    switch (action.type) {
        case actionType + EProcessActionTypeSuffixes.BEGIN:
            return getNewAsyncState(EProcessStatus.RUNNING, begin);
        case actionType + EProcessActionTypeSuffixes.SUCCESS:
            return getNewAsyncState(EProcessStatus.SUCCESS, success);
        case actionType + EProcessActionTypeSuffixes.FAILURE:
            return getNewAsyncState(EProcessStatus.FAIL, failure, action.payload.response as IErrorsResult);
    }

    return undefined;
};

/**
 * Создание редюсера для обработки типового процесса получения асинхронных данных.
 *
 * Функция обрабатывает следующую цепочку экшенов:
 * EProcessActionTypeSuffixes.BEGIN -> EProcessActionTypeSuffixes.SUCCESS || EProcessActionTypeSuffixes.FAILURE.
 *
 * @param actionType Тип экшена (без префиксов).
 * @param prevState Предыдущее состояние.
 * @param action Экшен, передаваемый в редюсеры.
 * @param [prepare] Предобработчики данных для этапов ЖЦ запроса.
 */
export const createAsyncReducer = <TStateData, TResponseData = unknown, TActionPayload = undefined>(
    actionType: string,
    prevState: IAsyncData<TStateData>,
    action: Action<TResponseData> | TAsyncAction<TResponseData | IErrorsResult, TActionPayload>,
    prepare: IReducerGroupPrepare<TStateData, TResponseData | IErrorsResult, TActionPayload> = {}
): IAsyncData<TStateData> => {
    return (
        customPrepareReducerHelper(prevState, action as Action<TResponseData>, prepare) ||
        chainPrepareReducerHelper(actionType, prevState, action as TAsyncAction<TResponseData | IErrorsResult, TActionPayload>, prepare) ||
        prevState
    );
};

/**
 * Создание редюсера для обработки типового процесса получения асинхронных данных.
 *
 * Функция обрабатывает следующую цепочку экшенов:
 * EProcessActionTypeSuffixes.BEGIN -> EProcessActionTypeSuffixes.SUCCESS || EProcessActionTypeSuffixes.FAILURE.
 *
 * @description Дабы не мучать наш chainPrepareReducerHelper вероятно огромным массивом экшен тайпов, будем строить логику
 * от предположения что текущий экшен тайп без суффикса стандартных асинхронных экшен тайпов находится в списке
 * доступных нам экшен тайпов, и если это так, то возьмём за основу экшентайпа .
 *
 * @param actionTypes Типы экшенов (без префиксов).
 * @param prevState Предыдущее состояние.
 * @param action Экшен, передаваемый в редюсеры.
 * @param [prepare] Предобработчики данных для этапов ЖЦ запроса.
 */
const multyChainPrepareReducerHelper = <TStateData, TPayload = unknown>(
    actionTypes: string[],
    prevState: IAsyncData<TStateData>,
    action: TAsyncAction<TPayload | IErrorsResult>,
    prepare: IReducerGroupPrepare<TStateData, TPayload | IErrorsResult> = {}
): IAsyncData<TStateData> | void => {
    // Будемя плясать от гипотезы что текущий экшен тайп может быть в массиве actionTypes
    const actionTypeWithOutPrefix = cutAsynPrefix(action.type);

    if (actionTypes.includes(actionTypeWithOutPrefix)) {
        return chainPrepareReducerHelper(actionTypeWithOutPrefix, prevState, action, prepare);
    }
    return undefined;
};

/**
 * Создание редюсера для обработки типового процесса получения асинхронных данных.
 *
 * Функция обрабатывает следующую цепочку экшенов:
 * EProcessActionTypeSuffixes.BEGIN -> EProcessActionTypeSuffixes.SUCCESS || EProcessActionTypeSuffixes.FAILURE.
 *
 * @param actionTypes Типы экшенов (без префиксов).
 * @param prevState Предыдущее состояние.
 * @param action Экшен, передаваемый в редюсеры.
 * @param [prepare] Предобработчики данных для этапов ЖЦ запроса.
 */
export const createMultiAsyncReducer = <TStateData, TPayload = unknown>(
    actionTypes: string[],
    prevState: IAsyncData<TStateData>,
    action: Action<TPayload> | TAsyncAction<TPayload | IErrorsResult>,
    prepare: IReducerGroupPrepare<TStateData, TPayload | IErrorsResult> = {}
): IAsyncData<TStateData> => {
    return (
        customPrepareReducerHelper(prevState, action as Action<TPayload>, prepare) ||
        multyChainPrepareReducerHelper(actionTypes, prevState, action as TAsyncAction<TPayload | IErrorsResult>, prepare) ||
        prevState
    );
};

/**
 * Функция хелпер для иницилизации асинхронных данных.
 *
 * @param [data] Первоначальные данные.
 */
export const initAsyncParticle = <TStateData>(data: TStateData = null): IAsyncData<TStateData> => ({
    errors: null,
    data,
    status: EProcessStatus.IDLE,
});
