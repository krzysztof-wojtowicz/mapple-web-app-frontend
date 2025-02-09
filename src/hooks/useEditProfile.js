import { useState } from "react"
import { useAuthContext } from "./useAuthContext"
import { API_URL } from "../App";

export const useEditProfile = () => {
    const [error, setError] = useState(true)
    const [isLoading, setIsLoading] = useState(null)
    const [updatedUser, setUpdatedUser] = useState(null)
    const { user } = useAuthContext()

    const editProfile = async (id, name, surname, image_url, bio, currentImageId) => {
        setIsLoading(true)
        setError(true) 
        
        if (!name || !surname) {
            setError("Name and surname must have a value!")
        } else {
            const response = await fetch(`${API_URL}/api/user/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ name, surname, image_url, bio, currentImageId })
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
                setUpdatedUser(json)
            }
        }

        setIsLoading(false)
    }

    return { editProfile, error, isLoading, updatedUser}
}