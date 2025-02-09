import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuthContext } from "../hooks/useAuthContext"
import LoadingAnim from "../components/LoadingAnim"
import { API_URL } from "../App";

const Gallery = ({ setIsFeed, setIsExplore, setIsProfile }) => {
    
    const { user } = useAuthContext()
    const [userPosts, setUserPosts] = useState()
    const [isPendingUserPosts, setIsPendingUserPosts] = useState(true)
    
    useEffect(()=>{
        setIsFeed(false)
        setIsExplore(false)
        setIsProfile(false)

        const fetchUserPosts = async () => {
            const response = await fetch(`${API_URL}/api/posts/${user._id}/0/0`, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            });
            const json = await response.json();
    
            if (response.ok) {
              setUserPosts(json);
            }
    
            setIsPendingUserPosts(false);
        };

        fetchUserPosts()
    },[])

    return (
        <div className="w-full">
            { (userPosts && userPosts.length>0) && 
                <div className="mx-5 md:mx-12 lg:mx-20">
                    <div className="text-2xl font-bold my-5">Your gallery</div>
                    <div className="grid gap-1 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 rounded-xl overflow-hidden mb-6">
                    { userPosts.map((post) => (
                        <div className="" key={post._id}>
                        <Link to={`/post/${post._id}`}>
                            <img
                            className="cursor-pointer hover:brightness-75 aspect-square object-cover w-full"
                            src={
                                "https://res.cloudinary.com/dcwp4g10w/image/upload/w_500,h_500,c_limit/" +
                                post.image.url.split("/")[6] +
                                "/" +
                                post.image.url.split("/")[7] +
                                "/" +
                                post.image.url.split("/")[8]
                            }
                            ></img>
                        </Link>
                        </div>
                    ))}
                    </div>
                </div>
            }
            { (!userPosts || userPosts.length===0) && !isPendingUserPosts && 
                <div className="justify-center w-full text-center items-center flex flex-col">
                    <div className="text-2xl font-bold mt-6 w-full">You don't have any maps!</div>
                    <div className="text-xl my-3">Add some on home page</div>
                    <Link to="/"><button className='mt-3 shadow bg-fuchsia-500 hover:bg-fuchsia-400 dark:bg-fuchsia-600 dark:hover:bg-fuchsia-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded'>Go back to home</button></Link>
                </div>
            }
            { (!userPosts || userPosts.length===0) && isPendingUserPosts && 
                <div className="mt-10 justify-center w-full text-center items-center flex flex-col">
                    <LoadingAnim />
                </div>
            }
        </div>
    )
}

export default Gallery