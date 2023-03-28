import ItemCode from "../models/ItemCode.js";


import mongoose from "mongoose";

const getAllItemCodes = async (req, res) => {
    const {
        _end,
        _order,
        _start,
        _sort,
        owner = "",
        fileName_like = "",
    } = req.query;

    const query = {};

    if (owner !== "") {
        query.owner = owner;
    }

    if (fileName_like) {
        query.fileName_like = { $regex: fileName_like, $options: "i" };
    }

    try {
        console.log("query ", query)
        const count = await ItemCode.countDocuments({ query });
        console.log("item code count", count)
        const itemCodes = await ItemCode.find(query)
            .limit(_end)
            .skip(_start)
            .sort({ [_sort]: _order });

        console.log("itemCodes", itemCodes)
        res.header("x-total-count", count);
        res.header("Access-Control-Expose-Headers", "x-total-count");

        res.status(200).json(itemCodes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createItemCode = async (req, res) => {
    try {
        const {
            fileName,
            fileUrl,
            status,
            owner,
            createBy,
        } = req.body;

        const session = await mongoose.startSession();
        session.startTransaction();

        
        const newItemCode = await ItemCode.create({
            fileName,
            fileUrl,
            status,
            owner,
            createBy
        });

        console.log("itemCode created ", newItemCode)
        //ItemCode.allProperties.push(newItemCode._id);
        //await ItemCode.save({ session });

        await session.commitTransaction();

        res.status(200).json({ message: "ItemCode created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getAllItemCodes,
    createItemCode
};