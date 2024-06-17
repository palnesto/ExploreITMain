const SubServiceModel = require("../Models/SubServiceModel");
const aws = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
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
const saveSubimg = async (req, res) => {
    console.log("s", saveSubimg);

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
const SubServiceData = async (req, res) => {
    try {

        const {
            Photo1,
            SubServiceName,
            Photo2,
            SubServiceDes,
            Photo3,
            FeatureDes,
            AddFeatures,
            Photo4,
            Active,
        } = req.body;
        const id = uuidv4();
        const newPrimary = new SubServiceModel({
            id,
            Photo1,
            SubServiceName,
            Photo2,
            SubServiceDes,
            Photo3,
            FeatureDes,
            AddFeatures,
            Photo4,
            Active,
        });


        const savedPrimary = await newPrimary.save();


        return res.status(201).send({
            status: true,
            msg: "NewSubService created successfully",
            data: savedPrimary,
        });

    } catch (err) {

        return res.status(500).send({ status: false, msg: "Server error", error: err.message });
    }
};

const getsubServiceData = async (req, res) => {
    try {
        const SubServiceData = await SubServiceModel.find();
        res.status(200).send({
            status: true,
            msg: "PrimaryData retrieved succesfully",
            data: SubServiceData,
        });
    } catch (err) {
        return res
            .status(500)
            .send({ status: false, msg: "server error", error: err.message });
    }
};

const getBySubServiceId = async (req, res) => {
    const subServiceId = req.params.subServiceId;

    const SubServiceData = await SubServiceModel.findOne({
        id: subServiceId,
        isDeleted: false,
    });
    return res
        .status(200)
        .send({ status: true, msg: "Data fetch succesfully", data: SubServiceData });
};



const updatesubServiceData = async (req, res) => {
    try {
        const {
            Photo1,
            SubServiceName,
            Photo2,
            SubServiceDes,
            Photo3,
            FeatureDes,
            AddFeatures,
            Photo4,
            Active
        } = req.body;

        const subServiceId = req.params.subServiceId;



        if (!subServiceId) {
            return res.status(400).send({ status: false, msg: "subServiceId parameter is required" });
        }

        const existingUnit = await SubServiceModel.findOne({
            id: subServiceId,
        });

        if (!existingUnit) {
            return res.status(404).send({ status: false, msg: "SubService not found" });
        }

        let updateBody = await SubServiceModel.findOneAndUpdate(
            { id: subServiceId },
            {
                $set: {
                    Photo1: Photo1,
                    Active: Active,
                    SubServiceName: SubServiceName,
                    Photo2: Photo2,
                    SubServiceDes: SubServiceDes,
                    Photo3: Photo3,
                    FeatureDes: FeatureDes,
                    AddFeatures: AddFeatures,
                    Photo4: Photo4
                },
            },
            { new: true }
        );

        if (!updateBody) {
            return res.status(404).send({ status: false, msg: "SubService not found" });
        }

        return res.status(200).send({
            status: true,
            msg: "Data updated successfully",
            data: updateBody,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ status: false, msg: "server error", error: err.message });
    }
};


const DeletesubServicedata = async (req, res) => {
    try {
        const result = await SubServiceModel.deleteMany({});
        res.send(`Deleted ${result.deletedCount}SubServiceData`);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .send({ status: false, msg: "server error", error: err.message });
    }
};


const DeleteBySubServiceId = async (req, res) => {
    try {
        let SubServiceId = req.params.SubServiceId;

        const deletionResult = await SubServiceModel.deleteOne({ SubServiceId: SubServiceId });

        if (deletionResult.deletedCount === 0) {
            return res.status(404).send({ status: false, message: "Page not found" });
        }

        return res.status(200).send({ status: true, message: "Data deleted successfully." });
    } catch (err) {
        return res.status(500).send({ status: false, message: "Server error", error: err.message });
    }
};

module.exports = {
    saveSubimg,
    SubServiceData,
    getsubServiceData,
    getBySubServiceId,
    updatesubServiceData,
    DeletesubServicedata,
    DeleteBySubServiceId
};