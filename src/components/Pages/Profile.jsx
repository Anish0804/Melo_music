import React, {useEffect, useState} from 'react';
import './css/Profile.scss';
import {Avatar} from "@material-ui/core";
import {useSelector} from "react-redux";
import MusicCard from "../fragment/MusicCard";
import Container from "../fragment/Container";
import Grade from 'grade-js';
import SideBarOptions from "../fragment/SideBarOptions";
import {PlaylistPlay} from "@material-ui/icons";
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'
import '../assets/scss/ImageCard.scss';
import '../assets/scss/MusicCardContainer.scss';
import PlayCircleFilledWhiteIcon from "@material-ui/icons/ShopOutlined";
import Name from "../fragment/Name";

function Profile({ marketplace, nft, account }) {

    const {playlists} = useSelector(state => state.musicReducer);
    const [mostPlayed, setMostPlayed] = useState([]);

    function sortByProperty(property) {
        return function (a, b) {
            if (a[property] > b[property])
                return 1;
            else if (a[property] < b[property])
                return -1;

            return 0;
        }
    }

    useEffect(() => {
        setMostPlayed(playlists.sort(sortByProperty("timesPlayed")));
    }, [playlists]);

    useEffect(() => {
        Grade(document.querySelectorAll('.gradient-wrap'))
    });

    const [loading, setLoading] = useState(true)
    const [purchases, setPurchases] = useState([])
    const loadPurchasedItems = async () => {
      // Fetch purchased items from marketplace by quering Offered events with the buyer set as the user
      const filter =  marketplace.filters.Bought(null,null,null,null,null,account)
      const results = await marketplace.queryFilter(filter)
      //Fetch metadata of each nft and add that to listedItem object.
      const purchases = await Promise.all(results.map(async i => {
        // fetch arguments from each result
        i = i.args
        // get uri url from nft contract
        const uri = await nft.tokenURI(i.tokenId)
        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(`https://ipfs.io/ipfs/${uri.split('//')[1]}`)
        const metadata = await response.json()
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(i.itemId)
        // define listed item object
        let purchasedItem = {
          totalPrice,
          price: i.price,
          itemId: i.itemId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        }
        return purchasedItem
      }))
      setLoading(false)
      setPurchases(purchases)
    }
    useEffect(() => {
      loadPurchasedItems()
    }, [])
    const [listedItems, setListedItems] = useState([])
  const [soldItems, setSoldItems] = useState([])
  const loadListedItems = async () => {
    // Load all sold items that the user listed
    const itemCount = await marketplace.itemCount()
    let listedItems = []
    let soldItems = []
    for (let indx = 1; indx <= itemCount; indx++) {
      const i = await marketplace.items(indx)
      if (i.seller.toLowerCase() === account) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(i.tokenId)
        console.log(uri)
        console.log((`https://ipfs.io/ipfs/${uri.split('//')[1]}`))
        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(`https://ipfs.io/ipfs/${uri.split('//')[1]}`)
        const metadata = await response.json()
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(i.itemId)
        // define listed Item object
        let item = {
          totalPrice,
          price: i.price,
          itemId: i.itemId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        }
        listedItems.push(item)
        // Add listed item to sold items array if sold
        if (i.sold) soldItems.push(item)
      }
    }
    setLoading(false)
    setListedItems(listedItems)
    setSoldItems(soldItems)
  }

  useEffect(() => {
    loadListedItems()
  }, [])



    if (loading) return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    ) 
    return (
        <Container>
            <div className={"Profile"}>
                <div className="top-profile">
                    <Avatar variant={"rounded"} src={require("../assets/img/avatar2.jpg")}
                            style={{width: "150px", height: "150px"}}>
                        VS
                    </Avatar>
                    <div className="profile-detail">
                        <h3>MELO USER</h3>
                        <span className={"profile-playlist"}>
                            <SideBarOptions className={"lib-sub"} Icon={PlaylistPlay}
                                            href={"/home/playlist/instrumental"} title={"Instrumental"}/>
                            <SideBarOptions className={"lib-sub"} Icon={PlaylistPlay} href={"/home/playlist/electronic"}
                                            title={"Electronic"}/>
                        </span>
                    </div>
                </div>
                <div className="bottom-profile">
                    <div>
                        <h3>Most Played</h3>
                        <div className="most-played">
                            {
                                mostPlayed.map((item, index) => (
                                    index <= 4 && <MusicCard key={item.id} music={item}/>
                                ))
                            }
                        </div>
                    </div>
            <div>
            <h3 className="top-profile" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>My Purchases</h3>
            {purchases.length > 0 ?
            <div className="music-card-container">
                {purchases.map((item, idx) => (
                    <Col key={idx} className="overflow-hidden music-card">
                      <div className={"music-card-cover"} >
                            <img src={`https://ipfs.io/ipfs/${item.image.replace('ipfs://', '')}`} alt={"image"}/>
                            <div className="play-circle">
                     
                            </div>
                        </div>

                        <React.Fragment>
                            <Name name={item.name} className={"song-name"} length={item.name.length}/>
                            <Name name={item.description} className={"author-name"} length={item.description.length}/>
                        </React.Fragment>
                        <div>
                            <button className="Buy-btn">
                              {ethers.utils.formatEther(item.totalPrice)} ETH
                            </button>
                        </div>
                    </Col>
                ))}
            </div>
            : (
                <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <h2>My Purchases empty</h2>
                </main>
            )}
            </div>
<div>
<h3 className="top-profile" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>My Listed Items</h3>
            {listedItems.length > 0 ?
            <div className="music-card-container">
                {listedItems.map((item, idx) => (
                    <Col key={idx} className="overflow-hidden music-card">
                      <div className={"music-card-cover"} >
                            <img src={`https://ipfs.io/ipfs/${item.image.replace('ipfs://', '')}`} alt={"image"}/>
                            <div className="play-circle">
                     
                            </div>
                        </div>

                        <React.Fragment>
                            <Name name={item.name} className={"song-name"} length={item.name.length}/>
                            <Name name={item.description} className={"author-name"} length={item.description.length}/>
                        </React.Fragment>
                        <div>
                            <button className="Buy-btn">
                              {ethers.utils.formatEther(item.totalPrice)} ETH
                            </button>
                        </div>
                    </Col>
                ))}
            </div>
            : (
                <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <h2>My Listed Items Empty</h2>
                </main>
            )}
        </div>
                </div>
            </div>
        </Container>
    );
}

export default Profile;
