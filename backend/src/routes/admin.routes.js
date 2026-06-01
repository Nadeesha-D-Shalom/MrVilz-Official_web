const { Router } = require("express");
const adminController = require("../controllers/admin.controller");
const adminUsersController = require("../controllers/adminUsers.controller");
const careersController = require("../controllers/careers.controller");
const galleryController = require("../controllers/gallery.controller");
const marketplaceController = require("../controllers/marketplace.controller");
const { authRequired, loadAdminRole, requireSuperAdmin } = require("../middleware/auth");
const { upload } = require("../middleware/upload");
const { galleryUpload } = require("../middleware/uploadGallery");
const { projectImage, teamImage, productImage } = require("../middleware/uploadHashedImage");

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

router.get("/gallery", galleryController.listAdminGallery);
router.put("/gallery/bundle", galleryController.saveGalleryBundle);
router.post("/gallery", galleryUpload.array("images", 30), galleryController.createGalleryItems);
router.put("/gallery/:id", galleryUpload.single("image"), galleryController.updateGalleryItem);
router.delete("/gallery/:id", galleryController.deleteGalleryItem);
router.put("/gallery-settings/page", galleryController.updateGallerySettings);

router.post("/gallery-sections", galleryController.createSection);
router.put("/gallery-sections/:id", galleryController.updateSection);
router.delete("/gallery-sections/:id", galleryController.deleteSection);

router.get("/products", marketplaceController.listProducts);
router.get("/products/:id", marketplaceController.getProduct);
router.post("/products", productImage.upload.single("image"), marketplaceController.createProduct);
router.put("/products/:id", productImage.upload.single("image"), marketplaceController.updateProduct);
router.delete("/products/:id", marketplaceController.deleteProduct);
router.put("/marketplace-settings/page", marketplaceController.updateMarketplaceSettings);

router.get("/users", requireSuperAdmin, adminUsersController.listAdmins);
router.post("/users", requireSuperAdmin, adminUsersController.createAdmin);
router.put("/users/:id", adminUsersController.updateAdmin);
router.patch("/users/:id/deactivate", requireSuperAdmin, adminUsersController.deactivateAdmin);

module.exports = router;
