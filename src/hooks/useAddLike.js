import { useState } from "react"
import { useAuthContext } from "./useAuthContext"
import { API_URL } from "../App";

export const useAddLike = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { user } = useAuthContext()

    const addLike = async (id, user_id) => {
        setIsLoading(true)
        setError(null) 
        
        const response = await fetch(`${API_URL}/api/posts/add/like/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ likedBy: user_id })
        })
        
        const json = await response.json()

        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
            console.log(json.error)
        }
        if (response.ok) {
            setIsLoading(false)
        }
        
        setIsLoading(false)
    }

    return { addLike, error, isLoading}
}