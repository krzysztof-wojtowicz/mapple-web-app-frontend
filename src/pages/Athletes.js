import { useEffect } from "react"
import LeftColWithFriends from "../components/LeftColWithFriends"

const Athletes = ({ setIsFeed, setIsExplore, setIsProfile }) => {
    useEffect(()=>{
        setIsExplore(false)
        setIsFeed(false)
        setIsProfile(false)
    },[])

    return (
        <div className="flex w-full justify-center">
            <div className="w-full md:w-1/2 lg:w-1/3">
                <LeftColWithFriends />
            </div>
        </div>
    )
}

export default Athletes