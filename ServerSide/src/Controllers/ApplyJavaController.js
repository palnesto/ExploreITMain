const applyJavaModel = require("../Models/ApplyJavaModel");
const nodemailer = require("nodemailer");


const applyJavaData = async (req, res) => {
    try {
        const { _id, Name, LastName, Email, Number, Country, State, City, Gender, NoticePeriod, Currentctc, Pay, Expected, Interestedlevel, Shift, PositionApply, Linkedin, Experience, Portfolio, JoininiDate, HereAbout, AddInfo } = req.body;
        console.log(req.body);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "palnesto886@gmail.com",
                pass: "pvhq gkjp sihd qdxn",
            },
        });

        const mailOptions = {
            from: "palnesto886@gmail.com",
            to: "info@palnesto.biz",
            subject: "Submission for ExploreIt",
            text: `
        Name: ${Name}
        LastName: ${LastName}
        Email :${Email}
        Number:${Number}
        Country:${Country}
        State: ${State}
        City: ${City}
        Gender:${Gender}
        Experience:${Experience}
        NoticePeriod:${NoticePeriod}
        Currentctc:${Currentctc}
        Pay:${Pay}
        Expected:${Expected}
        Interestedlevel:${Interestedlevel}
        Shift:${Shift}
        PositionApply:${PositionApply}
        Linkedin:${Linkedin}
        Portfolio:${Portfolio}
        JoininiDate:${JoininiDate}
        HereAbout:${HereAbout}
        AddInfo:${AddInfo}


                                
      `,
        };

        // Convert sendMail to use Promise
        await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(info);
                }
            });
        });

        console.log("Email sent");

        const datacreate = await applyJavaModel.create({ Name, Email, LastName, Number, Country, State, City, Gender, NoticePeriod, Currentctc, Pay, Expected, Interestedlevel, Shift, PositionApply, Linkedin, Experience, Portfolio, JoininiDate, HereAbout, AddInfo });
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

const getapplyJavaData = async (req, res) => {
    try {
        const applyJavaData = await applyJavaModel.findOne({ isDeleted: false });
        res.status(200).send({
            status: true,
            msg: "applyJavaData retrieved succesfully",
            data: applyJavaData,
        });
    } catch (err) {
        return res
            .status(500)
            .send({ status: false, msg: "server error", error: err.message });
    }
};

const updateapplyJavaData = async (req, res) => {
    try {
        const { Name, Email, LastName, Number, Country, State, City, Gender, NoticePeriod, Currentctc, Pay, Expected, Interestedlevel, Shift, PositionApply, Linkedin, Experience, Portfolio, JoininiDate, HereAbout, AddInfo } = req.body;
        const userHomeId = req.params.userHomeId;

        const UpdateuserHome = await applyJavaModel.findByIdAndUpdate(
            userHomeId,
            { $set: { Name, Email, LastName, Number, Country, State, City, Gender, NoticePeriod, Currentctc, Pay, Expected, Interestedlevel, Shift, PositionApply, Linkedin, Experience, Portfolio, JoininiDate, HereAbout, AddInfo } },
            { new: true }
        );

        // console.log("Update result:", UpdateuserHome);

        return res.status(200).send({
            status: true,
            msg: "Data updated successfully",
            data: UpdateuserHome,
        });
    } catch (err) {
        return res
            .status(500)
            .send({ status: false, msg: "server error", error: err.message });
    }
};

const DeleteapplyJavaData = async (req, res) => {
    try {
        const result = await applyJavaModel.deleteMany({});
        res.send(`Deleted ${result.deletedCount} applyJavaData`);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .send({ status: false, msg: "server error", error: err.message });
    }
};

module.exports = {
    applyJavaData,
    getapplyJavaData,
    updateapplyJavaData,
    DeleteapplyJavaData,
};
