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
                //const transactions = await trx('transactions').select().where({})
                chargers.forEach(async (charger) => {
                    const found = onlines.filter(
                        (onl) => onl.charger_code == charger.charger_code
                    );
                    if (found.length > 0) {
                        charger.online = true;
                        charger.connectors = {};
                        found.forEach(async (conn) => {
                            const transaction = await trx("transactions")
                                .select()
                                .where({
                                    charger_code: charger.charger_code,
                                    connector_id: conn.connector_id,
                                })
                                .orderBy("start_timestamp", "desc")
                                .limit(1)
                                .then((res) => res[0]);
                            conn.transaction = { ...transaction };
                            charger.connectors[conn.connector_id] = conn;
                        });
                    } else {
                        charger.online = false;
                    }
                });
                return chargers;
            })
            .catch((err) => console.error(err));

        //console.log(result);

        if (!result) return response.status(500).send({ error: "error" });

        //console.log("get-chargers", JSON.stringify(result));
        return response.status(200).send(result);
    }
);

export default chargersRoutes;
