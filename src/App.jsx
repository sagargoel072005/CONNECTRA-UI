import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

// 🔹 Redux Store
import appStore from "./utils/appStore.js";
// 🔹 Main Layout & Pages
import Body from "./components/Body";
import Profile from "./components/profile/Profile.jsx";
import Login from "./components/Login";
import Feed from "./components/Feed";
import LandingPage from "./components/LandingPage";
import Signup from "./components/Signup";
import Chat from "./components/chat/Chat";
import Connections from "./components/Connections";
import TechNews from "./components/TechNews.jsx";
// 🔹 Footer / Legal Pages
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

function App() {
  return (
    // 🔹 Wrap app with Redux Provider
    <Provider store={appStore}>
      <BrowserRouter>
        <Routes>

          {/* 🔹 Public Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 🔹 Footer / Legal Pages */}
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/support" element={<Support />} />
          <Route path="/careers" element={<Careers />} />
          {/* ⚠️ SAME ROUTES (as you requested — not changed) */}
          <Route path="/cancellation-and-refund-policy" element={<Cancellation />} />
          <Route path="/refund-policy" element={<Refund />} />
          <Route path="/shipping-and-delivery-policy" element={<Shipping />} />
          <Route path="/media-centre" element={<MediaCenter />} />
          <Route path="/delivery-policy" element={<DeliveryPolicy />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path='/tech-news' element={<TechNews />} />
          {/* 🔹 Protected / Main Layout */}
          <Route element={<Body />}>
            <Route path="/feed" element={<Feed />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/chat/:targetUserId" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;