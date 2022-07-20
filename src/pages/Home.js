import React,{ useEffect } from 'react';
import { Link } from "react-router-dom";
import "./Home.css";
import { Logo } from "../images/Netflix"
import {ConnectButton,Icon,TabList,Tab,Button,Modal,useNotification } from "web3uikit"
import { movies } from "../helpers/library";
import { useState } from "react";
import { useMoralis } from 'react-moralis';



const Home = () => {
  const [visible,setVisible] = useState(false);
  const [selectedFilm ,setSelectedFilm] = useState();
  const [myMovies,setMyMovies] = useState();
  const { isAuthenticated, Moralis ,account } = useMoralis(); 
  
  useEffect(() => {

      async function fetchMyList() {
        await Moralis.start({
          serverUrl:"https://dkcczdtuq8o4.usemoralis.com:2053/server",
          appId:"Q1aSPnwaHht0iLa5BJm88Ynq88JyHJJ5MZcMhoWb",
        });
        const theList = await Moralis.Cloud.run("getMyList", {addrs: account});
        const filterdA = movies.filter(function (e) {
          return theList.indexOf(e.Name) > -1;
        })
        setMyMovies(filterdA);
      }
      fetchMyList();
  }, [account,isAuthenticated]);

  const dispatch = useNotification();
  const handleNewNotification = () =>{
    dispatch({
      type :"error",
      message : "Please Connect to your wallet",
      title : "Not Authenticated",
      position : "topL"


    });
  };
  const handleAddNotification = () =>{
    dispatch({
      type :"success",
      message : "Movie added to List",
      title : "Success",
      position : "topL"


    });
  };
return(
  <>
  <div className="logo">
  <Logo/>
  </div>
  <div className="connect">
    <Icon fill="#ffffff" size ={24} svg = "bell" />
    <ConnectButton />
  </div>
  <div className="topBanner">
    <TabList defaultActiveKey = {1} tabStyle = "bar">
      <Tab tabKey={1} tabName={"Movies"}>
        <div className="scene">
          <img src={movies[0].Scene} className="sceneImg"></img>
          <img className="sceneLogo" src={movies[0].Logo}></img>
          <p className="sceneDesc">{movies[0].Description}</p>
          <div className="playButton">
            <Button 
              icon="chevronRightX2"
              text="Play"
              theme="secondary"
              type="button"
              />
            <Button 
              icon="plus"
              text="Add to My List"
              theme="translucent"
              type="button"
              onClick={() =>console.log(myMovies)}
              />  
          </div>
        </div>

        <div className="title">
          Movies
        </div>
        <div className="thumbs">
          {movies &&
          movies.map((e)=>{
            return (
              <img
              src={e.Thumnbnail}
              className="thumbnail"
              onClick={()=>{
                setSelectedFilm(e);
                setVisible(true);
              }}
              >

              </img>
            );
          })
          }
        </div>
        


      </Tab>
      <Tab tabKey={2} tabName={"Series"} isDisabled={true}></Tab>
      <Tab tabKey={3} tabName={"MyList"}>

        <div className="ownListContent">
          <div className="title">
            Your Library


          </div>
          {myMovies && isAuthenticated ? (
            <>
            <div className="ownThumbs">
          {
          myMovies.map((e)=>{
            return (
              <img
              src={e.Thumnbnail}
              className="thumbnail"
              onClick={()=>{
                setSelectedFilm(e);
                setVisible(true);
              }}
              >

              </img>
            );
          })
          }
        </div>
            </>

          ) : (
            <div className="ownThumbs">
              You Need to Authenticate to view your Library

            </div>
          )}
        </div>        


      </Tab>
    </TabList>
    {selectedFilm && (
      <div className="modal">
        <Modal
        onCloseButtonPressed={() => setVisible(false)}
        isVisible={visible}
        hasFooter={false}
        width="1000px"
        >
          <div className="modalContent">
          <img src={selectedFilm.Scene} className="modalImg"></img>
          <img className="modalLogo" src={selectedFilm.Logo}></img>
          <div className="modalPlayButton">

            {isAuthenticated ? (
              <>
              <Link to="/player" state={selectedFilm.Movie}>
            <Button 
              icon="chevronRightX2"
              text="Play"
              theme="secondary"
              type="button"
              />
              </Link>
            <Button 
              icon="plus"
              text="Add to My List"
              theme="translucent"
              type="button"
              onClick= {async () => {
                await Moralis.Cloud.run("updateMyList",{
                  addrs: account,
                  newFav: selectedFilm.Name,
                });
                handleAddNotification();
              }}
              />

              </>
            ) : (
              <>
              
            <Button 
              icon="chevronRightX2"
              text="Play"
              theme="secondary"
              type="button"
              onClick ={handleNewNotification}
              />
              
            <Button 
              icon="plus"
              text="Add to My List"
              theme="translucent"
              type="button"
              onClick ={handleNewNotification}
              />
              </>  

            )}

            
          </div>
          <div className="movieInfo">
            <div className="description">
              <div className="details">
                <span>{selectedFilm.Year}</span>
                <span>{selectedFilm.Duration}</span>

              </div>
              {selectedFilm.Description}

            </div>
            <div className="detailedInfo">
              Genre:
              <span className="deets">{selectedFilm.Genre}</span>
              <br />
              Actors:
              <span className="deets">{selectedFilm.Actors}</span>

            </div>

          </div>

          </div>


        </Modal>
      </div>

    )}

  </div>
  </>
)
}

export default Home;
