import moment from 'moment';
import {TObjectWithOrder} from 'Core/Models';

export const sortByDate = <T>(dateField: string) => (item1: T, item2: T): 1 | -1 =>
    moment(item1[dateField]).isAfter(item2[dateField]) ? -1 : 1;

export const sortByUpdateDate = sortByDate('updateDate');

export const sortByOrder = <T extends TObjectWithOrder>(item1: T, item2: T): 1 | -1 => (item1.order > item2.order ? 1 : -1);
