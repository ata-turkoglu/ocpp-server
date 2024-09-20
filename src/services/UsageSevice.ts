import db from "../../db";

const UsageService = {
    add: async (data: any) => {
        await db("usages").insert(data);
    },
};

export default UsageService;
