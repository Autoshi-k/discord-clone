import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NotFound from "../NotFound/NotFound";
import PendingItemList from '../PendingItemList/PendingItemList';

const FriendList = () => {
  const location = useSelector(state => state.location.value);
  const { friends, pending } = useSelector(state => state.friends.value);
  const [array, setArray] = useState([]);
  const [resetArray, setResetArray] = useState(true);
  
  // location chaged so needs to change the array's values
  useEffect(() => {
    setArray([]);
    setResetArray(true);
  }, [location.subRoom, friends, pending]);
  
  // set new values in array
  useEffect(() => {
    if (resetArray) {
      setArray(location.subRoom === 'pending' ? pending : location.subRoom === 'all' ? friends : friends.filter(friend => friend.statusId))
      setResetArray(false);
    }
  }, [resetArray])

  return (
    <>
      { array.length ? 
      <>
        <h2 className='friends-title'>{location.subRoom} - { array.length }</h2>
        <ul className='friend-page-list' >
          { array.map(request => <PendingItemList key={request.id} request={request} />) }
        </ul>
      </> 
      : <NotFound /> 
      }
      
    </>
  )
}

export default FriendList;