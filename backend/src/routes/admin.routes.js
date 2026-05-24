const { Router } = require("express");
const adminController = require("../controllers/admin.controller");
const adminUsersController = require("../controllers/adminUsers.controller");
const careersController = require("../controllers/careers.controller");
const { authRequired, loadAdminRole } = require("../middleware/auth");
const { upload } = require("../middleware/upload");
const { galleryUpload } = require("../middleware/uploadGallery");
const { projectImage, teamImage } = require("../middleware/uploadHashedImage");

const router = Router();

router.use(authRequired, loadAdminRole);

router.put("/hero", adminController.updateHero);
router.put("/about", adminController.updateAbout);

router.get("/stats", adminController.listStats);
router.put("/stats/:id", adminController.updateStat);

router.get("/social-links", adminController.listSocialLinks);
router.post("/social-links", adminController.createSocialLink);
router.put("/social-links/:id", adminController.updateSocialLink);

router.get("/team", adminController.listTeam);
router.post("/team", teamImage.upload.single("image"), adminController.createTeamMember);
router.put("/team/:id", teamImage.upload.single("image"), adminController.updateTeamMember);
router.delete("/team/:id", adminController.deleteTeamMember);

router.get("/projects", adminController.listProjects);
router.post("/projects", projectImage.upload.single("image"), adminController.createProject);
router.put("/projects/:id", projectImage.upload.single("image"), adminController.updateProject);
router.delete("/projects/:id", adminController.deleteProject);

router.get("/messages", adminController.listMessages);
router.patch("/messages/:id", adminController.updateMessageStatus);

router.post("/upload", upload.single("file"), adminController.uploadMedia);

router.get("/applications/team", adminController.listTeamApplications);
router.patch("/applications/team/:id", adminController.updateTeamApplicationStatus);
router.get("/applications/jobs", adminController.listJobApplications);
router.patch("/applications/jobs/:id", adminController.updateJobApplicationStatus);

router.get("/careers", careersController.listCareerPosts);
router.get("/careers/:id", careersController.getCareerPost);
router.post("/careers", careersController.createCareerPost);
router.put("/careers/:id", careersController.updateCareerPost);
router.delete("/careers/:id", careersController.deleteCareerPost);
router.put("/careers-settings/page", careersController.updateCareersSettings);

router.get("/gallery", adminController.listGallery);
router.post("/gallery", galleryUpload.array("images", 30), adminController.createGalleryItems);
router.put("/gallery/:id", galleryUpload.single("image"), adminController.updateGalleryItem);
router.delete("/gallery/:id", adminController.deleteGalleryItem);

router.get("/users", adminUsersController.listAdmins);
router.post("/users", adminUsersController.createAdmin);
router.put("/users/:id", adminUsersController.updateAdmin);
router.patch("/users/:id/deactivate", adminUsersController.deactivateAdmin);

module.exports = router;
