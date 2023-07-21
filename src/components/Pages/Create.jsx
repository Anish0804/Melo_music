import { useState } from 'react';
import { ethers } from 'ethers';
import { Row, Form, Button } from 'react-bootstrap';
import { NFTStorage, File } from 'nft.storage';
import NFTAddress from '../../contractsData/NFT-address.json';
import NFTAbi from '../../contractsData/NFT.json';
import musicDB from '../../db/music';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
const client = new NFTStorage({
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDE2RkI0NDc5QUVEMDU3RTA5MUMyM0VhRjE5RTdjYWQyMjFEZTZlMmMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4MTIzNjE2MTQ5MiwibmFtZSI6Im5mdHN0b3JhZ2UifQ.nzL-gbeL_9VZymTjM5Oz2xpGoqsUc9FMnLGxKvfnapQ',
});

const Create = () => {
  const [image, setImage] = useState(null);
  const [music, setMusic] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(null);

  const uploadImageToIPFS = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (typeof file !== 'undefined') {
      try {
        const imageFile = new File([file], file.name, { type: file.type });
        const metadata = await client.store({
          name: file.name,
          description: 'Uploaded image file using NFT.Storage',
          image: imageFile,
        });
        console.log(metadata);
        console.log(metadata.data.image.href);
        setImage(metadata.url); // Store only the IPFS CID
      } catch (error) {
        console.log('NFT.Storage image upload error: ', error);
      }
    }
  };

  const uploadMusicToIPFS = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (typeof file !== 'undefined') {
      try {
        const placeholderImage = new File([], 'placeholder.jpg', { type: 'image/jpeg' });
        const musicFile = new File([file], file.name, { type: file.type });
        const metadata = await client.store({
          name: file.name,
          description: 'Uploaded music file using NFT.Storage',
          image: placeholderImage,
          music: musicFile,
        });
        console.log(metadata);

        setMusic(metadata.url); // Store only the IPFS CID
      } catch (error) {
        console.log('NFT.Storage music upload error: ', error);
      }
    }
  };

  const createNFT = async () => {
    if (!image || !music || !name || !description || !price) return;
    try {
      mintThenList(image, music);
    } catch (error) {
      console.log('Error creating NFT: ', error);
    }
  };

  const mintThenList = async (imageMetadata, musicMetadata) => {
    console.log('Mint then list called');
    const imageCid = imageMetadata.replace('ipfs://', ''); // Remove 'ipfs://' from the CID
    const musicCid = musicMetadata.replace('ipfs://', ''); // Remove 'ipfs://' from the CID
    const imageUri = `https://ipfs.io/ipfs/${imageCid}`; // Construct the full IPFS URI for the image
    const musicUri = `https://ipfs.io/ipfs/${musicCid}`; // Construct the full IPFS URI for the music
    console.log('Image URI is: ', imageUri);
    console.log('Music URI is: ', musicUri);

    try {
      const maxId = musicDB.reduce((max, music) => Math.max(max, music.id), 0);
      const musicId = maxId + 1;

      const updatedMusicDB = [...musicDB, { id: musicId, imageUri, musicUri }];
      const updatedMusicDBJson = JSON.stringify(updatedMusicDB, null, 2);
      musicDB.push({ id: musicId, imageUri, musicUri });

      await fetch('http://localhost:3001/music.js', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: updatedMusicDBJson,
      });

      await (await nft.mint(imageUri)).wait();
      await (await nft.mint(musicUri)).wait();
      // get tokenId of new nft
    } catch (error) {
      console.error('Error updating musicDB:', error);
    }
  };

  return (
    <div className="container-fluid mt-5 justify-content-center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="imageFile"
                accept="image/*"
                onChange={uploadImageToIPFS}
              />
              <Form.Control
                type="file"
                required
                name="musicFile"
                accept="audio/*"
                onChange={uploadMusicToIPFS}
              />
              <Form.Control
                onChange={(e) => setName(e.target.value)}
                size="lg"
                required
                type="text"
                placeholder="Name"
              />
              <Form.Control
                onChange={(e) => setDescription(e.target.value)}
                size="lg"
                required
                as="textarea"
                placeholder="Description"
              />
              <Form.Control
                onChange={(e) => setPrice(e.target.value)}
                size="lg"
                required
                type="number"
                placeholder="Price in ETH"
              />
              <div className="d-grid px-0">
                <Button
                  onClick={createNFT}
                  variant="primary bg-gradient"
                  size="lg"
                >
                  Create & List NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Create;
