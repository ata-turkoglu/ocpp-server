import { Request, Response, NextFunction } from "express";
import db from "../../db";

const express = require("express");
const chargersRoutes = express.Router();

chargersRoutes.get(
    "/",
    async (req: Request, response: Response, next: NextFunction) => {
        const result = await db
            .transaction(async (trx) => {
                const chargers = await trx("chargers").select();
                const onlines = await trx("online_chargers").select();
                chargers.forEach((charger) => {
                    const found = onlines.find(
                        (onl) => onl.charger_code == charger.charger_code
                    );
                    if (found) {
                        charger.online = true;
                        charger.connectors = {};
                        charger.connectors[found.connector_id] = found;
                    } else {
                        charger.online = false;
                    }
                });
                return chargers;
            })
            .catch((err) => console.error(err));

        console.log(result);

        if (!result) return response.status(500).send({ error: "error" });

        console.log("get-chargers", JSON.stringify(result));
        return response.status(200).send(result);
    }
);

export default chargersRoutes;
