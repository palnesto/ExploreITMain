const userFormModel = require("../Models/userformModel");
const nodemailer = require("nodemailer");


const userformData = async (req, res) => {
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
      to: "info@palnesto.biz",
      subject: "Submission for ExploreIt",
      text: `
        Name: ${Name}
        Email: ${Email}
        Number: ${Number}
         Website: ${Website}
        Service: ${Service}
        Designation: ${Designation}
        Service Interested: ${ServiceInterested}
        Project Title: ${ProjectTitle}
        Budget: ${Budget}
        Description: ${Description}
        Timeline: ${Timeline}
        Technologies: ${Technologies}
        Requirements: ${Requirments}
        Platform: ${Platform}
        Constraints: ${Contraints}
        Area: ${Area}
        Experience: ${Experience}
        Reference: ${Reference}
        Additional Info: ${AddiInfo}
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

    const datacreate = await userFormModel.create({ Name, Email, Service, Number, Designation, Website, ServiceInterested, ProjectTitle, Budget, Description, Timeline, Technologies, Requirments, Platform, Contraints, Area, Experience, Reference, AddiInfo });
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

const getuserformData = async (req, res) => {
  try {
    const userformData = await userFormModel.findOne({ isDeleted: false });
    res.status(200).send({
      status: true,
      msg: "userformData retrieved succesfully",
      data: userformData,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, msg: "server error", error: err.message });
  }
};

const updateuserformData = async (req, res) => {
  try {
    const { Name, Email, Service, Number, Designation, Website, ServiceInterested, ProjectTitle, Budget, Description, Timeline, Technologies, Requirments, Platform, Contraints, Area, Experience, Reference, AddiInfo } = req.body;
    const userHomeId = req.params.userHomeId;

    const UpdateuserHome = await userFormModel.findByIdAndUpdate(
      userHomeId,
      { $set: { Name, Email, Service, Number, Designation, Website, ServiceInterested, ProjectTitle, Budget, Description, Timeline, Technologies, Requirments, Platform, Contraints, Area, Experience, Reference, AddiInfo } },
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

const DeleteuserformData = async (req, res) => {
  try {
    const result = await userFormModel.deleteMany({});
    res.send(`Deleted ${result.deletedCount} userformData`);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ status: false, msg: "server error", error: err.message });
  }
};

module.exports = {
  userformData,
  getuserformData,
  updateuserformData,
  DeleteuserformData,
};
