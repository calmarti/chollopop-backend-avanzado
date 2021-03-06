"use strict";
const express = require("express");
const router = express.Router();

const Advert = require("../../models/Advert");
const cote = require("cote");
const upload = require("../../lib/multerSetup");
const ResizeController = require("../../controllers/resizeController");
const resizeController = new ResizeController();
require("../../microservices/resizeImageService");    //carga del servicio de resizing en modo 'listening'

//Segundo endpoint: creación de un documento nuevo

router.post(
  "/",

  upload.single("picture"), 

  resizeController.index, //llamada del controlador al servicio de resizing 

  async function (req, res, next) {
    try {
      const { filename } = req.file;

      const newData = { ...req.body, picture: `/images/${filename}` };

      const newAdvert = new Advert(newData);
      const newAdvertSaved = await newAdvert.save();

      res.status(201).json({ result: newAdvertSaved });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
