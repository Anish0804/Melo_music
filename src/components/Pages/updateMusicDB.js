const fs = require('fs');

// Update the musicDB array with the new IPFS URI
const updateMusicDB = (musicId, imageUri, musicUri) => {
  const musicDB = require('../db/music.js');
  const updatedMusicDB = musicDB.map((music) => {
    if (music.id === musicId) {
      return { ...music, id: musicId, image: imageUri, music: musicUri };
    }
    return music;
  });

  fs.writeFile('../db/music.json', JSON.stringify(updatedMusicDB), (error) => {
    if (error) {
      console.log('Error updating musicDB:', error);
    } else {
      console.log('musicDB updated successfully!');
    }
  });
};

// Read the command-line arguments
const args = process.argv.slice(2);

// Validate the number of arguments
if (args.length !== 4) {
  console.error('Invalid number of arguments. Usage: node updateMusicDB.js <musicId> <imageUri> <musicUri>');
  process.exit(1);
}

// Parse the arguments
const musicIdToUpdate = parseInt(args[0]);
const imageUriToUpdate = args[1];
const musicUriToUpdate = args[2];

// Call the updateMusicDB function
updateMusicDB(musicIdToUpdate, imageUriToUpdate, musicUriToUpdate);
