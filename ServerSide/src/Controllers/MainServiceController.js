const MainServiceModel = require("../Models/MainServiceModel");
const aws = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const MainServiceData = async (req, res) => {
    try {

        const {
            ServiceName,
            Description,
            Active,
        } = req.body;
        const id = uuidv4();
        const newMainService = new MainServiceModel({
            id,
            ServiceName,
            Description,
            Active,
        });


        const savedMainService = await newMainService.save();


        return res.status(201).send({
            status: true,
            msg: "New MainService created successfully",
            data: savedMainService,
        });

    } catch (err) {

        return res.status(500).send({ status: false, msg: "Server error", error: err.message });
    }
};

const getMainServiceData = async (req, res) => {
    try {
        const MainServiceData = await MainServiceModel.find();
        res.status(200).send({
            status: true,
            msg: "MainServiceData retrieved succesfully",
            data: MainServiceData,
        });
    } catch (err) {
        return res
            .status(500)
            .send({ status: false, msg: "server error", error: err.message });
    }
};

const getByMainServiceId = async (req, res) => {
    const MainServiceId = req.params.MainServiceId;

    const MainServiceData = await MainServiceModel.findOne({
        id: MainServiceId,
        isDeleted: false,
    });
    return res
        .status(200)
        .send({ status: true, msg: "Data fetch succesfully", data: MainServiceData });
};

const updateMainServiceData = async (req, res) => {
    try {
        const { Active, ServiceName, Description } = req.body;

        let MainServiceId = req.params.MainServiceId;

        const existingUnit = await MainServiceModel.findOne({
            Active,
            id: { $ne: MainServiceId },
        });
        let updateBody = await MainServiceModel.findOneAndUpdate(
            { id: MainServiceId },
            {
                $set: {
                    Active: Active,
                    ServiceName: ServiceName,
                    Description: Description
                },
            },
            { new: true }
        );
        return res.status(200).send({
            status: true,
            msg: "Data updated successfully",
            data: updateBody,
        });
    } catch (err) {
        return res
            .status(500)
            .send({ status: false, msg: "server error", error: err.message });
    }
};

const DeleteMainServicedata = async (req, res) => {
    try {
        const result = await MainServiceModel.deleteMany({});
        res.send(`Deleted ${result.deletedCount} MainServiceData`);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .send({ status: false, msg: "server error", error: err.message });
    }
};


const DeleteByMainServiceId = async (req, res) => {
    try {
        let MainServiceId = req.params.MainServiceId;
        const deletionResult = await MainServiceModel.deleteOne({ id: MainServiceId });

        if (deletionResult.deletedCount === 0) {
            return res.status(404).send({ status: false, message: "Page not found" });
        }

        return res.status(200).send({ status: true, message: "Data deleted successfully." });
    } catch (err) {
        return res.status(500).send({ status: false, message: "Server error", error: err.message });
    }
};

module.exports = {
    MainServiceData,
    getMainServiceData,
    getByMainServiceId,
    updateMainServiceData,
    DeleteMainServicedata,
    DeleteByMainServiceId
};