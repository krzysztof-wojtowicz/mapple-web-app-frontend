import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { endOfWeek, format, formatDistanceToNowStrict } from 'date-fns'
import { compareAsc } from 'date-fns/esm'
import EditPost from "../components/EditPost";
import { useFetchedUsersContext } from "../hooks/useFetchedUsersContext";
import { useAddLike } from "../hooks/useAddLike";
import LoadingAnim from "../components/LoadingAnim";
import { useAddComment } from "../hooks/useAddComment";
import { API_URL } from "../App";

const Post = ({
  setIsExplore,
  setIsFeed,
  isFeed,
  isExplore,
  isProfile,
  setIsProfile,
}) => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const { fetchedUsers, dispatch: usersDispatch } = useFetchedUsersContext();
  const [post, setPost] = useState();
  const [postUser, setPostUser] = useState();
  const [isPendingPost, setIsPendingPost] = useState(true);

  const [isLiked, setIsLiked] = useState(
    post && post.likedBy && post.likedBy.includes(user._id)
  );
  const [isLikedNow, setIsLikedNow] = useState(false);
  const [usersLiked, setUsersLiked] = useState();

  const { addComment, error, isLoading, postRes } = useAddComment()

  useEffect(() => {
    setIsProfile(false);
    setIsExplore(false);
    setIsFeed(false);
    const fetchPost = async () => {
      const response = await fetch(`${API_URL}/api/posts/single/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        setPost(json);
        setIsLiked(json.likedBy && json.likedBy.includes(user._id));
      } else {
        setIsPendingPost(false);
      }
    };

    if (!post) {
      fetchPost();
    }
  }, []);

  useEffect(() => {
    const fetchPostUser = async () => {
      const response = await fetch(`${API_URL}/api/user/${post.user_id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (response.ok) {
        setPostUser(json);
      }
      setIsPendingPost(false);
    };

    if (post && !postUser) {
      if (fetchedUsers && fetchedUsers.some((e) => e._id === post.user_id)) {
        setPostUser(fetchedUsers.find((x) => x._id === post.user_id));
        setIsPendingPost(false);
      } else {
        fetchPostUser();
      }
    }
  }, [post]);

  useEffect(() => {
    const fetchUsersLiked = async () => {
      let array = [];
      let temp = [];

      post.likedBy.forEach((u) => {
        if (fetchedUsers && !fetchedUsers.some((e) => e._id === u)) {
          array.push(u);
        } else if (!fetchedUsers) {
          array.push(u);
        } else if (
          post.likedBy.includes(u) &&
          fetchedUsers.some((e) => e._id === u)
        ) {
          temp.push(fetchedUsers.find((x) => x._id === u));
        }
      });

      if (isLikedNow && !array.includes(user._id)) {
        if (fetchedUsers && fetchedUsers.some((e) => e._id === user._id)) {
          array.push(user._id);
        }
      }

      if (array.length > 0) {
        const response = await fetch(`${API_URL}/api/user/array/${array}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const json = await response.json();

        usersDispatch({ type: "ADD_USERS", payload: json });

        if (response.ok) {
          setUsersLiked(json.concat(temp));
        }
      } else {
        setUsersLiked(temp);
      }
    };

    if (post) {
      fetchUsersLiked();
      fetchUsersCommented()
    }
  }, [post, isLikedNow]);

  const [isEditPost, setIsEditPost] = useState();

  function handleEditPost() {
    setIsEditPost(!isEditPost);
  }

  function changeValues(newTitle, newDescription, newType, newLivelox, newWinsplits, newResults) {
    post.title = newTitle;
    post.description = newDescription;
    post.runType = newType
    post.livelox = newLivelox
    post.winsplits = newWinsplits
    post.results = newResults
  }

  const { addLike } = useAddLike();

  const handleLikeClick = () => {
    setIsLiked(true);
    addLike(post._id, user._id);
    setIsLikedNow(true);
  };

  // date formatting
  const [created, setCreated] = useState()

  useEffect(()=>{
      if(post){
        if (compareAsc(endOfWeek(new Date()),endOfWeek(new Date(post.createdAt)))===0){
            setCreated(formatDistanceToNowStrict(new Date(post.createdAt), { addSuffix: true }))
        } else {
            setCreated(format(new Date(post.createdAt), "LLLL d',' y 'at' H':'mm aaa"))
        }
      }
  },[post])


  // users for comments
  const [usersCommented, setUsersCommented] = useState()

    const fetchUsersCommented = async () => {
        let array = []
        let temp = []

        post.comments.forEach((u)=>{
            if(fetchedUsers && !fetchedUsers.some(e => e._id === u.user_id)) {
                array.push(u.user_id)
            } else if (!fetchedUsers) {
                array.push(u.user_id)
            } else if (post.comments.some((x => x.user_id === u.user_id)) && fetchedUsers.some(e => e._id === u.user_id)){
                temp.push(fetchedUsers.find((x => x._id === u.user_id)))
            }
        })

        array.push(user._id)
        
        if (array.length>0){
            const response = await fetch(`${API_URL}/api/user/array/${array}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            
            const json = await response.json()
    
            let temp2 = Array.isArray(json) ? json : [json]
           
            usersDispatch({ type: 'ADD_USERS', payload: temp2 })
    
            if (response.ok) {
                setUsersCommented(json.concat(temp))
            }  
        } else {
            setUsersCommented(temp)
        }
        
    }

  // comments
  const [formComment, setFormComment] = useState('')

    const handleCommentSubmit = async (e) => {
        e.preventDefault()

        await addComment(post._id, user._id, formComment)
    }

    useEffect(()=>{
        if (postRes && !error){
            setFormComment("")
            post.comments.push(postRes.comments.slice(-1)[0])
        }
    },[postRes])

  return (
    <>
      {isPendingPost && (
        <div className="m-10">
          <LoadingAnim />
        </div>
      )}
      {((!isPendingPost && !post) || (!isPendingPost && !postUser)) && (
        <div className='flex flex-col items-center mt-16'>
          <span className='text-7xl'>404</span>
          <span className='text-4xl'>Post not found</span>
          <Link to="/"><button className='mt-4 shadow bg-fuchsia-500 hover:bg-fuchsia-400 dark:bg-fuchsia-600 dark:hover:bg-fuchsia-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded'>Go back to home!</button></Link>
        </div>
      )}
      {!isPendingPost && post && postUser && (
        <div className="flex flex-col rounded-xl items-center justify-center w-full">
          <div className="flex flex-col md:flex-row justify-around w-full bg-white dark:bg-zinc-800 rounded-lg shadow-lg mt-4 mb-2 max-w-full lg:w-5/6 xl:w-4/5">
            {!isEditPost && (
              // POSTT INFO
              <div className="flex flex-col md:w-1/2 m-8">
                <div className="gap-x-2 w-full items-center">
                  <div className="flex gap-x-2 w-full mb-4">
                    <Link to={`/profile/${postUser._id}`}>
                      <img
                        src={
                          "https://res.cloudinary.com/dcwp4g10w/image/upload/w_150,h_150,c_fill,r_max/" +
                          postUser.profile_picture.url.split("/")[6] +
                          "/" +
                          postUser.profile_picture.url.split("/")[7] +
                          "/" +
                          postUser.profile_picture.url.split("/")[8]
                        }
                        className="rounded-full w-12 hover:opacity-50"
                      ></img>
                    </Link>
                    <div>
                      <Link to={`/profile/${postUser._id}`}>
                        <span className="font-bold text-lg hover:opacity-50">{`${postUser.name} ${postUser.surname}`}</span>
                      </Link>
                      <p className="text-xs">
                        {created}
                      </p>
                    </div>
                    </div>
                  {post.runType && 
                      <div className='mb-2 py-1 px-2 text-white bg-fuchsia-600 dark:bg-fuchsia-700 rounded-lg text-sm font-bold shadow-md w-min'>
                          {post.runType==="race" ? "Race" : "Training"}
                      </div>
                  }
                  <h3
                    className="font-bold text-2xl whitespace-pre-wrap break-words"
                    style={{ wordBreak: "break-word" }}
                  >
                    {post.title}
                  </h3>
                  <p
                    className="whitespace-pre-wrap break-words"
                    style={{ wordBreak: "break-word" }}
                  >
                    {post.description}
                  </p>
                  {/* BUTTONS WITH LINKSS */}
                  <div className="flex mt-4 mb-2 gap-3">
                    {post.livelox &&
                      <a className="px-3 py-1 flex items-center text-white bg-red-500 rounded-md cursor-pointer hover:bg-red-400 font-bold" href={post.livelox} target="_blank">
                        {/* <img className="w-24" src="https://www.livelox.com/Images/livelox-logo-white.png" /> */}
                        Livelox
                      </a>
                    }
                    {post.winsplits &&
                      <a className="px-3 py-1 flex items-center text-white bg-yellow-500 rounded-md cursor-pointer hover:bg-yellow-400 font-bold" href={post.winsplits} target="_blank">
                        Winsplits
                      </a>
                    }
                    {post.results &&
                      <a className="px-3 py-1 flex items-center text-white bg-blue-500 rounded-md cursor-pointer hover:bg-blue-400 font-bold" href={post.results} target="_blank">
                        Results
                      </a>
                    }
                  </div>
                </div>
                {post.user_id === user._id && (
                  <div className="flex">
                    <button
                      onClick={handleEditPost}
                      className="mt-4 shadow bg-fuchsia-500 hover:bg-fuchsia-400 dark:bg-fuchsia-600 dark:hover:bg-fuchsia-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            )}
            {isEditPost && (
              <div className="flex flex-col md:w-1/2 m-8">
                <EditPost
                  post={post}
                  postUser={postUser}
                  handleEditPost={handleEditPost}
                  changeValues={changeValues}
                />
              </div>
            )}
            {/* HEARTS AND COMMENTS */}
            <div className="flex flex-col md:w-1/2 m-8">
              <div className="flex items-center">
                { !isLiked &&
                    <span className="material-symbols-outlined dark:text-white scale-125 p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 cursor-pointer" onClick={ handleLikeClick }>
                        favorite
                    </span>
                    // <img alt="" className="m-2 p-1 rounded-lg hover:bg-gray-200 cursor-pointer text-white" style={{width: "32px"}} onClick={ handleLikeClick } src="data:image/png;base64,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"></img>
                }
                { isLiked &&
                    <span className="material-symbols-outlined filled text-fuchsia-500 dark:text-fuchsia-600 scale-125 p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 cursor-pointer">
                        favorite
                    </span>
                    //<img alt="" className="m-2 p-1 rounded-lg hover:bg-gray-200 cursor-pointer text-white" style={{width: "32px"}} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAFGElEQVR4nO2ba4hVVRTHf+fYvV6qLxo9NaFC7YPVYDMJPSijpgiiQhLpW33pRUTlo/pkQR+UxkcPtfeHQg2KisCgZuxBQYYSRaBRgulojoKQM5UZzvRh3dOse+bce/a+Z51z7wzzhw337L32Xo9z9jp7rbNugB26gcuBKYZrJuEU8APwWc58vPAOMFJwe7sQzRzQTfHKR+2mrMKHWRcArjRYo1l0ZV3AwgBTDdZoGW8LA4xrRAa4CvgG+If0fXcSWFW4pOlYjciWJv8QsA24OJp4PnDMYaJug4rxSs+5lm2lkmPQc+7PQCUEbgemOVg4wkngJQ/6ovAyIpsr5gALQuAC1fkMEKS0qcBTBgJb40lEtjT5N6s5MyadYKsFaDUmDdBqAVqNEPhbXc9DHMVERQWYq67/CoGvVcciYCMT0wgV4ANGY5cTwI4QOQGuV4T3M/GMECl/q+p7HPg9ugiQw40+Kb2Om49ol5NgPZSBj2PzEs8xAbApRriJ9CdhRQsNsDxFtgrwSWzOE40mNGOEa1pogKstlc9ihHUtUH5dHspH8PUJSfR5ttcayOK859Pg+yQk0efRGsmQ+c67KLXIk74o5UEiQjPl6ynV7UlflPIAj2KsfIQAuIt05TW9pRFclAfxC4uBGxzlzBVWjrGRw2t7ZDXCuFY+QrNGmBDKR/A1QmHKu0Z8VwAXISl0gKPAj8AviMCuvDYi0WYjvAI86LHuacBlQAdwNvAvcATYDXzvsc4YnAv0APupf6f2Ac8C0x3XTHs7uHp7kGx2DzDQYL2DwNqqLs4IgGX4fWg4BtzhsX6SEXyUvw/5wuMq3yCwNGn9eEcFeAtYEus/DHwBHEIesVlIFDhL0XwHLHBUIEC2wr1IQcUbjBrFBf3ADHX9K/AtcsfL1bGFyJbQ2IIY70Q9obZSa7mdyOEnySEFwC3ALqRqw/TklYLVwDDwJXBtHZopyFevn6jVaTN1nrTlMcI1uJe7nOlIZwlXnmXkraJ1G3OzzgGOK4IeGxnbCq9S6xPO04M6obGT/Aqd5iIptF7kNTVUbburfSuoTVtbogzsofYJB2Q/HFQDrgGPD7qA7bh57BGgD+jMQY67FY9+qr6gU3UewvYEVgI2IA7L9yg8jJweS4bylIE/FI/5APeoji2GzKYDn+OveLxtx69+IQ3b1NpL4vUB/UZMSsB72MTlC4GPkLtngQPqd271AesRwa1wHXZvJn3YCkIkcIgw04BBF/CAwTpxPIxNTaI+vQ6AOALtBLN+E/Tx9r4ta31wiVon2AHi9Y+oztsyMLiU/JSP2pwM8mmHP4C62c+rgV00/+op4jvhsiZlOx0pjYvWqal1nIkUSkSDa5tk0kv+Bvi0CbkC4E21xp+MJnf+x2MxRmuQbIsPtIXzans8Zaog4bZe45EkwhB4P0a4A7jRg5kOqPJqxx1lCYE7GRsOv0sDR19GKiniTPcie+aMcWCAs5C8YlKqbCsO/i1A4mXtE6L2dMrcdtgCqxLmDAEPkXDnk06CI8ip6xIkTD6qxg6nMN+fMm6B31LG96rf+4DnkIz2BkQ3b4RIOf31DrTxrFIebamDHJ3kl1doiNnkb4AsB6FC0Ed+yrfVX+XqoQPJElsrP0xr/6DlhTzqhV4oVIOMKGG7Fb7CLiFSGKZhExr3YZsSKxQl4EWaS4qeQh5733ikLTGPsbV7ad5+fhGCFV0RPhsJUG4GLmQ0BXeg2nqBD5G6g0kUgf8ANzudgfUCbQcAAAAASUVORK5CYII="></img>
                }
                <span className="font-bold text-sm p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer ml-2">
                  {post.likedBy
                    ? post.likedBy.length + (isLikedNow ? 1 : 0)
                    : "0"}{" "}
                  {post.likedBy && post.likedBy.length + (isLikedNow ? 1 : 0) === 1
                    ? " heart"
                    : " hearts"}
                </span>
              </div>
              <div className="grid grid-cols-6 md:grid-cols-8 gap-4 w-full mt-3 max-w-md max-h-60 overflow-auto">
                {usersLiked &&
                  usersLiked.map((userLiked) => (
                    <div className="" key={userLiked._id}>
                      <Link to={`/profile/${userLiked._id}`}>
                        <img
                          className="cursor-pointer hover:opacity-80 rounded-full w-full"
                          src={
                            "https://res.cloudinary.com/dcwp4g10w/image/upload/w_150,h_150,c_fill,r_max/" +
                            userLiked.profile_picture.url.split("/")[6] +
                            "/" +
                            userLiked.profile_picture.url.split("/")[7] +
                            "/" +
                            userLiked.profile_picture.url.split("/")[8]
                          }
                        ></img>
                      </Link>
                    </div>
                  ))}
              </div>
              <div className="mt-4">
                <div className="bg-gray-200 dark:bg-zinc-700 w-full h-[2px]"></div>
                <div className='my-4 w-max font-bold text-sm p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer'>{post.comments ? post.comments.length : "0"} {post.comments && post.comments.length===1 ? " comment" : " comments"}</div>
                {post.comments.length>0
                    ?
                    <>
                    { usersCommented &&
                        <div className='max-h-72 overflow-auto'>
                            {post.comments.map((comment, i, arr)=>(
                                <div key={comment._id} className='flex flex-col items-center my-3'>
                                    <div className='flex w-full items-center'>
                                        <Link to={`/profile/${comment.user_id}`} className="hover:opacity-75 cursor-pointer">
                                            <img src={"https://res.cloudinary.com/dcwp4g10w/image/upload/w_150,h_150,c_fill,r_max/" + usersCommented.find((x => x._id === comment.user_id)).profile_picture.url.split("/")[6] + "/" + usersCommented.find((x => x._id === comment.user_id)).profile_picture.url.split("/")[7] + "/" + usersCommented.find((x => x._id === comment.user_id)).profile_picture.url.split("/")[8]} className="rounded-full w-10 mr-4" alt={usersCommented.find((x => x._id === comment.user_id)).name+usersCommented.find((x => x._id === comment.user_id)).surname}></img>
                                        </Link>
                                        <div className='flex flex-col items-start w-full'>
                                            <div className='flex justify-between w-full'> 
                                                <Link to={`/profile/${comment.user_id}`} className="hover:opacity-80 cursor-pointer">
                                                    <p className='font-semibold text-sm'>{`${usersCommented.find((x => x._id === comment.user_id)).name} ${usersCommented.find((x => x._id === comment.user_id)).surname}`}</p>
                                                </Link>
                                                <p className='text-sm font-light mr-3'>{formatDistanceToNowStrict(new Date(comment.createdAt), { addSuffix: true })}</p>
                                            </div>
                                            <p className='text-start'>{comment.content}</p>
                                        </div>
                                    </div>
                                    {!(arr.length-1===i) &&
                                        <div className="bg-gray-200 dark:bg-zinc-700 w-full h-[1px] mt-3"></div>
                                    }
                                </div>
                            ))}
                        </div>
                    }
                    { !usersCommented &&
                        <div className='m-2'><LoadingAnim /></div>
                    }
                    </>
                    :
                    <div className="">
                        <span className='font-medium'>No one has commented yet</span>
                    </div>
                }
                <div>
                    <form onSubmit={handleCommentSubmit} className="mt-4">
                        <div className='flex items-center'>
                            <img
                                src={user.url}
                                className="w-8 h-8 object-cover rounded-full"
                            />
                            <input
                                className="shadow appearance-none border border-gray-300 dark:border-zinc-600 rounded w-full p-2 mx-3 bg-white dark:bg-zinc-800 dark:text-white leading-tight focus:outline-none focus:border-fuchsia-500 dark:focus:border-fuchsia-600"
                                type="text"
                                onChange={(e) => setFormComment(e.target.value)}
                                value={formComment}
                                placeholder="Add your comment..."
                            />
                            <button 
                                disabled={ isLoading } 
                                className='shadow bg-fuchsia-500 hover:bg-fuchsia-400 dark:bg-fuchsia-600 dark:hover:bg-fuchsia-500 focus:shadow-outline focus:outline-none text-white font-medium py-1 px-2 rounded'
                            >
                                Post
                            </button>
                        </div>
                        { error && error!=true && <div className="text-center w-full bg-red-200 dark:bg-red-400 border-2 border-red-300 dark:border-red-500 rounded-lg text-red-800 dark:text-white my-2 p-1">{ error } </div>}
                    </form>
                </div>
              </div>
            </div>
            {/* maybe someday comments will be added maybe not who knows <div className="flex flex-col m-8">
              <div>
                <span className="font-bold text-sm p-1 rounded-lg hover:bg-gray-100 cursor-pointer">
                  {post.comments ? post.comments.length : "0"} comments
                </span>
              </div>
            </div> */}
          </div>
          <div className="my-3 flex flex-col items-center">
            <img
              className="rounded-lg object-contain shadow-lg max-w-full lg:w-5/6 xl:w-4/5"
              src={
                "https://res.cloudinary.com/dcwp4g10w/image/upload/" +
                post.image.url.split("/")[6] +
                "/" +
                post.image.url.split("/")[7] +
                "/" +
                post.image.url.split("/")[8]
              }
              alt={`Map ${post.title}`}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Post;
