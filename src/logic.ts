import {getData} from './dataStore';

export function adding (a: number, b: number) {
    const data = getData();
    
    data.number += (a + b);
    return ({result: getData().number});
}

export function show() {
    return (getData());
}