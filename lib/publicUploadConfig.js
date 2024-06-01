const multer = require('multer');
const path = require('node:path');

// declarar una configuracion de almacenamiento
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        const ruta = path.join(__dirname, '..', 'public', 'images', 'ads');
        callback(null, ruta);
    },
    filename: function(req, file, callback) {
        try {
            const filename = `${Date.now()}-${file.originalname}`;
            callback(null, filename);
        } catch (error) {
            callback(error);
        }
        
    }
})

// declarar la configuracion de upload
const upload = multer({ storage: storage });

module.exports = upload;