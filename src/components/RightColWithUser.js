import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";
import ShowProfile from "./ShowProfile";
import { useFetchedUsersContext } from "../hooks/useFetchedUsersContext";
import LoadingAnim from "./LoadingAnim";
import { API_URL } from "../App";

const RightColWithUser = () => {
  const { user } = useAuthContext();
  const { fetchedUsers, dispatch: usersDispatch } = useFetchedUsersContext();

  const [userPosts, setUserPosts] = useState();
  const [blank, setBlank] = useState();
  const [userProfile, setUserProfile] = useState();

  const [isPendingUserPosts, setIsPendingUserPosts] = useState(true);
  const [isPendingUserProfile, setIsPendingUserProfile] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      // const fetchUserProfile = async () => {
      //   const response = await fetch(`/api/user/${user._id}`, {
      //     headers: {
      //       Authorization: `Bearer ${user.token}`,
      //     },
      //   });
      //   const json = await response.json();

      //   if (response.ok) {
      //     setUserProfile(json);
      //   }

      //   setIsPendingUserProfile(false);
      // };
      const fetchUserPosts = async () => {
        const response = await fetch(`${API_URL}/api/posts/${user._id}/15/0`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const json = await response.json();

        if (response.ok) {
          setUserPosts(json);
        }

        setIsPendingUserPosts(false);
      };

      if (fetchedUsers && fetchedUsers.some((e) => e._id === user._id)) {
        setUserProfile(fetchedUsers.find((x) => x._id === user._id));
        setIsPendingUserProfile(false);
      }
      if (!userPosts) {
        await fetchUserPosts();
      }
    };

    fetchAll();
  }, [fetchedUsers]);
  let blanks = [];
  useEffect(() => {
    if (userPosts) {
      for (let i = 0; i < 9 - userPosts.length; i++) {
        blanks.push(i);
      }
      setBlank(blanks);
    }
  }, [userPosts]);

  return (
    <div className="w-full flex flex-col mb-5">
      {!isPendingUserProfile && !isPendingUserPosts && (
        <>
          <ShowProfile user={userProfile} />
          <div className="mb-10 p-5  bg-white dark:bg-zinc-800 rounded-lg shadow-lg">
            <h3 className="mb-3 text-xl font-bold">Your recent maps</h3>
            {userPosts.length >= 9 && (
              <div className="grid gap-1 grid-cols-3 rounded-xl overflow-hidden">
                {userPosts.map((post) => (
                  <div className="" key={post._id}>
                    <Link to={`/post/${post._id}`}>
                      <img
                        className="cursor-pointer hover:brightness-75 aspect-square object-cover w-full"
                        src={
                          "https://res.cloudinary.com/dcwp4g10w/image/upload/w_500,h_500,c_limit/" +
                          post.image.url.split("/")[6] +
                          "/" +
                          post.image.url.split("/")[7] +
                          "/" +
                          post.image.url.split("/")[8]
                        }
                      ></img>
                    </Link>
                  </div>
                ))}
              </div>
            )}
            {userPosts.length > 0 && userPosts.length < 9 && (
              <div className="grid gap-1 grid-cols-3 rounded-3xl overflow-hidden">
                {userPosts.map((post) => (
                  <div className="" key={post._id}>
                    <Link to={`/post/${post._id}`}>
                      <img
                        className="cursor-pointer hover:brightness-75 aspect-square object-cover w-full"
                        src={
                          "https://res.cloudinary.com/dcwp4g10w/image/upload/w_500,h_500,c_limit/" +
                          post.image.url.split("/")[6] +
                          "/" +
                          post.image.url.split("/")[7] +
                          "/" +
                          post.image.url.split("/")[8]
                        }
                      ></img>
                    </Link>
                  </div>
                ))}
                {blank &&
                  blank.map((blank) => (
                    <div
                      className="cursor-pointer bg-gray-100 dark:bg-zinc-700 hover:brightness-90 aspect-square object-cover w-full"
                      key={blank}
                    ></div>
                  ))}
              </div>
            )}
            {!userPosts.length > 0 && (
              <div className="bg-white dark:bg-zinc-800 rounded-lg p-3">
                You do not have any maps yet, share some!
              </div>
            )}
          </div>
        </>
      )}
      {(isPendingUserProfile || isPendingUserPosts) && (
        <div className="m-10">
          <LoadingAnim />
        </div>
      )}
    </div>
  );
};

export default RightColWithUser;
