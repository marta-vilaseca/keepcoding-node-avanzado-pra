const express = require("express");
const path = require('path');
const { validationResult } = require("express-validator");
const Anuncio = require("../../models/Anuncio");
const validation = require("../../lib/validation");
const { buildFilter, buildOptions } = require("../../lib/queryHelpers");
const upload = require("../../lib/publicUploadConfig");
const createThumbnail = require('../../microservices/reqThumbnail');
const deleteFileIfExists = require('../../lib/deleteFileIfExists');

const router = express.Router();

// GET /api/anuncios
// Devuelve una lista de anuncios con opción de filtros, paginación y ordenación
router.get("/", validation.queryValidators, async (req, res, next) => {
  try {
    validationResult(req).throw();

    const filter = buildFilter(req);
    const options = buildOptions(req);

    const anuncios = await Anuncio.listar(filter, options);

    res.json({ results: anuncios });
  } catch (error) {
    next(error);
  }
});

// GET /api/anuncios/<_id>
// Devuelve un anuncio concreto en base a su id
router.get("/:id", validation.paramValidators, async (req, res, next) => {
  try {
    validationResult(req).throw();

    const id = req.params.id;

    const anuncio = await Anuncio.findById(id);

    res.json({ results: anuncio });
  } catch (error) {
    next(error);
  }
});

// POST /api/anuncios (body)
// Crea un anuncio
router.post("/", upload.single('foto'), validation.bodyValidators, async (req, res, next) => {
  try {
    validationResult(req).throw();
    const data = req.body;

    // creamos una instancia del anuncio  en memoria
    const anuncio = new Anuncio(data);
    anuncio.foto = req.file ? req.file.filename : 'no-photo.png';

    // y lo persistimos en la BD
    const anuncioGuardado = await anuncio.save();

    // creamos thumbnail
    createThumbnail(anuncio.foto, anuncioGuardado._id);

    res.json({ result: anuncioGuardado });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/anuncios/:id (body)
// Actualiza un anuncio en base a su id
router.patch("/:id", upload.single('foto'), validation.paramValidators, async (req, res, next) => {
  try {
    validationResult(req).throw();
    const id = req.params.id;
    const data = req.body;

    const anuncio = await Anuncio.findById(id);
    if (!anuncio) {
      return res.status(404).json({ error: 'Anuncio no encontrado' });
    }

    if (req.file) {
      if (anuncio.foto && anuncio.foto !== 'no-photo.png') {
        const oldPhotoPath = path.join(__dirname, '..', '..', 'public', 'images', 'ads', anuncio.foto);
        const oldThumbnailPath = path.join(__dirname, '..', '..', 'public', 'images', 'ads', 'thumbnails', `thumb-${anuncio.foto}`);

        await deleteFileIfExists(oldPhotoPath);
        await deleteFileIfExists(oldThumbnailPath);
      }

      data.foto = req.file.filename;
    }

    const anuncioActualizado = await Anuncio.findByIdAndUpdate(id, data, { new: true });

    if (req.file) {
      try {
        await createThumbnail(anuncioActualizado.foto, anuncioActualizado._id);
      } catch (thumbnailError) {
        console.error("Error creating or updating thumbnail:", thumbnailError);
        return res.status(500).json({ error: "Error updating thumbnail" });
      }
    }

    // Timeout porque si no el res.json no mostraba la info actualizada
    setTimeout(async () => {
      try {
        const anuncioFinalActualizado = await Anuncio.findById(anuncioActualizado._id);
        res.json({ result: anuncioFinalActualizado });
      } catch (finalFetchError) {
        next(finalFetchError);
      }
    }, 1000); 

  } catch (error) {
    next(error);
  }
});

// DELETE /api/anuncios/<_id>
// Elimina un anuncio en base a su id
router.delete("/:id", validation.paramValidators, async (req, res, next) => {
  try {
    validationResult(req).throw();
    const id = req.params.id;

    const anuncio = await Anuncio.findById(id);
    if (!anuncio) {
      return res.status(404).json({ error: 'Anuncio no encontrado' });
    }

    if (anuncio.foto && anuncio.foto !== 'no-photo.png') {
      const photoPath = path.join(__dirname, '..', '..', 'public', 'images', 'ads', anuncio.foto);
      const thumbnailPath = path.join(__dirname, '..', '..', 'public', 'images', 'ads', 'thumbnails', `thumb-${anuncio.foto}`);
      
      await deleteFileIfExists(photoPath);
      await deleteFileIfExists(thumbnailPath);
    }

    await Anuncio.deleteOne({ _id: id });

    res.json({ message: "Document successfully deleted." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
