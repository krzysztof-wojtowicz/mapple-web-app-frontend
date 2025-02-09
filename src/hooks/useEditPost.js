import { useState } from "react"
import { useAuthContext } from "./useAuthContext"
import { API_URL } from "../App";

export const useEditPost = () => {
    const [error, setError] = useState(true)
    const [isLoading, setIsLoading] = useState(null)
    const { user } = useAuthContext()

    const editPost = async (id, title, description, type, livelox, winsplits, results) => {
        setIsLoading(true)
        setError(true) 
        
        if (!title || !description) {
            setError("Post must have a title and description!")
        } else {
            const response = await fetch(`${API_URL}/api/posts/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ title, description, runType: type, livelox, winsplits, results })
            })
            
            const json = await response.json()

            if (!response.ok) {
                setIsLoading(false)
                setError(json.error)
                console.log(json.error)
            }
            if (response.ok) {
                setIsLoading(false)
                setError(null)
            }
        }

        setIsLoading(false)
    }

    return { editPost, error, isLoading}
}