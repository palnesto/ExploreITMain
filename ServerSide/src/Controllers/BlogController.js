const BlogModel = require("../Models/BlogModel");
const aws = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

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
    CreateBlog,
    getBlog,
    getByBlogId,
    updateBlog,
    DeleteBlog,
    DeleteByBlogId
};