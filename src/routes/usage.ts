import { Request, Response, NextFunction } from "express";
import db from "../../db";

const express = require("express");
const usageRoutes = express.Router();

usageRoutes.post(
    "/getByUser",
    async (req: Request, response: Response, next: NextFunction) => {
        const { id_tag } = req.body;
        const result = await db("usages")
            .select()
            .where({ id_tag })
            .catch((err) => console.error(err));

        if (!result) return response.status(500).send({ error: "error" });
        return response.status(200).send(result);
    }
);

export default usageRoutes;
