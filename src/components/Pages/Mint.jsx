import React from 'react';
import './css/About.scss';
import Container from "../fragment/Container";
import { useState } from 'react';
import { ethers } from 'ethers';
import { Row, Form, Button } from 'react-bootstrap';
import { NFTStorage, File } from 'nft.storage';
import './css/Generator.scss';


const client = new NFTStorage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDE2RkI0NDc5QUVEMDU3RTA5MUMyM0VhRjE5RTdjYWQyMjFEZTZlMmMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4MTIzNjE2MTQ5MiwibmFtZSI6Im5mdHN0b3JhZ2UifQ.nzL-gbeL_9VZymTjM5Oz2xpGoqsUc9FMnLGxKvfnapQ' })


const Mint = ({ marketplace, nft }) => {
    const [image, setImage] = useState(null)
    const [price, setPrice] = useState(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    const uploadToIPFS = async (event) => {
      event.preventDefault()
      const file = event.target.files[0]
      if (typeof file !== 'undefined') {
        try {
          const metadata = await client.store({
            name: file.name,
            description: 'Uploaded using NFT.Storage',
            image: new File([file], file.name, { type: file.type })
          })
          console.log(metadata)
          setImage(new File([file], file.name, { type: file.type }))
        } catch (error){
          console.log("NFT.Storage image upload error: ", error)
        }
      }
    }
    
  
    const createNFT = async (e) => {
      e.preventDefault()
      if (!image || !price || !name || !description) return
      try{
        const metadata = await client.store({
          name,
          description,
          image
        })
         mintThenList(metadata)
      } catch(error) {
        console.log("NFT.Storage metadata upload error: ", error)
      }
    }
    
  
    const mintThenList = async (metadata) => {
      console.log("mint then list called")
      const uri = metadata.url
      console.log("uri is  : " ,uri)
      console.log(nft)
      // mint nft 
      await(await nft.mint(uri)).wait()
      // get tokenId of new nft 
      const id = await nft.tokenCount()
      // approve marketplace to spend nft
      await(await nft.setApprovalForAll(marketplace.address, true)).wait()
      // add nft to marketplace
      const listingPrice = ethers.utils.parseEther(price.toString())
      await(await marketplace.makeItem(nft.address, id, listingPrice)).wait()
    }
  
    return (
    <Container>
      <div className="container-fluid mt-5 justify-content-center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', minWidth:'20vh'}}>
      <div className="row">
        <main role="main" >
          <div className="form-contain">
  <form className='aigenform' onSubmit={createNFT}>
    <div>
      <label htmlFor="file">File:</label><br/>
      <input
        id="file"
        type="file"
        required
        name="file"
        onChange={uploadToIPFS}
      />
    </div>
    <div>
      <label htmlFor="name">Name:</label><br/>
      <input
        id="name"
        onChange={(e) => setName(e.target.value)}
        required
        type="text"
        placeholder="Name"
      />
    </div>
    <div>
      <label htmlFor="description">Description:</label><br/>
      <input
        id="description"
        type="text"
        onChange={(e) => setDescription(e.target.value)}
        required
        placeholder="Description"
      />
    </div>
    <div>
      <label htmlFor="price">Price in ETH:</label><br/>
      <input
        id="price"
        onChange={(e) => setPrice(e.target.value)}
        required
        type="number"
        placeholder="Price in ETH"
      />
    </div>
    <input type="submit" value="Create & List NFT" />
  </form>
          </div>
        </main>
      </div>
      </div>
      </Container>
    );
  }
  
  export default Mint;
  
