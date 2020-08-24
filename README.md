The current repository has the server-side in the /server folder and client-side in the /client folder.

On the server-side, the babel libraries were used to code in ECMAScript 6.
The server is a communication bridge between the clients. It will be responsible for coordinating the messages between the clients, the video to be shared, etc.
To ensure that the information is transmitted in real-time, the server uses the socket.io library. Click here to see the socket.io documentation https://socket.io/.

On the client-side, the client uses the socket.io-client library to send messages to the server and the simple-peer to the webrtc communication.
Click here to see the simple-peer documentation https://www.npmjs.com/package/simple-peer.
