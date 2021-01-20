import {Action} from 'redux-actions';
import {ThunkDispatch} from 'redux-thunk';
import {IApplicationsMappedReducer, IApplicationsReduxBranchState} from '../../Modules/Applications/Models/ApplicationsModels';
import {IPollsMappedReducer, IPollsReduxBranchState} from '../../Modules/Polls/Models/PollsModels';
import {IAuthorizationMappedReducer, IAuthorizationReduxBranchState} from '../Authorization/Models/AuthorizationModels';
import {TAsyncAction} from './ActionDataModels';
import {IAsyncData, IErrorsResult} from './AsyncDataModels';

/**
 * Модель редюсеров приложения
 */
export interface IAppMappedReducerState extends IAuthorizationMappedReducer, IApplicationsMappedReducer, IPollsMappedReducer {}

/**
 * Модель стейта приложения
 */
export interface IAppState extends IAuthorizationReduxBranchState, IApplicationsReduxBranchState, IPollsReduxBranchState {}

/**
 * Модель диспатча из Thunk, с Action из redux-actions, но без обязательного payload
 *
 * @description данная типизация нужна только для того чтобы не дублировать этот код в местах создания модульных Actions.
 */
export type TThunkDispatch = ThunkDispatch<
    IAppState,
    unknown,
    Omit<Action<unknown>, 'payload'> & Partial<Pick<Action<unknown>, 'payload'>>
>;

/**
 * Интерфейс стандартной функции предобработки асинхронных даннных.
 */
export interface IStandardAsyncReducer<TStateData, TResponseData, TActionPayload> {
    (state: IAsyncData<TStateData>, action: TAsyncAction<TResponseData, TActionPayload>): TStateData;
}

/**
 * Интерфейс кастомной функции предобработки асинхронных даннных.
 */
export interface ICustomAsyncReducer<TAsyncData, TResponseData> {
    (state: TAsyncData, action: Action<TResponseData | IErrorsResult>): TAsyncData;
}

/**
 * Набор кастомных предобработчиков для асинхронных редюсеров.
 * Необходимо на случай если требуется логика обработки данных на стороне клиента.
 *
 * Имеется ввиду вне цикла EActionTypeSuffixes.BEGIN -> EActionTypeSuffixes.SUCCESS || EActionTypeSuffixes.FAILURE.
 *
 * @prop {ICustomAsyncReducer<TAsyncData, TResponseData, TActionPayload>} [type: string].
 */
export interface ICustomAsyncReducersMap<TAsyncData, TResponseData> {
    [type: string]: ICustomAsyncReducer<TAsyncData, TResponseData>;
}

/**
 * Предобработчики данных для асинхронных редюсеров в цепочке:
 * EActionTypeSuffixes.BEGIN -> EActionTypeSuffixes.SUCCESS || EActionTypeSuffixes.FAILURE.
 *
 * @prop begin Предобработчик при EActionTypeSuffixes.BEGIN.
 * @prop success Предобработчик при EActionTypeSuffixes.SUCCESS.
 * @prop failure Предобработчик при EActionTypeSuffixes.FAILURE.
 * @prop custom Кастомынй набор предобработчиков, для кейсов обработки данных вне базового цикло.
 */
export interface IReducerGroupPrepare<TStateData, TResponseData, TActionPayload = undefined> {
    begin?: IStandardAsyncReducer<TStateData, TResponseData, TActionPayload>;
    success?: IStandardAsyncReducer<TStateData, TResponseData, TActionPayload>;
    failure?: IStandardAsyncReducer<TStateData, IErrorsResult, TActionPayload>;
    custom?: ICustomAsyncReducersMap<IAsyncData<TStateData>, TResponseData>;
}
