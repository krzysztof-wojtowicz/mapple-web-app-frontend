import { useEffect, useState } from "react"
import { useEditProfile } from '../hooks/useEditProfile'
import LoadingAnimButton from './LoadingAnimButton'
import { useFetchedUsersContext } from "../hooks/useFetchedUsersContext"

const EditProfile = ({ user, handleEditProfile, changeName, changeSurname, changeBio, changeImage }) => {
    // profile picture from cloudinary
    const profile_picture =
      "https://res.cloudinary.com/dcwp4g10w/image/upload/w_150,h_150,c_fill,r_max/" +
      user.profile_picture.url.split("/")[6] +
      "/" +
      user.profile_picture.url.split("/")[7] +
      "/" +
      user.profile_picture.url.split("/")[8];
    
    // form fields data
    const [formName, setFormName] = useState(user.name)
    const [formSurname, setFormSurname] = useState(user.surname)
    const [formImage, setFormImage] = useState(user.profile_picture)
    const [formBio, setFormBio] = useState(user.bio ? user.bio : '')

    // edit profile hook
    const { editProfile, error, isLoading, updatedUser } = useEditProfile()
    // fetched users context
    const { fetchedUsers, dispatch: usersDispatch } = useFetchedUsersContext()
    
    // error with image uploaded
    const [errorFile, setErrorFile] = useState(false)

    // handle submit form
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!errorFile) {
            await editProfile(user._id, formName, formSurname, formImage, formBio, user.profile_picture.public_id)
        } 
    }

    // after succesful submission change values on profile page and close form
    useEffect(()=>{
        if (!error) {
            changeName(updatedUser.name)
            changeSurname(updatedUser.surname)
            changeBio(updatedUser.bio)
            changeImage(updatedUser.profile_picture)
            usersDispatch({type:'UPDATE', payload: updatedUser})
            handleEditProfile()
        }
    },[error])

    // handle image and convert it in base 64 to send it to db and cloudinary
    const handleImage = (e) => {
        const file = e.target.files[0]
        if (file && file['type'].split('/')[0] !== 'image') {
            setErrorFile('File has to be an image!')
        } else if (file && file.size/1024/1024 > 10) {
            setErrorFile('Maximum file size is 10MB!')
        } else {
            setErrorFile(null)
            setFileToBase(file)
        }
    }

    const setFileToBase = (file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setFormImage(reader.result)
        }
    }

    return (
        <div className="w-full">
            <form className="flex flex-col items-center" onSubmit={handleSubmit}>
                <label htmlFor="profile_picture" className="w-max cursor-pointer rounded-full relative hover:opacity-60">
                    <img src={formImage.url ? profile_picture : formImage} className="w-[150px] h-[150px] object-cover rounded-full opacity-70 shadow-md"/>
                    <img className="absolute m-auto inset-0 opacity-70 scale-90" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAACB0lEQVRYhcXXu2sVQRQG8F+ugmBjKrtgjAQtIoqCFrERsVAuWFkpFqKFKKig/hdyzbXSIrWGlFqJhYIilloo+AIxPiq1EPFxicXO4mbv7jp7Nzd+cBh25sz5vnNmd2aW/4xVKxB/KybxA9+GzLcEJ/ABi8F6uIXxYROPoJMh/oQn+Jl5Hs86ZzGJI9isenm+4FJoi8jPSkp+GrOBeAzz2IXbaOeDtiVrtBhpewvIr2bGDxUI34BfkuVYn06CtXgTOmdxJziV4TPuBqI0ThdnMj43cRS/c3OfYgrTeJh2TodgjytIy5DPPGs3sDrnuxDGprJBDofOuWUkLxJxLPQtoNVUQAx5VkQb38Pz8XywugLqkOetUxSwjoD0hRuE/Ir+T7+WgCaZl5LHCmiSeaeKPEbAUMljBFwckLyy7OS+xQqcjPTLYgbn/d0tBxawBhMNyUewD6NlE6qWYIt6ZZ/RX/b9Yex6PnhMBSYjfFJcwzn9ZR/NtbUEbIok7+JUAXklYgTE+HQVZ74sweck538ePbzAhUHJWXpWl+Edtkte1B5eBnstuec1QowAeIvLTcmKELsRDQ2pgPT+N6wflTRu3z0zFfA8tLuxbggCDoT2WX4g3bFauIc9eI9Hqm/FdTCBnZIr/za8KnMcw32DnXr/so84WESa37Nb2IGNNbOswlc8sMI/ptH4A/znBSyUDmuUAAAAAElFTkSuQmCC"/>
                </label>
                <input 
                    className="hidden"
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleImage}
                    id="profile_picture"
                />
                <input 
                    className="font-bold text-2xl mt-4 shadow appearance-none border border-gray-300 dark:border-zinc-600 rounded w-full py-2 px-3 bg-white dark:bg-zinc-800 dark:text-white leading-tight focus:outline-none focus:border-fuchsia-500 dark:focus:border-fuchsia-600"
                    type="text"
                    onChange={(e) => setFormName(e.target.value)}
                    value={formName}
                />
                <input 
                    className="font-bold text-2xl mt-4 shadow appearance-none border border-gray-300 dark:border-zinc-600 rounded w-full py-2 px-3 bg-white dark:bg-zinc-800 dark:text-white leading-tight focus:outline-none focus:border-fuchsia-500 dark:focus:border-fuchsia-600"
                    type="text"
                    onChange={(e) => setFormSurname(e.target.value)}
                    value={formSurname}
                />
                <textarea 
                    className="resize-none shadow appearance-none mt-4 border border-gray-300 dark:border-zinc-600 rounded w-full py-2 px-3 bg-white dark:bg-zinc-800 dark:text-white leading-tight focus:outline-none focus:border-fuchsia-500 dark:focus:border-fuchsia-600"
                    rows={5}
                    onChange={(e) => setFormBio(e.target.value)}
                    value={formBio}
                />

                <button disabled={ isLoading } className="mt-4 shadow bg-fuchsia-500 hover:bg-fuchsia-400 dark:bg-fuchsia-600 dark:hover:bg-fuchsia-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">{ isLoading ? (<div className="flex justify-center"><LoadingAnimButton color="fuchsia"/>Loading...</div>) : 'Save' }</button>
                { error && error!=true && <div className="text-center w-full  bg-red-200 dark:bg-red-400 border-2 border-red-300 dark:border-red-500 rounded-lg text-red-800 dark:text-white my-2 p-1">{ error } </div>}
                { errorFile && <div className="text-center w-full  bg-red-200 dark:bg-red-400 border-2 border-red-300 dark:border-red-500 rounded-lg text-red-800 dark:text-white my-2 p-1">{ errorFile }</div>}
            </form>
        </div>
    )
}

export default EditProfile