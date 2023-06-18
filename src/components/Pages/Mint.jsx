import React from 'react';
import './css/About.scss';
import Container from "../fragment/Container";
import { useState } from 'react';
import { ethers } from 'ethers';
import { Row, Form, Button } from 'react-bootstrap';
import { NFTStorage, File } from 'nft.storage';


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
    
  
    const createNFT = async () => {
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
      <div className="container-fluid mt-5 justify-content-center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="row">
          <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
            <div className="content mx-auto">
              <Row className="g-4">
                <Form.Control
                  type="file"
                  required
                  name="file"
                  onChange={uploadToIPFS}
                />
                <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
                <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
                <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
                <div className="d-grid px-0">
                  <Button onClick={createNFT} variant="primary bg-gradient" size="lg">
                    Create & List NFT!
                  </Button>
                </div>
              </Row>
            </div>
          </main>
        </div>
      </div>
      </Container>
    );
  }
  
  export default Mint;
  
