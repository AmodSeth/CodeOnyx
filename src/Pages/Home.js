import React,{useState} from 'react'
import img1 from '../assets/1.png';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Home.css'

import { useNavigate } from 'react-router-dom';
function Home() {
  const navigate = useNavigate();
  const [roomid, setRoomid] = useState("");
  const [Name, setName] = useState("");
  
  const notify = () => toast("New Room Created",{
    
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      
  });

  const errorNotify = () => toast("RoomId and Username is Required",{
    position: "bottom-right",
autoClose: 5000,
hideProgressBar: false,
closeOnClick: true,
pauseOnHover: true,
draggable: true,
progress: undefined,
theme: "dark",
  })
  const handleinputenter = (e)=>{
    //to get the input given by the keyboard
    // console.log('event',e.code);
    if(e.code === 'Enter'){
      joinRoom();
    }

  }
  const createNewRoom = (event) =>{
    //this prevents from refreshing of the new page
    event.preventDefault();
    const id = uuidv4();
    setRoomid(id);
    notify();
  }

  const joinRoom = () =>{
    if(!roomid || !Name){
      errorNotify();
      return;      
    }
    //redirect to the editorpage
    navigate(`/editor/${roomid}`,{
      //to pass the data from 1 page to another
      state:{
         username:Name,
      }
    })

  }

  return (
    <div className='homepageWrapper'>
        <div className="formWrapper">
            <img src={img1} alt="onyx-logo" className='onyx-logo'/>
            <h3 className='mainLabel'>paste your Room Id:</h3>
            <div className="inputGroup">
            <input type="text"  value={roomid}  
              onChange={(e)=>setRoomid(e.target.value)}
              onKeyUp={handleinputenter}
            placeholder='RoomId' className='inputBox'/>
            <input type="text"
              value={Name}
              onKeyUp={handleinputenter}
          onChange={(e)=>setName(e.target.value)}
          

            placeholder='UserName' className='inputBox'/>
           

            <button className='btn joinbtn' onClick={joinRoom}>Join</button>
            <span className='info'>
                if you dont have an invite then create &nbsp;
                <a onClick={createNewRoom} href="" className='newRoomBtn'> new Room</a>
                
            </span>
            </div>
        </div>
         <ToastContainer />
    </div>
  )
}

export default Home