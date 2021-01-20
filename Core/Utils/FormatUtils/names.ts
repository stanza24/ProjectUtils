import {IUser} from 'Core/Authorization/Models/AuthorizationModels';

/**
 * Возвращает ФИО в формате (Фамилия.И.О.)
 *
 * @param user объект с фамилией именем отчеством
 */
export const getSurnameWithInitials = ({lastName, firstName, middleName}: IUser): string =>
    `${lastName} ${firstName[0]}.${middleName ? `${middleName[0]}.` : ''}`;

/**
 * Возвращает ФИО в формате (Фамилия Имя Отчество)
 *
 * @param user объект с фамилией именем отчеством
 */
export const getFullName = ({lastName, firstName, middleName}: IUser): string =>
    `${lastName} ${firstName}${middleName ? ` ${middleName}` : ''}`;

/**
 * Возвращает ФИО в формате (Фамилия Имя)
 *
 * @param user объект с фамилией именем
 */
export const getSurnameWithName = ({lastName, firstName}: IUser): string => `${lastName || ''} ${firstName || ''}`;
