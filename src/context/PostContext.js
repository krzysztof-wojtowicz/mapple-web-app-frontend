import id from "date-fns/esm/locale/id/index.js"
import { createContext, useReducer } from "react"

export const PostContext = createContext()

export const postReducer = (state, action) => {
    function isIterable(input) {  
        if (input === null || input === undefined) {
          return false
        }
      
        return typeof input[Symbol.iterator] === 'function'
      }
    
    let tempState = []
        if (isIterable(state.posts)){
            tempState=[...state.posts]
        } else if (!state.posts===null && !state.posts === undefined) {
            tempState=state.posts
        }
    
    switch (action.type) {
        case 'SET_POSTS':
            return {
                posts: action.payload
            }
        case 'CREATE_POST':
            if (tempState.length===0){
                return {
                    posts: [action.payload]
                }
            } else {
                return {
                    posts: [action.payload, ...tempState]
                }
            }
        case 'ADD_POSTS':
            let temp = []

            if (Array.isArray(action.payload)){
                action.payload.forEach((post)=>{
                    if(state.posts){
                        if(!state.posts.includes(post)){
                            temp.push(post)
                        }
                    }
                })
                
                return {
                    posts: [...tempState, ...temp]
                }
            } else {
                if(state.posts){
                    if(!state.posts.includes(action.payload)){
                        temp.push(action.payload)
                    }
                    return {
                        posts: [...tempState, ...temp]
                    }
                } else {
                    return {
                        posts: [action.payload]
                    }
                }
            }
        default:
            return state
    }
}

export const PostContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(postReducer, {
        posts: null
    })

    return (
        <PostContext.Provider value={ { ...state, dispatch } }>
            { children }
        </PostContext.Provider>
    )
}
