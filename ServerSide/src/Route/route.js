const express = require("express");
const router = express.Router();
// const multer = require("multer");
// const storage = multer.memoryStorage(); // using memory storage for simplicity
const {
  // createUser,
  userLogin,
  getusersData,
  deleteUser,
  logout,

} = require("../Controllers/loginController");
const {
  userformData,
  getuserformData,
  updateuserformData,
  DeleteuserformData,
} = require("../Controllers/userformController");


const {
  PrimaryData,
  getPrimaryData,
  getByPrimaryId,
  updatePrimaryData,
  DeletePrimarydata,
  DeleteByPrimaryId,
  saveImage,

} = require("../Controllers/ServiceController")

const {
  saveSubimg,
  SubServiceData,
  getsubServiceData,
  getBySubServiceId,
  updatesubServiceData,
  DeletesubServicedata,
  DeleteBySubServiceId
} = require("../Controllers/SubServiceController")

const {
  CareerData,
  getCareerData,
  getByCareerId,
  updateCareerData,
  DeleteCareerdata,
  DeleteByCareerId
} = require("../Controllers/CareerController")
const {
  saveBlogImage,
  CreateBlog,
  getBlog,
  getByBlogId,
  updateBlog,
  DeleteBlog,
  DeleteByBlogId
} = require("../Controllers/BlogController")
const { ClientRoles } = require("../clientRole");
const currentUser = require("../middleware/currentUser");
const auth = require("../middleware/auth");
const authMidd = require("../middleware/authorization");
//****************************************************************** */
//userForm

router.post(
  "/V1/userformcreate",
  userformData
);
router.get("/V1/getformData", getuserformData);
router.put(
  "/V1/updateData/:homeId",
  updateuserformData
);
router.delete(
  "/V1/deleteData",
  DeleteuserformData
);

//login
// router.post("/v1/create", createUser)
router.post("/v1/userLogin", userLogin);
router.get("/v1/getuser", getusersData);
router.delete("/v1/deleteusers", deleteUser)
router.post("/v1/logout", logout)


//PrimaryService
router.post("/V1/uploadImg", saveImage);
router.post("/v1/Service", PrimaryData);
router.get("/v1/getPrimary", getPrimaryData);
router.get("/v1/getbyPrimary/:primaryId", getByPrimaryId);
router.put("/v1/updatePrimary/:primaryId", updatePrimaryData);
router.delete("/v1/deltePrimary", DeletePrimarydata);
router.delete("/v1/deletbyId/:primaryId", DeleteByPrimaryId)


//SubService
router.post("/v1/subService", SubServiceData)
router.get("/v1/getsubService", getsubServiceData);
router.get("/v1/getbysubService/:subServiceId", getBySubServiceId);
router.put("/v1/updatesubService/:subServiceId", updatesubServiceData);
router.delete("/v1/deltesubService", DeletesubServicedata);
router.delete("/v1/deletsubServicebyId/:subServiceId", DeleteBySubServiceId)

//careerService
router.post("/v1/Career", CareerData)
router.get("/v1/getCareer", getCareerData);
router.get("/v1/getbyCareer/:CareerId", getByCareerId);
router.put("/v1/updateCareer/:CareerId", updateCareerData);
router.delete("/v1/delteCareer", DeleteCareerdata);
router.delete("/v1/deletCareerbyId/:CareerId", DeleteByCareerId)

//BlogsService
router.post("/v1/Blog", CreateBlog)
router.get("/v1/getBlog", getBlog);
router.get("/v1/getbyBlog/:BlogId", getByBlogId);
router.put("/v1/updateBlog/:BlogId", updateBlog);
router.delete("/v1/delteBlog", DeleteBlog);
router.delete("/v1/deletBlogbyId/:BlogId", DeleteByBlogId)


//aws
router.post("/V1/uploadImg", saveImage);
router.post("/V1/subserviceimg", saveSubimg)
router.post("/V1/blogImg", saveBlogImage)
module.exports = router;
