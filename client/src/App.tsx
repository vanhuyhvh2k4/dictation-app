import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import VideoDetail from "./pages/VideoDetail";
import WordList from "./pages/WordList";
import Home from "./pages/Home";
import VideoUpload from "./pages/VideoUpload";

function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem("token"));

  return (
    <BrowserRouter>
      <Routes>
        {!auth ? (
          <Route path="/login" element={<Login setAuth={setAuth} />} />
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/videos/:id" element={<VideoDetail />} />
            <Route path="/words" element={<WordList />} />
            <Route path="/upload" element={<VideoUpload />} />
          </>
        )}
        <Route path="*" element={<Navigate to={auth ? "/" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
