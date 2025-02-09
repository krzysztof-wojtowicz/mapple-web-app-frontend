import ShowPost from "../components/ShowPost";
import { useEffect, useState, useRef } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { usePostContext } from "../hooks/usePostContext";
import { useFetchedUsersContext } from "../hooks/useFetchedUsersContext";
import LoadingAnim from "./LoadingAnim";
import { API_URL } from "../App";

const Explore = () => {
  // post context and fetched users context and user context
  const { posts, dispatch } = usePostContext();
  const { fetchedUsers: users, dispatch: usersDispatch} = useFetchedUsersContext();
  const { user } = useAuthContext();
  // check if data is pending from db
  const [isPendingPosts, setIsPendingPosts] = useState(true);
  const [isPendingUsers, setIsPendingUsers] = useState(true)
  // states for fetching posts from db
  const [skip, setSkip] = useState(0)
  const [end, setEnd] = useState(false)
  const limit = 10

  // fetch first posts with limit
  const fetchPostsFirst = async () => {
    const response = await fetch(`${API_URL}/api/posts/${limit}/0`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (response.ok) {
      if (json.length===0){
        setEnd(true)
      } else if (json.length<10) {
        setEnd(true)
        dispatch({ type: "SET_POSTS", payload: json });
      }else {
        dispatch({ type: "SET_POSTS", payload: json });
      }
    }

    setIsPendingPosts(false);
  };

  // fetch more posts after scrolling down
  const fetchPostsMore = async () => {
    const response = await fetch(`${API_URL}/api/posts/${limit}/${skip}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (response.ok) {
      if (json.length===0){
        setEnd(true)
      } else {
        dispatch({ type: "ADD_POSTS", payload: json });
      }
    }

    setIsPendingPosts(false);
  };
  
  // use effect after loading the page, setting post context to null and fetching posts using function above
  useEffect(() => {
    dispatch({ type: "SET_POSTS", payload: null });

    fetchPostsFirst();
  }, []);
  
  // if page is scrolled to bottom, skip is incremented
  window.onscroll = function() {
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 2 && !end) {
      setSkip(skip+1)
    }
  }

  // if page is scrolled and skip incremented, more posts are fetched
  useEffect(()=>{
    if(skip>0){
      fetchPostsMore()
    }
  },[skip])

  // if there are new posts, fetch users for them to show profile picture and name
  useEffect(()=>{
    let arrayForFetch = []
    
    if(posts) {
      posts.forEach((post)=>{
        if (users){
          if(!users.some(e => e._id === post.user_id) && !arrayForFetch.includes(post.user_id)){
            arrayForFetch.push(post.user_id)
          }
        } else {
          if (!arrayForFetch.includes(post.user_id)) {
            arrayForFetch.push(post.user_id)
          }
        }
      })

      const fetchUsers = async () => {
        const response = await fetch(`${API_URL}/api/user/array/${arrayForFetch}}`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            usersDispatch({ type: 'ADD_USERS', payload: json })
            setIsPendingUsers(false)
        }
    }

    if(arrayForFetch.length > 0) {
      fetchUsers()
    } else {
      setIsPendingUsers(false)
    }
    }
  },[posts])

  return (
    <div className="w-full">
      {(isPendingPosts || isPendingUsers) && (
        <>
          <div className="m-16"><LoadingAnim /></div>
        </>
      )}
      {!isPendingPosts && !isPendingUsers && (
        <div>
          <div id="posts" className="transition-all w-full mt-20">
            {posts &&
              posts.map((post) => (
                <div className="my-5 w-full" key={post._id}>
                  <ShowPost post={post} />
                </div>
              ))}
          </div>
          {!end &&
            <div className="my-3 py-2 flex justify-center w-full bg-white dark:bg-zinc-800 shadow-lg rounded-lg">
                  <LoadingAnim />
            </div>
          }
        </div>
      )}
    </div>
  );
};

export default Explore;
