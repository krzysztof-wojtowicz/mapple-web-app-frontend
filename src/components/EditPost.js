import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { useEditPost } from "../hooks/useEditPost"
import { useDeletePost } from "../hooks/useDeletePost"
import { useNavigate } from "react-router-dom"
import Modal from "./Modal"
import LoadingAnimButton from "./LoadingAnimButton"

const EditPost = ({ post, postUser, handleEditPost, changeValues }) => {
    const navigate = useNavigate()
    
    // form fields data
    const [formTitle, setFormTitle] = useState(post.title)
    const [formDescription, setFormDescription] = useState(post.description)
    const [formType, setFormType] = useState(post.runType ? post.runType : "")
    const [formLivelox, setFormLivelox] = useState(post.livelox ? post.livelox : "")
    const [formWinsplits, setFormWinsplits] = useState(post.winsplits ? post.winsplits : "")
    const [formResults, setFormResults] = useState(post.results ? post.results : "")

    // edit post and delete post hooks
    const { editPost, isLoading, error } = useEditPost()
    const { deletePost, isLoading: isLoadingDelete, error: errorDelete} = useDeletePost()

    // function to handle submit of form and to send data to server using hook
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        await editPost(post._id, formTitle, formDescription, formType, formLivelox, formWinsplits, formResults)
    }

    // after submitting data to server, change post data on page and close form
    useEffect(()=>{
        if(!error) {
            changeValues(formTitle, formDescription, formType, formLivelox, formWinsplits, formResults)
            handleEditPost()
        }
    },[error])

    // deleting post and navigating to page before
    const handleDelete = async (e) => {
        await deletePost(post._id)
        navigate(-1)
    }
    //==============================
    // modal asking "are you sure"

    // modal is open
    let [isOpen, setIsOpen] = useState(false);


    // modal functions
    function closeModal() {
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }

    // template for modal component
    const templateFunction = () => {
        return (
            <div className="">
                <span className="font-bold text-2xl">Are you sure?</span>
                <p className="font-light text-xl mt-4">This will delete this post permanently!</p>
                <div className="flex justify-around mt-3">
                    <button type="button" onClick={()=>{closeModal();handleDelete()}} className="mt-4 shadow bg-red-600 hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">YES</button>
                    <button type="button" onClick={closeModal} className="mt-4 shadow bg-fuchsia-500 hover:bg-fuchsia-400 dark:bg-fuchsia-600 dark:hover:bg-fuchsia-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">NO</button>
                </div>
            </div>
        )
    }
        
    return (
        <div>
            <div className="gap-x-2 items-center">
                <div className='flex gap-x-2'>
                    <Link to={`/profile/${postUser._id}`}>
                        <img
                            src={
                            "https://res.cloudinary.com/dcwp4g10w/image/upload/w_150,h_150,c_fill,r_max/" +
                            postUser.profile_picture.url.split("/")[6] +
                            "/" +
                            postUser.profile_picture.url.split("/")[7] +
                            "/" +
                            postUser.profile_picture.url.split("/")[8]
                            }
                            className="rounded-full w-12 hover:opacity-50"
                        ></img>
                    </Link>
                    <div>
                        <Link to={`/profile/${postUser._id}`}>
                            <span className='font-bold text-lg hover:opacity-50'>{`${postUser.name} ${postUser.surname}`}</span>
                        </Link>
                        <p className='text-xs'>{formatDistanceToNowStrict(new Date(post.createdAt), { addSuffix: true })}</p>
                    </div>
                </div>
                {/* form : */}
                    <form className="edit-post" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-y-1 items-start w-full overflow-auto space-y-1 max-h-[30rem]">
                            <input 
                                className="bg-white dark:bg-zinc-800 dark:text-white font-bold text-2xl mt-4 shadow appearance-none border border-gray-300 dark:border-zinc-600 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:border-fuchsia-500 dark:focus:border-fuchsia-600"
                                type="text"
                                onChange={(e) => setFormTitle(e.target.value)}
                                value={formTitle}
                            />
                            <textarea 
                                className="bg-white dark:bg-zinc-800 dark:text-white resize-none shadow appearance-none border border-gray-300 dark:border-zinc-600 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:border-fuchsia-500 dark:focus:border-fuchsia-600"
                                onChange={(e) => setFormDescription(e.target.value)}
                                value={formDescription}
                                rows={5}
                            />
                            {/* TYPE */}
                            <select onChange={(e) => setFormType(e.target.value)} value={formType} id="type" className="bg-white border border-gray-300 text-sm rounded shadow focus:outline-none focus:border-fuchsia-500 block w-full py-2 px-3 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:border-fuchsia-600">
                                <option value="">Choose a type</option>
                                <option value="race">Race</option>
                                <option value="training">Training</option>
                            </select>
                            {/* LINKS TO */}
                            <div className="w-full">
                                <div className="relative w-full mt-4">
                                    <input 
                                        className="peer bg-white dark:bg-zinc-800 dark:text-white shadow text-sm font-light appearance-none border border-gray-300 dark:border-zinc-600 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:border-fuchsia-500 dark:focus:border-fuchsia-600"
                                        type="text"
                                        onChange={(e) => setFormLivelox(e.target.value)}
                                        value={formLivelox}
                                    />
                                    <label htmlFor="" className="absolute -top-2.5 left-1 px-2 bg-white dark:bg-zinc-800 text-sm scale-90 rounded-md peer-focus:text-fuchsia-500 dark:peer-focus:text-fuchsia-600">Livelox:</label>
                                </div>
                                <div className="relative w-full mt-4">
                                    <input 
                                        className="peer bg-white dark:bg-zinc-800 dark:text-white shadow text-sm font-light appearance-none border border-gray-300 dark:border-zinc-600 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:border-fuchsia-500 dark:focus:border-fuchsia-600"
                                        type="text"
                                        onChange={(e) => setFormWinsplits(e.target.value)}
                                        value={formWinsplits}
                                    />
                                    <label htmlFor="" className="absolute -top-2.5 left-1 px-2 bg-white dark:bg-zinc-800 text-sm scale-90 rounded-md peer-focus:text-fuchsia-500 dark:peer-focus:text-fuchsia-600">Winsplits:</label>
                                </div>
                                <div className="relative w-full mt-4">
                                    <input 
                                        className="peer bg-white dark:bg-zinc-800 dark:text-white shadow text-sm font-light appearance-none border border-gray-300 dark:border-zinc-600 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:border-fuchsia-500 dark:focus:border-fuchsia-600"
                                        type="text"
                                        onChange={(e) => setFormResults(e.target.value)}
                                        value={formResults}
                                        id="results"
                                    />
                                    <label htmlFor="results" className="absolute -top-2.5 left-1 px-2 bg-white dark:bg-zinc-800 text-sm scale-90 rounded-md peer-focus:text-fuchsia-500 dark:peer-focus:text-fuchsia-600">Results:</label>
                                </div>
                            </div>

                            <div className="flex justify-around w-full">
                                <button disabled={ isLoading } className="mt-4 shadow bg-fuchsia-500 hover:bg-fuchsia-400 dark:bg-fuchsia-600 dark:hover:bg-fuchsia-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">{ isLoading ? (<div className="flex justify-center"><LoadingAnimButton color="fuchsia"/>Loading...</div>) : 'Save' }</button>
                                <button disabled={ isLoadingDelete } onClick={openModal} type="button" className="mt-4 shadow bg-red-600 hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">{ isLoadingDelete ? (<div className="flex justify-center"><LoadingAnimButton color="red"/>Loading...</div>) : 'Delete' }</button>
                            </div>
                            { error && error!=true && <div className="text-center w-full bg-red-200 dark:bg-red-400 border-2 border-red-300 dark:border-red-500 rounded-lg text-red-800 dark:text-white my-2 p-1">{ error } </div>}
                        </div>
                    </form>
                <Modal templateFunction={templateFunction} isOpen={isOpen} closeModal={closeModal} />
            </div>
        </div>
    )
}

export default EditPost