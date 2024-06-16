const ServiceModel = require("../Models/ServiceModel");
const aws = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const PrimaryData = async (req, res) => {
    try {

        const {
            ServiceName,
            Description,
            Active,
            Photos,
        } = req.body;
        const id = uuidv4();
        const newPrimary = new ServiceModel({
            id,
            ServiceName,
            Description,
            Active,
            Photos,
        });
        const savedPrimary = await newPrimary.save();
        return res.status(201).send({
            status: true,
            msg: "New Primary created successfully",
            data: savedPrimary,
        });

    } catch (err) {

        return res.status(500).send({ status: false, msg: "Server error", error: err.message });
    }
};

const getPrimaryData = async (req, res) => {
    try {
        const PrimaryData = await ServiceModel.find();
        res.status(200).send({
            status: true,
            msg: "PrimaryData retrieved succesfully",
            data: PrimaryData,
        });
    } catch (err) {
        return res
            .status(500)
            .send({ status: false, msg: "server error", error: err.message });
    }
};

const getByPrimaryId = async (req, res) => {
    const PrimaryId = req.params.PrimaryId;
    console.log("pri", PrimaryId)
    const PrimaryData = await ServiceModel.findOne({
        id: PrimaryId,
        isDeleted: false,
    });

    return res
        .status(200)
        .send({ status: true, msg: "Data fetch succesfully", data: PrimaryData });
};

const updatePrimaryData = async (req, res) => {
    try {
        const { Active, ServiceName, Description, Photos } = req.body;
        const primaryId = req.params.primaryId;

        if (!primaryId) {
            return res.status(400).send({
                status: false,
                msg: "PrimaryId parameter is required",
            });
        }

        const existingUnit = await ServiceModel.findOne({
            Active,
            id: { $ne: primaryId },
        });

        let updateBody = await ServiceModel.findOneAndUpdate(
            { id: primaryId },
            {
                $set: {
                    Active: Active,
                    ServiceName: ServiceName,
                    Description: Description,
                    Photos: Photos,
                },
            },
            { new: true }
        );

        if (!updateBody) {
            return res.status(404).send({
                status: false,
                msg: "Primary data not found",
            });
        }

        return res.status(200).send({
            status: true,
            msg: "Data updated successfully",
            data: updateBody,
        });
    } catch (err) {
        return res.status(500).send({
            status: false,
            msg: "server error",
            error: err.message,
        });
    }
};



const DeletePrimarydata = async (req, res) => {
    try {
        const result = await ServiceModel.deleteMany({});
        res.send(`Deleted ${result.deletedCount} PrimaryData`);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .send({ status: false, msg: "server error", error: err.message });
    }
};


const DeleteByPrimaryId = async (req, res) => {
    try {
        let PrimaryId = req.params.PrimaryId;
        console.log("pri", PrimaryId)
        const deletionResult = await ServiceModel.deleteOne({ PrimaryId: PrimaryId });

        if (deletionResult.deletedCount === 0) {
            return res.status(404).send({ status: false, message: "Page not found" });
        }

        return res.status(200).send({ status: true, message: "Data deleted successfully." });
    } catch (err) {
        return res.status(500).send({ status: false, message: "Server error", error: err.message });
    }
};

module.exports = {
    PrimaryData,
    getPrimaryData,
    getByPrimaryId,
    updatePrimaryData,
    DeletePrimarydata,
    DeleteByPrimaryId
};