import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useEditPost } from '../hooks/useEditPost'

const Notfound = (props) => {
    const { setIsFeed, setIsExplore, setIsProfile } = props

    useEffect(()=>{
        setIsExplore(false)
        setIsFeed(false)
        setIsProfile(false)
    },[])

    return (
        <div className='flex flex-col items-center mt-16'>
            <span className='text-7xl'>404</span>
            <span className='text-4xl'>Page not found</span>
            <Link to="/"><button className='mt-4 shadow bg-fuchsia-500 hover:bg-fuchsia-400 dark:bg-fuchsia-600 dark:hover:bg-fuchsia-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded'>Go back to home!</button></Link>
        </div>
    )
}

export default Notfound