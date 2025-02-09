import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState } from "react";

// pages & components
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Notfound from "./pages/Notfound";
import Post from "./pages/Post";
import { useAuthContext } from "./hooks/useAuthContext";
import Athletes from "./pages/Athletes";
import Gallery from "./pages/Gallery";
import Search from "./pages/Search";

function App() {
  const { user } = useAuthContext();
  const [isExplore, setIsExplore] = useState(false);
  const [isFeed, setIsFeed] = useState(false);
  const [isProfile, setIsProfile] = useState(false);
  const location = useLocation();

  if (user === undefined) {
    return null; // loading indicator later
  }

  return (
    <div className="text-gray-600 dark:text-white font-body ">
      {/* <BrowserRouter> */}
      {location.pathname != "/login" && location.pathname != "/signup" && (
        <Navbar
          setIsExplore={setIsExplore}
          setIsFeed={setIsFeed}
          isFeed={isFeed}
          isExplore={isExplore}
          isProfile={isProfile}
          setIsProfile={setIsProfile}
        />
      )}
      <div className="pages">
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Home
                  isFeed={isFeed}
                  isExplore={isExplore}
                  setIsFeed={setIsFeed}
                  setIsExplore={setIsExplore}
                  setIsProfile={setIsProfile}
                  page={"feed"}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
            exact
          />
          <Route
            path="/feed"
            element={
              user ? (
                <Home
                  isFeed={isFeed}
                  isExplore={isExplore}
                  setIsFeed={setIsFeed}
                  setIsExplore={setIsExplore}
                  setIsProfile={setIsProfile}
                  page={"feed"}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
            exact
          />
          <Route
            path="/explore"
            element={
              user ? (
                <Home
                  isFeed={isFeed}
                  isExplore={isExplore}
                  setIsFeed={setIsFeed}
                  setIsExplore={setIsExplore}
                  setIsProfile={setIsProfile}
                  page={"explore"}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
            exact
          />
          <Route
            path="/athletes"
            element={
              user ? (
                <Athletes
                  setIsFeed={setIsFeed}
                  setIsExplore={setIsExplore}
                  setIsProfile={setIsProfile}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
            exact
          />
          <Route
            path="/search"
            element={
              user ? (
                <Search
                  setIsFeed={setIsFeed}
                  setIsExplore={setIsExplore}
                  setIsProfile={setIsProfile}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
            exact
          />
          <Route
            path="/gallery"
            element={
              user ? (
                <Gallery
                  setIsFeed={setIsFeed}
                  setIsExplore={setIsExplore}
                  setIsProfile={setIsProfile}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
            exact
          />
          <Route
            path="/profile/:id"
            element={
              user ? (
                <Profile
                  setIsExplore={setIsExplore}
                  setIsFeed={setIsFeed}
                  isFeed={isFeed}
                  isExplore={isExplore}
                  isProfile={isProfile}
                  setIsProfile={setIsProfile}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/post/:id"
            element={
              user ? (
                <Post
                  setIsExplore={setIsExplore}
                  setIsFeed={setIsFeed}
                  isFeed={isFeed}
                  isExplore={isExplore}
                  isProfile={isProfile}
                  setIsProfile={setIsProfile}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/" />}
          />
          <Route
            path="/notfound"
            element={
              <Notfound
                setIsFeed={setIsFeed}
                setIsExplore={setIsExplore}
                setIsProfile={setIsProfile}
              />
            }
          />
          <Route path="*" element={<Navigate to="/notfound" />} />
        </Routes>
      </div>
      {/* </BrowserRouter> */}
    </div>
  );
}

export default App;
export const API_URL = "https://mapple-backend.vercel.app";
