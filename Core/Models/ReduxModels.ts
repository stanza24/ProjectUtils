/**
 * Модель хранилища Redux
 */
export interface IModuleDb<TCollections, TRelations> {
    collections: TCollections;
    relations: TRelations;
}
