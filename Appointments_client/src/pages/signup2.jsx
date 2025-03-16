

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
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showErrorPopup, setShowErrorPopup ] = useState(false); // state to control popu visibility
  const navigate = useNavigate(); // Initialize navigate function.


      const handleChange = (e) => {
           const { name, value } = e.target;

     // Filter out non-numeric characters for contactNumber
     if (name === "contactNumber") {
      const numericValue = value.replace(/\D/g, ""); // Remove non-numeric characters
      if (numericValue.length > 10) {
        setError("Phone number must be 10 digits.");
      } else {
        setError("");
      }
      setFormData({ ...formData, [name]: numericValue });
      return;
    }
       
    // For all other fields (including panNumber), update the state directly
    setFormData({ ...formData, [name]: value });


  // Other logic for province and district
    if (name === "province") {
      const districts = Object.keys(nepalData[value]?.districts || {});
      setFilteredDistricts(districts);
      setFilteredCities([]); // Reset cities when province changes
      setFormData((prev) => ({ ...prev, district: "", city: "" })); // Reset district and city
    } else if (name === "district") {
      const cities = nepalData[formData.province]?.districts[value] || [];
      setFilteredCities(cities);
      setFormData((prev) => ({ ...prev, city: "" })); // Reset city
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);


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
      setError("Please fill in all required fields. ");
      setShowErrorPopup(true); // show the error popup
      return;
    }

    // validate contact number length
    if(formData.contactNumber.length !== 10)
{
  setError("Phone number must be 10 digits. ");
  setShowErrorPopup(true); // Show the error popup
  return;
   }  
    setError(""); // Clear any previous error
    navigate("/dashboard"); // Navigate to the Dashboard page
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
        <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
        <p>{error}</p>
        <button
          onClick={() => setShowErrorPopup(false)}
          className="mt-2 bg-white text-red-500 px-3 py-1 rounded"
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
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
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
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-3 rounded mt-4"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}