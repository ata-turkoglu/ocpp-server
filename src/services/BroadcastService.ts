import WebSocket from "ws";
import { BroadcastData } from "../models/common";
const BroadcastService = async (
    messageType: string,
    charger_code: string,
    clients: any,
    data?: any
) => {
    const BroadcastData: BroadcastData = {
        messageType,
        charger_code,
        data,
    };
    clients.forEach((client: any) => {
        if (client.dashboard) {
            client.send(JSON.stringify(BroadcastData));
        }
    });
};

export default BroadcastService;
