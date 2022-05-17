const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");

const store = require("../store/listings");
const categoriesStore = require("../store/categories");
const validateWith = require("../middleware/validation");
const auth = require("../middleware/auth");
const imageResize = require("../middleware/imageResize");
const delay = require("../middleware/delay");
const listingMapper = require("../mappers/listings");
const config = require("config");

const upload = multer({
  dest: "uploads/",
  limits: { fieldSize: 25 * 1024 * 1024 },
});

const schema = {
  userId:Joi.number().required().min(1),
  title: Joi.string().required(),
  description: Joi.string().allow(""),
  price: Joi.number().required().min(1),
  categoryId: Joi.number().required().min(1),
  location: Joi.string().optional(),
};

const validateCategoryId = (req, res, next) => {
  if (!categoriesStore.getCategory(parseInt(req.body.categoryId)))
    return res.status(400).send({ error: "Invalid categoryId." });

  next();
};

router.get("/", (req, res) => {
  const listings = store.getListings();
  const resources = listings.map(listingMapper);
  res.send(resources);
});

router.delete("/:id", (req, res) => {
  const listingList = store.getListings();
  const listingId = parseInt(req.params.id);
  const listing = listingList.find(item => item.id === listingId);

  if (!listing) return res.status(400).send({ error: "Invalid listing Id." });

  store.deleteListing(listing);
  res.status(201).send(listing);

});

router.post(
  "/",
  [
    // Order of these middleware matters.
    // "upload" should come before other "validate" because we have to handle
    // multi-part form data. Once the upload middleware from multer applied,
    // request.body will be populated and we can validate it. This means
    // if the request is invalid, we'll end up with one or more image files
    // stored in the uploads folder. We'll need to clean up this folder
    // using a separate process.
    // auth,
    upload.array("images", config.get("maxImageCount")),
    validateWith(schema),
    validateCategoryId,
    imageResize,
  ],

  async (req, res) => {
    const listing = {
      title: req.body.title,
      price: parseFloat(req.body.price),
      userId:parseInt(req.body.userId),
      categoryId: parseInt(req.body.categoryId),
      description: req.body.description,
    };
    listing.images = req.images.map((fileName) => ({ fileName: fileName }));
    if (req.body.location) listing.location = JSON.parse(req.body.location);
    if (req.user) listing.userId = req.user.userId;

    store.addListing(listing);

    res.status(201).send(listing);
  }
);



module.exports = router;
