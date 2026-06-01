const { Router } = require("express");
const publicController = require("../controllers/public.controller");
const careersController = require("../controllers/careers.controller");
const galleryController = require("../controllers/gallery.controller");
const marketplaceController = require("../controllers/marketplace.controller");
const { applicationUpload } = require("../middleware/uploadApplication");

const router = Router();

router.get("/site", publicController.getSiteData);
router.get("/team/:slug", publicController.getTeamMember);
router.get("/careers", careersController.listPublishedCareers);
router.get("/gallery", galleryController.listPublicGallery);
router.get("/marketplace", marketplaceController.listPublishedProducts);
router.get("/marketplace/:slug", marketplaceController.getPublishedProduct);
router.get("/sitemap-images.xml", galleryController.getImageSitemap);
router.post("/contact", publicController.submitContact);
router.post("/join-team", publicController.submitJoinTeam);
router.post(
  "/careers/apply",
  applicationUpload.fields([
    { name: "cv", maxCount: 1 },
    { name: "additionalDoc", maxCount: 1 }
  ]),
  publicController.submitJobApplication
);

module.exports = router;
