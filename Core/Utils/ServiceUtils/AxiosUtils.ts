import axios, {AxiosError, AxiosResponse} from 'axios';
import {debounce, isBoolean} from 'lodash';
import {restActive} from '../../Config';
import {serviceConfiguration} from '../../Const';
import {DEFAULT_SERVICE_MOCK_DELAY} from '../../Const/ServiceConst';
import {IAxiosRequestConfig, IErrorsResult, IServiceMockDelay, IServiceSource} from '../../Models';
import {TParams} from '../../Models/ServiceModels';
import {randomInteger} from '../HelperUtils';

/**
 * Функция для получения данных из моков, с возможностью подмены данных, для симулирования поведения реального сервиса.
 *
 * @param source путь до JSON.
 * @param serviceMockDelay Требуется ли задержка для возврата данных мока.
 * @param [mockCallbackServiceSimulator] Колбек симулятор поведения сервиса, для подмены данных JSON.
 */
const getMockData = <TResponse>(
    source: string,
    serviceMockDelay: boolean | IServiceMockDelay = false,
    mockCallbackServiceSimulator?: (data?: TResponse) => TResponse
): Promise<AxiosResponse<TResponse>> => {
    const mockDelay = isBoolean(serviceMockDelay) && serviceMockDelay ? DEFAULT_SERVICE_MOCK_DELAY : serviceMockDelay;

    const axiosPromise = mockDelay
        ? axios.get(source).then(
              async (axiosResponse: AxiosResponse<TResponse>): Promise<AxiosResponse<TResponse>> => {
                  await new Promise<void>((resolve) =>
                      debounce(
                          resolve,
                          randomInteger((mockDelay as IServiceMockDelay).minDelay, (mockDelay as IServiceMockDelay).maxDelay)
                      )()
                  );

                  return axiosResponse;
              }
          )
        : axios.get(source);

    if (mockCallbackServiceSimulator) {
        return axiosPromise.then(
            (axiosResponse: AxiosResponse<TResponse>): AxiosResponse<TResponse> => ({
                ...axiosResponse,
                data: mockCallbackServiceSimulator(axiosResponse.data),
            })
        );
    }

    return axiosPromise;
};

/**
 * Небольшая обёртка над промисом axios, служит для того чтобы избавляться от ненужного мусора при запросах.
 *
 * @param axiosPromise Промис который возвращает axios.
 */
const cleanerDataAxiosPromises = <T = unknown>(axiosPromise: Promise<AxiosResponse<T>>): Promise<T> =>
    axiosPromise
        .then(
            // TODO продумать стоит ли брать что нибудь кроме data, на текущий момент кажется что нет
            (axiosResponse: AxiosResponse<T>): T => axiosResponse.data
        )
        .catch(
            // TODO при появлении стенда, требуется переработать этот блок
            (axiosError: AxiosError<T>) => {
                // TODO понять и переделать
                // eslint-disable-next-line no-throw-literal
                throw {
                    errorCode: undefined,
                    clientMessage: axiosError.message,
                    httpErrorCode: axiosError.response.status,
                } as IErrorsResult;
            }
        );

/**
 * Выясняем необходимость вызвать моки.
 *
 * @param source Источник данных.
 */
const hasNeedCallMock = (source: IServiceSource): boolean => (source.forceMock || !restActive) && !!source.mock;

/**
 * Отправить данные методом POST, или запросить моки.
 *
 * @param source Источник данных.
 * @param [data] Данные которые требуется отправить.
 * @param [params] Get параметры запроса.
 * @param [config] Дополнительная конфигурация для axios, которую можно переопределить.
 * @param [serviceMockDelay] Требуется ли задержка для возврата данных мока.
 * @param [mockCallbackServiceSimulator] Если используются моки, то данные пройдут через колбек, который будет симулировать поведение реального сервиса.
 */
