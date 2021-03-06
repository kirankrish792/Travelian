const express = require('express');
const router = express.Router();
const admin = require('../controllers/admin');

const { isLoggedIn, isAdmin } = require("../middleware");

router.route("/").get(isLoggedIn, isAdmin ,admin.dashboard);

router.route("/users").get(isLoggedIn, isAdmin, admin.users);

router
  .route("/campgrounds/:id/verify")
  .post(isLoggedIn, isAdmin, admin.verifyCampgroundAdmin);

router.route("/users/:id")
  .delete(admin.deleteUser);

  router.route("/user/:id/verify")
  .post(isLoggedIn, isAdmin, admin.verifyUserAdmin);

module.exports = router;