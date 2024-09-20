import WebSocket from "ws";
import { IdTagInfo, SocketInfo } from "../models/common";
import { AuthorizeReq } from "../models/requests";
import { BootNotificationRes, StartTransactionRes } from "../models/responses";
import SessionManager from "../services/SessionManager";
import Authorization from "../services/Authorization";
import MessageSendingHandler from "../services/MessageSendingHandler";

const ReceivedMessageHandler = (
    socket: WebSocket & SocketInfo,
    charger: string,
    data: any
) => {
    const [messageTypeId, uniqueId, action, payload] = JSON.parse(
        data.toString()
    );

    console.log("ReceivedMessageHandler: ", data);

    switch (action) {
        case "Authorize":
            return authorizeMsg(socket, uniqueId, payload, charger);
        case "BootNotification":
            return bootNotificationMsg(socket, uniqueId, payload, charger);
        case "StartTransaction":
            return startTransactionMsg(socket, uniqueId, payload, charger);
        case "StatusNotification":
            return statusNotificationMsg(socket, uniqueId, payload, charger);
        case "MeterValues":
            return meterValuesMsg(socket, uniqueId, payload, charger);
        case "StopTransaction":
            return stopTransactionMsg(socket, uniqueId, payload, charger);
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

    if (idTagInfo.status == "Accepted") {
        socket.idTag = data.idTag;
        await SessionManager(socket.idTag, "startSession", idTagInfo, charger);
    }

    MessageSendingHandler(socket, 3, uniqueId, idTagInfo);
};

const bootNotificationMsg = async (
    socket: WebSocket & SocketInfo,
    uniqueId: string,
    data: any,
    charger: string
) => {
    const response = await SessionManager(
        socket.idTag,
        "bootCharger",
        data,
        charger
    );

    MessageSendingHandler(socket, 3, uniqueId, response);
};

const startTransactionMsg = async (
    socket: WebSocket & SocketInfo,
    uniqueId: string,
    data: any,
    charger: string
) => {
    const response = await SessionManager(
        socket.idTag,
        "startTransaction",
        data,
        charger
    );

    MessageSendingHandler(socket, 3, uniqueId, response);
};

const statusNotificationMsg = async (
    socket: WebSocket & SocketInfo,
    uniqueId: string,
    data: any,
    charger: string
) => {
    const response = await SessionManager(
        socket.idTag,
        "updateStatus",
        data,
        charger
    );

    MessageSendingHandler(socket, 3, uniqueId, {});
};

const meterValuesMsg = async (
    socket: WebSocket & SocketInfo,
    uniqueId: string,
    data: any,
    charger: string
) => {
    const response = await SessionManager(
        socket.idTag,
        "meterValues",
        data,
        charger
    );

    MessageSendingHandler(socket, 3, uniqueId, response);
};

const stopTransactionMsg = async (
    socket: WebSocket & SocketInfo,
    uniqueId: string,
    data: any,
    charger: string
) => {
    const response = await SessionManager(
        socket.idTag,
        "stopTransaction",
        data,
        charger
    );

    MessageSendingHandler(socket, 3, uniqueId, response);
};

const heartbeatMsg = (
    socket: WebSocket & SocketInfo,
    uniqueId: string,
    data: any,
    charger: string
) => {};

export default ReceivedMessageHandler;
