import {OutputSelector, createSelector} from '@reduxjs/toolkit';
import {isArray, isUndefined} from 'lodash';
import {IAsyncData, IItemsCollection, IModuleDb} from '../Models';
import {TTypedObject} from '../Models/ListDataModels';

/** ----------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------- */
/** --------------------------------------------- Relations --------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------- */

/**
 * Селектор для получения массива идентификторов из relation объекта.
 *
 * @param relationName Название зависимости по которой требуется извлечь массив данных из коллекции.
 * @param relationId Идентификатор объекта зависимостей.
 */
export function selectorGetArrayRelationById<TModuleRelations>(
    relationName: keyof TModuleRelations,
    relationId: string | string[]
): OutputSelector<TModuleRelations, string[], (relationIds: string[]) => string[]> {
    return createSelector(
        (state: TModuleRelations): string[] => {
            const relationIds: string[] = [];

            if (!isArray(relationId)) {
                relationIds.push(...(state[relationName][relationId] || []));
            } else {
                relationId.forEach((relationSingleId: string) => {
                    relationIds.push(...(state[relationName][relationSingleId] || []));
                });
            }

            return relationIds;
        },
        (relationIds: string[]) => relationIds
    );
}

/**
 * Селектор для получения массива идентификторов из relation объекта.
 *
 * @param relationName Название зависимости по которой требуется извлечь массив данных из коллекции.
 * @param relationId Идентификатор объекта зависимостей.
 */
export const selectorGetRelationGroupById = <TModuleRelations, TKeyType extends string = string>(
    relationName: keyof TModuleRelations,
    relationId: string | string[]
): OutputSelector<
    TModuleRelations,
    TTypedObject<string[], TKeyType>,
    (relationByIdObject: TTypedObject<string[], TKeyType>) => TTypedObject<string[], TKeyType>
> => {
    return createSelector(
        (state: TModuleRelations): TTypedObject<string[], TKeyType> => {
            const relationIdsArray = isArray(relationId) ? relationId : [relationId];

            return relationIdsArray.reduce(
                (relationByIdObject: TTypedObject<string[], TKeyType>, id) => ({
                    ...relationByIdObject,
                    [id]: state[relationName][id] || [],
                }),
                {}
            );
        },
        (relationByIdObject: TTypedObject<string[], TKeyType>) => relationByIdObject
    );
};

/** ----------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------- */
/** --------------------------------------------- Коллекции --------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------- */

/**
 * Хелпер для получения коллекции данных из коллекции по списку id.
 *
 * @param collection Объект коллекции.
 * @param ids Список идентификаторов.
 */
export const getFilteredCollectionByIds = <TData>(collection: TTypedObject<TData>, ids: string[]): TTypedObject<TData> => {
    if (isUndefined(ids)) return {};

    return ids.reduce(
        (collectionObject: TTypedObject<TData>, id) =>
            collection[id]
                ? {
                      ...collectionObject,
                      [id]: collection[id],
                  }
                : collectionObject,
        {}
    );
};

/**
 * Создатель селектора для получения объекта из асинхронной коллекции коллекции объектов по его идентификаторам.
 *
 * @param collectionName Название коллекции.
 */
export const selectorGetCollectionForName = <TModuleCollections, TData>(
    collectionName: keyof TModuleCollections
): OutputSelector<TModuleCollections, TTypedObject<TData>, (collection: TTypedObject<TData>) => TTypedObject<TData>> =>
    createSelector(
        (collections: TModuleCollections): TTypedObject<TData> =>
            ((collections[collectionName] as unknown) as IAsyncData<IItemsCollection<TData>>).data.items,
        (collection: TTypedObject<TData>): TTypedObject<TData> => collection
    );

/**
 * Создатель селектора для получения объекта из асинхронной коллекции коллекции объектов по его идентификаторам.
 *
 * @param collectionName Название коллекции.
 * @param customRelationArray Список идентификаторов.
 */
export const selectorGetCollectionFromAsyncCollectionByIds = <TModuleCollections, TData>(
    collectionName: keyof TModuleCollections,
    customRelationArray: string[]
): OutputSelector<TModuleCollections, TTypedObject<TData>, (collection: TTypedObject<TData>) => TTypedObject<TData>> =>
    createSelector(
        (collections: TModuleCollections): TTypedObject<TData> =>
            getFilteredCollectionByIds(
                selectorGetCollectionForName<TModuleCollections, TData>(collectionName)(collections),
                customRelationArray
            ),
        (collection: TTypedObject<TData>): TTypedObject<TData> => collection
    );

/**
 * Селектор для получения отфлильтрованой коллекции асинхронных данных по таблице relations.
 *
 * @param collectionName Название коллекции.
 * @param relationName Название зависимости по которой требуется извлечь массив данных из коллекции.
 * @param relationId Идентификатор объекта зависимостей.
 */
export function selectorGetCollectionFromAsyncCollectionByRelation<TModuleCollections, TModuleRelations, TData>(
    collectionName: keyof TModuleCollections,
    relationName: keyof TModuleRelations,
    relationId: string | string[]
): OutputSelector<
    IModuleDb<TModuleCollections, TModuleRelations>,
    TTypedObject<TData>,
    (items: TTypedObject<TData>) => TTypedObject<TData>
