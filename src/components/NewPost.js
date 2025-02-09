import { useState, useEffect, useRef } from "react";
import { useCreatePost } from "../hooks/useCreatePost";
import Previews from "../components/Previews";
import { Transition } from "@headlessui/react";
import LoadingAnimButton from "./LoadingAnimButton";

const NewPost = ({ closeModal }) => {
  const [formTitle, setFormTitle] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const { createPost, error, isLoading, isSuccess } = useCreatePost();

  const [errorFile, setErrorFile] = useState(null);

  //Sprawdz wysokosc modala
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  const checkHeight = () => {
    setHeight(ref.current.clientHeight);
  };
  //-------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!errorFile) {
      await createPost(formTitle, formImage, formDescription);
    }
  };

  // handle image and convert it in base 64
  const handleImage = (e) => {
    const file = e;
    if (file && file["type"].split("/")[0] !== "image") {
      setErrorFile("File has to be an image!");
    } else if (file && file.size / 1024 / 1024 > 10) {
      setErrorFile("Maximum file size is 10MB!");
    } else {
      setErrorFile(null);
      setFileToBase(file);
    }
  };

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFormImage(reader.result);
    };
  };

  return (
    <div className="">
      <form className="" onSubmit={handleSubmit}>
        {!isSuccess && (
          <div
            ref={ref}
            className="flex flex-col items-start   rounded-lg space-y-2 text-gray-600 dark:text-white"
          >
            <>
              <div className="flex flex-col w-full space-y-2">
                <h3 className="text-3xl font-bold my-1">Create post</h3>
                <div className="bg-gray-200 dark:bg-zinc-700 w-full h-[2px]"></div>
              </div>
              <div className="flex flex-col items-start w-full overflow-auto space-y-1  px-6 pt-1 max-h-[30rem]">
                <label className="font-bold text-xl">Title:</label>
                <input
                  className="bg-white dark:bg-zinc-800 shadow appearance-none border border-gray-300 dark:border-zinc-600 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:border-fuchsia-500 dark:focus:border-fuchsia-500"
                  type="text"
                  onChange={(e) => setFormTitle(e.target.value)}
                  value={formTitle}
                />
                <label className="font-bold text-lg">Description:</label>
                <div className="min-h-max w-full">
                  <textarea 
                      className="bg-white dark:bg-zinc-800 dark:text-white resize-none shadow appearance-none border border-gray-300 dark:border-zinc-600 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:border-fuchsia-500 dark:focus:border-fuchsia-600"
                      onChange={(e) => setFormDescription(e.target.value)}
                      value={formDescription}
                      rows={4}
                  />
                </div>
                <div className="w-full h-max py-3">
                  <Previews
                    handleImage={handleImage}
                    checkHeight={checkHeight}
                    setErrorFile={setErrorFile}
                  />
                </div>
              </div>

              <div className="w-full flex flex-col ">
                <div className="w-full h-[2px] bg-gray-200 dark:bg-zinc-700"></div>
                <div className="flex justify-center py-3">
                  <button
                    className="text-white flex justify-center font-bold w-3/4 bg-fuchsia-500 dark:bg-fuchsia-600 hover:bg-fuchsia-400 dark:hover:bg-fuchsia-500 px-6 py-2 rounded-lg "
                    disabled={isLoading}
                  >
                    {isLoading ? (<div className="flex justify-center"><LoadingAnimButton color="fuchsia"/>Loading...</div>) : 'Add'}
                  </button>
                </div>
              </div>
            </>
          </div>
        )}

        <Transition
          show={isSuccess && (error === null || error === undefined)}
          enter="transition-all duration-1500"
          enterFrom="opacity-0 "
          enterTo="opacity-100 rotate-0"
          afterEnter={() => {
            closeModal();
          }}
        >
          <div
            className="flex justify-center  items-center"
            style={{ height: height + "px" }}
          >
            <div className="wrapper scale-150">
              {" "}
              <svg
                className="checkmark"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
              >
                {" "}
                <circle
                  className="checkmark__circle"
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />{" "}
                <path
                  className="checkmark__check"
                  fill="none"
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                />
              </svg>
            </div>
          </div>
        </Transition>

        {error && <div className="text-center bg-red-200 dark:bg-red-400 border-2 border-red-300 dark:border-red-500 rounded-lg text-red-800 dark:text-white my-2 mx-6 p-1">{error} </div>}
        {errorFile && <div className="text-center bg-red-200 dark:bg-red-400 border-2 border-red-300 dark:border-red-500 rounded-lg text-red-800 dark:text-white my-2 mx-6 p-1">{errorFile}</div>}
      </form>
    </div>
  );
};

export default NewPost;
