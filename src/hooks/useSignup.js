import { useState } from "react"
import { useAuthContext } from './useAuthContext'
import { API_URL } from "../App";

export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()

    const signup = async (name, surname, email, password) => {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`${API_URL}/api/user/signup`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ name, surname, email, password })
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
    }

    return { signup, error, isLoading }
}