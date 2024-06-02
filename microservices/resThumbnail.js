'use strict'

// creamos un Responder para generar los thumbnails cuando se suba una imagen
const { Responder } = require('cote');
const jimp = require("jimp");
const path = require("path");

const responder = new Responder({ name: 'Create Thumbnail'});

console.log('Responder service started and listening for create-thumbnail events'); 

responder.on('create-thumbnail', async (req, done) => {
    const filePath = path.join(__dirname, '..', 'public', 'images', 'ads', req.fileName);

    const thumbnailName = `thumb-${req.fileName}`;
    const thumbnailPath = path.join(__dirname, '..', 'public', 'images', 'ads', thumbnailName);

    // console.log('Received event to create thumbnail:', req.fileName);

    try {
        const image = await jimp.read(filePath);

        // Recortamos la imagen usando cover en vez de resize 
        // Así conseguimos una imagen cuadrada sin deformar la original
        await image.cover(100, 100).quality(70);

        // Guardar el thumbnail en la ruta y con el nombre especificados
        await image.writeAsync(thumbnailPath);

        console.log('Thumbnail created:', thumbnailName);

        // Devolver el nombre del thumbnail
        done(null,thumbnailName);

    } catch (error) {
         console.error('Error creating thumbnail:', error);
         done(error);
    }
    
})

module.exports = responder;