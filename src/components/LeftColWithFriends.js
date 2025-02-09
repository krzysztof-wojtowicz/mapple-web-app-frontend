import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";
import { useFetchedUsersContext } from "../hooks/useFetchedUsersContext";
import LoadingAnim from "./LoadingAnim";
import { API_URL } from "../App";

const LeftColWithFriends = () => {
  const { user } = useAuthContext();
  const [friends, setFriends] = useState();
  const { fetchedUsers, dispatch: usersDispatch } = useFetchedUsersContext();

  const fetchUsers = async () => {
    let array = [];
    let temp = [];

    user.following.forEach((u) => {
      if (fetchedUsers && !fetchedUsers.some((e) => e._id === u)) {
        array.push(u);
      } else if (!fetchedUsers) {
        array.push(u);
      } else if (
        user.following.includes(u) &&
        fetchedUsers.some((e) => e._id === u)
      ) {
        temp.push(fetchedUsers.find((x) => x._id === u));
      }
    });

    if (array.length > 0) {
      const response = await fetch(`${API_URL}/api/user/array/${array}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      usersDispatch({ type: "ADD_USERS", payload: json });

      if (response.ok) {
        setFriends(json.concat(temp));
      }
    } else {
      setFriends(temp);
    }
  };

  useEffect(() => {
    if (user && user.following) {
      if (user.following.length > 0) {
        fetchUsers();
      }
    }
  }, [user]);

  // SEARCH BAR 

  const [searchUsers, setSearchUsers] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const [searchShow, setSearchShow] = useState(false)
  const [filteredUsers, setFilteredUsers] = useState()

  useEffect(()=>{
    const fetchSearchUsers = async() => {
      const response = await fetch(`${API_URL}/api/user/`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })

      const json = await response.json()

      if(response.ok) {
        setSearchUsers(json)
      }
    }

    fetchSearchUsers()
  },[])
  
  useEffect(()=>{
    if (searchUsers) {
      setFilteredUsers(searchUsers.filter(
        searchUser => {
          return (
            (`${searchUser.name} ${searchUser.surname}`).toLowerCase().includes(searchValue.toLowerCase())
          )
        }
      ))
    }
  },[searchValue])

  const handleChange = (e) => {
    setSearchValue(e.target.value)
    if(e.target.value===""){
      setSearchShow(false)
    } else {
      setSearchShow(true)
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-5 mt-4">
      
      {/* SEARCH BAR */}
      <div className="relative">
          <input 
            type="text" 
            id="floating_outlined" 
            className="block py-2 px-3 focus:ring-0 peer bg-fuchsia-50 dark:bg-zinc-600 hover:cursor-text rounded-xl text-center mt-3 mb-4 text-fuchsia-400 dark:text-fuchsia-50 w-full shadow appearance-none leading-tight focus:outline-none border border-fuchsia-50 dark:border-zinc-600 focus:border-fuchsia-400 dark:focus:border-fuchsia-50" 
            value={searchValue}
            onChange={handleChange}
            placeholder=" "
            autoComplete="off"
          />
          <label htmlFor="floating_outlined" className="hover:cursor-text absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] rounded-md bg-fuchsia-50 dark:bg-zinc-600 px-2 peer-focus:px-2 peer-focus:bg-white dark:peer-focus:bg-zinc-600 text-fuchsia-500 dark:text-fuchsia-50 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Search athletes</label>
      </div>

      {searchShow &&
        <div className="relative">
          <div className="absolute bg-white dark:bg-zinc-800 rounded-lg shadow-lg px-3 py-1 w-full border border-fuchsia-100 dark:border-zinc-600">
          {filteredUsers && 
            filteredUsers.map((filteredUser) => (
            <div className="my-2 flex" key={filteredUser._id}>
              <Link
                to={`/profile/${filteredUser._id}`}
                className="flex w-full items-center p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg"
              >
                <img
                  src={
                    "https://res.cloudinary.com/dcwp4g10w/image/upload/w_150,h_150,c_fill,r_max/" +
                    filteredUser.profile_picture.url.split("/")[6] +
                    "/" +
                    filteredUser.profile_picture.url.split("/")[7] +
                    "/" +
                    filteredUser.profile_picture.url.split("/")[8]
                  }
                  className="rounded-full w-10 mx-2"
                  alt={filteredUser.name + filteredUser.surname}
                ></img>
                <span>{`${filteredUser.name} ${filteredUser.surname}`}</span>
              </Link>
            </div>
          ))}
          {filteredUsers.length===0 &&
            <div className="py-2">
              No athletes found!
            </div>
          }
          </div>
        </div>
      }

      {friends && (
        <div className="flex flex-col">
          <span className="text-2xl font-bold">Your friends</span>
          {friends.map((friend) => (
            <div className="my-2 flex" key={friend._id}>
              <Link
                to={`/profile/${friend._id}`}
                className="flex w-full items-center p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg"
              >
                <img
                  src={
                    "https://res.cloudinary.com/dcwp4g10w/image/upload/w_150,h_150,c_fill,r_max/" +
                    friend.profile_picture.url.split("/")[6] +
                    "/" +
                    friend.profile_picture.url.split("/")[7] +
                    "/" +
                    friend.profile_picture.url.split("/")[8]
                  }
                  className="rounded-full w-10 mx-2"
                  alt={friend.name + friend.surname}
                ></img>
                <span>{`${friend.name} ${friend.surname}`}</span>
              </Link>
            </div>
          ))}
        </div>
      )}
      {!friends && user.following.length > 0 && (
        <div className="flex flex-col">
          <span className="text-2xl font-bold">Your friends</span>
          <div className="m-5"><LoadingAnim /></div>
        </div>
      )}
      {!friends && !user.following.length > 0 && (
        <div className="flex flex-col">
          <span className="text-2xl font-bold">Your friends</span>
          <span>You do not have any friends yet, follow somebody!</span>
        </div>
      )}
    </div>
  );
};

export default LeftColWithFriends;
