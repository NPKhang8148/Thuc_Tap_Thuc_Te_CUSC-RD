const express = require("express");
const { getDashboardStats } = require("../controllers/statsController");
const verifyAdminToken = require("../middlewares/verifyAdminToken");

const router = express.Router();

router.get("/", verifyAdminToken, getDashboardStats);

module.exports = router;
