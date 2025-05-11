const fs = require('fs');
const path = require('path');

function storeZip(call, callback) {
  const { fileName, zipData } = call.request;

  const storageDir = path.join(__dirname, '../../storage');
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir);
  }

  const filePath = path.join(storageDir, fileName);

  fs.writeFile(filePath, zipData, (err) => {
    if (err) {
      console.error('❌ Erreur lors du stockage :', err);
      return callback({
        code: 13,
        message: 'Erreur lors de l’écriture du fichier',
      });
    }

    console.log('✅ Fichier stocké avec succès à :', filePath);
    callback(null, {
      success: true,
      message: 'Fichier stocké avec succès',
      filePath,
    });
  });
}

module.exports = { storeZip };
