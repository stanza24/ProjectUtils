/* eslint-disable prettier/prettier */

// prettier-ignore
export const RegExpPattern = {
    /**
     * Регулярки для проверок полей
     */
    EMAIL: '^([_A-Za-z0-9-\\+<>\']+(\\.[_A-Za-z0-9-\\+<>\']+)*)@([A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,}))$',
    URL: '^(https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9]+\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]+\\.[^\\s]{2,}|[a-zA-Z0-9]+\\.[^\\s]{2,})',
    DATE: '^(0[1-9]|[12][0-9]|3[01])\\/(0[1-9]|1[012])\\/(19|20)\\d\\d$',
    TEL: '^\\+[1-9]\\s\\(\\d\\d\\d\\)\\s\\d\\d\\d\\-\\d\\d\\d\\d$',
};
