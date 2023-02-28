import { useEffect, useState } from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import {Room, Star, Hotel} from "@material-ui/icons"
import "./app.css"
import axios from 'axios';
import {format} from "timeago.js";
import Register from './components/Register';
import Login from './components/Login';

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem('user'));
  const [pins,setPins] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [searchTerm,setSearchTerm] = useState("");
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 46,
    longitude: 17,
    zoom: 4
  });

  useEffect(()=>{
    const getPins = async () => {
      try{
        const res = await axios.get('/pins');
        setPins(res.data);
      }catch(err){
        console.log("err");
      }
    };
    getPins();
  }, []);

  useEffect(()=>{
    const getHotels = async () => {
      try{
        const res = await axios.get('/hotels');
        setHotels(res.data);
      }catch(err){
        console.log('err');
      }
    };
    getHotels();
  }, []);

  const handleMarkerClick = (id,lat,long)=>{
    setCurrentPlaceId(id);
    setViewport({...viewport, latitude: lat, longitude: long});
  };

  const handleAddClick = (e)=>{
    const [long, lat] = e.lngLat;
    setNewPlace({
      lat,
      long
    })
  }

  const handleSubmit =  async (e)=>{
    e.preventDefault(); //dont refresh the page by default
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long
    }

    try
    {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    }catch(err){
      console.log(err);
    }
  }

  const handleLogout = () => {
    myStorage.removeItem('user');
    setCurrentUser(null);
  }

  return (
    <div className="App">
     <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle = "mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
      onDblClick = {handleAddClick}
      transitionDuration= "200"
     >
       {pins.map(p=>(

        <><Marker 
          latitude={p.lat} 
          longitude={p.long} 
          offsetLeft={-viewport.zoom * 3.5} 
          offsetTop={-viewport.zoom * 7}
      >
        <Room 
          style={{fontSize: viewport.zoom * 7, color: p.username===currentUser ? "tomato" : "slateblue", 
          cursor: "pointer"}}
          onClick={()=>handleMarkerClick(p._id, p.lat, p.long)}
        />
      </Marker>
      {p._id === currentPlaceId && (
       <Popup
          latitude={p.lat}
          longitude={p.long}
          closeButton={true}
          closeOnClick={false}
          onClose = {()=>setCurrentPlaceId(null)}
          anchor="left" >
          <div className="card">
            <label>Place</label>
            <h4 className="place">{p.title}</h4>
            <label>Review</label>
            <p className='desc'>{p.desc}</p>
            <label>Rating</label>
            <div className="stars">
              { Array(p.rating).fill(<Star className="star"/>)}
            </div>
            <label>Information</label>
            <span className="username">Created by <b>{p.username}</b></span>
            <span className="date">{format(p.createdAt)}</span>
          </div>
        </Popup>
        )}
        </>
        ))}
        {/* hotels */}
        {hotels.map(h=>(

          <><Marker 
              latitude={h.lat} 
              longitude={h.long} 
              offsetLeft={-viewport.zoom * 3.5} 
              offsetTop={-viewport.zoom * 7}
            >
            <Hotel
              style={{fontSize: viewport.zoom * 5, color: "purple", 
              cursor: "pointer"}}
              onClick={()=>handleMarkerClick(h._id, h.lat, h.long)}
            />
          </Marker>
          {h._id === currentPlaceId && (
            <Popup
              latitude={h.lat}
              longitude={h.long}
              closeButton={true}
              closeOnClick={false}
              onClose = {()=>setCurrentPlaceId(null)}
              anchor="left" >
              <div className="card">
              <label>Name</label>
              <p className='desc'>{h.hname}</p>
              <label>Address</label>
              <h4 className="place">{h.address}</h4>
              <label>Capacity</label>
              <h4 className="place">{h.capacity}</h4>
              <label>Rating</label>
              <div className="stars">
              { Array(h.rating).fill(<Star className="star"/>)}
              </div>
              </div>
            </Popup>
          )}
          </>
          ))}
        { newPlace && ( <Popup
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeButton={true}
          closeOnClick={false}
          // onClose = {()=>setCurrentPlaceId(null)}
          anchor="left" 
          onClose={()=> setNewPlace(null)}
          >
            <div>
              <form onSubmit = {handleSubmit}>
                <label>Title</label>
                <input placeholder="enter a title" onChange={(e)=>setTitle(e.target.value)}/>
                <label>Review</label>
                <textarea placeholder="Say us something about this place" onChange={(e)=>setDesc(e.target.value)}></textarea>
                <label>Rating</label>
                <select onChange={(e)=>setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitButton" type="submit">Add Pin</button>
              </form>
            </div>
          </Popup> 
        )}
        {currentUser ? ( <button className='button logout' onClick={handleLogout}>Log out</button> ) : ( <div className='buttons'>
          <button className='button login' onClick={()=>setShowLogin(true)}>Log in</button>
          <button className='button register' onClick={()=>setShowRegister(true)}>Register</button>
        </div>)
        }
        {showRegister && <Register setShowRegister={setShowRegister}/>}
        {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser}/>}
        {<input type="text" placeholder='Search places for hotels!' className="search" onChange={(e)=>{setSearchTerm(e.target.value);}}/>}
        {hotels.filter((val)=>{
          if(searchTerm==="")
            return "";
          if(val.address.toLowerCase().includes(searchTerm.toLowerCase()))
          {
            return val;
          }
        }).map((val,key)=>{
          return (
            <div className="searchRes" key={key}>
              <p>{val.hname}</p>
            </div>
          );
        })}
    </ReactMapGL>
    </div>
  );
}

export default App;
