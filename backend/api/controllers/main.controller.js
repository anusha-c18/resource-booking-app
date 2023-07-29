const express = require("express");
const app = express();
app.use(express.json());
const getResources = require("./getAllResources.helper");
const getBookings = require("./getAllBookings.helper");

module.exports.getAllResources = async function (req, res) {
  try {
    const resources = await getResources.getAllResources();
    if (resources.length == 0) {
      res.status(200).send(["No resources exist."]);
    } else {
      res.status(200).send(resources);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.getAllBookings = async function (req, res) {
  try {
    const bookings = await getBookings.getAllBookings();
    if (bookings.length == 0) {
      res.status(200).send(["No bookings exist."]);
    } else {
      res.status(200).send(bookings);
    }
  } catch (err) {
    console.log(err);
  }
};
