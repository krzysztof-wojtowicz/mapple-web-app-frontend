import { useEffect, useState } from "react"
import { useSignup } from "../hooks/useSignup"
import { Link } from "react-router-dom"

const Signup = () => {
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { signup, error, isLoading } = useSignup()
    const [isSigned, setIsSigned] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        await signup(name, surname, email, password)

        setIsSigned(true)
    }

    return (
        <div className="flex justify-center w-screen h-screen bg-no-repeat bg-cover bg-center bg-fixed bg-opacity-10 text-gray-600" style={{backgroundImage: "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('https://res.cloudinary.com/dcwp4g10w/image/upload/v1670408551/assets/mappleBg_uttwzu.jpg')"}}>
            <div className="flex-col md:inline-flex md:flex-row justify-center rounded-xl shadow-xl my-auto h-fit">
                <div className="flex justify-center">
                    <div className=" bg-blue-200 rounded-t-xl md:rounded-r-none md:rounded-l-xl p-9 w-full md:w-auto flex flex-col">
                        <h1 className="text-6xl font-bold text-fuchsia-600">Mapple</h1>
                        <div className="block text-xl mt-6">Share your orienteering activities with others!</div>
                        <div className="flex items-center mt-10 md:mt-auto">
                            <div className="text-md">Already have an account?</div>
                            <Link
                                to="/login"
                                className="font-bold text-fuchsia-500 ml-2"
                                >
                                Login
                            </Link>
                        </div>  
                    </div>
                </div>
                <div className="">
                    <div className="bg-blue-100 0 rounded-b-xl md:rounded-l-none md:rounded-r-xl p-9 relative w-full md:w-auto">
                        <form className="signup" onSubmit={handleSubmit}>
                            <h3 className="font-bold text-2xl mb-4">Sign up</h3>
                            
                            <label className="block">Name:</label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-fuchsia-500"
                                type="text"
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                            />
                            <label className="block mt-2">Surname:</label>
                            <input 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-fuchsia-500"
                                type="text"
                                onChange={(e) => setSurname(e.target.value)}
                                value={surname}
                            />
                            <label className="block mt-2">Email:</label>
                            <input 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-fuchsia-500"
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                            <label className="block mt-2">Password:</label>
                            <input 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-fuchsia-500"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />

                            <button className="mt-4 w-full shadow border-2 border-fuchsia-600 bg-fuchsia-500 hover:bg-fuchsia-400  hover:border-fuchsia-500 focus:outline-none text-white font-bold py-2 px-4 rounded" disabled={ isLoading }>Sign up</button>
                            { error && <div className="text-center bg-red-200 border-2 border-red-400 rounded-lg text-red-800 my-2 mx-6 p-1">{ error} </div>}
                            { (isSigned && !error && !isLoading) && <div className="text-center bg-blue-200 border-2 border-blue-400 rounded-lg text-blue-800 my-2 mx-6 p-1">Please check your email to verify it</div>}
                        </form>
                    <hr className="my-3 h-px bg-gray-200 border-0 dark:bg-gray-700"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup