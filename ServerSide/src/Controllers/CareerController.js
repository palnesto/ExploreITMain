const CareerModel = require("../Models/CareerModel");
const aws = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const CareerData = async (req, res) => {
    try {

        const {
            CareerName,
            CareerDesc,
            Active,
        } = req.body;
        const id = uuidv4();
        const newCareer = new CareerModel({
            id,
            CareerName,
            CareerDesc,
            Active,
        });


        const savedCareer = await newCareer.save();


        return res.status(201).send({
            status: true,
            msg: "New Career created successfully",
            data: savedCareer,
        });

    } catch (err) {

        return res.status(500).send({ status: false, msg: "Server error", error: err.message });
    }
};

const getCareerData = async (req, res) => {
    try {
        const CareerData = await CareerModel.find();
        res.status(200).send({
            status: true,
            msg: "CareerData retrieved succesfully",
            data: CareerData,
        });
    } catch (err) {
        return res
            .status(500)
            .send({ status: false, msg: "server error", error: err.message });
    }
};

const getByCareerId = async (req, res) => {
    const CareerId = req.params.CareerId;

    const CareerData = await CareerModel.findOne({
        id: CareerId,
        isDeleted: false,
    });
    return res
        .status(200)
        .send({ status: true, msg: "Data fetch succesfully", data: CareerData });
};

const updateCareerData = async (req, res) => {
    try {
        const { Active, CareerName, CareerDesc } = req.body;

        let CareerId = req.params.CareerId;

        const existingUnit = await CareerModel.findOne({
            Active,
            id: { $ne: CareerId },
        });
        let updateBody = await CareerModel.findOneAndUpdate(
            { id: CareerId },
            {
                $set: {
                    Active: Active,
                    CareerName: CareerName,
                    CareerDesc: CareerDesc
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

const DeleteCareerdata = async (req, res) => {
    try {
        const result = await CareerModel.deleteMany({});
        res.send(`Deleted ${result.deletedCount} CareerData`);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .send({ status: false, msg: "server error", error: err.message });
    }
};


const DeleteByCareerId = async (req, res) => {
    try {
        let CareerId = req.params.CareerId;
        const deletionResult = await CareerModel.deleteOne({ id: CareerId });

        if (deletionResult.deletedCount === 0) {
            return res.status(404).send({ status: false, message: "Page not found" });
        }

        return res.status(200).send({ status: true, message: "Data deleted successfully." });
    } catch (err) {
        return res.status(500).send({ status: false, message: "Server error", error: err.message });
    }
};

module.exports = {
    CareerData,
    getCareerData,
    getByCareerId,
    updateCareerData,
    DeleteCareerdata,
    DeleteByCareerId
};