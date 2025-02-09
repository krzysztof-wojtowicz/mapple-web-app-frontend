import { useState } from "react"
import { useAuthContext } from "./useAuthContext"
import { API_URL } from "../App";

export const useDeleteProfile = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { user } = useAuthContext()

    const deleteProfile = async (id) => {
        setIsLoading(true)
        setError(null) 
        
        const response = await fetch(`${API_URL}/api/user/${id}`, {
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

    return { deleteProfile, error, isLoading}
}