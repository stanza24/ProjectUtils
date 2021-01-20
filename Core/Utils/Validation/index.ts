import {maskArray} from 'react-text-mask';

const maxValueMonth = [31, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const formatOrder = ['yyyy', 'yy', 'mm', 'dd', 'HH', 'MM', 'SS'];
const atSymbol = '@';
const emptyString = '';
const dot = '.';
const asterisk = '*';
const caretTrap = '[]';
const space = ' ';
const g = 'g';
const anyNonWhitespaceRegExp = /[^\s]/;
const anyNonDotOrWhitespaceRegExp = /[^.\s]/;
const allWhitespaceRegExp = /\s/g;
// const allAtSymbolsRegExp = /@/g;
// const atDot = '@.';
// const dotDot = '..';
// const emptyArray = [];
// const allDotsRegExp = /\./g;

export const createAutoCorrectedDatePipe = (
    dateFormat = 'dd mm yyyy',
    {minYear = 1, maxYear = 2100} = {}
): ((conformedValue: string) => false | string | {value: string; indexesOfPipedChars: number[]}) => {
    const dateFormatArray = dateFormat.split(/[^dmyHMS]+/).sort((a, b) => formatOrder.indexOf(a) - formatOrder.indexOf(b));
    return (conformedValue: string) => {
        const indexesOfPipedChars = [];
        const maxValue = {dd: 31, mm: 12, yy: 99, yyyy: maxYear, HH: 23, MM: 59, SS: 59};
        const minValue = {dd: 1, mm: 1, yy: 0, yyyy: minYear, HH: 0, MM: 0, SS: 0};
        const conformedValueArr = conformedValue.split('');

        // Проверяем первое число
        dateFormatArray.forEach((format) => {
            const position = dateFormat.indexOf(format);
            const maxFirstDigit = parseInt(maxValue[format].toString().substr(0, 1), 10);

            if (parseInt(conformedValueArr[position], 10) > maxFirstDigit) {
                conformedValueArr[position + 1] = conformedValueArr[position];
                conformedValueArr[position] = '0';
                indexesOfPipedChars.push(position);
            }
        });

        // Проверка на неверную датау
        let month = 0;
        const isInvalid = dateFormatArray.some((format) => {
            const position = dateFormat.indexOf(format);
            const {length} = format;
            const textValue = conformedValue.substr(position, length).replace(/\D/g, '');
            const value = parseInt(textValue, 10);
            if (format === 'mm') {
                month = value || 0;
            }
            const maxValueForFormat = format === 'dd' ? maxValueMonth[month] : maxValue[format];
            if (format === 'yyyy' && (minYear !== 1 || maxYear !== 9999)) {
                const scopedMaxValue = parseInt(maxValue[format].toString().substring(0, textValue.length), 10);
                const scopedMinValue = parseInt(minValue[format].toString().substring(0, textValue.length), 10);
                return value < scopedMinValue || value > scopedMaxValue;
            }
            return value > maxValueForFormat || (textValue.length === length && value < minValue[format]);
        });

        if (isInvalid) {
            return false;
        }

        return {
            value: conformedValueArr.join(''),
            indexesOfPipedChars,
        };
    };
};

// export const emailPipe = (conformedValue, config) => {
//     const {currentCaretPosition, rawValue, previousConformedValue, placeholderChar} = config;

//     const removeAllAtSymbolsButFirst = (str) => {
//         let atSymbolCount = 0;

//         return str.replace(allAtSymbolsRegExp, () => {
//             // eslint-disable-next-line no-plusplus
//             atSymbolCount++;

//             return atSymbolCount === 1 ? atSymbol : emptyString;
//         });
//     };

//     let value = conformedValue;

//     value = removeAllAtSymbolsButFirst(value);

//     const indexOfAtDot = value.indexOf(atDot);

//     const emptyEmail = rawValue.match(new RegExp(`[^@\\s.${placeholderChar}]`)) === null;

//     if (emptyEmail) {
//         return emptyString;
//     }

//     if (
//         includes(value, dotDot) ||
//         (indexOfAtDot !== -1 && currentCaretPosition !== indexOfAtDot + 1) ||
//         (includes(rawValue, atSymbol) && previousConformedValue !== emptyString && includes(rawValue, dot))
//     ) {
//         return false;
//     }

//     const indexOfAtSymbol = value.indexOf(atSymbol);
//     const domainPart = value.slice(indexOfAtSymbol + 1, value.length);

//     if (
//         (domainPart.match(allDotsRegExp) || emptyArray).length > 1 &&
//         value.substr(-1) === dot &&
//         currentCaretPosition !== rawValue.length
//     ) {
//         value = value.slice(0, value.length - 1);
//     }

//     return value;
// };

const getConnector = (rawValue, indexOfConnection, connectionSymbol) => {
    const connector = [];

    if (rawValue[indexOfConnection] === connectionSymbol) {
        connector.push(connectionSymbol);
    } else {
        connector.push(caretTrap, connectionSymbol);
    }

    connector.push(caretTrap);

    return connector;
};

const getLocalPart = (rawValue, indexOfFirstAtSymbol: number) => {
    return indexOfFirstAtSymbol === -1 ? rawValue : rawValue.slice(0, indexOfFirstAtSymbol);
};

const getDomainName = (rawValue, indexOfFirstAtSymbol, indexOfTopLevelDomainDot, placeholderChar) => {
    let domainName = emptyString;

    if (indexOfFirstAtSymbol !== -1) {
        if (indexOfTopLevelDomainDot === -1) {
            domainName = rawValue.slice(indexOfFirstAtSymbol + 1, rawValue.length);
        } else {
            domainName = rawValue.slice(indexOfFirstAtSymbol + 1, indexOfTopLevelDomainDot);
        }
    }

    domainName = domainName.replace(new RegExp(`[\\s${placeholderChar}]`, g), emptyString);

    if (domainName === atSymbol) {
        return asterisk;
    }
    if (domainName.length < 1) {
        return space;
    }
    if (domainName[domainName.length - 1] === dot) {
        return domainName.slice(0, domainName.length - 1);
    }
    return domainName;
};

const getTopLevelDomain = (rawValue, indexOfTopLevelDomainDot, placeholderChar, currentCaretPosition) => {
    let topLevelDomain = emptyString;

    if (indexOfTopLevelDomainDot !== -1) {
        topLevelDomain = rawValue.slice(indexOfTopLevelDomainDot + 1, rawValue.length);
    }

    topLevelDomain = topLevelDomain.replace(new RegExp(`[\\s${placeholderChar}.]`, g), emptyString);

    switch (topLevelDomain.length) {
        case 0:
            return rawValue[indexOfTopLevelDomainDot - 1] === dot && currentCaretPosition !== rawValue.length ? asterisk : emptyString;
        default:
            return topLevelDomain;
    }
};

const convertToMask = (str, noDots?) =>
    str.split(emptyString).map((char) => {
        switch (char) {
            case space:
                return char;
            default:
                return noDots ? anyNonDotOrWhitespaceRegExp : anyNonWhitespaceRegExp;
        }
    });

interface IEmailMaskConfig {
    currentCaretPosition: number;
    previousConformedValue: string;
    placeholderChar: string;
}

export const emailMask = (rawValue: string, config?: IEmailMaskConfig): maskArray => {
    const trimmedRawValue = rawValue.replace(allWhitespaceRegExp, emptyString);

    const {placeholderChar, currentCaretPosition} = config;
    const indexOfFirstAtSymbol = trimmedRawValue.indexOf(atSymbol);
    const indexOfLastDot = trimmedRawValue.lastIndexOf(dot);
    const indexOfTopLevelDomainDot = indexOfLastDot < indexOfFirstAtSymbol ? -1 : indexOfLastDot;

    const localPartToDomainConnector = getConnector(trimmedRawValue, indexOfFirstAtSymbol + 1, atSymbol);
    const domainNameToTopLevelDomainConnector = getConnector(trimmedRawValue, indexOfTopLevelDomainDot - 1, dot);

    let localPart = getLocalPart(trimmedRawValue, indexOfFirstAtSymbol /* placeholderChar */);
    let domainName = getDomainName(trimmedRawValue, indexOfFirstAtSymbol, indexOfTopLevelDomainDot, placeholderChar);
    let topLevelDomain = getTopLevelDomain(trimmedRawValue, indexOfTopLevelDomainDot, placeholderChar, currentCaretPosition);

    localPart = convertToMask(localPart);
    domainName = convertToMask(domainName);
    topLevelDomain = convertToMask(topLevelDomain, true);

    const mask = localPart
        .concat(localPartToDomainConnector)
        .concat(domainName)
        .concat(domainNameToTopLevelDomainConnector)
        .concat(topLevelDomain);

    return mask;
};
