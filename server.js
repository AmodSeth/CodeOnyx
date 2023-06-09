// // const express = require("express");
// // const http = require("http");
// // const { Server } = require("socket.io");
// // const ACTIONS = require("./src/actions.js");
// // const app = express();
// // //pass the app in the server
// // const server = http.createServer(app);

// // const io = new Server(server);

// // const PORT = process.env.PORT || 5000;

// // //create a map of username and socket id
// // const usermap = {};
// // function getAllConnectedClients(roomId) {
// //   //map type to array convertion as it returns  a map
// //   return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
// //     (socketId) => {
// //       return {
// //         socketId,
// //         username: usermap[socketId],
// //       };
// //     }
// //   );
// // }

// // //connection on the server
// // //it shows the elements it get connected on
// // io.on("connection", (socket) => {
// //   console.log("socket connected", socket.id);

// //   //on establish connect
// //   socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
// //     usermap[socket.id] = username;
// //     socket.join(roomId);

// //     //get the list of all userid
// //     const clients = getAllConnectedClients(roomId);
// //     console.log(clients);

// //     clients.forEach(({ socketId }) => {
// //       io.to(socketId).emit(ACTIONS.JOINED, {
// //         //send all the data to the usernames connected into it

// //         clients,
// //         username,
// //         socketId: socket.id,
// //       });
// //     });
// //   });
// //   //life cycle disconnect hone se phele
// //   //browser bnd krne ke baad
// //   socket.on("disconnecting", () => {
// //     //create a shallow and deep copy
// //     const rooms = [...socket.rooms];
// //     console.log("the rooms are :" ,rooms);
// //     rooms.forEach((roomId) => {
// //       socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
// //         socketId: socket.id,
// //         usermap: usermap[socket.id],
// //       });
// //     });
// //     delete usermap[socket.id];
// //     socket.leave();
// //   });
// // });

// // server.listen(PORT, () => {
// //   console.log("listening on ", { PORT });
// // });


// /////////////////////////*github//////////////

// const express = require('express');
// const app = express();
// const http = require('http');
// const path = require('path');
// const { Server } = require('socket.io');
// const ACTIONS = require('./src/Actions');

// const server = http.createServer(app);
// const io = new Server(server);

// app.use(express.static('build'));
// app.use((req, res, next) => {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// const userSocketMap = {};
// function getAllConnectedClients(roomId) {
//     // Map
//     return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
//         (socketId) => {
//             return {
//                 socketId,
//                 username: userSocketMap[socketId],
//             };
//         }
//     );
// }

// io.on('connection', (socket) => {
//     console.log('socket connected', socket.id);

//     socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
//         userSocketMap[socket.id] = username;
//         socket.join(roomId);
//         const clients = getAllConnectedClients(roomId);
//         clients.forEach(({ socketId }) => {
//             io.to(socketId).emit(ACTIONS.JOINED, {
//                 clients,
//                 username,
//                 socketId: socket.id,
//             });
//         });
//     });

//     socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
//         socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
//     });

//     socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
//         io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
//     });

//     socket.on('disconnecting', () => {
//         const rooms = [...socket.rooms];
//         rooms.forEach((roomId) => {
//             socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
//                 socketId: socket.id,
//                 username: userSocketMap[socket.id],
//             });
//         });
//         delete userSocketMap[socket.id];
//         socket.leave();
//     });
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Listening on port ${PORT}`));


const express = require('express');
const app = express();

const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const ACTIONS = require('./src/Actions');

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('build'));
app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'build','index.html'));
})


const userSocketMap = {};
function getAllConnectedClients(roomId) {
    // Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}



io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });
});




const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
