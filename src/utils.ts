import db from "../db";

const camelToSnakeCase = (str: string) =>
    str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const snakeToCamelCase = (str: string) =>
    str.toLowerCase().replace(/(_\w)/g, (m) => m.toUpperCase().substr(1));

export const convertKeysForDB = (data: any, removeNulls: boolean) => {
    try {
        let nullIndexes: number[] = [];
        const newData: any = {};
        const keys = Object.keys(data);
        const values = Object.values(data);

        if (removeNulls) {
            values.forEach((item, index) => {
                if (item != 0 && !item) {
                    nullIndexes.push(index);
                }
            });
        }

        keys.forEach((key: string, index: number) => {
            if (removeNulls && !nullIndexes.includes(index)) {
                const newKey = camelToSnakeCase(key);
                newData[newKey] = values[index];
            } else if (!removeNulls) {
                const newKey = camelToSnakeCase(key);
                newData[newKey] = values[index];
            }
        });
        return newData;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const convertKeysFromDB = (data: any) => {
    try {
        const newData: any = {};
        const keys = Object.keys(data);
        const values = Object.values(data);
        keys.forEach((key, index) => {
            const newKey = snakeToCamelCase(key);
            newData[newKey] = values[index];
        });
        return newData;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const resetOnlinesTable = async () => {
    await db("online_chargers").del();
};
