// Function to delete a file if it exists
const deleteFileIfExists = (filePath) => {
    return new Promise((resolve, reject) => {
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          resolve();
        } else {
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error('No se ha podido borrar:', unlinkErr);
              reject(unlinkErr);
            } else {
              resolve();
            }
          });
        }
      });
    });
  };

module.exports = deleteFileIfExists;