let data: DataStore = {
    number: 0}

export const getData = () => {
    return data;
}

export const setData = (newData: DataStore) => {
    data = newData
}

interface DataStore {
    number: number
}