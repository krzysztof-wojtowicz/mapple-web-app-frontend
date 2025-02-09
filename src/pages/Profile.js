import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import EditProfile from "../components/EditProfile";
import ShowFullProfile from "../components/ShowFullProfile";
import ShowPost from "../components/ShowPost";
import { usePostContext } from "../hooks/usePostContext";
import { useFetchedUsersContext } from "../hooks/useFetchedUsersContext";
import LoadingAnim from "../components/LoadingAnim";
import LoadingAnimButton from "../components/LoadingAnimButton";
import ShowPostSmall from "../components/ShowPostSmall";
import { API_URL } from "../App";

const Profile = ({
  setIsExplore,
  setIsFeed,
  isFeed,
  isExplore,
  isProfile,
  setIsProfile,
}) => {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const { user, dispatch: userDispatch } = useAuthContext();
  const { fetchedUsers, dispatch: usersDispatch } = useFetchedUsersContext()
  const [isPendingProfile, setIsPendingProfile] = useState(true);
  const [isPendingPosts, setIsPendingPosts] = useState(true);

  const [editProfile, setEditProfile] = useState(false);

  const { posts, dispatch } = usePostContext();

  const [skip, setSkip] = useState(0)
  const [end, setEnd] = useState(false)
  const limit = 10

  // get user profile from db
  const fetchProfile = async () => {
    const response = await fetch(`${API_URL}/api/user/${id}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (response.ok) {
      setUserProfile(json);
      usersDispatch({type:'ADD_USER', payload: json})
    }
    setIsPendingProfile(false);
    };

  useEffect(() => {
    if (id === user._id) setIsProfile(true);
    setIsExplore(false);
    setIsFeed(false);
    //usersDispatch({ type: 'RESET', payload: user })
    dispatch({ type: "SET_POSTS", payload: null });
    setIsPendingPosts(true);
    setIsPendingProfile(true);

    const fetchAll = async () => {
      // sprawdzenie czy profile jest w users context i dodawanie go jesli nie ma
      if (fetchedUsers && fetchedUsers.some(e => e._id === id)){
          setUserProfile(fetchedUsers.find((x => x._id === id)))
          setIsPendingProfile(false)
      } else {
          await fetchProfile()
      }
    }
    
    fetchAll();
  }, [id]);

  useEffect(()=>{
    const fetchAll = async () => {
      // get user's posts from db
      const fetchPostsFirst = async () => {
        const response = await fetch(`${API_URL}/api/posts/${id}/${limit}/${skip}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const json = await response.json();

        if (response.ok) {
          if (json.length !== 0 && json.length>=10) {
            dispatch({ type: "SET_POSTS", payload: json });
            setEnd(false)
          } else if (json.length !== 0 && json.length<10) {
            setEnd(true)
            dispatch({ type: "SET_POSTS", payload: json });
          }else {
            dispatch({ type: "SET_POSTS", payload: null });
            setEnd(true)
          }
        }

        setIsPendingPosts(false);
      }
      
      await fetchPostsFirst()
    }
    
    if (!posts) {
      fetchAll()
    }
  },[userProfile])

  window.onscroll = function() {
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 2 && !end) {
      setSkip(skip+1)
    }
  }

  const fetchPostsMore = async () => {
    const response = await fetch(`${API_URL}/api/posts/${id}/${limit}/${skip}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (response.ok) {
      if (json.length === 0) {
        setEnd(true)
      } else {
        dispatch({ type: "ADD_POSTS", payload: json });
      }
    }
  }

  useEffect(()=>{
    if(skip>0){
      fetchPostsMore()
    }
  },[skip])

  const handleEditProfile = () => {
    setEditProfile(!editProfile);
  };

  const [isFollowLoading, setIsFollowLoading] = useState(false)

  const handleFollow = async () => {
    const addFollower = async () => {
      const response = await fetch(
        `${API_URL}/api/user/add/follower/${userProfile._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            newFollower: user._id,
          }),
        }
      );
      //const json = await response.json()

      if (response.ok) {
        
      }
    };
    const addFollowing = async () => {
      const response = await fetch(`${API_URL}/api/user/add/following/${user._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          newFollowing: userProfile._id,
        }),
      });
      //const json = await response.json()

      if (response.ok) {
        let tempUser = user;

        tempUser.following.push(userProfile._id);

        // save the user to local storage
        localStorage.setItem("user", JSON.stringify(tempUser));

        // update the auth context
        userDispatch({ type: "UPDATE", payload: tempUser });
        
        //await fetchProfile()

        // updating user in users context
        let userFollowing = fetchedUsers.find(e => e._id === user._id)
        let userFollowed = userProfile

        userFollowing.following.push(userProfile._id)
        userFollowed.followers.push(user._id)

        usersDispatch({type:'UPDATE', payload: userFollowed})
        usersDispatch({type:'UPDATE', payload: userFollowing})
      }
      setIsFollowLoading(false)
    };

    setIsFollowLoading(true)
    await addFollower();
    await addFollowing();
  };

  const handleUnfollow = async () => {
    const removeFollower = async () => {
      const response = await fetch(
        `${API_URL}/api/user/remove/follower/${userProfile._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            newFollower: user._id,
          }),
        }
      );
      //const json = await response.json()

      if (response.ok) {
        
      }
    };
    const removeFollowing = async () => {
      const response = await fetch(`${API_URL}/api/user/remove/following/${user._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          newFollowing: userProfile._id,
        }),
      });
      //const json = await response.json()

      if (response.ok) {
        let tempUser = user;

        tempUser.following.splice(
          tempUser.following.indexOf(userProfile._id),
          1
        );

        // save the user to local storage
        localStorage.setItem("user", JSON.stringify(tempUser));

        // update the auth context
        userDispatch({ type: "UPDATE", payload: tempUser });
        
        //await fetchProfile()

        // updating user in users context
        let userFollowing = fetchedUsers.find(e => e._id === user._id)
        let userFollowed = userProfile

        userFollowing.following.splice(userFollowing.following.indexOf(userProfile._id))
        userFollowed.followers.splice(userFollowed.followers.indexOf(user._id))

        usersDispatch({type:'UPDATE', payload: userFollowed})
        usersDispatch({type:'UPDATE', payload: userFollowing})
      }
      setIsFollowLoading(false)
    };

    setIsFollowLoading(true)
    await removeFollower();
    await removeFollowing();
  };

  function changeName(newName) {
    userProfile.name = newName;
  }

  function changeSurname(newSurname) {
    userProfile.surname = newSurname;
  }

  function changeBio(newBio) {
    userProfile.bio = newBio;
  }

  const [newPicture, setNewPicture] = useState();

  function changeImage(newImage) {
    setNewPicture(newImage);
    let tempUser = user;

    tempUser.url = newImage.url;
    
    userProfile.profile_picture = newImage
    // save the user to local storage
    localStorage.setItem("user", JSON.stringify(tempUser));

    // update the auth context
    userDispatch({ type: "UPDATE", payload: tempUser });
  }

  const [isSearch, setIsSearch] = useState(false)
  // SEARCH BAR 

  const [searchPosts, setSearchPosts] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const [searchShow, setSearchShow] = useState(false)
  const [filteredPosts, setFilteredPosts] = useState()

  useEffect(()=>{
    const fetchSearchPosts = async() => {
      const response = await fetch(`${API_URL}/api/posts/${userProfile._id}/0/0`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })

      const json = await response.json()

      if(response.ok) {
        setSearchPosts(json)
      }
    }

    if(isSearch){
      fetchSearchPosts()
    }
  },[isSearch])
  
  useEffect(()=>{
    if (searchPosts) {
      setFilteredPosts(searchPosts.filter(
        searchPost => {
          return (
            (searchPost.title.toLowerCase().includes(searchValue.toLowerCase()))
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
    <div className="">
      {userProfile && (
        <div>
          {(isPendingProfile || isPendingPosts) && 
            <div className='m-10'><LoadingAnim /></div>
          }
          {!isPendingProfile && !isPendingPosts && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 justify-items-center justify-center gap-4">
              <div className="w-full md:col-span-1 flex-col justify-center">
                <div className="flex flex-col items-center gap-y-1 bg-white dark:bg-zinc-800 shadow-lg rounded-lg p-4 w-full md:m-4 md:fixed md:w-1/3 lg:w-1/4">
                  {!editProfile && (
                    <div className="">
                      <ShowFullProfile
                        user={userProfile}
                        newPicture={newPicture}
                      />
                      {userProfile._id === user._id && (
                        <div className="flex justify-center">
                          <button
                            className="mt-4 shadow bg-fuchsia-500 hover:bg-fuchsia-400 dark:bg-fuchsia-600 dark:hover:bg-fuchsia-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                            onClick={handleEditProfile}
                          >
                            Edit profile
                          </button>
                        </div>
                      )}
                      {userProfile._id !== user._id &&
                        !userProfile.followers.includes(user._id) && (
                          <div className="flex justify-center">
                            {isFollowLoading && 
                              <button
                              className="w-30 flex justify-center mt-4 shadow bg-fuchsia-500 hover:bg-fuchsia-400 dark:bg-fuchsia-600 dark:hover:bg-fuchsia-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                              disabled
                              >
                                <LoadingAnimButton color="fuchsia"/>Loading...
                              </button>
                            }
                            {!isFollowLoading &&
                              <button
                              className="w-30 flex justify-center mt-4 shadow bg-fuchsia-500 hover:bg-fuchsia-400 dark:bg-fuchsia-600 dark:hover:bg-fuchsia-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                              onClick={handleFollow}
                              >
                                Follow
                              </button>
                            }
                          </div>
                        )}
                      {userProfile._id !== user._id &&
                        userProfile.followers.includes(user._id) && (
                          <div className="flex justify-center">
                            {isFollowLoading && 
                              <button
                              className="w-30 flex justify-center mt-4 shadow bg-fuchsia-500 hover:bg-fuchsia-400 dark:bg-fuchsia-600 dark:hover:bg-fuchsia-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                              disabled
                              >
                                <LoadingAnimButton color="fuchsia"/>Loading...
                              </button>
                            }
                            {!isFollowLoading &&
                              <button
                              className="w-30 flex justify-center mt-4 shadow bg-fuchsia-500 hover:bg-fuchsia-400 dark:bg-fuchsia-600 dark:hover:bg-fuchsia-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                              onClick={handleUnfollow}
                              >
                                Unfollow
                              </button>
                            }
                          </div>
                        )}
                    </div>
                  )}
                  {editProfile && (
                    <div>
                      <EditProfile
                        user={userProfile}
                        handleEditProfile={handleEditProfile}
                        changeName={changeName}
                        changeSurname={changeSurname}
                        changeBio={changeBio}
                        changeImage={changeImage}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full md:col-span-2 lg:col-span-3 justify-content-center justify-center">
                  <div className="w-full flex justify-center">
                    <div className="flex flex-col w-full items-center">
                      {!isSearch &&
                        <>
                        {posts && (
                          <div className="w-full flex justify-between items-center md:w-5/6 lg:w-3/5 xl:w-1/2 my-6">
                            <h3 className="font-bold text-2xl text-center md:text-left ml-4 md:ml-0">
                              {`${userProfile.name}'s`} maps
                            </h3>
                            <button onClick={()=>{setIsSearch(true)}} className="mr-4 md:mr-0 flex justify-center items-center shadow bg-fuchsia-500 hover:bg-fuchsia-400 dark:bg-fuchsia-600 dark:hover:bg-fuchsia-500 focus:shadow-outline focus:outline-none text-white  py-2 px-4 rounded-full">
                              <span className="material-symbols-outlined scale-110 mr-1" style={{"fontVariationSettings": "'FILL' 0,'wght' 500,'GRAD' 0,'opsz' 48"}}>
                                search
                              </span>
                              <span className="font-bold">Search</span>
                            </button>
                          </div>
                        )}
                        {posts &&
                          posts.map((post) => (
                            <div
                              className="mb-4 w-full md:w-5/6 lg:w-3/5 xl:w-1/2"
                              key={post._id}
                            >
                              <ShowPost post={post} />
                            </div>
                          ))}
                          {!end && posts &&
                            <div className="mb-4 py-2 flex justify-center w-full md:w-5/6 lg:w-3/5 xl:w-1/2 bg-white dark:bg-zinc-800 shadow-lg rounded-lg">
                                  <LoadingAnim />
                            </div>
                          }
                        {!posts && (
                          <h3 className="font-bold text-2xl my-4 text-center md:text-left">
                            {`${userProfile.name}`} does not have any maps
                          </h3>
                        )}
                        </>
                      }
                      { isSearch &&
                        <div className="min-h-screen flex flex-col items-center w-full">
                          <div className="flex items-center justify-between my-6 w-full md:w-5/6 lg:w-3/5 xl:w-1/2">
                            {/* SEARCH BAR */}
                            <div className="relative ml-4 md:ml-0">
                                <input 
                                  type="text" 
                                  id="floating_outlined" 
                                  className="block py-2 px-3 focus:ring-0 peer bg-fuchsia-50 dark:bg-zinc-600 hover:cursor-text rounded-xl text-center text-fuchsia-400 dark:text-fuchsia-50 w-full shadow appearance-none leading-tight focus:outline-none border border-fuchsia-50 dark:border-zinc-600 focus:border-fuchsia-400 dark:focus:border-fuchsia-50" 
                                  value={searchValue}
                                  onChange={handleChange}
                                  placeholder=" "
                                  autoComplete="off"
                                />
                                <label htmlFor="floating_outlined" className="hover:cursor-text absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] rounded-md bg-fuchsia-50 dark:bg-zinc-600 px-2 peer-focus:px-2 peer-focus:bg-white dark:peer-focus:bg-zinc-600 text-fuchsia-500 dark:text-fuchsia-50 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Search maps by title</label>
                            </div>
                            <div onClick={()=>{setIsSearch(false)}} className="mr-4 md:mr-0 hover:scale-90 hover:opacity-80 flex items-center shadow-md hover:cursor-pointer bg-white dark:bg-zinc-800 rounded-full p-1 text-fuchsia-500 dark:text-fuchsia-600">
                              <span className="material-symbols-outlined" style={{"fontVariationSettings": "'FILL' 0,'wght' 500,'GRAD' 0,'opsz' 48"}}>
                                close
                              </span>
                            </div>
                          </div>

                          {searchShow &&
                            <>
                              {filteredPosts && 
                                filteredPosts.map((filteredPost) => (
                                  <div
                                    className="mb-4 w-full md:w-5/6 lg:w-3/5 xl:w-1/2"
                                    key={filteredPost._id}
                                  >
                                    <ShowPostSmall post={filteredPost} />
                                  </div>
                              ))}
                              {filteredPosts.length===0 &&
                                <div className="py-2">
                                  No maps found!
                                </div>
                              }
                              </>
                          }

                          {!searchShow &&
                            <>
                              {posts &&
                                posts.map((post) => (
                                  <div
                                    className="mb-4 w-full md:w-5/6 lg:w-3/5 xl:w-1/2"
                                    key={post._id}
                                  >
                                    <ShowPostSmall post={post} />
                                  </div>
                                ))}
                                {!end && posts &&
                                  <div className="mb-4 py-2 flex justify-center w-full md:w-5/6 lg:w-3/5 xl:w-1/2 bg-white dark:bg-zinc-800 shadow-lg rounded-lg">
                                        <LoadingAnim />
                                  </div>
                                }
                            </>
                          }
                        </div>
                      }
                    </div>
                  </div>
              </div>
            </div>
          )}
        </div>
      )}
      {!userProfile && (
        <div>
          {!isPendingProfile && 
            <div className='flex flex-col items-center mt-16'>
              <span className='text-7xl'>404</span>
              <span className='text-4xl'>User not found</span>
              <Link to="/"><button className='mt-4 shadow bg-fuchsia-500 hover:bg-fuchsia-400 dark:bg-fuchsia-600 dark:hover:bg-fuchsia-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded'>Go back to home!</button></Link>
            </div>
          }
          {isPendingProfile && 
            <div className='m-10'><LoadingAnim /></div>
          }
        </div>
      )}
    </div>
  );
};

export default Profile;
