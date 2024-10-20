import { Request, Response, NextFunction } from "express";
import db from "../../db";

const express = require("express");
const usersRoutes = express.Router();

usersRoutes.get(
    "/",
    async (req: Request, response: Response, next: NextFunction) => {
        const result = await db("users")
            .select()
            .catch((err) => console.error(err));

        if (!result) return response.status(500).send({ error: "error" });
        return response.status(200).send(result);
    }
);

export default usersRoutes;
