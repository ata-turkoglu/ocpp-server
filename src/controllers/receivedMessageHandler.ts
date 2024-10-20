import WebSocket from "ws";
import { IdTagInfo, SocketInfo } from "../models/common";
import { AuthorizeReq } from "../models/requests";
import {
    BootNotificationRes,
    StartTransactionRes,
    StopTransactionRes,
} from "../models/responses";
import SessionManager from "../services/SessionManager";
import Authorization from "../services/Authorization";
import MessageSendingHandler from "../services/MessageSendingHandler";
import BroadcastService from "../services/BroadcastService";
import { convertKeysForDB, getUserName } from "../utils";

const ReceivedMessageHandler = (
    socket: WebSocket & SocketInfo,
    charger: string,
    data: any,
    clients: any
) => {
    const [messageTypeId, uniqueId, action, payload] = JSON.parse(
        data.toString()
    );

    console.log("ReceivedMessageHandler: ", data);

    switch (action) {
        case "Authorize":
            return authorizeMsg(socket, uniqueId, payload, charger);
        case "BootNotification":
            return bootNotificationMsg(
                socket,
                uniqueId,
                payload,
                charger,
                clients
            );
        case "StartTransaction":
            return startTransactionMsg(
                socket,
                uniqueId,
                payload,
                charger,
                clients
            );
        case "StatusNotification":
            return statusNotificationMsg(
                socket,
                uniqueId,
                payload,
                charger,
                clients
            );
        case "MeterValues":
            return meterValuesMsg(socket, uniqueId, payload, charger, clients);
        case "StopTransaction":
            return stopTransactionMsg(
                socket,
                uniqueId,
                payload,
                charger,
                clients
            );
        case "Heartbeat":
            return heartbeatMsg(socket, uniqueId, payload, charger);
        default:
            break;
    }
};

const authorizeMsg = async (
    socket: WebSocket & SocketInfo,
    uniqueId: string,
    data: AuthorizeReq,
    charger: string
) => {
    const idTagInfo: IdTagInfo = await Authorization(data);

    MessageSendingHandler(socket, 3, uniqueId, idTagInfo);
};

const bootNotificationMsg = async (
    socket: WebSocket & SocketInfo,
    uniqueId: string,
    data: any,
    charger: string,
    clients: any
) => {
    const response: any = await SessionManager(
        socket.idTag,
        "bootCharger",
        data,
        charger
    );

    MessageSendingHandler(socket, 3, uniqueId, response);

    if (response.status == "Accepted") {
        BroadcastService("online", charger, clients, response);
    }
};

const startTransactionMsg = async (
    socket: WebSocket & SocketInfo,
    uniqueId: string,
    data: any,
    charger: string,
    clients: any
) => {
    const response: any = await SessionManager(
        socket.idTag,
        "startTransaction",
        data,
        charger
    );

    MessageSendingHandler(socket, 3, uniqueId, response);

    if (response.idTagInfo.status == "Accepted") {
        const userName = await getUserName(data.idTag);
        const newData = {
            userName,
            ...data,
            start_timestamp: data.timestamp,
        };
        delete newData.timestamp;
        const broadcastData = {
            ...newData,
            transactionId: response.transactionId,
        };

        BroadcastService(
            "startTransaction",
            charger,
            clients,
            convertKeysForDB(broadcastData, false)
        );
    }
};

const statusNotificationMsg = async (
    socket: WebSocket & SocketInfo,
    uniqueId: string,
    data: any,
    charger: string,
    clients: any
) => {
    const response = await SessionManager(
        socket.idTag,
        "updateStatus",
        data,
        charger
    );

    MessageSendingHandler(socket, 3, uniqueId, {});

    BroadcastService(
        "statusUpdate",
        charger,
        clients,
        convertKeysForDB(data, false)
    );
};

const meterValuesMsg = async (
    socket: WebSocket & SocketInfo,
    uniqueId: string,
    data: any,
    charger: string,
    clients: any
) => {
    const response = await SessionManager(
        socket.idTag,
        "meterValues",
        data,
        charger
    );

    MessageSendingHandler(socket, 3, uniqueId, response);

    BroadcastService(
        "meterValues",
        charger,
        clients,
        convertKeysForDB(data, false)
    );
};

const stopTransactionMsg = async (
    socket: WebSocket & SocketInfo,
    uniqueId: string,
    data: any,
    charger: string,
    clients: any
) => {
    const response: any = await SessionManager(
        socket.idTag,
        "stopTransaction",
        data,
        charger
    );

    MessageSendingHandler(socket, 3, uniqueId, response);

    if (response.idTagInfo.status == "Accepted") {
        const broadcastData = {
            ...data,
            endTimestamp: data.timestamp,
            meterValues: data.transactionData,
        };
        delete broadcastData.timestamp;
        delete broadcastData.transactionData;

        BroadcastService(
            "stopTransaction",
            charger,
            clients,
            convertKeysForDB(broadcastData, false)
        );
    }
};

const heartbeatMsg = (
    socket: WebSocket & SocketInfo,
    uniqueId: string,
    data: any,
    charger: string
) => {};

export default ReceivedMessageHandler;
