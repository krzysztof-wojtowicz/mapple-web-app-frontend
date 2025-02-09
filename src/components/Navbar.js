import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState, useEffect, useRef } from "react";

const Navbar = ({
  setIsExplore,
  setIsFeed,
  isFeed,
  isExplore,
  isProfile,
  setIsProfile,
}) => {
  const { user } = useAuthContext();

  return (
    <header className="sticky top-0 w-full z-50">
      <div className="text-lg flex md:px-5 bg-white dark:bg-zinc-800 py-2 shadow-md items-center w-full">
        <Link
          onClick={() => {
            setIsExplore(false);
            setIsFeed(true);
            setIsProfile(false);
          }}
          className="md:basis-1/3 hidden md:block"
          to="/"
        >
          <h1 className="font-bold hover:opacity-80 text-fuchsia-500 dark:text-fuchsia-600">MAPPLE</h1>
        </Link>
        
        <div className="md:basis-1/3 w-full md:w-auto">
          {user && (
            <div className="flex justify-around items-center w-full">
              <Link to="/">
                <button
                  onClick={() => {
                    setIsExplore(false);
                    setIsFeed(true);
                    setIsProfile(false);
                  }}
                  className="flex items-center"
                >
                  <span
                    className={
                      (isFeed
                        ? "text-fuchsia-500 dark:text-fuchsia-600 material-symbols-outlined filled"
                        : "hover:bg-gray-100 dark:hover:bg-zinc-700") +
                      " scale-150 px-3 rounded-lg relative material-symbols-outlined"
                    }
                  >
                    home
                    <div
                      className={
                        isFeed
                          ? "absolute bg-fuchsia-500 dark:bg-fuchsia-600 h-[1.3px] w-10 -bottom-1 left-1"
                          : ""
                      }
                    ></div>
                  </span>
                </button>
              </Link>

              <Link to="/explore">
                <button
                  onClick={() => {
                    setIsExplore(true);
                    setIsFeed(false);
                    setIsProfile(false);
                  }}
                  className="flex items-center"
                >
                  <span
                    className={
                      (isExplore
                        ? "text-fuchsia-500 dark:text-fuchsia-600 material-symbols-outlined filled"
                        : "hover:bg-gray-100 dark:hover:bg-zinc-700") +
                      " scale-150 px-3 rounded-lg material-symbols-outlined relative"
                    }
                  >
                    explore
                    <div
                      className={
                        isExplore
                          ? "absolute bg-fuchsia-500 dark:bg-fuchsia-600 h-[1.3px] w-10 -bottom-1 left-1"
                          : ""
                      }
                    ></div>
                  </span>
                </button>
              </Link>

              <Link to={`/profile/${user._id}`}>
                <button className="flex items-center">
                  <span
                    className={
                      (isProfile
                        ? "text-fuchsia-500 dark:text-fuchsia-600 material-symbols-outlined filled"
                        : "hover:bg-gray-100 dark:hover:bg-zinc-700") +
                      " scale-150 px-3 rounded-lg relative material-symbols-outlined"
                    }
                  >
                    person
                    <div
                      className={
                        isProfile
                          ? "absolute bg-fuchsia-500 dark:bg-fuchsia-600 h-[1.3px] w-10 -bottom-1 left-1"
                          : ""
                      }
                    ></div>
                  </span>
                </button>
              </Link>
              
              <div className="md:hidden"><DropdownOpener /></div>
            </div>
          )}
        </div>
        <div className="md:basis-1/3 hidden md:block">
          <div className="flex justify-end ">
            <DropdownOpener />
          </div>
        </div>
      </div>
    </header>
  );
};