> {
    return createSelector(
        (state: IModuleDb<TModuleCollections, TModuleRelations>): TTypedObject<TData> => {
            return selectorGetCollectionFromAsyncCollectionByIds<TModuleCollections, TData>(
                collectionName,
                selectorGetArrayRelationById(relationName, relationId)(state.relations)
            )(state.collections);
        },
        (items: TTypedObject<TData>): TTypedObject<TData> => items
    );
}

/** ----------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------- */
/** ---------------------------------------------- Массивы ---------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------- */

/**
 * Хелпер для получения массива асинхронных данных из коллекции по списку id.
 *
 * @param collection Объект коллекции.
 * @param ids Список идентификаторов.
 */
export const getFilteredArrayItemsByIds = <TData>(collection: TTypedObject<TData>, ids: string[]): TData[] => {
    if (isUndefined(ids)) return [];

    const resultArray: TData[] = [];

    ids.forEach((id) => {
        const collectionItem: TData = collection[id];
        if (collectionItem) {
            resultArray.push(collectionItem);
        }
    });

    return resultArray;
};

/**
 * Селектор для получения массива асинхронных данных по списку идентификаторов.
 *
 * @param collectionName Название коллекции.
 * @param customRelationArray Кастомный список зависимостей.
 */
export function selectorGetItemsFromAsyncCollectionByCustomRelation<TModuleCollections, TData>(
    collectionName: keyof TModuleCollections,
    customRelationArray: string[]
): OutputSelector<TModuleCollections, TData[], (items: TData[]) => TData[]> {
    return createSelector(
        (collections: TModuleCollections): TData[] =>
            getFilteredArrayItemsByIds(
                selectorGetCollectionForName<TModuleCollections, TData>(collectionName)(collections),
                customRelationArray
            ),
        (items: TData[]) => items
    );
}

/**
 * Селектор для получения массива асинхронных данных по таблице relations.
 *
 * @param collectionName Название коллекции.
 * @param relationName Название зависимости по которой требуется извлечь массив данных из коллекции.
 * @param relationId Идентификатор объекта зависимостей.
 * @param sortFunction Функция сортировки, по умолчанию сортируем по order.
 */
export function selectorGetItemsFromAsyncCollectionByRelation<TModuleCollections, TModuleRelations, TData>(
    collectionName: keyof TModuleCollections,
    relationName: keyof TModuleRelations,
    relationId: string | string[]
): OutputSelector<IModuleDb<TModuleCollections, TModuleRelations>, TData[], (items: TData[]) => TData[]> {
    return createSelector(
        (state: IModuleDb<TModuleCollections, TModuleRelations>): TData[] => {
            return selectorGetItemsFromAsyncCollectionByCustomRelation<TModuleCollections, TData>(
                collectionName,
                selectorGetArrayRelationById(relationName, relationId)(state.relations)
            )(state.collections);
        },
        (items: TData[]) => items
    );
}

/**
 * Селектор для получения отфлильтрованго массива асинхронных данных по таблице relations.
 *
 * @param collectionName Название коллекции.
 * @param relationName Название зависимости по которой требуется извлечь массив данных из коллекции.
 * @param relationId Идентификатор объекта зависимостей.
 * @param sortFunction Функция сортировки, по умолчанию сортируем по order.
 */
export function selectorGetSortedItemsFromAsyncCollectionByRelation<TModuleCollections, TModuleRelations, TData>(
    collectionName: keyof TModuleCollections,
    relationName: keyof TModuleRelations,
    relationId: string | string[],
    sortFunction?: (a: TData, b: TData) => 1 | -1
): OutputSelector<IModuleDb<TModuleCollections, TModuleRelations>, TData[], (items: TData[]) => TData[]> {
    return createSelector(
        (state: IModuleDb<TModuleCollections, TModuleRelations>): TData[] => {
            return selectorGetItemsFromAsyncCollectionByCustomRelation<TModuleCollections, TData>(
                collectionName,
                selectorGetArrayRelationById(relationName, relationId)(state.relations)
            )(state.collections);
        },
        (items: TData[]) => (sortFunction ? items.sort(sortFunction) : items)
    );
}

/** ----------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------- */
/** --------------------------------------------- Примитивы --------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------- */

/**
 * Создатель селектора для получения объекта из асинхронной коллекции объектов по его идентификатору.
 *
 * @param collectionName Название коллекции.
 * @param id Идентификатор.
 */
export const selectorGetItemFromAsyncCollectionById = <TModuleCollections, TData>(
    collectionName: keyof TModuleCollections,
    id: string
): OutputSelector<TModuleCollections, TData, (collection: TTypedObject<TData>) => TData> =>
    createSelector(
        (collections: TModuleCollections): TTypedObject<TData> =>
            selectorGetCollectionForName<TModuleCollections, TData>(collectionName)(collections),
        (collection: TTypedObject<TData>): TData => collection[id]
    );
