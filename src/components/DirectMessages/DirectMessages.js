import { Divider } from "@mui/material";

// Components
import { Chat } from "../Chat/Chat";
import { Sidebar } from "../Sidebar/Sidebar";
import { ListItemUser } from "../ListItemUser/ListItemUser";
import Friends from "../../pages/Friends/Friends";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { useContext } from "react";
import { newRoom } from "../../features/rooms";

import { SocketContext } from "../../context/socket";

function DirectMessages() {
  const user = useSelector(state => state.user.value);
  const rooms = useSelector(state => state.rooms.value);
  const location = useSelector(state => state.location.value);

  const socket = useContext(SocketContext);
  const dispatch = useDispatch();

  // adding a new conversation
  const addCoversation = () => {
    const newConAdd = prompt('write your friend username & tag');
    if (newConAdd === null) return;
    // getting the promt and spliting it to username and tag
    const mark = newConAdd.indexOf('#');
    let displayName, tag;
    if (mark === -1) {
      displayName = newConAdd;
      tag = null; 
    } else {
      displayName = newConAdd.slice(0, mark);
      tag = newConAdd.slice(mark + 1);
    }
    fetch('/api/users/addConv', { 
      method: 'POST', 
      body: JSON.stringify({ displayName, tag }),
      headers: {
        "content-type": "application/json",
        "Authorization": localStorage.getItem("auth-token")
      }  
    })
    .then(res => res.json())
    .then(data => {
      if (data.err) console.log(data.err);
      dispatch(newRoom(data));
      socket.emit('add room', data);
    })
  }
 
  return (
  <div className="direct-messages-window">
    <Sidebar> 
      <input type="text" placeholder="search or start a chat"/>
      <Divider />
      <div className="direct-to-friends-window">
        <ListItemUser key={9999999} room='friends' roomName='friends' />
      </div>
      <div className="users-list">
        <div className="sidebar-title" onClick={ () => addCoversation() }>direct messages</div>
        { Object.keys(rooms).length ?
          Object.keys(rooms).map((key, index) => {
            const otherParticipantId = Object.keys(rooms[key].participants).filter(participant => rooms[key].participants[participant]._id !== user._id) // will change later in case of multichat
            const toDisplay = rooms[key].participants[otherParticipantId];
            return <ListItemUser 
                    key={index} 
                    room={key} 
                    roomName={toDisplay.displayName}
                    image={toDisplay.image}
                    currentStatus={toDisplay.currentStatus}
                  />
              })
        : <div style={{ flex: 1 }}></div>
        }
      </div>
    </Sidebar>
    {
      location.room === 'friends' ?
      <Friends />
      :
      <Chat />
    }
  </div>
  )
}

export default DirectMessages;