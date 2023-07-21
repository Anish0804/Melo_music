import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Form, Button } from "react-bootstrap";
import { NFTStorage, File } from "nft.storage";
import NFTAddress from "../contractsData/NFT-address.json";
import NFTAbi from "../contractsData/NFT.json";
import Container from "../fragment/Container";
import { useDispatch, useSelector } from "react-redux";
import { setPlaylist } from "../../actions/actions";
import "./css/Generator.scss";

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
  const dispatch = useDispatch();
  const { musicDB = [] } = useSelector((state) => state.musicReducer);
  const [maxId, setMaxId] = useState(0); // Track the maximum ID
  const [musicproducer,setmusicproducer]=useState('');
  const [type,settype]=useState('');
  useEffect(() => {
    const fetchMusicDB = async () => {
      try {
        const response = await fetch('http://localhost:3001/music');
        const existingMusicDB = await response.json();
        dispatch(setPlaylist(existingMusicDB));
        const maxId = existingMusicDB.reduce((max, music) => Math.max(max, music.id), 0);
        setMaxId(maxId);
      } catch (error) {
        console.error('Error fetching musicDB:', error);
      }
    };

    fetchMusicDB();
  }, [dispatch]);

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
          type:type
        });
        console.log(metadata);

        setMusic(metadata.url); // Store only the IPFS CID
      } catch (error) {
        console.log('NFT.Storage music upload error: ', error);
      }
    }
  };

  const mintThenList = async (imageMetadata, musicMetadata, maxId) => {
  const imageCid = imageMetadata.replace('ipfs://', '');
  const musicCid = musicMetadata.replace('ipfs://', '');
  const imageUri = `https://ipfs.io/ipfs/${imageCid}`;
  const musicUri = `https://ipfs.io/ipfs/${musicCid}`;

  try {
    const musicId = maxId + 1;

    const responseone = await fetch(imageUri);
    const imageurimage = await responseone.json();
    console.log("Link is", imageurimage.image);
    const uploadimagecid = imageurimage.image.replace('ipfs://', '');
    const uploadimageuri = `https://ipfs.io/ipfs/${uploadimagecid}`;

    const responsetwo = await fetch(musicUri);
    const musicurimusic = await responsetwo.json();
    const uploadmusiccid = musicurimusic.music.replace('ipfs://', '');
    const uploadmusicuri = `https://ipfs.io/ipfs/${uploadmusiccid}`;

    const updatedMusic = {
      id: musicId,
      uploadimageuri: uploadimageuri,
      uploadmusicuri: uploadmusicuri,
      name: name,
      musicproducer:musicproducer,
      type:type
    };

    const existingMusicDB = [...musicDB]; // Create a shallow copy of the existing musicDB array
    existingMusicDB.push(updatedMusic); // Add the updatedMusic object to the end of the array

    const updatedMusicDBJson = existingMusicDB
    .map((music) => ({
      uploadimageuri: music.uploadimageuri,
      uploadmusicuri: music.uploadmusicuri,
      name: music.name,
      musicproducer:musicproducer,
      type:type
    }))
    .reduce(
      (accumulator, music) =>
        accumulator +
        JSON.stringify(music, null, 2).replace(/[\[\]]/g, "") +
        ",\n",
      ""
    );
  
  const finalMusicDBJson = updatedMusicDBJson.slice(0, -2);
  console.log("Updated music DB JSON:", finalMusicDBJson);
    dispatch(setPlaylist(existingMusicDB));

    await fetch('http://localhost:3001/music', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: finalMusicDBJson,
    });

    await (await nft.mint(imageUri)).wait();
    await (await nft.mint(musicUri)).wait();
  } catch (error) {
    console.error('Error updating musicDB:', error);
  }
};
  
  
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if (image && music) {
      mintThenList(image, music, maxId);
    } else {
      alert('Please upload an image and music file');
    }
  };

  return (<Container>
    <div
    className="container-fluid mt-5 justify-content-center"
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "80vh",
      minWidth: "20vh",
    }}>
      <div className="form-contain">
      <form className="aigenform" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="image">Image</label><br/>
          <input
            type="file"
            id="image"
            onChange={uploadImageToIPFS}
            accept="image/*"
          />
        </div>
        <div className="form-group">
          <label htmlFor="music">Music</label><br/>
          <input
            type="file"
            id="music"
            onChange={uploadMusicToIPFS}
            accept="audio/*"
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name</label><br/>
          <input
            type="text"
            id="name"
            placeholder="Enter the name of the NFT"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Producer's Name</label><br/>
          <input
            type="text"
            id="name"
            placeholder="Enter the name of the NFT"
            value={musicproducer}
            onChange={(e) => setmusicproducer(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label><br/>
          <input
            type="text"
            id="description"
            placeholder="Enter a description for the NFT"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Type of Music</label><br/>
          <input
            type="text"
            id="description"
            placeholder="Enter the type of music"
            value={type}
            onChange={(e) => settype(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label><br/>
          <input
            type="number"
            id="price"
            placeholder="Enter the price of the NFT"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <button class="submit-btn"type="submit">Create Music</button>
      </form>
      </div>
    </div>
    </Container>
  );
};

export default Create;
