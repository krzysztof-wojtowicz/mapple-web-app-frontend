import { useEffect, useState } from "react"
import { useLogin } from "../hooks/useLogin"
import { Link } from "react-router-dom"
import { API_URL } from "../App";

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login, error, isLoading } = useLogin()

    const [email2, setEmail2] = useState('')
    const [res, setRes] = useState()

    const handleSubmit = async (e) => {
        e.preventDefault()

        await login(email,password)
    }

    useEffect(()=>{
        if(error==="Please verify your email to login"){
            setEmail2(email)
        }
    },[error])

    const sendMail = async () => {
        const response = await fetch(`${API_URL}/api/user/send/${email2}`)

        setRes(response)
    }

    return (
        <div className="flex justify-center w-screen h-screen bg-no-repeat bg-cover bg-center bg-fixed bg-opacity-10 text-gray-600" style={{backgroundImage: "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('https://res.cloudinary.com/dcwp4g10w/image/upload/v1670408551/assets/mappleBg_uttwzu.jpg')"}}>
            <div className="flex-col md:inline-flex md:flex-row justify-center rounded-xl shadow-2xl my-auto h-fit">
                <div className="flex justify-center">
                    <div className=" bg-blue-200 rounded-t-xl md:rounded-r-none md:rounded-l-xl p-9 w-full md:w-auto flex flex-col h-full">
                        <h1 className="text-6xl font-bold text-fuchsia-600">Mapple</h1>
                        <div className="block text-xl mt-6">Share your orienteering activities with others!</div>
                        <div className="flex items-center mt-10 md:mt-auto">
                            <div className="text-md">Don't have an account?</div>
                            <Link
                                to="/signup"
                                className="font-bold text-fuchsia-500 ml-2"
                                >
                                Signup
                            </Link>
                        </div>  
                    </div>
                </div>
                <div className="">
                    <div className="bg-blue-100 0 rounded-b-xl md:rounded-l-none md:rounded-r-xl p-9 relative w-full md:w-auto h-full">
                    <form className="" onSubmit={handleSubmit}>
                    <h3 className="font-bold text-2xl ">Log in</h3>
                    
                    <label className="block text-l mt-4 mb-1">Email:</label>
                    <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-fuchsia-500"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                    <label className="block text-l mt-2">Password:</label>
                    <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-fuchsia-500"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />

                    <button className="mt-4 w-full shadow border-2 border-fuchsia-600 bg-fuchsia-500 hover:bg-fuchsia-400  hover:border-fuchsia-500 focus:outline-none text-white font-bold py-2 px-4 rounded" disabled={ isLoading }>Log in</button>
                    { error && <div className="text-center bg-red-200 border-2 border-red-400 rounded-lg text-red-800 my-2 mx-6 p-1">{ error }</div>}
                    { (error==="Please verify your email to login"&&!res) && <button onClick={sendMail} type="button" className="w-full text-center font-bold text-fuchsia-500">Send again</button>}
                    { res && <div className="text-center bg-blue-200 border-2 border-blue-400 rounded-lg text-blue-800 my-2 mx-6 p-1">Mail sent again</div>}
                    </form>
                    <hr className="my-3 h-px bg-gray-200 border-0 dark:bg-gray-700"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login