import {useEffect, useRef} from 'react';

/**
 * Хук получения предыдущего состояния.
 *
 * @param value параметр прошлое состояние которого мы хотим отслеживать.
 */
export const usePrev = <T>(value: T): T => {
    const ref = useRef<T>();

    useEffect(() => {
        ref.current = value;
    });

    return ref.current;
};
