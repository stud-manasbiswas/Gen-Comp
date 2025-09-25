import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  useAuth,
} from "@clerk/clerk-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const { isLoaded } = useAuth();

  // Show loading while Clerk initializes
  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/sign-in/*"
            element={
              <SignedOut>
                <SignInPage />
              </SignedOut>
            }
          />
          <Route
            path="/sign-up/*"
            element={
              <SignedOut>
                <SignUpPage />
              </SignedOut>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <SignedIn>
                <Home />
              </SignedIn>
            }
          />

          {/* Catch-all for unauthorized users */}
          <Route
            path="*"
            element={
              <>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
                <SignedIn>
                  <Home />
                </SignedIn>
              </>
            }
          />
        </Routes>

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </Router>
  );
}

export default App;
