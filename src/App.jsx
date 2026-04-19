import { BrowserRouter, Routes, Route } from "react-router-dom"
import Body from "./components/Body";
import Profile from "./components/profile/Profile";
import Login from "./components/Login";
import Feed from "./components/Feed";
import LandingPage from "./components/LandingPage";
import appStore from './utils/appStore.js'
import { Provider } from "react-redux";
import Signup from "./components/Signup";

function App() {

  return (
   <>
   <Provider store={appStore}>
  <BrowserRouter>
    <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route element={<Body />}>
               <Route path="/feed" element={<Feed />} />
               <Route path="/chat" element={<Chat />} />
              </Route>
            </Routes>
  </BrowserRouter>
  </Provider>
</>
  )
}

export default App;