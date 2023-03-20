import React, { useEffect, useRef, useState } from "react";
import {
  Navigate, useLocation,
  useNavigate, useParams
} from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ACTIONS from "../Actions";
import wolf from "../assets/wolf_logo.png";
import Client from "../Components/Client";
import Editor from "../Components/Editor";
import PopupExample from "../Components/LangSelect/modal";
import { initSocket } from "../socket";
import "./Editor.css";

const errorNotify = () =>
  toast("RoomId and Username is Required", {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

const notify = () =>
  toast("new user Joined the room", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
const leftnotify = () =>
  toast("user left the room", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

const EditorPage = () => {
  //ref ke change hone pr component render na ho iski wajah se 
  //ref socket bnanna hain

  const socketRef = useRef(null);
  const location = useLocation();
  const codeRef = useRef(null);
  const reactnavigator = useNavigate();
  const [clients, setClients] = useState([]);

  //get the room id for the url

  const { roomId } = useParams();

 
  //asyn await hata hain await init

  useEffect(() => {
  //   const init = async() => {
  //     //initialise the socket
  //     socketRef.current = await initSocket();
  //     //initalise hone ke baad server pe join event ka event bhejna hain
  //     //error handling

  //     socketRef.current.on("connect_error", (err) => handleErrors(err));
  //     socketRef.current.on("connect_failed", (err) => handleErrors(err));
   
  //     function handleErrors(err) {
  //       console.log("socket err", err);
  //       errorNotify();
  //       reactnavigator("/");
  //     }
 
  //     //sending logic after connection is established
  //     socketRef.current.emit(ACTIONS.JOIN, {
  //       roomId,
  //       username: location.state?.username,
      
  //     });

  //     //listening for joined events
  //     socketRef.current.on(
  //       ACTIONS.JOINED,
  //       ({ clients, username, socketId }) => {
  //         //to notify all the clients but to prevent us the same
  //         //message

  //         if (username !== location.state?.username) {
  //           notify();
  //           console.log(`${username} joined`);
  //         }
  //         setClients(clients);
  //       }
  //     );
  //     //listening for disconnect compoenets
  //     socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId,username}) => {
  //       leftnotify();
  //       setClients((prev) => {
  //         return prev.filter((client) => client.socketid !== socketId);
  //       });
  //     });
  //   };
   

  //   init();

  //   //distributing the cleaning function

  // //   return () => {
  // //     socketRef.current.off(ACTIONS.DISCONNECTED);
  // //  }
  const init = async () => {
    socketRef.current = await initSocket();
    socketRef.current.on('connect_error', (err) => handleErrors(err));
    socketRef.current.on('connect_failed', (err) => handleErrors(err));

    function handleErrors(e) {
        console.log('socket error', e);
        toast.error('Socket connection failed, try again later.');
        reactnavigator('/');
    }

    socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
    });

    // Listening for joined event
    socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
            if (username !== location.state?.username) {
                toast.success(`${username} joined the room.`);
                console.log(`${username} joined`);
            }
            setClients(clients);
            socketRef.current.emit(ACTIONS.SYNC_CODE, {
                code: codeRef.current,
                socketId,
            });
        }
    );

    // Listening for disconnected
    socketRef.current.on(
        ACTIONS.DISCONNECTED,
        ({ socketId, username }) => {
            toast.success(`${username} left the room.`);
            setClients((prev) => {
                return prev.filter(
                    (client) => client.socketId !== socketId
                );
            });
        }
    );
};
init();
return () => {
  
    socketRef.current.off(ACTIONS.JOINED);
    socketRef.current.off(ACTIONS.DISCONNECTED);
    socketRef.current.disconnect();
  
};
    
  }, []);

  

  if (!location.state) {
    <Navigate to="/" />;
  }

  return (
    <div className="editorPageWrapper">
      <div className="leftWrapper">
        <div className="sideNav">
          <div className="logoEditor">
            <img src={wolf} alt="" className="logoImgEditor" />
          </div>
          <h3>Connected</h3>
          <div className="clientLists">
            {clients.map((client) => (
              <Client key={client.id} username={client.username} />
            ))}
          </div>
        </div>
        <PopupExample />
        <button className="btn copybtn">Copy Room Id</button>
        <button className="btn leavebtn"> Leave </button>
      </div>
      <div className="rightWrapper">
        {/* <Editor lang={"python"} socketRef={socketRef} roomId={roomId} /> */}

        <Editor
                    socketRef={socketRef}
                    roomId={roomId}
                    onCodeChange={(code) => {
                        codeRef.current = code;
                    }}
                />
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditorPage;
