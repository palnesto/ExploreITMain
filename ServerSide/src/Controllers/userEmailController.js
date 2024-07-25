const userEmailModel = require("../Models/userEmailModel");
const nodemailer = require("nodemailer");


const userEmailData = async (req, res) => {
    try {
        const { _id, Name, Email, Service, Number, Designation, Website, ServiceInterested, ProjectTitle, Budget, Description, Timeline, Technologies, Requirments, Platform, Contraints, Area, Experience, Reference, AddiInfo } = req.body;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "palnesto886@gmail.com",
                pass: "pvhq gkjp sihd qdxn",
            },
        });

        const mailOptions = {
            from: "palnesto886@gmail.com",
            to: "nikitalilhore123@gmail.com",
            subject: "Submission for ExploreIt",
            text: `
        Email: ${Email}
       
      `,
        };

        await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(info);
                }
            });
        });

        const datacreate = await userEmailModel.create({ Name, Email, Service, Number, Designation, Website, ServiceInterested, ProjectTitle, Budget, Description, Timeline, Technologies, Requirments, Platform, Contraints, Area, Experience, Reference, AddiInfo });
        return res.status(201).send({
            status: true,
            msg: "Data created successfully, and email sent",
            data: datacreate,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ status: false, msg: "Server error", error: err.message });
    }
};





module.exports = {
    userEmailData,

};
