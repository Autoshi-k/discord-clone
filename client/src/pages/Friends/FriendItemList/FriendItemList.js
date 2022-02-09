import { Divider } from "@mui/material"
import StatusIcon from "../../../Utilities/StatusIcon";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { useContext } from "react";
import { SocketContext } from "../../../context/socket";

const FriendItemList = ({isSender, request}) => {

  const socket = useContext(SocketContext);
  const ignoreBtn = () => {
    socket.emit('ignore friend request', { senderId: request.senderId, reciverId: request.id });
  }

  return (
    <>
    <li className="friend-item-list">
      <StatusIcon 
        badge={true}
        currentStatus={request.statusId}
        alt={request.name}
        image={request.image}
      />
      <div className='content'>
        <div className='user-name'>{request.name}<span>#{request.tag}</span></div>
        <div>{isSender ? 'Outgoing' : 'Incoming'} Friend Request</div>
      </div>
      <div className='actions'>
        <div className='negative' onClick={() => ignoreBtn()}>
          <ClearIcon />
        </div>
        { 
          !isSender &&
          <div className='positive'>
            <CheckIcon />
          </div>
        }
      </div>
    </li>
      <Divider sx={{ color: '#40444B' }} />
      </>
  )
}

export default FriendItemList;