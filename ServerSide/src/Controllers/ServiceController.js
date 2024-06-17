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


const {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    CopyObjectCommand,
} = require("@aws-sdk/client-s3");

// Configure AWS S3 client
const s3Client = new S3Client({
    // Replace with your AWS region
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const saveImage = async (req, res) => {
    console.log("s", saveImage);

    const file = req.files[0];
    // console.log("first error", file);
    const fileNameParts = file.originalname.split(".");
    const fileExtension = fileNameParts[fileNameParts.length - 1];
    const fileMimeType = file.mimetype;
    let uuid = uuidv4();
    const input = {
        // PutObjectRequest
        Body: file.buffer, // required
        Bucket: "20palnesto-storage24", // required
        Key: uuid, // requiredz
        Metadata: {
            format: fileExtension, // Add metadata indicating the format is JPEG
        },
        ContentType: fileMimeType, // Set the ContentType to the MIME type for JPEG images
    };
    console.log("file", file.originalname);
    const uploadCommand = new PutObjectCommand(input);

    s3Client
        .send(uploadCommand)
        .then((response) => {
            // console.log("r", response);
            let imageId = response.$metadata.requestId;

            let awsImageUrl = `https://20palnesto-storage24.s3.ap-south-1.amazonaws.com/${uuid}`;

            return res.send({ imageUrl: awsImageUrl });
        })
        .catch((error) => {
            console.error("Error uploading file:", error);
            return res.status(500).json({ error: "Error uploading file" });
        });
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
    saveImage,
    PrimaryData,
    getPrimaryData,
    getByPrimaryId,
    updatePrimaryData,
    DeletePrimarydata,
    DeleteByPrimaryId
};