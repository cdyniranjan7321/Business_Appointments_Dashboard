import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignupPage from './pages/signup'; 
import BusinessSignupScreen from './pages/signup2'; // Import signup2 component
import LogIn from './pages/login';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
              <h1 className="text-4xl font-bold text-gray-800">Welcome to the Home Page</h1>
              <p className="text-lg text-gray-600 mt-4">Create an account first to use Dashboard.</p>
              <Link
                to="/signup"
                className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Go to Signup page
              </Link>
            </div>
          }
        />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup2" element={<BusinessSignupScreen />} /> {/* Add this line */}
        <Route path="/login" element={<LogIn />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Added Dashboard route */}
      </Routes>
    </Router>
  );
}

export default App;
