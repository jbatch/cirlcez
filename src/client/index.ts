import { initialiseSocket, safeOn, safeEmit } from "./sockets";

const socket = initialiseSocket();

socket.on('connect', () =>{
  document.getElementById('play-button').addEventListener('click', () => {
    const playerName = (document.getElementById('player-name') as HTMLInputElement).value;
    console.log('Joining');
    safeEmit('join', { username: playerName })
  })
})

function onPlayButtonClick() {

}