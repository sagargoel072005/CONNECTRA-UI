import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./utils/appStore.js";
import Body from "./components/Body";
import Profile from "./components/profile/profile.jsx";
import Login from "./components/Login";
import Feed from "./components/Feed";
import Requests from "./components/Requests";
import LandingPage from "./components/LandingPage";
import Signup from "./components/Signup";
import Chat from "./components/chat/Chat.jsx";
import Connections from "./components/Connections";
import TechNews from "./components/TechNews.jsx";
import TermsAndConditions from "./components/footer/TermsAndConditions";
import ContactUs from "./components/footer/ContactUs";
import Cancellation from "./components/footer/Cancellation";
import Shipping from "./components/footer/Shipping";
import Refund from "./components/footer/Refund";
import DeliveryPolicy from "./components/footer/DeliveryPolicy";
import FAQ from "./components/footer/FAQ.jsx";
import Careers from "./components/footer/Careers.jsx";
import Premium from "./components/Premium.jsx";
import UserProfilePage from "./components/UserProfilePage.jsx";
import SubscriptionStatus from "./components/SubscriptionStatus.jsx"
import Discover from "./components/Discover.jsx";
import AIResumeBuilder from "./components/AIResumeBuilder.jsx";

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/cancellation-and-refund-policy" element={<Cancellation />} />
          <Route path="/refund-policy" element={<Refund />} />
          <Route path="/shipping-and-delivery-policy" element={<Shipping />} />
          <Route path="/delivery-policy" element={<DeliveryPolicy />} />

          <Route element={<Body />}>
            <Route path="/requests" element={<Requests />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/profile/:userId" element={<UserProfilePage />} />
            <Route path="/chat/:targetUserId" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/subscription-status" element={<SubscriptionStatus />} />
            <Route path="/tech-news" element={<TechNews />} /> 
          <Route path="/discover" element={<Discover />}/> 
          <Route path="/resume-builder" element={<AIResumeBuilder />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;