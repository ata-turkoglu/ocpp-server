import db from "../../db";
import { SocketInfo } from "../models/common";
import BroadcastService from "./BroadcastService";

const Disconnection = async (charger_code: string, chargers: any) => {
    await db("online_chargers").where({ charger_code }).del();
    BroadcastService("offline", charger_code, chargers, null);
};

export default Disconnection;
