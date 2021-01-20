/**
 * Общий формат пагинации.
 *
 * @prop {number} [offset] Смещение относительно начала выборки (выражается в количестве элементов).
 * @prop {number} [count] Запрашиваемое количество элементов (обычно кол-во элементов на странице).
 * @prop {boolean} [hasNextPage] Флаг, сигнализирующий о наличии/отсутствии следующей страницы.
 */
export interface IPagination {
    offset?: number;
    count?: number;
    hasNextPage?: boolean;
}

export type TTypedObject<TData, TEnum extends string = string> = {[key in TEnum]?: TData};

/**
 * Пагинируемые коллекции хранятся в этой структуре.
 *
 * @prop {[key: string]: TData} items Мап таблица элементов.
 */
export interface IItemsCollection<TData = unknown> {
    items: TTypedObject<TData>;
}

/**
 * Пагинируемые коллекции хранятся в этой структуре.
 *
 * @prop {TData} items Список элементов
 */
export interface IItemsList<TData> {
    items: TData[];
    count?: number;
}

/**
 * Пагинируемые коллекции хранятся в этой структуре.
 *
 * @prop items Мап таблица элементов.
 * @prop {number[]} order Порядок элементов
 */
export interface IItemsArray<TData> {
    items: TData[];
}

/**
 * Пагинация списков
 *
 * @prop {IPagination} pagination Параметры пейджинга.
 */
export type TPagination = {
    pagination: IPagination;
};

/**
 * Списочные REST-сервисы возвращают результаты в этом формате.
 *
 * @prop {IPagination} pagination Параметры пейджинга.
 */
export type TPaginatedItemsCollection<TData, TPaginationType = IItemsCollection<TData>> = TPaginationType & TPagination;
