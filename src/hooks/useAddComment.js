import { useState } from "react"
import { useAuthContext } from "./useAuthContext"
import { API_URL } from "../App";

export const useAddComment = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const [postRes, setPostRes] = useState()
    const { user } = useAuthContext()

    const addComment = async (id, user_id, content) => {
        setIsLoading(true)
        setError(null) 
        
        if(!content){
            setError('Comment must have content!')
        } else {
            const comment = {
                "user_id":user_id,
                "content":content
            }

            const response = await fetch(`${API_URL}/api/posts/add/comment/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ comment })
            })

            const json = await response.json()

            if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
            console.log(json.error)
            }
            if (response.ok) {
            setIsLoading(false)
            setPostRes(json)
            }  
        }
        setIsLoading(false)
    }

    return { addComment, error, isLoading, postRes }
}