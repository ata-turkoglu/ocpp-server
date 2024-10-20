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

export const getUserName = async (id_tag: string) => {
    return await db("users")
        .select("user_name")
        .where({ id_tag })
        .then((res) => res[0].user_name);
};

export const addDummyConnector = async () => {
    await db("online_chargers").insert({
        online_charger_id: 223,
        charger_code: "newStation1239",
        connector_id: 2,
        error_code: "NoError",
        info: null,
        status: "Available",
        timestamp: "2024-09-24T13:29:07.953Z",
        vendorid: null,
        vendorerrorcode: null,
    });
};
