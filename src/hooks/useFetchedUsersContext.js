import { FetchedUsersContext } from '../context/FetchedUsersContext'
import { useContext } from 'react'

export const useFetchedUsersContext = () => {
    const context = useContext(FetchedUsersContext)

     if (!context) {
        throw Error('useFetchedUsersContext must be used inside an PostContextProvider')
     }

    return context
}