import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import WebSocket from "ws";
import { SocketInfo } from "./models/common";
import ReceivedMessageHandler from "./controllers/receivedMessageHandler";
import Disconnection from "./services/Disconnection";

dotenv.config();
const port = process.env.PORT || 33333;

const app: Express = express();
const server = app.listen(port, () => {
    console.log("Server listening on http:/localhost:" + port);
});

const wsServer = new WebSocket.Server({
    noServer: true,
    perMessageDeflate: {
        zlibDeflateOptions: {
            // See zlib defaults.
            chunkSize: 1024,
            memLevel: 7,
            level: 3,
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024,
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 1024, // Size (in bytes) below which messages
        // should not be compressed if context takeover is disabled.
    },
    /* verifyClient: function (info: any, done) {
        console.log("verify: ", info.req.url.slice(1));
        done(true);
        const chargerState = checkCharger(info.req.url.slice(1));
        if (chargerState) {
            done(true);
        } else {
            done(false, 404, "Not valid charger");
        }
    }, */
});

var dashboards: WebSocket[] = [];

wsServer.on(
    "connection",
    (socket: WebSocket & SocketInfo, request: Request) => {
        const searchParams = new URLSearchParams(request.url.slice(1));
        const charger = searchParams.get("charger");
        const dashboard = searchParams.get("dashboard");
        //let charger = request.url.slice(1);
        if (charger) {
            socket.charger = charger;
            socket.idTag = "";
            console.log("New charger connected", charger);

            socket.on("message", (data: string) => {
                const [messageTypeId] = JSON.parse(data.toString());
                if (messageTypeId == 2) {
                    ReceivedMessageHandler(socket, charger, data.toString());
                }
            });

            socket.on("close", async () => {
                console.log("Client disconnected", charger);
                await Disconnection(charger);
            });

            socket.on("error", (error: any) => {
                throw new Error("socket error: " + error);
            });
        }

        if (dashboard) {
            dashboards.push(socket);
        }
    }
);

wsServer.on("error", (error: any) => {
    console.log("WSS Error", error);
    throw new Error("wss error");
});

server.on("upgrade", (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, (ws) => {
        wsServer.emit("connection", ws, request);
    });
});
