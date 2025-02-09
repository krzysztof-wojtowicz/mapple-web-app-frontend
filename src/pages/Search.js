import { useEffect, useState } from "react"
import ShowPostSmall from "../components/ShowPostSmall"
import { useAuthContext } from "../hooks/useAuthContext"
import { API_URL } from "../App";

const Search = ({ setIsFeed, setIsExplore, setIsProfile}) => {
    const { user } = useAuthContext()

    useEffect(()=>{
        setIsFeed(false)
        setIsExplore(false)
        setIsProfile(false)
    },[])

    // SEARCH BAR 

    const [searchPosts, setSearchPosts] = useState([])
    const [searchValue, setSearchValue] = useState("")
    const [searchShow, setSearchShow] = useState(false)
    const [filteredPosts, setFilteredPosts] = useState()

    useEffect(()=>{
        const fetchSearchPosts = async() => {
        const response = await fetch(`${API_URL}/api/posts/0/0`, {
            headers: {
            Authorization: `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if(response.ok) {
            setSearchPosts(json)
        }
        }
        
        fetchSearchPosts()
        
    },[])
    
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
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 my-4 gap-2">
                <div></div>
                {/* SEARCH BAR */}
                <div className="mx-2 md:mx-0">
                    <h2 className="font-bold text-2xl mb-3">Search all maps</h2>
                    <div className="relative md:ml-0">
                        <input 
                            type="text" 
                            id="floating_outlined" 
                            className="block py-2 px-3 focus:ring-0 peer bg-fuchsia-50 dark:bg-zinc-600 hover:cursor-text rounded-xl text-center text-fuchsia-400 dark:text-fuchsia-50 w-full shadow appearance-none leading-tight focus:outline-none border border-fuchsia-50 dark:border-zinc-600 focus:border-fuchsia-400 dark:focus:border-fuchsia-50" 
                            value={searchValue}
                            onChange={handleChange}
                            placeholder=" "
                            autoComplete="off"
                        />
                        <label htmlFor="floating_outlined" className="hover:cursor-text absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] rounded-md bg-fuchsia-50 dark:bg-zinc-600 px-2 peer-focus:px-2 peer-focus:bg-white dark:peer-focus:bg-zinc-600 text-fuchsia-500 dark:text-fuchsia-50 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Search by title</label>
                    </div>
                </div>
                <div></div>
            </div>

            {searchShow &&
                <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-x-2 gap-y-4 md:gap-y-2">
                    {filteredPosts && 
                    filteredPosts.map((filteredPost) => (
                        <div
                        className="w-full h-full"
                        key={filteredPost._id}
                        >
                        <ShowPostSmall post={filteredPost} />
                        </div>
                    ))}
                    {filteredPosts.length===0 &&
                    <div className="py-2 col-span-full text-center">
                        No maps found!
                    </div>
                    }
                </div>
            }
        </div>
    )
}

export default Search