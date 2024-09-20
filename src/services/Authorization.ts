import { IdTagInfo } from "../models/common";
import { AuthorizeReq } from "../models/requests";
import { AuthorizationStatus } from "../models/enums";
import db from "../../db";
import { convertKeysForDB, convertKeysFromDB } from "../utils";

const Authorization = async (data: AuthorizeReq) => {
    const dbData = convertKeysForDB(data, true);
    let res: IdTagInfo = {
        expiryDate: null,
        parentIdTag: "",
        status: AuthorizationStatus.Accepted,
    };
    const result = await db("users")
        .select("expiry_date", "parent_id_tag", "status")
        .where(dbData);

    if (result.length <= 0) {
        res.status = AuthorizationStatus.Invalid;
    } else if (result[0].status == null) {
        res.status = AuthorizationStatus.Accepted;
    } else {
        res = { ...convertKeysFromDB(result[0]) };
    }

    return res;
};

export default Authorization;
