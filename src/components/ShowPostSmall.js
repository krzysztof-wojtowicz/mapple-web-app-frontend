// date-fns
import { endOfWeek, format, formatDistanceToNowStrict } from 'date-fns'
import { compareAsc } from 'date-fns/esm'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const ShowPostSmall = ({post}) => {
    const map_image = "https://res.cloudinary.com/dcwp4g10w/image/upload/w_500,h_500,c_limit/"+post.image.url.split("/")[6]+"/"+post.image.url.split("/")[7]+"/"+post.image.url.split("/")[8]

    // date formatting
    const [created, setCreated] = useState()

    useEffect(()=>{
        if (compareAsc(endOfWeek(new Date()),endOfWeek(new Date(post.createdAt)))===0){
            setCreated(formatDistanceToNowStrict(new Date(post.createdAt), { addSuffix: true }))
        } else {
            setCreated(format(new Date(post.createdAt), "LLLL d',' y 'at' H':'mm aaa"))
        }
    },[])

    return (
        <Link to={`/post/${post._id}`} className="w-full h-full">
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-3 hover:scale-[99%] hover:opacity-80 cursor-pointer w-full h-full">
                <div className="flex justify-start w-full items-center h-full">
                    <img src={map_image} className="aspect-square object-cover w-1/3"></img>
                    <div className="ml-4 flex flex-col">
                        <h2 className='text-xl font-bold mb-1 whitespace-pre-wrap break-words' style={{"wordBreak": "break-word"}}>{post.title}</h2>
                        <p className='font-light text-sm whitespace-pre-wrap break-words' style={{"wordBreak": "break-word"}}>{created}</p>
                    </div>
                </div>       
            </div>
        </Link>
    )
}

export default ShowPostSmall