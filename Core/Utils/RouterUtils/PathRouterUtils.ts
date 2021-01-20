import {Location} from 'history';
import {isUndefined, startsWith} from 'lodash';
import {IItemGroup, IMenuItem, ISubMenuItem, TMenuItem} from '../../../Common/Models/MenuModels';
import {historyApp} from './History';

/**
 * Перейти на другую страницу.
 *
 * @param newPath Новый url
 */
export const redirectTo = (newPath: string): void => {
    !!newPath && historyApp.push(newPath);
};

/**
 * Получить текущий location
 */
export const getLocation = (): Location => historyApp.location;

/**
 * Рекурсивная функция обхода меню, возвращает список активных роутов.
 *
 * @param route Роут который нужно првоерить
 * @param pathname Текущий путь из react router.
 */
export const isRouteActive = (route: string, pathname: string = getLocation().pathname): boolean => startsWith(pathname, route);

/**
 * Рекурсивная функция обхода меню, возвращает список активных роутов.
 *
 * @param routes Список путей который требуется проверить.
 * @param pathname Текущий путь из react router.
 */
export const getActiveRoute = (routes: string[], pathname: string = getLocation().pathname): string => {
    const activeRoutes: string[] = [];

    routes.forEach((route: string) => {
        isRouteActive(route, pathname) && activeRoutes.push(route);
    });

    switch (true) {
        case activeRoutes.length === 1:
            return activeRoutes[0];
        case activeRoutes.length > 1:
            // eslint-disable-next-line no-console
            console.warn('More than 1 active path found');
            return activeRoutes[0];
        default:
        case activeRoutes.length === 0:
            return '';
    }
};
/**
 * Рекурсивная функция обхода меню, возвращает список активных роутов.
 *
 * @param menuItem Список элементов меню, рекурсивно прокидывающийся вглубь из подменю и групп меню.
 * @param pathname Текущий путь из react router.
 */
export const getActiveRouteForMenuItem = (menuItem: TMenuItem[], pathname: string = getLocation().pathname): string[] => {
    const activeRoutes: string[] = [];

    menuItem.forEach((item: TMenuItem) => {
        switch (true) {
            case !isUndefined((item as IMenuItem).route):
                isRouteActive((item as IMenuItem).route, pathname) && activeRoutes.push((item as IMenuItem).route);
                break;

            case !isUndefined((item as IItemGroup).groupItems):
                activeRoutes.push(...getActiveRouteForMenuItem((item as IItemGroup).groupItems, pathname));
                break;

            case !isUndefined((item as ISubMenuItem).subMenuItems):
                activeRoutes.push(...getActiveRouteForMenuItem((item as ISubMenuItem).subMenuItems, pathname));
                break;
        }
    });

    return activeRoutes;
};
