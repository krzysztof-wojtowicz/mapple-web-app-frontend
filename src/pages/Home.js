import { useState, Fragment, useEffect } from "react";
import NewPost from "../components/NewPost";
import RightColWithUser from "../components/RightColWithUser";
import { Dialog, Transition } from "@headlessui/react";
import LeftColWithFriends from "../components/LeftColWithFriends";
import Explore from "../components/Explore";
import Feed from "../components/Feed";

const Home = ({
  isFeed,
  isExplore,
  setIsFeed,
  setIsExplore,
  setIsProfile,
  page,
}) => {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  useEffect(() => {
    if (page === "feed") {
      setIsFeed(true);
      setIsExplore(false);
      setIsProfile(false);
    } else if (page === "explore") {
      setIsFeed(false);
      setIsExplore(true);
      setIsProfile(false);
    }
  }, []);

  return (
    <div className="flex justify-around dark:bg-zinc-900">
      <div className="md:basis-1/4 hidden md:flex flex-col items-center">
        <div className="fixed w-1/4 h-screen overflow-auto overscroll-contain scrollbar-hide">
          <LeftColWithFriends />
        </div>
      </div>
      <div className="md:basis-1/3 overflow-y-auto w-full">
        <div className="">
          <div className="overflow-hidden w-[90%] fixed md:w-[36%] left-0 right-0 mx-auto z-10">
            {
              <div>
                <div
                  onClick={openModal}
                  className="cursor-pointer bg-fuchsia-100 dark:bg-fuchsia-400 group transition-all rounded-b-xl duration-300 hover:h-16 border-t-gray-100 border-fuchsia-300 dark:border-fuchsia-500 border-2 rounded-bottom-md flex h-10 items-center justify-center hover:border-x-green-400 hover:border-b-green-400 hover:bg-green-200 hover:border-t-green-200 dark:hover:bg-green-400 dark:hover:border-green-500"
                >
                  <div className="">
                    <button className="p-5" onClick={openModal}>
                      <div className="transition-all group-active:scale-50 group-hover:scale-75 scale-50 ease-in-out duration-500 group-hover:rotate-90">
                        <div className="bg-fuchsia-500 dark:bg-fuchsia-50 group-hover:bg-green-500 dark:group-hover:bg-green-50 rounded-lg  w-11 h-1 relative">
                          <div className="bg-fuchsia-500 dark:bg-fuchsia-50 group-hover:bg-green-500 dark:group-hover:bg-green-50 rounded-lg w-1 h-11 absolute -top-5 right-5 group-hover:h-7 group-hover:-rotate-45 group-hover:translate-x-2.5 group-hover:-translate-y-0.5"></div>
                          <div className="bg-fuchsia-500 dark:bg-fuchsia-50 group-hover:bg-green-500 dark:group-hover:bg-green-50 rounded-lg absolute group-hover:w-1 group-hover:h-7 group-hover:rotate-45 group-hover:-top-0.5 group-hover:right-2.5 "></div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
                {/* MODAL CREATE NEW POST */}
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

                    <div className="fixed  top-1 md:top-10 left-0 right-0 overflow-y-auto">
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
                          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-800 shadow-xl transition-all">
                            <NewPost closeModal={closeModal} />
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition>
              </div>
            }
          </div>
        </div>

        {isFeed && <Feed />}
        {isExplore && <Explore />}
      </div>
      <div className="md:basis-1/4 hidden  md:flex flex-col items-center ">
        <div className="fixed w-1/4 h-screen overflow-auto overscroll-contain scrollbar-hide">
          <RightColWithUser openModal={openModal} closeModal={closeModal} />
        </div>
      </div>
    </div>
  );
};

export default Home;
