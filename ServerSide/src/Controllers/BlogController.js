const BlogModel = require("../Models/BlogModel");
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
const saveBlogImage = async (req, res) => {
    console.log("s", saveBlogImage);

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
const CreateBlog = async (req, res) => {
    try {
        const { BlogName, servDescription, photo1, Active,
        } = req.body;
        const id = uuidv4();
        const newBlog = new BlogModel({
            id, BlogName, servDescription, photo1, Active,
        });
        const savedBlog = await newBlog.save();
        return res.status(201).send({
            status: true,
            msg: "New Blog created successfully",
            data: savedBlog,
        });
    } catch (err) {
        return res.status(500).send({ status: false, msg: "Server error", error: err.message });
    }
};


const getBlog = async (req, res) => {
    try {
        const Blog = await BlogModel.find();
        res.status(200).send({
            status: true,
            msg: "Blog retrieved succesfully",
            data: Blog,
        });
    } catch (err) {
        return res
            .status(500)
            .send({ status: false, msg: "server error", error: err.message });
    }
};

const getByBlogId = async (req, res) => {
    const BlogId = req.params.BlogId;

    const Blog = await BlogModel.findOne({
        id: BlogId,
        isDeleted: false,
    });
    return res
        .status(200)
        .send({ status: true, msg: "Data fetch succesfully", data: Blog });
};

const updateBlog = async (req, res) => {
    try {
        const { servDescription, BlogName, photo1, Active } = req.body;

        let BlogId = req.params.BlogId;

        const existingUnit = await BlogModel.findOne({
            Active,
            id: { $ne: BlogId },
        });
        let updateBody = await BlogModel.findOneAndUpdate(
            { id: BlogId },
            {
                $set: {
                    servDescription: servDescription,
                    BlogName: BlogName,
                    photo1: photo1,
                    Active: Active

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

const DeleteBlog = async (req, res) => {
    try {
        const result = await BlogModel.deleteMany({});
        res.send(`Deleted ${result.deletedCount} Blog`);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .send({ status: false, msg: "server error", error: err.message });
    }
};

const DeleteByBlogId = async (req, res) => {
    try {
        let BlogId = req.params.BlogId;
        const deletionResult = await BlogModel.deleteOne({ id: BlogId });

        if (deletionResult.deletedCount === 0) {
            return res.status(404).send({ status: false, message: "Blog not found" });
        }

        return res.status(200).send({ status: true, message: "Data deleted successfully." });
    } catch (err) {
        return res.status(500).send({ status: false, message: "Server error", error: err.message });
    }
};

module.exports = {
    saveBlogImage,
    CreateBlog,
    getBlog,
    getByBlogId,
    updateBlog,
    DeleteBlog,
    DeleteByBlogId
};