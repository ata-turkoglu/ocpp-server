import { BootNotificationRes } from "../models/responses";
import { RegistrationStatus } from "../models/enums";
import db from "../../db";
import { convertKeysForDB } from "../utils";
import Authorization from "./Authorization";
import UsageService from "./UsageSevice";

const SessionManager = (
    idTag: string,
    action: string,
    data: any,
    charger: string
) => {
    switch (action) {
        case "bootCharger":
            return bootCharger(idTag, data, charger);
        case "updateStatus":
            return updateStatus(idTag, data, charger);
        case "startTransaction":
            return startTransaction(idTag, data, charger);
        case "meterValues":
            return meterValues(idTag, data);
        case "stopTransaction":
            return stopTransaction(idTag, data);
        default:
            break;
    }
};

const bootCharger = async (idTag: string, data: any, charger_code: string) => {
    const dbData = convertKeysForDB(data, true);

    const checked = await db("chargers")
        .count()
        .where({
            charger_code,
            charge_point_vendor: dbData.charge_point_vendor,
            charge_point_model: dbData.charge_point_model,
        })
        .then((res) => (Number(res[0].count) > 0 ? true : false));

    const res: BootNotificationRes = {
        currentTime: new Date(),
        interval: 600,
        status: checked
            ? RegistrationStatus.Accepted
            : RegistrationStatus.Rejected,
    };

    return res;
};

const updateStatus = async (idTag: string, data: any, charger: string) => {
    const existing = await db("online_chargers")
        .count()
        .where({ charger_code: charger, connector_id: data.connectorId })
        .then((res) => (Number(res[0].count) > 0 ? true : false));

    const dbData = {
        charger_code: charger,
        connector_id: data.connectorId,
        error_code: data.errorCode,
        status: data.status,
        timestamp: data.timestamp,
    };

    if (existing) {
        await db("online_chargers")
            .update(dbData)
            .where({ charger_code: charger, connector_id: data.connectorId });
    } else {
        await db("online_chargers").insert(dbData);
    }
};

const startTransaction = async (idTag: string, data: any, charger: string) => {
    const dbData = convertKeysForDB(data, true);
    dbData.charger_code = charger;
    dbData.start_timestamp = dbData.timestamp;
    delete dbData.timestamp;

    const idTagInfo = await Authorization({ idTag });

    let transactionId = null;
    if (idTagInfo.status == "Accepted") {
        transactionId = await db("transactions")
            .insert(dbData)
            .returning("transaction_id")
            .then((res) => res[0].transaction_id);
    }

    return {
        idTagInfo,
        transactionId,
    };
};

const meterValues = async (idTag: string, data: any) => {
    const { transactionId, connectorId, meterValue } = data;
    await db("transactions")
        .where({
            id_tag: idTag,
            transaction_id: transactionId,
            connector_id: connectorId,
        })
        .update({ transaction_data: meterValue });

    return {};
};

const stopTransaction = async (idTag: string, data: any) => {
    const { meterStop, timestamp, transactionId, reason, transactionData } =
        data;

    const idTagInfo = await Authorization({ idTag });

    if (idTagInfo.status == "Accepted") {
        await db("transactions")
            .where({
                id_tag: idTag,
                transaction_id: transactionId,
            })
            .update({
                meter_stop: meterStop,
                transaction_data: transactionData,
                end_timestamp: timestamp,
                end_reason: reason,
            });

        const user_name = await db("users")
            .select("user_name")
            .where({ id_tag: idTag })
            .then((res) => res[0].user_name);

        const result: any = await db("transactions")
            .select()
            .where({
                id_tag: idTag,
                transaction_id: transactionId,
            })
            .then((res) => res[0]);

        const data = {
            id_tag: idTag,
            user_name,
            charger_code: result.charger_code,
            transaction_id: transactionId,
            connector_id: result.connector_id,
            meter_start: result.meter_start,
            start_timestamp: result.start_timestamp,
            meter_stop: meterStop,
            stop_timestamp: timestamp,
            imported: meterStop - result.meter_start,
            end_reason: result.end_reason,
        };

        UsageService.add(data);
    }
    return idTagInfo;
};

export default SessionManager;
