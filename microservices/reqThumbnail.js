'use strict';

// microservicio para crear thumbnails
const { Requester } = require('cote');
const Anuncio = require('../models/Anuncio')

const requester = new Requester({ name: 'Requester - thumbnail'});

console.log('Requester service started');

const createThumbnail = (fileName, id) => {
    const request = {
        type: 'create-thumbnail',
        fileName
    };

    requester.send(request, async(error, result) => {
        if (error) {
            console.error("Couldn't create thumbnail", error);  
            return;
        }
        
        try {
            await Anuncio.findByIdAndUpdate(id, { thumbnail: result });
            console.log('Thumbnail created and updated for ad:', id);
        } catch (err) {
            console.error("Error updating ad with thumbnail:", err); 
        }
    })
}

module.exports = createThumbnail;