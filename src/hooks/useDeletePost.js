import { useState } from "react"
import { useAuthContext } from "./useAuthContext"
import { API_URL } from "../App";

export const useDeletePost = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { user } = useAuthContext()

    const deletePost = async (id) => {
        setIsLoading(true)
        setError(null) 
        
        const response = await fetch(`${API_URL}/api/posts/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
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

    return { deletePost, error, isLoading}
}