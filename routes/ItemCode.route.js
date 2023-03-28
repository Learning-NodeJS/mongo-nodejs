import express from "express";

import {
    getAllItemCodes,
    createItemCode
} from "../controllers/ItemCode.controller.js";

const router = express.Router();

router.route("/").get(getAllItemCodes);
router.route("/").post(createItemCode);

export default router;