export const POST = <TResponse, TData = unknown>(
    source: IServiceSource,
    data?: TData,
    params?: TParams,
    config?: IAxiosRequestConfig,
    serviceMockDelay?: boolean | IServiceMockDelay,
    mockCallbackServiceSimulator?: (data?: TResponse) => TResponse
): Promise<TResponse> =>
    cleanerDataAxiosPromises<TResponse>(
        !hasNeedCallMock(source)
            ? axios.post(source.url, data, {...serviceConfiguration, ...config, params})
            : getMockData(source.mock, serviceMockDelay, mockCallbackServiceSimulator)
    );

/**
 * Запросить данные методом GET, или запросить моки.
 *
 * @param source Источник данных.
 * @param [params] Get параметры запроса.
 * @param [config] Дополнительная конфигурация для axios, которую можно переопределить.
 * @param [serviceMockDelay] Требуется ли задержка для возврата данных мока.
 * @param [mockCallbackServiceSimulator] Колбек симулятор поведения сервиса, для подмены данных JSON.
 */
export const GET = <TResponse>(
    source: IServiceSource,
    params?: TParams,
    config?: IAxiosRequestConfig,
    serviceMockDelay?: boolean | IServiceMockDelay,
    mockCallbackServiceSimulator?: (data?: TResponse) => TResponse
): Promise<TResponse> =>
    cleanerDataAxiosPromises<TResponse>(
        !hasNeedCallMock(source)
            ? axios.get(source.url, {...serviceConfiguration, ...config, params})
            : getMockData(source.mock, serviceMockDelay, mockCallbackServiceSimulator)
    );

/**
 * Удалить данные методом DELETE, или запросить моки.
 *
 * @param source Источник данных.
 * @param [data] Данные которые требуется удалить.
 * @param [params] Get параметры запроса.
 * @param [config] Дополнительная конфигурация для axios, которую можно переопределить.
 * @param [serviceMockDelay] Требуется ли задержка для возврата данных мока.
 * @param [mockCallbackServiceSimulator] Колбек симулятор поведения сервиса, для подмены данных JSON.
 */
export const DELETE = <TResponse, TData = unknown>(
    source: IServiceSource,
    data?: TData,
    params?: TParams,
    config?: IAxiosRequestConfig,
    serviceMockDelay?: boolean | IServiceMockDelay,
    mockCallbackServiceSimulator?: (data?: TResponse) => TResponse
): Promise<TResponse> =>
    cleanerDataAxiosPromises<TResponse>(
        !hasNeedCallMock(source)
            ? axios.delete(source.url, {data, ...serviceConfiguration, ...config, params})
            : getMockData(source.mock, serviceMockDelay, mockCallbackServiceSimulator)
    );

/**
 * Обновить данные методом PATCH, или запросить моки.
 *
 * @param source Источник данных.
 * @param [data] Данные которые требуется отправить для обновления.
 * @param [params] Get параметры запроса.
 * @param [config] Дополнительная конфигурация для axios, которую можно переопределить.
 * @param [serviceMockDelay] Требуется ли задержка для возврата данных мока.
 * @param [mockCallbackServiceSimulator] Колбек симулятор поведения сервиса, для подмены данных JSON.
 */
export const PATCH = <TResponse, TData = unknown>(
    source: IServiceSource,
    data?: TData,
    params?: TParams,
    config?: IAxiosRequestConfig,
    serviceMockDelay?: boolean | IServiceMockDelay,
    mockCallbackServiceSimulator?: (data?: TResponse) => TResponse
): Promise<TResponse> =>
    cleanerDataAxiosPromises<TResponse>(
        !hasNeedCallMock(source)
            ? axios.patch(source.url, data, {...serviceConfiguration, ...config, params})
            : getMockData(source.mock, serviceMockDelay, mockCallbackServiceSimulator)
    );

