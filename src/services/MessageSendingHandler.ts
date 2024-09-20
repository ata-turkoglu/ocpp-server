import WebSocket from "ws";
import { SocketInfo } from "../models/common";

const MessageSendingHandler = (
    socket: WebSocket & SocketInfo,
    messageTypeId: number,
    uniqueId: string,
    data: any
) => {
    let res = [messageTypeId, uniqueId, data];

    console.log("message send to client: ", JSON.stringify(res));
    socket.send(JSON.stringify(res));
};

export default MessageSendingHandler;
