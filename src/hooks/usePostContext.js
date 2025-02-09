import { PostContext } from '../context/PostContext'
import { useContext } from 'react'

export const usePostContext = () => {
    const context = useContext(PostContext)

     if (!context) {
        throw Error('usePostContext must be used inside an PostContextProvider')
     }

    return context
}