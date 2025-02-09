import { Link } from "react-router-dom";
import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAuthContext } from "../hooks/useAuthContext";
import LoadingAnim from "./LoadingAnim";
import { API_URL } from "../App";

const ShowFullProfile = ({ user, newPicture }) => {
    const profile_picture =
      "https://res.cloudinary.com/dcwp4g10w/image/upload/w_150,h_150,c_fill,r_max/" +
      user.profile_picture.url.split("/")[6] +
      "/" +
      user.profile_picture.url.split("/")[7] +
      "/" +
      user.profile_picture.url.split("/")[8];

    const { user: activeUser } = useAuthContext()
    
    const [usersArray, setUsersArray] = useState([])
    const [modalType, setModalType] = useState()
    let [isOpen, setIsOpen] = useState(false);

    function closeModal() {
        setIsOpen(false);
    }

    useEffect(() => {
      if (usersArray.length>0){
        fetchUsers()
      }
      setUsersForModal()
    },[usersArray])

    function openModal(type) {
        setIsOpen(true);
        if (type==="following"){
            setUsersArray(user.following)
            setModalType("following")
        } else if (type==="followers"){
            setUsersArray(user.followers)
            setModalType("followers")
        }
    }

    const [usersForModal, setUsersForModal] = useState()

    const fetchUsers = async () => {
        const response = await fetch(`${API_URL}/api/user/array/${usersArray}}`, {
            headers: {
                'Authorization': `Bearer ${activeUser.token}`
            }
        })
        
        const json = await response.json()

        if (response.ok) {
            setUsersForModal(json)
        }
    }

    return (
      <div className="">
        <div className="flex flex-col items-center gap-y-4 my-2"> 
          <img
            className="rounded-full w-[150px] h-[150px] object-cover"
            src={(typeof newPicture === 'object' || newPicture===undefined) ? profile_picture : newPicture}
            alt="profile"
          ></img>
          <h3 className="text-3xl font-bold text-center">{`${user.name} ${user.surname}`}</h3>
          <p className="font-light mb-1 mx-2 break-words whitespace-pre-wrap" style={{"wordBreak": "break-word"}}>{user.bio}</p>
          <div className="flex font-bold items-center h-10">
            <div onClick={() => openModal("following")} className="text-center hover:opacity-80 hover:cursor-pointer mx-3">
                <p className="">Following</p>
                <p className="">{ user.following.length }</p>
            </div>
            <div className="bg-gray-200 dark:bg-zinc-600 h-full w-[2px]"></div>
            <div onClick={() => openModal("followers")} className="text-center hover:opacity-80 hover:cursor-pointer mx-3">
                <p className="">Followers</p>
                <p className="">{ user.followers.length }</p>
            </div>
          </div>
        </div>
        {/* MODAL */}
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
              as="div"
              className="relative z-10"
              onClose={closeModal}
          >
              <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
              >
                  <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed top-10 left-0 right-0 overflow-y-auto">
                  <div className="flex min-h-max mt-10  justify-center p-4 text-center">
                      <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0 scale-95"
                          enterTo="opacity-100 scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100 scale-100"
                          leaveTo="opacity-0 scale-95"
                      >
                          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-800 text-gray-600 dark:text-white shadow-xl transition-all">
                              <div className='px-4 py-6'>
                                  { (usersArray.length>0) 
                                      ? <div>
                                          <span className='font-bold'>{modalType==="following" ? "Following" : "Followers"}</span>
                                          <div>
                                              { usersForModal &&
                                                  <div>
                                                      {usersForModal.map((userForModal) => (
                                                          <div className="my-5 flex" key={userForModal._id}>
                                                              <Link to={`/profile/${userForModal._id}`} className="flex w-full items-center p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg">
                                                                  <img src={"https://res.cloudinary.com/dcwp4g10w/image/upload/w_150,h_150,c_fill,r_max/" + userForModal.profile_picture.url.split("/")[6] + "/" + userForModal.profile_picture.url.split("/")[7] + "/" + userForModal.profile_picture.url.split("/")[8]} className="rounded-full w-10 mx-2" alt={userForModal.name+userForModal.surname}></img>
                                                                  <span>{`${userForModal.name} ${userForModal.surname}`}</span>
                                                              </Link>
                                                          </div>
                                                          ))}
                                                  </div>
                                              }
                                              { !usersForModal &&
                                                  <div className="m-10"><LoadingAnim /></div>
                                              }
                                          </div>
                                      </div>
                                      : <div>
                                          <span className='font-bold'>{modalType==="following" ? "Following 0" : "0 followers"}</span>
                                      </div>
                                  }
                              </div>
                          </Dialog.Panel>
                      </Transition.Child>
                  </div>
              </div>
          </Dialog>
      </Transition>
      </div>
    );
  };
  
  export default ShowFullProfile;
