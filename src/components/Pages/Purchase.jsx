import React from 'react';
import './css/About.scss';
import '../assets/scss/Navigation.scss';
import Container from "../fragment/Container";
import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'
import '../assets/scss/ImageCard.scss';
import '../assets/scss/MusicCardContainer.scss';
import PlayCircleFilledWhiteIcon from "@material-ui/icons/ShopOutlined";
import Name from "../fragment/Name";
import {Skeleton} from "@material-ui/lab";
import Box from "@material-ui/core/Box";


const Purchase = ({ marketplace, nft }) => {
    const [loading, setLoading] = useState(true)
    const [items, setItems] = useState([])
    const loadMarketplaceItems = async () => {
      // Load all unsold items
      const itemCount = await marketplace.itemCount()
      let items = []
      for (let i = 1; i <= itemCount; i++) {
        const item = await marketplace.items(i)
        if (!item.sold) {
          // get uri url from nft contract
          const uri = await nft.tokenURI(item.tokenId)
          console.log(uri)
          console.log((`https://ipfs.io/ipfs/${uri.split('//')[1]}`))
          // use uri to fetch the nft metadata stored on ipfs 
          const response = await fetch(`https://ipfs.io/ipfs/${uri.split('//')[1]}`)
          const metadata = await response.json()
          // get total price of item (item price + fee)
          const totalPrice = await marketplace.getTotalPrice(item.itemId)
          // Add item to items array
          items.push({
            totalPrice,
            itemId: item.itemId,
            seller: item.seller,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image
          })
        }
      }
      setLoading(false)
      setItems(items)
    }
  
    const buyMarketItem = async (item) => {
      await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
      loadMarketplaceItems()
    }
  
    useEffect(() => {
      loadMarketplaceItems()
    }, [])
    if (loading) return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    )
    return (
        <Container>
        <div className="flex justify-center">
            {items.length > 0 ?
            <div className="music-card-container">
                {items.map((item, idx) => (
                    <Col key={idx} className="overflow-hidden music-card">
                      <div className={"music-card-cover"} >
                            <img src={`https://ipfs.io/ipfs/${item.image.replace('ipfs://', '')}`} alt={"image"}/>
                            <div className="play-circle" onClick={() => buyMarketItem(item)}>
                                <PlayCircleFilledWhiteIcon/>
                            </div>
                        </div>

                        <React.Fragment>
                            <Name name={item.name} className={"song-name"} length={item.name.length}/>
                            <Name name={item.description} className={"author-name"} length={item.description.length}/>
                        </React.Fragment>
                        <div>
                            <button className="Buy-btn" onClick={() => buyMarketItem(item)}>
                              {ethers.utils.formatEther(item.totalPrice)} ETH
                            </button>
                        </div>
                    </Col>
                ))}
            </div>
            : (
                <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <h2>No listed assets</h2>
                </main>
            )}
        </div>
    </Container>
    );
  }
  export default Purchase
