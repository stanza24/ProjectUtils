/** Формат года. */
export const YEAR_FORMAT = 'YYYY';
/** Формат месяца. */
export const MONTH_FORMAT = 'MM';
/** Формат дня. */
export const DAY_FORMAT = 'DD';
/** Формат часов. */
export const HOURS_FORMAT = 'HH';
/** Формат минут. */
export const MINUTES_FORMAT = 'mm';
// /** Формат секунд. */
export const SECONDS_FORMAT = 'ss';

/** Формат даты, приходящий с сервера. */
export const SERVER_DATE_FORMAT = `${YEAR_FORMAT}${MONTH_FORMAT}${DAY_FORMAT}`;
/** Формат даты, приходящий с сервера вместе со временем. */
export const SERVER_DATETIME_FORMAT = `${SERVER_DATE_FORMAT}T${HOURS_FORMAT}${MINUTES_FORMAT}${SECONDS_FORMAT}`;
/** Формат даты, отображаемый на клиентской части. */
export const FRONTEND_DATE_FORMAT = `${DAY_FORMAT}.${MONTH_FORMAT}.${YEAR_FORMAT}`;
/** Формат времени, для календарного инпута. */
export const CALENDAR_INPUT_DATE_FORMAT = `${YEAR_FORMAT}-${MONTH_FORMAT}-${DAY_FORMAT}`;

/** Формат времени, отображаемый на клиентской части. */
export const FRONTEND_TIME_FORMAT = `${HOURS_FORMAT}:${MINUTES_FORMAT}`;
/** Формат полного времени, отображаемый на клиентской части */
export const FRONTEND_FULL_TIME_FORMAT = `${HOURS_FORMAT}:${MINUTES_FORMAT}:${SECONDS_FORMAT}`;
/** Формат даты и времени, отображаемый на клиентской части. */
export const FRONTEND_DATETIME_FORMAT = `${FRONTEND_DATE_FORMAT}, ${FRONTEND_TIME_FORMAT}`;
