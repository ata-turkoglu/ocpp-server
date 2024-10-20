import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import WebSocket from "ws";
import { SocketInfo } from "./models/common";
import ReceivedMessageHandler from "./controllers/receivedMessageHandler";
import Disconnection from "./services/Disconnection";
import chargersRoutes from "./routes/chargers";
import usersRoutes from "./routes/users";
import usageRoutes from "./routes/usage";
import { addDummyConnector, resetOnlinesTable } from "./utils";

dotenv.config();

const port = process.env.PORT || 3333;

const app: Express = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

app.use("/chargers", chargersRoutes);
app.use("/users", usersRoutes);
app.use("/usage", usageRoutes);
const server = app.listen(port, async () => {
    await resetOnlinesTable();
    //await addDummyConnector();
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
        const dashboard = !!searchParams.get("dashboard");
        //let charger = request.url.slice(1);
        socket.charger = charger;
        socket.idTag = "";
        socket.dashboard = dashboard;
        if (charger) {
            console.log("New charger connected", charger);
        }

        if (dashboard) {
            console.log("New dashboard connected", dashboard);
            dashboards.push(socket);
        }

        socket.on("message", (data: string) => {
            if (charger) {
                const [messageTypeId] = JSON.parse(data.toString());
                if (messageTypeId == 2) {
                    ReceivedMessageHandler(
                        socket,
                        charger,
                        data.toString(),
                        wsServer.clients
                    );
                }
            }
        });

        socket.on("close", async () => {
            if (charger) {
                console.log("Client disconnected", charger);
                await Disconnection(charger, wsServer.clients);
            }

            if (dashboard) {
                console.log("Dashboard disconnected", dashboard);
            }
        });

        socket.on("error", (error: any) => {
            throw new Error("socket error: " + error);
        });
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
