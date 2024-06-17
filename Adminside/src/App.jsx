import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Component/Sidebar/Sidebar";
import Services from "./Component/Services/Services";
import Subservice from "./Component/Services/Subservice";
import Career from "./Component/Career/Career";
import Blogs from "./Component/Blogs/Blogs";

import useLoginStore from "./store/useLoginStore";
import Login from "./Component/Login/Login";
import SubServicePopup from "./Component/Popup/SubServicePopUp";

function App() {
  const { isLoggedIn } = useLoginStore();
  return (
    <Router>
      <ToastContainer className="!z-[999999]" />
      <div className="flex w-[100vw] min-h-screen bg-[#F1F1F1] example">
        {isLoggedIn && <Sidebar />}
        <div className="flex-grow">
          <Routes>
            {!isLoggedIn ? (
              <Route path="*" element={<Login />} />
            ) : (
              <>
                <Route path="/" element={<Services />} />
                <Route path="/Subservice" element={<Subservice />} />
                <Route path="/SubServicePopup" element={<SubServicePopup />} />
                <Route path="/Career" element={<Career />} />
                <Route path="/Blogs" element={<Blogs />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