/**
 * Добавить данные методом PUT, или запросить моки.
 *
 * @param source Источник данных.
 * @param [data] Данные которые требуется отправить для обновления.
 * @param [params] Get параметры запроса.
 * @param [config] Дополнительная конфигурация для axios, которую можно переопределить.
 * @param [serviceMockDelay] Требуется ли задержка для возврата данных мока.
 * @param [mockCallbackServiceSimulator] Колбек симулятор поведения сервиса, для подмены данных JSON.
 */
export const PUT = <TResponse, TData = unknown>(
    source: IServiceSource,
    data?: TData,
    params?: TParams,
    config?: IAxiosRequestConfig,
    serviceMockDelay?: boolean | IServiceMockDelay,
    mockCallbackServiceSimulator?: (data?: TResponse) => TResponse
): Promise<TResponse> =>
    cleanerDataAxiosPromises<TResponse>(
        !hasNeedCallMock(source)
            ? axios.put(source.url, data, {...serviceConfiguration, ...config, params})
            : getMockData(source.mock, serviceMockDelay, mockCallbackServiceSimulator)
    );

/**
 * Обёртка методов axios для использования в dispatchAsyncResponseBound.
 *
 * @param POST создать функцию для отправки POST запроса.
 * @param GET создать функцию для отправки GET запроса.
 * @param DELETE создать функцию для отправки DELETE запроса.
 * @param PATCH создать функцию для отправки PATCH запроса.
 * @param PUT создать функцию для отправки PUT запроса.
 */
export const ServiceWrapper = {
    /* eslint-disable  @typescript-eslint/naming-convention */
    POST: <TResponse, TData = unknown>(
        source: IServiceSource,
        data?: TData,
        params?: TParams,
        config?: IAxiosRequestConfig,
        serviceMockDelay?: boolean | IServiceMockDelay,
        mockCallbackServiceSimulator?: (data?: TResponse) => TResponse
    ): (() => Promise<TResponse>) => (): Promise<TResponse> =>
        POST(source, data, params, config, serviceMockDelay, mockCallbackServiceSimulator),
    GET: <TResponse>(
        source: IServiceSource,
        params?: TParams,
        config?: IAxiosRequestConfig,
        serviceMockDelay?: boolean | IServiceMockDelay,
        mockCallbackServiceSimulator?: (data?: TResponse) => TResponse
    ) => (): Promise<TResponse> => GET(source, params, config, serviceMockDelay, mockCallbackServiceSimulator),
    DELETE: <TResponse, TData = unknown>(
        source: IServiceSource,
        data?: TData,
        params?: TParams,
        config?: IAxiosRequestConfig,
        serviceMockDelay?: boolean | IServiceMockDelay,
        mockCallbackServiceSimulator?: (data?: TResponse) => TResponse
    ): (() => Promise<TResponse>) => (): Promise<TResponse> =>
        DELETE(source, data, params, config, serviceMockDelay, mockCallbackServiceSimulator),
    PATCH: <TResponse, TData = unknown>(
        source: IServiceSource,
        data?: TData,
        params?: TParams,
        config?: IAxiosRequestConfig,
        serviceMockDelay?: boolean | IServiceMockDelay,
        mockCallbackServiceSimulator?: (data?: TResponse) => TResponse
    ): (() => Promise<TResponse>) => (): Promise<TResponse> =>
        PATCH(source, data, params, config, serviceMockDelay, mockCallbackServiceSimulator),
    PUT: <TResponse, TData = unknown>(
        source: IServiceSource,
        data?: TData,
        params?: TParams,
        config?: IAxiosRequestConfig,
        serviceMockDelay?: boolean | IServiceMockDelay,
        mockCallbackServiceSimulator?: (data?: TResponse) => TResponse
    ): (() => Promise<TResponse>) => (): Promise<TResponse> =>
        PUT(source, data, params, config, serviceMockDelay, mockCallbackServiceSimulator),
    /* eslint-enable @typescript-eslint/naming-convention */
};
