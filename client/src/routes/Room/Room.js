import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { SERVER_END_POINT, USER_LEFT, USER_JOINED, SIGNAL, SENDING_SIGNAL,
    JOIN_ROOM, JOIN_ROOM_RESPONSE, RECEIVING_RETURNED_SIGNAL, RETURNING_SIGNAL, STREAM } from "../../utils/Constants";

const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-direction: column
`;

const StyledVideo = styled.video`
    width: 100%;
    max-height: 500px;
`;

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on(STREAM, stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <StyledVideo playsInline autoPlay ref={ref} />
    );
}

const Room = (props) => {
    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const roomID = props.match.params.roomID;

    useEffect(() => {
        socketRef.current = io.connect(SERVER_END_POINT);
        navigator.mediaDevices.getDisplayMedia({ cursor: true }).then(stream => {
            userVideo.current.srcObject = stream;
            socketRef.current.emit(JOIN_ROOM, {
                roomID,
                "name": "camilo"
            });
            socketRef.current.on(JOIN_ROOM_RESPONSE, response => {
                if(response==="room full"){
                    alert("Whoops!, the room is full");
                    window.location.href = "/";
                }else{
                    const peers = [], users=response;
                    Object.entries(users).forEach(([socketID, userInfo])=>{
                        console.log(socketID);
                        console.log(userInfo);
                        const peer = createPeer(socketID, socketRef.current.id, stream);
                        peersRef.current.push({
                            peerID: socketID,
                            peer,
                        })
                        peers.push(peer);
                    });
                    setPeers(peers);
                    console.log(peers);
                }
            });

            socketRef.current.on(USER_JOINED, payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })
                setPeers(users => [...users, peer]);
            });

            socketRef.current.on(USER_LEFT, data =>{
                console.log(data);
                const newPeers = [], newPeersRef = [];
                peersRef.current.forEach(peerElement=>{
                    if(peerElement.peerID===data.id){
                        peerElement.peer.destroy();
                    }else{
                        newPeers.push(peerElement.peer);
                        newPeersRef.push(peerElement);
                    }
                });
                setPeers(newPeers);
                peersRef.current = newPeersRef;
            });

            socketRef.current.on(RECEIVING_RETURNED_SIGNAL, payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        })
    }, []);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });
        peer.on(SIGNAL, signal => {
            socketRef.current.emit(SENDING_SIGNAL, { userToSignal, callerID, signal })
        });
        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })
        peer.on(SIGNAL, signal => {
            socketRef.current.emit(RETURNING_SIGNAL, { signal, callerID })
        })
        peer.signal(incomingSignal);
        return peer;
    }

    return (
        <Container>
            <div id="myVideo">
                <StyledVideo muted ref={userVideo} autoPlay playsInline />
            </div>
            <div id="othersVideo">
                {peers.map((peer, index) => {
                    return (
                        <Video key={index} peer={peer} />
                    );
                })}
            </div>
        </Container>
    );
};

export default Room;
