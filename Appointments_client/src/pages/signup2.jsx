
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';

export default function BusinessSignupScreen() {
  const [formData, setFormData] = useState({
    businessName: "",
    panNumber: "",
    businessType: "",
    businessCategory: "",
    established: "",
    annualRevenue: "",
    FullName: "",
    contactNumber: "",
    province: "",
    district: "",
    city: "",
    streetAddress: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false); // Add loading state
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "contactNumber") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length > 10) {
        setError("Phone number must be 10 digits.");
      } else {
        setError("");
      }
      setFormData({ ...formData, [name]: numericValue });
      return;
    }
    
    setFormData({ ...formData, [name]: value });

    if (name === "province") {
      const districts = Object.keys(nepalData[value]?.districts || {});
      setFilteredDistricts(districts);
      setFilteredCities([]);
      setFormData((prev) => ({ ...prev, district: "", city: "" }));
    } else if (name === "district") {
      const cities = nepalData[formData.province]?.districts[value] || [];
      setFilteredCities(cities);
      setFormData((prev) => ({ ...prev, city: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (
      !formData.businessName ||
      !formData.panNumber ||
      !formData.businessType ||
      !formData.businessCategory ||
      !formData.established ||
      !formData.annualRevenue ||
      !formData.FullName ||
      !formData.contactNumber ||
      !formData.province ||
      !formData.district ||
      !formData.city ||
      !formData.streetAddress
    ) {
      setError("Please fill in all required fields.");
      setShowErrorPopup(true);
      return;
    }

    // Validate contact number length
    if (formData.contactNumber.length !== 10) {
      setError("Phone number must be 10 digits.");
      setShowErrorPopup(true);
      return;
    }

    setError("");
    setLoading(true); // Set loading state

    try {
      // Send data to your backend API
      const response = await fetch('http://localhost:6001/api/business/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register business');
      }

      // On successful registration
      navigate("/dashboard");
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register business. Please try again.');
      setShowErrorPopup(true);
    } finally {
      setLoading(false); // Reset loading state
    }
  };


  const nepalData = {
    "Province 1": {
      districts: {
        "Jhapa": ["Bhadrapur", "Damak", "Mechinagar"],
        "Ilam": ["Ilam", "Deumai", "Mai"],
        "Sunsari": ["Itahari", "Dharan", "Inaruwa"],
        "Bhojpur": ["Bhojpur", "Shadanand"],
        "Dhankuta": ["Dhankuta", "Sangurigadhi", "Basantapur"],
        "Khotang": ["Diktel", "Mahadev", "Halesi"],
        "Morang": ["Biratnagar", "Urlabari", "Itahari"],
        "Okhaldhunga": ["Okhaldhunga", "Khijidemba"],
        "Panchthar": ["Phidim", "Fikkal"],
        "Sankhuwasabha": ["Khandbari", "Khibar", "Kimathanka"],
        "Solukhumbu": ["Salleri", "Lukla"],
        "Taplejung": ["Taplejung", "Phungling"],
        "Terhathum": ["Myanglung", "Suryodaya"]
      },
    },
    "Province 2": {
      districts: {
        "Sarlahi": ["Malangwa", "Haripur", "Barahathwa"],
        "Mahottari": ["Jaleshwar", "Bardibas", "Gaushala"],
        "Dhanusha": ["Janakpur", "Mithila", "Sabaila"],
        "Bara": ["Kalaiya", "Nijgadh"],
        "Madhesh": ["Lahan", "Siraha"],
        "Parsa": ["Birgunj", "Nawalpur"],
        "Saptari": ["Rajbiraj", "Kanchan"],
        "Siraha": ["Siraha", "Lahan"]
      },
    },
    "Bagmati": {
      districts: {
        "Kathmandu": ["Kathmandu", "Kirtipur", "Tokha"],
        "Lalitpur": ["Lalitpur", "Mahalaxmi", "Godawari"],
        "Bhaktapur": ["Bhaktapur", "Suryabinayak", "Madhyapur Thimi"],
        "Chitwan": ["Bharatpur", "Ratnanagar"],
        "Dhading": ["Dhading", "Benighat"],
        "Makwanpur": ["Hetauda", "Thaha"],
        "Nuwakot": ["Bidur", "Dandagaun"],
        "Ramechhap": ["Manthali", "Okhaldhunga"],
        "Rasuwa": ["Dhunche", "Timure"],
        "Sindhuli": ["Sindhuli", "Kamalamai"],
        "Sindhupalchok": ["Chautara", "Melamchi"]
      },
    },
    "Gandaki": {
      districts: {
        "Kaski": ["Pokhara", "Lekhnath", "Machhapuchhre"],
        "Lamjung": ["Besisahar", "Sundarbazar", "MadhyaNepal"],
        "Syangja": ["Waling", "Putalibazar", "Chapakot"],
        "Baglung": ["Baglung", "Taman"],
        "Gorkha": ["Gorkha", "Palungtar"],
        "Manang": ["Chame", "Besisahar"],
        "Mustang": ["Jomsom", "Lo Manthang"],
        "Nawalparasi": ["Parasi", "Kawasoti"],

      },
    },
    "Lumbini": {
      districts: {
        "Rupandehi": ["Butwal", "Siddharthanagar", "Lumbini"],
        "Kapilvastu": ["Taulihawa", "Kapilvastu", "Maharajgunj"],
        "Nawalparasi": ["Kawasoti", "Gaindakot", "Madhyabindu"],
        "Arghakhanchi": ["Sandhikharka", "Bhilampur"],
        "Banke": ["Nepalgunj", "Khajura"],
        "Bardiya": ["Gulariya", "Thakurbaba"],
        "Dang": ["Tulsipur", "Ghorahi"],
 
      },
    },
    "Karnali": {
      districts: {
        "Surkhet": ["Birendranagar", "Gurbhakot", "Chaukune"],
        "Jumla": ["Chandannath", "Tila", "Patarasi"],
        "Dolpa": ["Dunai", "Tripurasundari", "Shey Phoksundo"],
        "Bardiya": ["Gulariya", "Thakurbaba"],
        "Dailekh": ["Dailekh", "Dullu"],
        "Humla": ["Simkot", "Sarkegad"],
        "Jajarkot": ["Jajarkot", "Chhedagad"],
        "Kalikot": ["Manma", "Bhur"],
        "Mugu": ["Gamgadhi", "Mugu"],
        "Rukum": ["Rukum", "Musikot"],
        "Salyan": ["Salyan", "Khalanga"],
           
      },
    },
    "Sudurpaschim": {
      districts: {
        "Kailali": ["Dhangadhi", "Tikapur", "Lamki"],
        "Kanchanpur": ["Mahendranagar", "Bhimdatta", "Punarbas"],
        "Dadeldhura": ["Amargadhi", "Parashuram", "Alital"],
        "Achham": ["Mangalsen", "Sanphebagar"],
        "Baitadi": ["Baitadi", "Dasharath"],
        "Bajhang": ["Bajhang", "Chainpur"],
        "Bajura": ["Bajura", "Martadi"],
        "Darchula": ["Darchula", "Khalanga"],
        "Doti": ["Doti", "Silgadhi"],
      
     
      },
    },
  };

  return (
    <div className="flex justify-center items-center min-h-screen">

      {/* Error Popup */}
      {showErrorPopup && (
        <div className="fixed top-4 right-4 bg-yellow-300 text-black p-4 rounded-lg shadow-lg">
        <p>{error}</p>
        <button
          onClick={() => setShowErrorPopup(false)}
          className="mt-2 bg-white text-red-400 px-3 py-1 rounded hover:bg-slate-300"
        >
          Close
        </button>
      </div>
      )}
      
      <div className="bg-blue-50 p-8 rounded-lg shadow-md w-full max-w-2xl">
        
        {/* Logo Centered with Bottom Line */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="h-10 w-auto mb-2" />
          <div className="w-full border-b-2 border-gray-300"></div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800 text-center">
          Tell us about your business.
        </h2>

        <p className="text-xs sm:text-sm text-gray-700 mb-5 text-center">
          Fill out the form below, and we’ll provide tailored insights just for you!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-blue-50 p-6 rounded-lg">
          
          {/* Business Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col items-start">
              <label className="block text-sm font-medium text-gray-700">What is your business name?</label>
              <input
                type="text"
                name="businessName"
                placeholder="Enter your business name"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white"
              />
            </div>
          
            {/* PAN Number */}
            <div className="flex flex-col items-start">
              <label className="block text-sm font-medium text-gray-700">What is your business PAN number?</label>
              <input
                type="text"
                name="panNumber"
                placeholder="Enter your PAN number"
                value={formData.panNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white"
              />
            </div>
          </div>

          {/* Business Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col items-start">
              <label className="block text-sm font-medium text-gray-700">What type of business it is?</label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white"
              >
                 <option value="" disabled>
                    Please select...
                  </option>
                <option value="Retail">Retail</option>
                <option value="Service">Service</option>
                <option value="beauty-personal-care">Beauty and Personal Care</option>
                <option value="charities">Charities</option>
                <option value="education-membership">Education and Membership</option>
                <option value="fitness">Fitness</option>
                <option value="food-drink">Food and Drink</option>
                <option value="health-care">Health Care</option>
                <option value="home-repair">Home and Repair</option>
                <option value="leisure-entertainment">Leisure and Entertainment</option>
                <option value="pet-care">Pet Care</option>
                <option value="professional-services">Professional Services</option>
                <option value="transportation">Transportation</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Business Category */}
            <div className="flex flex-col items-start">
              <label className="block text-sm font-medium text-gray-700">Business Category</label>
              <select
                name="businessCategory"
                value={formData.businessCategory}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white"
              >
                 <option value="" disabled>
                    Please select...
                  </option>
                <option value="IT">IT</option>
                <option value="Finance">Finance</option>
                <option value="events-festivals">Events/Festivals</option>
                  <option value="misc-goods">Miscellaneous Goods</option>
                  <option value="misc-services">Miscellaneous Services</option>
                  <option value="outdoor-market">Outdoor Market</option>
                  <option value="other">Other</option>
              </select>
            </div>
          </div>

        {/* Established or New Business */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {/* Label for the checkboxes */}
  <div className="flex flex-col items-start py-2">
    <label className="text-sm font-medium text-gray-700">Is your business established or new?</label>

    {/* Checkboxes below the text */}
    <div className="flex items-center space-x-4 mt-2">
      <label className="flex items-center">
        <input
          type="checkbox"
          name="established"
          value="Established"
          checked={formData.established === "Established"}
          onChange={handleChange}
          className="mr-2"
        />
        Established
      </label>
      <label className="flex items-center">
        <input
          type="checkbox"
          name="established"
          value="New"
          checked={formData.established === "New"}
          onChange={handleChange}
          className="mr-2"
        />
        New
      </label>
    </div>
  </div>

  {/* Annual Revenue */}
  <div className="flex flex-col items-start mt-2">
    <label className="text-sm font-medium text-gray-700">Estimated annual revenue of your business</label>
    <select
      type="text"
      name="annualRevenue"
      placeholder="Enter your annual revenue"
      value={formData.annualRevenue}
      onChange={handleChange}
      className="w-full p-2 border rounded bg-white"
    >
       <option value="" disabled>
                    Please select...
                  </option>
                                                 
                  <option value="less-than-1-lakh">Less than 1 lakh</option>
                  <option value="1-to-4-lakh">1 to 4 lakhs</option>
                  <option value="4-to-8-lakh">4 to 8 lakhs</option>
                  <option value="8-to-12-lakh">8 to 12 lakhs</option>
                  <option value="12-to-20-lakh">12 to 20 lakhs</option>
                  <option value="20-to-30-lakh">20 to 30 lakhs</option>
                  <option value="30-to-40-lakh">30 to 40 lakhs</option>
                  <option value="above-40-lakh">Above 40 lakhs</option>
      </select>
    
  </div>
</div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col items-start">
              <label className="block text-sm font-medium text-gray-700">Business contact:</label>
              <input
                type="text"
                name="FullName"
                placeholder="Enter your full name"
                value={formData.FullName}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white"
              />
            </div>
            <div className="py-5">
             
              <input
                 type="tel"  // Designed for telephone numbers
                name="contactNumber"
                placeholder="Enter your contact number"
                value={formData.contactNumber}
                onChange={handleChange}
                pattern="[0-9]{10}"  // Ensures exactly 10 digits (optional)
                className="w-full p-2 border rounded bg-white"
              />
              
            </div>
          </div>

          {/* Location Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col items-start">
              <label className="block text-sm font-medium text-gray-700">Business location:</label>
              <select
  name="province"
  value={formData.province}
  onChange={handleChange}
  className="w-full p-2 border rounded bg-white"
>
  <option value="" disabled>
    Select province
  </option>
  {Object.keys(nepalData).map((province) => (
    <option key={province} value={province}>
      {province}
    </option>
  ))}
</select>
            </div>

            <div className="py-5">
             
            <select
  name="district"
  value={formData.district}
  onChange={handleChange}
  className="w-full p-2 border rounded bg-white"
>
  <option value="" disabled>
    Select district
  </option>
  {filteredDistricts.map((district) => (
    <option key={district} value={district}>
      {district}
    </option>
  ))}
</select>

            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
             
            <select
  name="city"
  value={formData.city}
  onChange={handleChange}
  className="w-full p-2 border rounded bg-white"
>
  <option value="" disabled>
    Select city
  </option>
  {filteredCities.map((city) => (
    <option key={city} value={city}>
      {city}
    </option>
  ))}
</select>
            </div>

            <div>             
              <input
                type="text"
                name="streetAddress"
                placeholder="Enter your street address"
                value={formData.streetAddress}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white"
              />
            </div>
          </div>
          <div className="w-full border-b-2 border-gray-300 py-2"></div>

          {/* Submit Button */}
          {/* Continue Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating in...
              </span>
            ) : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}