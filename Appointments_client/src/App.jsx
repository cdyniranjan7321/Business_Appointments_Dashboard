
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignupPage from './pages/signup'; 
import BusinessSignupScreen from './pages/signup2'; // Import signup2 component
import LogIn from './pages/login';
import Dashboard from './pages/Dashboard';
import Apps from './pages/Apps'; // Import the Apps page
import './App.css';
import Orders from './pages/Orders';
import ProductPage from './pages/ProductPage';
import CustomerPage from './pages/CustomerPage'
import DiscountPage from './pages/DiscountPage';



function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex flex-col items-center justify-center h-screen">
             {/* Card Container with Hover Animation */}
             <div className="bg-green-200 p-8 rounded-lg shadow-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <h1 className="text-4xl font-bold text-gray-800">Welcome to the Business Appointments<br/> Home Page</h1>
                <p className="text-lg text-gray-600 mt-4">
                  Create an account first to use your own Dashboard.
                </p>
                <Link
                  to="/signup"
                  className="mt-6 inline-block bg-green-400 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-300"
                >
                  Go to Signup page
                </Link>
              </div>
            </div>
          }
        />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup2" element={<BusinessSignupScreen />} /> {/* Add this line */}
        <Route path="/login" element={<LogIn />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Added Dashboard route */}
        <Route path="/apps" element={<Apps />} /> {/* Add Apps route */}
        <Route path="/orders" element={<Orders />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/discount" element={<DiscountPage />} />
       
      </Routes>
    </Router>
  );
}

export default App;
