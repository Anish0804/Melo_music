import React from "react"
import '../assets/scss/MusicCardContainer.scss';
import MusicCard from "./MusicCard";
import {useSelector} from "react-redux";
import Container from "./Container";

function MusicCardContainer() {
    const {playlists} = useSelector(state => state.musicReducer);
    return (
        <Container>
            <div className={"music-card-container"}>
                {
                    playlists.map(item => (
                        <MusicCard key={item.id} music={item}/>
                    ))
                }
            </div>
        </Container>
    );
}

export default MusicCardContainer;
/*import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Container from "./Container";
import '../assets/scss/MusicCardContainer.scss';
import MusicCard from "./MusicCard";
import { NFTStorage } from 'nft.storage';*/

/*import React from "react";
import { NFTStorage } from 'nft.storage';
import { useSelector } from "react-redux";
import Container from "./Container";
import '../assets/scss/MusicCardContainer.scss';
import MusicCard from "./MusicCard";

function MusicCardContainer({ music }) {
  const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDE2RkI0NDc5QUVEMDU3RTA5MUMyM0VhRjE5RTdjYWQyMjFEZTZlMmMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4MTIzNjE2MTQ5MiwibmFtZSI6Im5mdHN0b3JhZ2UifQ.nzL-gbeL_9VZymTjM5Oz2xpGoqsUc9FMnLGxKvfnapQ';
  const ipfsCID = music.ipfsCID;

  async function playMusicFromLocalStorage() {
    // Implement the logic to play music from local storage
  }

  async function playMusicFromIPFS() {
    const client = new NFTStorage({ token: apiKey });

    try {
      const response = await client.get(ipfsCID);
      const { value } = await response.blob();

      const objectURL = URL.createObjectURL(value);

      const audio = new Audio();
      audio.src = objectURL;
      audio.play();
    } catch (error) {
      console.error("Failed to fetch music from NFT.Storage:", error);
    }
  }

  function handleMusicCardClick() {
    if (music.isLocal) {
      playMusicFromLocalStorage();
    } else {
      playMusicFromIPFS();
    }
  }
  const {playlists} = useSelector(state => state.musicReducer);
  return (
   
    <div className="music-card" onClick={handleMusicCardClick}>
      {<Container>
            <div className={"music-card-container"}>
                {
                    playlists.map(item => (
                        <MusicCard key={item.id} music={item}/>
                    ))
                }
            </div>
        </Container>}
    </div>
  );
}

export default MusicCardContainer;*/
