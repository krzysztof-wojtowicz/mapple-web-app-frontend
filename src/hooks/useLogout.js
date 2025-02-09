import { useAuthContext } from './useAuthContext'
import { usePostContext } from './usePostContext'

export const useLogout = () => {
    const { dispatch } = useAuthContext()
    const { dispatch: postDispatch } = usePostContext()

    const logout = () => {
        // remove user from storage
        localStorage.removeItem('user')

        // dispatch logout action
        dispatch({ type: 'LOGOUT' })
        postDispatch({ type: 'SET_POSTS', payload: null})
    }

    return { logout }
} 