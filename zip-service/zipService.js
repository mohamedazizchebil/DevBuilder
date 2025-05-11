const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

function zipDirectory(sourceDir, outputZipPath, callback) {
  const output = fs.createWriteStream(outputZipPath); // Crée un flux de sortie pour le fichier ZIP
  const archive = archiver('zip', { zlib: { level: 9 } }); // Crée une instance d'archiver avec compression maximum

  output.on('close', () => {
    console.log(`Archive created successfully: ${outputZipPath}`);
    callback(null, { success: true, message: `Archive created successfully at ${outputZipPath}` });
  });

  output.on('error', (err) => {
    console.error('Error while creating archive:', err);
    callback(err, null);
  });

  archive.pipe(output); // Pipe l'archive vers le fichier de sortie
  archive.directory(sourceDir, false); // Ajoute le répertoire source à l'archive
  archive.finalize(); // Finalise l'archive (commence la compression)
}
exports.zipDirectory = zipDirectory;