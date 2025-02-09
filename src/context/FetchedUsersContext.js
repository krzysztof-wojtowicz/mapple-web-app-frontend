import { createContext, useEffect, useReducer } from "react"
import { useAuthContext } from "../hooks/useAuthContext"
import { API_URL } from "../App";

export const FetchedUsersContext = createContext()

export const fetchedUsersReducer = (state, action) => {
    switch (action.type) {
        case 'RESET':   
            if(state.fetchedUsers && (!state.fetchedUsers.some(e => e._id === action.payload._id))){
                return {
                    fetchedUsers: [state.fetchedUsers.find((x => x._id === action.payload._id))]
                }
            }
        case 'ADD_USER':
            if(state.fetchedUsers && (!state.fetchedUsers.some(e => e._id === action.payload._id))){
                return {
                    fetchedUsers: [action.payload, ...state.fetchedUsers]
                }
            } else if (!state.fetchedUsers){
                return {
                    fetchedUsers: [action.payload]
                }
            }
        
        case 'ADD_USERS':
            if (state.fetchedUsers) {
                let temp = []

                if (Array.isArray(action.payload)) {
                    action.payload.forEach((user)=>{
                        if (!state.fetchedUsers.some(e => e._id === user._id)){
                            temp.push(user)
                        }
                    })
                } else {
                    if (!state.fetchedUsers.some(e => e._id === action.payload._id)){
                        temp.push(action.payload)
                    }
                }

                return {
                    fetchedUsers: state.fetchedUsers.concat(temp)
                }
            } else {
                return {
                    fetchedUsers: action.payload
                }
            }
        case 'UPDATE':
            if (state.fetchedUsers){
                let temp = state.fetchedUsers
                let i = temp.indexOf(temp.find(e => e._id === action.payload._id))
                
                if (i!=-1) {
                    temp[i] = action.payload
                    
                    return {
                        fetchedUsers: [ ...temp ]
                    }
                } 
            }
        default:
            return state
    }
}

export const FetchedUsersContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(fetchedUsersReducer, {
        fetchedUsers: null
    })

    const { user: userAuth } = useAuthContext()

    useEffect(()=>{
        const fetchUser = async () => {
            const response = await fetch(`${API_URL}/api/user/${userAuth._id}`, {
                headers: {
                    'Authorization': `Bearer ${userAuth.token}`
                }
            })
            const json = await response.json()
    
            if (response.ok) {
                dispatch({type: 'ADD_USER', payload: json})
            }
        }

        if (userAuth) {
            fetchUser()
        }
    },[userAuth])

    return (
        <FetchedUsersContext.Provider value={ { ...state, dispatch } }>
            { children }
        </FetchedUsersContext.Provider>
    )
}
