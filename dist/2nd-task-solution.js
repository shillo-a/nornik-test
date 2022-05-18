"use strict";
/**
 * Here is interface you need to implement.
 * Please use only single .ts file for solution. Please make sure it can be compiled on Tyepscript 4 without
 * any additional steps and 3rd-party libs. Please use comments to describe your solution.
 *
 * This is spot provider, it stores information about ticking spots, and provide ability to requests like : what was the spot
 * at any given point in time.
 * CCYPAIR  is combination of two 3-chars currencies like "EURUSD" or "JPYRUB" and so on.  Always in uppercase.
 * SPOT is ticking value of given ccypair  like for "USDRUB" it can be 76.45 then 76.46 then 76.44 ...
 *
 * We can assume that all data fits in memory, so we don't need to store it anywhere.
 *
 */
///////////////// РЕШЕНИЕ ///////////////////////
// Создаем дополнительные классы и функции, которые пригодятся нам далее
// Сериализацию не делаем, по условию задачи не ясно, есть ли в этом необходимость
// По всем несоответствиям строго выдаем ошибку
class ValidationError extends Error {
    constructor(remarks = []) {
        super('Validation error');
        this.remarks = remarks;
        this.remarks = remarks;
        // Решение ошибки extends в TS для использования instanceof далее
        // Источник - https://stackoverflow.com/questions/31626231/custom-error-class-in-typescript/41429145#41429145
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
class Validators {
    static isLength6(value) {
        return value.length === 6 ? true : false;
    }
    static isUpperCase(value) {
        return value.toUpperCase() === value ? true : false;
    }
    static isOnlyEnglishLetters(value) {
        return /[a-zA-Z]/.test(value);
    }
    static isUnixTimestamp(timestamp) {
        return timestamp.toString().length === 10 ? true : false;
    }
}
function addCcypairSpotValidation(ccypair, tickTime) {
    let remarks = [];
    if (!Validators.isLength6(ccypair)) {
        remarks.push('Некорректная длина валютной пары');
    }
    if (!Validators.isUpperCase(ccypair)) {
        remarks.push('Некорректный регистр валютной пары');
    }
    if (!Validators.isOnlyEnglishLetters(ccypair)) {
        remarks.push('Использованы некорректные символы для валютной пары');
    }
    if (!Validators.isUnixTimestamp(tickTime)) {
        remarks.push('TickTime указан не в формате Unix Timestamp MS');
    }
    if (remarks.length > 0) {
        throw new ValidationError(remarks);
    }
}
function getCcypairSpotValidation(ccypair) {
    let remarks = [];
    if (!Validators.isLength6(ccypair)) {
        remarks.push('Некорректная длина валютной пары');
    }
    if (!Validators.isUpperCase(ccypair)) {
        remarks.push('Некорректный регистр валютной пары');
    }
    if (!Validators.isOnlyEnglishLetters(ccypair)) {
        remarks.push('Использованы некорректные символы для валютной пары');
    }
    if (remarks.length > 0) {
        throw new ValidationError(remarks);
    }
}
function spotsBinarySearch(spots, dateTime) {
    // Можно реализовать перевод dateTime в unix timestamp, чтобы воспринимались и другие форматы
    // Но по умолчанию пока передаем только число
    const dateTimeUnixTimestamp = dateTime;
    let lowIndex = 0;
    let highIndex = spots.length - 1;
    let requiredIndex = -1;
    while (lowIndex <= highIndex) {
        let middleIndex = Math.floor((lowIndex + highIndex) / 2);
        if (spots[middleIndex].tickTime === dateTimeUnixTimestamp) {
            requiredIndex = middleIndex;
            break;
        }
        else if (spots[middleIndex].tickTime > dateTimeUnixTimestamp) {
            highIndex = middleIndex - 1;
        }
        else if (spots[middleIndex].tickTime < dateTimeUnixTimestamp) {
            lowIndex = middleIndex + 1;
        }
        requiredIndex = middleIndex; // Сохраняем наиболее приближенное значение
    }
    return spots[requiredIndex].spot;
}
class CcypairSpotStore {
    constructor(_ccypairsSpotsMap = new Map()) {
        this._ccypairsSpotsMap = _ccypairsSpotsMap;
    }
    add(ccypair, spot, tickTime) {
        var _a;
        // 1. Выполняем валидацию
        addCcypairSpotValidation(ccypair, tickTime);
        // 2. Если ccypair еще нет в памяти, то инициализируем новую ccypair поиск - O(1), добавление - O(1)
        if (!this._ccypairsSpotsMap.has(ccypair)) {
            this._ccypairsSpotsMap.set(ccypair, []);
        }
        // 3. Добавляем значение в массив к конкретному ccypair - O(1)
        (_a = this._ccypairsSpotsMap.get(ccypair)) === null || _a === void 0 ? void 0 : _a.push({ spot, tickTime });
    }
    get(ccypair, dateTime) {
        // 1. Выполняем валидацию
        getCcypairSpotValidation(ccypair);
        // 2. Проверяем, что ccypair уже есть в памяти, иначе выдаем ошибку
        // можно было бы undefined, но условия задачи не позволяют
        if (!this._ccypairsSpotsMap.has(ccypair)) {
            throw new ValidationError(['Такой валютной пары нет в памяти']);
        }
        // 3. Находим необходимую ccypair и выгружаем spots к ней
        const ccypairSpotsList = this._ccypairsSpotsMap.get(ccypair);
        // 4. Так как предполагается, что данные сразу будут отсортированными по умолчанию (загружаются по мере появления новых данных), 
        // можно применить бинарный поиск по отсортированному массиву O(logN), ищем наиболее подходящий индекс
        return spotsBinarySearch(ccypairSpotsList, dateTime);
    }
}
const myCcypairSpotStore = new CcypairSpotStore();
try {
    let i = 0;
    while (i < 10000) {
        myCcypairSpotStore.add('USDEUR', i, 1652815741 + i); // предположим, что tickTime = unix timestamp в ms
        myCcypairSpotStore.add('USDRUB', i, 1652815741 + i);
        myCcypairSpotStore.add('USDJPY', i, 1652815741 + i);
        i++;
    }
    console.log(myCcypairSpotStore.get('USDEUR', 1652823941), // предположим, что dateTime = unix timestamp в ms (по условию необхочимо задать number а не string)
    myCcypairSpotStore.get('USDJPY', 1652823942));
    console.log(myCcypairSpotStore);
}
catch (err) {
    if (err instanceof ValidationError) {
        console.log(err.remarks);
    }
    else {
        throw err;
    }
}
