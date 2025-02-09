import ShowPost from "../components/ShowPost";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { usePostContext } from "../hooks/usePostContext";
import { useFetchedUsersContext } from "../hooks/useFetchedUsersContext";
import LoadingAnim from "./LoadingAnim";
import { API_URL } from "../App";

const Feed = () => {
  const { posts, dispatch } = usePostContext();
  const { fetchedUsers: users, dispatch: usersDispatch} = useFetchedUsersContext();
  const { user } = useAuthContext();
  const [isPendingPosts, setIsPendingPosts] = useState(true);
  const [isPendingUsers, setIsPendingUsers] = useState(true)

  const [skip, setSkip] = useState(0)
  const [end, setEnd] = useState(false)
  const limit = 10

  const fetchPostsFirst = async () => {
    let array = [];
    array = array.concat(user.following);
    array.push(user._id);

    const response = await fetch(`${API_URL}/api/posts/array/${array}/${limit}/${skip}`, {
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
      } else {
        dispatch({ type: "SET_POSTS", payload: json });
      }
    }

    setIsPendingPosts(false);
  };

  const fetchPostsMore = async () => {
    let array = [];
    array = array.concat(user.following);
    array.push(user._id);

    const response = await fetch(`${API_URL}/api/posts/array/${array}/${limit}/${skip}`, {
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
  };

  useEffect(() => {
    dispatch({ type: "SET_POSTS", payload: null });

    fetchPostsFirst();
  }, []);

  useEffect(()=>{
    if(skip>0){
      fetchPostsMore()
    }
  },[skip])

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
    } else {
      setIsPendingUsers(false)
    }
  },[posts])

  window.onscroll = function() {
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 2 && !end) {
      setSkip(skip+1)
    }
  }

  return (
    <div className="w-full">
      {(isPendingPosts || isPendingUsers) && (  
        <div className="m-16"><LoadingAnim /></div>
      )}
      {!isPendingPosts && !isPendingUsers && (
        <>
          <div id="posts" className="transition-all w-full mt-20">
            {posts &&
              posts.map((post) => (
                <div className="my-5 w-full" key={post._id}>
                  <ShowPost post={post} />
                </div>
              ))}
            {!end &&
              <div className="my-3 py-2 flex justify-center w-full bg-white dark:bg-zinc-800 shadow-lg rounded-lg">
                    <LoadingAnim />
              </div>
            }
            {(!posts || posts.length===0) && (
              <div className="text-center mt-10">
                {user.following.length > 0
                  ? "Your friends have not posted anything! Post something or encourage them to do so!"
                  : "Follow someone to see their posts here or share your first map!"}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Feed;
