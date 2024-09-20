import db from "../../db";
import { SocketInfo } from "../models/common";

const Disconnection = async (charger_code: string) => {
    console.log("chargers_code", charger_code);
    await db("online_chargers").where({ charger_code }).del();
};

export default Disconnection;
