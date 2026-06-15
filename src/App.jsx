
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./utils/appStore.js";
import Body from "./components/Body";
import Profile from "./components/profile/Profile.jsx";
import Login from "./components/Login";
import Feed from "./components/Feed";
import Requests from "./components/Requests";
import LandingPage from "./components/LandingPage";
import Signup from "./components/Signup";
import Chat from "./components/chat/Chat.jsx";
import Connections from "./components/Connections";
import TechNews from "./components/TechNews.jsx";
import TermsAndConditions from "./components/footer/TermsAndConditions";
import PrivacyPolicy from "./components/footer/PrivacyPolicy";
import ContactUs from "./components/footer/ContactUs";
import Cancellation from "./components/footer/Cancellation";
import Shipping from "./components/footer/Shipping";
import MediaCenter from "./components/footer/MediaCenter";
import Refund from "./components/footer/Refund";
import DeliveryPolicy from "./components/footer/DeliveryPolicy";
import AboutUs from "./components/footer/AboutUs";
import FAQ from "./components/footer/FAQ.jsx";
import Support from "./components/footer/Support.jsx";
import Careers from "./components/footer/Careers.jsx";
import Premium from "./components/Premium.jsx";
import UserProfilePage from "./components/UserProfilePage.jsx";
import SubscriptionStatus from "./components/SubscriptionStatus.jsx"

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/support" element={<Support />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/cancellation-and-refund-policy" element={<Cancellation />} />
          <Route path="/refund-policy" element={<Refund />} />
          <Route path="/shipping-and-delivery-policy" element={<Shipping />} />
          <Route path="/media-centre" element={<MediaCenter />} />
          <Route path="/delivery-policy" element={<DeliveryPolicy />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path='/tech-news' element={<TechNews />} />
          <Route element={<Body />}>
          <Route path="/requests" element={<Requests />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/connections" element={<Connections />} />
              <Route path="/profile/:userId" element={<UserProfilePage />} />
            <Route path="/chat/:targetUserId" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/premium" element={<Premium />} />
            <Route
 path="/subscription-status"
 element={<SubscriptionStatus />}
/>
          </Route>

        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;