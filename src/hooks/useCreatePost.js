import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { usePostContext } from "./usePostContext";
import { API_URL } from "../App";

export const useCreatePost = () => {
  const { dispatch } = usePostContext();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();
  const [isSuccess, setIsSuccess] = useState(false);

  const createPost = async (title, image, description) => {
    setIsLoading(true);

    if (!title || !image || !description) {
      setError("All fields must have a value!");
    } else {
      const response = await fetch(`${API_URL}/api/posts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          title,
          description,
          image: image,
          user_id: user._id,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(json.error);
        console.log(json.error);
      }
      if (response.ok) {
        setError(null);
        setIsLoading(false);
        dispatch({ type: "CREATE_POST", payload: json });
        console.log(error);
        setIsSuccess(true);
      }
    }

    setIsLoading(false);
  };

  return { createPost, error, isLoading, isSuccess };
};