const DropdownOpener = () => {
  const [isDropOpen, setIsDropOpen] = useState(false)
  const [isTemp, setIsTemp] = useState(false)
  const { user } = useAuthContext();
  
  // DARK MODE 
  const mode = JSON.parse(localStorage.getItem('darkMode'))
  const [isDark, setIsDark] = useState()
  var doc = document.getElementById('html')
  
  useEffect(()=>{
    if(mode){
      setIsDark(true)
    } else {
      setIsDark(false)
    }
  },[])

  useEffect(()=>{
    if(isDark) {
      doc.classList.add('dark')
      localStorage.setItem('darkMode', true)
    } else {
      doc.classList.remove('dark')
      localStorage.setItem('darkMode', false)
    }
  },[isDark])

  useEffect(()=>{
    setIsTemp(isDropOpen)
  },[isDropOpen])

  useEffect(()=>{
    if(isTemp!=isDropOpen){
      setIsDropOpen(isTemp)
    }
  },[isTemp])

  return (
    <div>
      {user && (
        <div className="">
          <div onClick={()=>{setIsDropOpen(!isDropOpen)}} className="group flex items-center px-1 mx-2 rounded-lg cursor-pointer hover:text-fuchsia-500 dark:hover:text-fuchsia-600"> 
            <img
              src={user.url}
              className="w-8 h-8 object-cover rounded-full"
            ></img>
            { !isDropOpen && 
              <span className="material-symbols-outlined scale-110">
                expand_more
              </span>
            }
            { isDropOpen &&
              <span className="material-symbols-outlined scale-110 text-fuchsia-500 dark:text-fuchsia-600">
                expand_less
              </span>
            }
          </div>
          
          <Dropdown show={isTemp} onClickOutside={() => {setIsTemp(false)}} isDark={isDark} setIsDark={setIsDark}/>
        </div>
      )}
    </div>
  )
}

const Dropdown = (props) => {
  const ref = useRef(null);
  const { onClickOutside, isDark, setIsDark } = props;
  const { logout } = useLogout();
  const { user } = useAuthContext();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [ onClickOutside ]);

  if(!props.show)
    return null;
  
  return (
    <div className="relative" ref={ref}>
      <div className="absolute bg-white dark:bg-zinc-800 rounded-md shadow-md py-4 px-6 right-1 top-3 w-max">
        <div className="flex flex-col items-start gap-1">
          {/* PROFILE */}
          <Link to={`/profile/${user._id}`} onClick={onClickOutside} className="flex items-center py-1 border-b-2 border-slate-300 dark:border-zinc-600 w-full mb-2 px-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg">
            <img
              src={user.url}
              className={"w-6 h-6 object-cover rounded-full mr-2"}
            ></img>
            Profile
          </Link>

          {/* SEARCH MAPS (page where you can search all maps by title) */}
          <Link 
            className="flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg w-full"
            to="/search"
            onClick={onClickOutside}
          >
            <span className="material-symbols-outlined mr-2 text-fuchsia-500 dark:text-fuchsia-600">
              travel_explore
            </span>
            Search maps
          </Link>
          
          {/* ATHLETES (only on mobile - left col not visible on home so it has its own page) */}
          <Link 
            className="flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg w-full md:hidden"
            to="/athletes"
            onClick={onClickOutside}
          >
            <span className="material-symbols-outlined mr-2 text-fuchsia-500 dark:text-fuchsia-600">
              group
            </span>
            Athletes
          </Link>

          {/* GALLERY (page with all maps represented as gallery!) */}
          <Link 
            className="flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg w-full"
            to="/gallery"
            onClick={onClickOutside}
          >
            <span className="material-symbols-outlined mr-2 text-fuchsia-500 dark:text-fuchsia-600">
              photo_library
            </span>
            Gallery
          </Link>
          
          {/* DARK MODE (later) */}
          <button
            className="flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg w-full"
            onClick={()=>{setIsDark(!isDark)}}
          >
            {/* <span className={"mr-2 text-fuchsia-500 dark:text-fuchsia-600" + (isDark ? " material-symbols-outlined filled" : " material-symbols-outlined")}>
              dark_mode
            </span> */}
            {!isDark && 
              <>
                <span className={"mr-2 text-fuchsia-500 dark:text-fuchsia-600 material-symbols-outlined"}>
                  light_mode
                </span>
                Light mode
              </>
            }
            {isDark &&
              <>
                <span className={"mr-2 text-fuchsia-500 dark:text-fuchsia-600 material-symbols-outlined"}>
                  dark_mode
                </span>
                Dark mode
              </>
            }
          </button>

          {/* LOGOUT */}
          <button
            className="flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg w-full"
            onClick={()=>{logout()}}
          >
            <span className="material-symbols-outlined mr-2 text-fuchsia-500 dark:text-fuchsia-600">
              logout
            </span>
            Log out
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar;
