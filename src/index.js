import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { PostContextProvider } from './context/PostContext'
import { FetchedUsersContextProvider } from './context/FetchedUsersContext';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <PostContextProvider>
        <FetchedUsersContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </FetchedUsersContextProvider>
      </PostContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

