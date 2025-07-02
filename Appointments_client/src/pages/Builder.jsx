import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Plus, Trash2, Settings, Code, Upload, Image as ImageIcon } from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';
import { MdLocationOn } from 'react-icons/md';


// ======================
// PROP TYPE DEFINITIONS
// ======================

const LinkPropTypes = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
});

const ButtonPropTypes = PropTypes.shape({
  text: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
});

const LogoPropTypes = PropTypes.shape({
  text: PropTypes.string,
  imageUrl: PropTypes.string,
});

//const ServiceItemPropTypes = PropTypes.shape({
  //id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  //icon: PropTypes.string,
  //title: PropTypes.string.isRequired,
  //description: PropTypes.string.isRequired,
// });

const StylesPropTypes = PropTypes.shape({
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  titleColor: PropTypes.string,
  subtitleColor: PropTypes.string,
  linkColor: PropTypes.string,
  buttonBgColor: PropTypes.string,
  buttonTextColor: PropTypes.string,
  logoColor: PropTypes.string,
});

const ComponentPropTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["navbar", "banner", "hero", "categories", "services", "about", "footer"]).isRequired,
  styles: StylesPropTypes,
};

const NavbarPropTypes = {
  ...ComponentPropTypes,
  logo: LogoPropTypes,
  links: PropTypes.arrayOf(LinkPropTypes).isRequired,
  button: ButtonPropTypes.isRequired,
};

const BannerPropTypes = {
  ...ComponentPropTypes,
  title: PropTypes.string.isRequired,
  highlightedWord: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  button: ButtonPropTypes.isRequired,
  imageUrl: PropTypes.string,
};

const CategoriesPropTypes = {
  ...ComponentPropTypes,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      imageUrl: PropTypes.string
    })
  ).isRequired
};


const HeroPropTypes = {
  ...ComponentPropTypes,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  button: ButtonPropTypes.isRequired,
  imageUrl: PropTypes.string,
};

const AppointmentPropTypes = {
  ...ComponentPropTypes,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  button: ButtonPropTypes.isRequired,
  imageUrl: PropTypes.string,
  workingDays: PropTypes.shape({
    weekdays: PropTypes.string.isRequired,
    weekend: PropTypes.string.isRequired,
  }).isRequired,
};

const ServicesPropTypes = {
  ...ComponentPropTypes,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  button: ButtonPropTypes.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      imageUrl: PropTypes.string
    })
  ).isRequired
};

const AboutPropTypes = {
  ...ComponentPropTypes,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
};

const FooterPropTypes = {
  ...ComponentPropTypes,
  logo: LogoPropTypes,
  description: PropTypes.string,
  copyright: PropTypes.string,
  links: PropTypes.arrayOf(LinkPropTypes),
  contactInfo: PropTypes.shape({
    address: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string
  }),
  socialLinks: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      url: PropTypes.string
    })
  )
};

// ======================
// UTILITY FUNCTIONS
// ======================

const generateId = () => `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const validateComponentData = (component) => {
  switch(component.type) {
    case 'navbar':
      PropTypes.checkPropTypes(NavbarPropTypes, component, 'prop', 'NavbarComponent');
      break;
    case 'banner':
      PropTypes.checkPropTypes(BannerPropTypes, component, 'prop', 'BannerComponent');
      break;
    case 'categores':
      PropTypes.checkPropTypes(CategoriesPropTypes, component, 'prop', 'CategoriesComponent');
      break;
    case 'hero':
      PropTypes.checkPropTypes(HeroPropTypes, component, 'prop', 'HeroComponent');
      break;
    case 'appointment':
      PropTypes.checkPropTypes(AppointmentPropTypes, component, 'prop', 'AppointmentComponent');
      break;
    case 'services':
      PropTypes.checkPropTypes(ServicesPropTypes, component, 'prop', 'ServicesComponent');
      break;
    case 'about':
      PropTypes.checkPropTypes(AboutPropTypes, component, 'prop', 'AboutComponent');
      break;
    case 'footer':
      PropTypes.checkPropTypes(FooterPropTypes, component, 'prop', 'FooterComponent');
      break;
    default:
      PropTypes.checkPropTypes(ComponentPropTypes, component, 'prop', 'Component');
  }
};

const getInitialComponentData = (type) => {
  const base = { id: generateId(), type };
  let component;

  switch (type) {
    case "navbar":
      component = {
        ...base,
        logo: { 
          text: "MyLogo",
          imageUrl: ""
        },
        links: [
          { id: 1, name: "Home", url: "#home" },
          { id: 2, name: "About", url: "#about" },
        ],
        button: { text: "Book Now", url: "#booking" },
        styles: { 
          backgroundColor: "#FFFFFF", 
          linkColor: "#374151",
          logoColor: "#4F46E5"
        },
      };
      break;
      case "banner":
  component = {
    ...base,
    title: "Dive Into Dapper, Define Your", // Split title
    highlightedWord: "Style!", // Add highlighted word separately
    subtitle: "Where Every Trim, and Style Tells a Story of Mastery and Timeless Craftsmanship.",
    button: { text: "Book Now", url: "/appointment" },
    imageUrl: "/images/home/banner.png",
    styles: {
      backgroundColor: "#FAFAFA",
      gradientToColor: "#FCFCFC",
      titleColor: "#000000",
      highlightedWordColor: "#4CAF50",
      textColor: "#4A4A4A",
      buttonBgColor: "#4CAF50",
      buttonTextColor: "#FFFFFF"
    }
  };
  break;
  case "categories":
  component = {
    ...base,
    title: "Popular Categories",
    subtitle: "Customer Favorites",
    items: [
      {
        id: 1,
        title: "Cuts & Styles",
        description: "(5 services)",
        imageUrl: "/images/home/category/img1.png"
      },
      {
        id: 2,
        title: "Shaves & Beards",
        description: "(5 services)",
        imageUrl: "/images/home/category/img2.png"
      },
      {
        id: 3,
        title: "Hair Care",
        description: "(4 services)",
        imageUrl: "/images/home/category/img3.png"
      },
      {
        id: 4,
        title: "Facial Services",
        description: "(6 services)",
        imageUrl: "/images/home/category/img4.png"
      }
    ],
    styles: {
      backgroundColor: "#FFFFFF",
      titleColor: "#1E1E1E",
      subtitleColor: "#4B5563",
      textColor: "#1E1E1E",
      cardBgColor: "#FFFFFF",
      highlightColor: "#16A34A"
    }
  };
  break;
    case "hero":
      component = {
        ...base,
        title: "Welcome to Our Awesome Website",
        subtitle: "Your one-stop solution for everything.",
        button: { text: "Learn More", url: "#about" },
        imageUrl: "https://placehold.co/1200x600/4F46E5/FFFFFF?text=Hero+Image",
        styles: { titleColor: "#FFFFFF", subtitleColor: "#E5E7EB" },
      };
      break;
      case "appointment":
  component = {
    ...base,
    title: "Book Your Appointment, Skip the Wait",
    subtitle: "Opening hours",
    description: "With our easy online booking system, you can choose your preferred time and barber, ensuring a seamless, appointment-only experience. No more waiting in line—just arrive, relax, and enjoy top-notch service!",
    button: { 
      text: "Book Now", 
      url: "/appointment/book" 
    },
    workingDays: {
      weekdays: "SUN - FRI\n8AM - 10PM",
      weekend: "SAT\nClosed"
    },
    styles: {
      backgroundColor: "#FFFFFF",
      titleColor: "#1E1E1E",
      subtitleColor: "#16A34A",
      descriptionColor: "#6B7280",
      buttonBgColor: "#16A34A",
      buttonTextColor: "#FFFFFF",
      timeCardBgColor: "#FFFFFF",
      timeCardTextColor: "#16A34A",
      timeCardSubtextColor: "#90BD95"
    }
  };
  break;
    case "services":
  component = {
    ...base,
    title: "Our Grooming Journey And Services",
    subtitle: "Our Story & Services",
    description: "At THE BARBER, we started with a passion for perfecting your look. With skill, precision, and style, we create a grooming experience that leaves you confident and refreshed.",
    button: {
      text: "Call Us",
      url: "tel:+1234567890"
    },
    items: [
      {
        id: 1,
        title: "5+ YEARS EXPERIENCE",
        description: "Expert grooming with precision, style, and care",
        imageUrl: "/images/home/services/icon1.png"
      },
      {
        id: 2,
        title: "CUSTOMER SATISFACTION",
        description: "Committed to excellence, ensuring satisfaction every visit",
        imageUrl: "/images/home/services/icon2.png"
      },
      {
        id: 3,
        title: "PREMIUM",
        description: "Only the finest products for exceptional grooming results",
        imageUrl: "/images/home/services/icon3.png"
      },
      {
        id: 4,
        title: "LOYALTY REWARDS",
        description: "Earn points with every visit for exclusive perks",
        imageUrl: "/images/home/services/icon4.png"
      }
    ],
    styles: {
      backgroundColor: "#FFFFFF",
      titleColor: "#1E1E1E",  // Dark color for title
      subtitleColor: "#4B5563", // Subtitle color
      textColor: "#6B7280", // Secondary text color
      cardTextColor: "#16A34A", // Green for service titles
      cardDescriptionColor: "#90BD95", // Light green for descriptions
      buttonBgColor: "#16A34A", // Green button
      buttonTextColor: "#FFFFFF" // White button text
    }
  };
  break;
    case "about":
      component = {
        ...base,
        title: "About Us",
        text: "We are a team of passionate developers, designers, and strategists dedicated to creating amazing digital experiences.",
        imageUrl: "https://placehold.co/600x400/F3F4F6/333333?text=About+Us",
        styles: { backgroundColor: "#FFFFFF" },
      };
      break;
    case "footer":
  component = {
    ...base,
    logo: { 
      text: "Calenify",
      imageUrl: "/logo.jpg" 
    },
    description: "Experience the craft where every cut is a masterpiece of style and precision.",
    copyright: "Copyright © 2025 Calenify | All rights reserved",
    links: [
      { id: 1, name: "Home", url: "#home" },
      { id: 2, name: "Services", url: "#services" },
      { id: 3, name: "Appointments", url: "#appointments" },
      { id: 4, name: "About us", url: "#about" }
    ],
    contactInfo: {
      address: "Pokhara-10, Lakeside, Street no.14",
      email: "thebarber@gmail.com",
      phone: "+977-9812345678"
    },
    socialLinks: [
      { icon: "facebook", url: "https://www.facebook.com/" },
      { icon: "twitter", url: "https://twitter.com/" },
      { icon: "instagram", url: "https://www.instagram.com/" },
      { icon: "youtube", url: "https://www.youtube.com/" }
    ],
    styles: {
      backgroundColor: "#C8F5CC",
      textColor: "#4B5563",
      highlightColor: "#16A34A"
    }
  };
  break;
    default:
      component = { ...base, styles: {} };
  }

  validateComponentData(component);
  return component;
};

// ======================
// REUSABLE COMPONENTS
// ======================

const ColorInput = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between mb-2">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="flex items-center gap-2 border rounded-md p-1">
      <span className="text-sm">{value}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-7 h-7 border-none cursor-pointer"
        style={{ backgroundColor: "transparent" }}
      />
    </div>
  </div>
);

ColorInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const ImageUploadInput = ({ label, imageUrl, onImageUpload, onUrlChange }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">{label}</label>
      <div className="flex items-center p-2 border rounded-lg bg-gray-50">
        {imageUrl ? (
          <img src={imageUrl} alt="preview" className="w-12 h-12 object-cover rounded-md mr-3" />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded-md mr-3 flex items-center justify-center">
            <ImageIcon className="text-gray-400" />
          </div>
        )}
        <input
          type="text"
          placeholder="Or paste image URL"
          value={imageUrl?.startsWith("data:") ? "" : imageUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          className="flex-grow p-2 border rounded-l-md text-sm"
        />
        <button
          onClick={() => fileInputRef.current.click()}
          className="p-2 bg-gray-200 rounded-r-md hover:bg-gray-300"
        >
          <Upload size={20} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
      </div>
    </div>
  );
};

ImageUploadInput.propTypes = {
  label: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  onImageUpload: PropTypes.func.isRequired,
  onUrlChange: PropTypes.func.isRequired,
};

// ======================
// PREVIEW COMPONENTS
// ======================

const ComponentPreview = ({ component, onClick }) => {
  const { styles = {} } = component;

  const renderComponent = () => {
    switch (component.type) {
      case "navbar":
        return (
          <nav
            className="flex items-center justify-between p-4 shadow-md rounded-lg"
            style={{ backgroundColor: styles.backgroundColor }}
          >
            <div className="flex items-center">
              {component.logo.imageUrl ? (
                <img 
                  src={component.logo.imageUrl} 
                  alt="Logo" 
                  className="h-10 mr-2" 
                />
              ) : (
                <div 
                  className="text-xl font-bold"
                  style={{ color: styles.logoColor || "#4F46E5" }}
                >
                  {component.logo.text}
                </div>
              )}
            </div>
            <div className="hidden md:flex items-center space-x-6">
              {component.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  className="hover:opacity-75"
                  style={{ color: styles.linkColor }}
                >
                  {link.name}
                </a>
              ))}
            </div>
            <a
              href={component.button.url}
              className="px-4 py-2 rounded-md font-semibold"
              style={{
                backgroundColor: styles.buttonBgColor || "#4F46E5",
                color: styles.buttonTextColor || "#FFFFFF",
              }}
            >
              {component.button.text}
            </a>
          </nav>
        );
    case "banner":
  return (
    <div className="w-full" style={{ background: `linear-gradient(to right, ${styles.backgroundColor}, ${styles.gradientToColor})` }}>
      <div className="max-w-screen-2xl container mx-auto xl:px-24">
        <div className="py-24 flex flex-col md:flex-row-reverse items-center justify-between gap-8">
          {/* Image side */}
          <div className="md:w-1/2">
            {component.imageUrl ? (
              <img src={component.imageUrl} alt="Banner" className="w-full" />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                <ImageIcon className="text-gray-400 w-16 h-16" />
              </div>
            )}
          </div>

          {/* Text side */}
          <div className="md:w-1/2 px-4 space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight md:leading-snug mt-4 md:mt-6" style={{ color: styles.titleColor }}>
              {component.title} <span style={{ color: styles.highlightedWordColor }}>{component.highlightedWord}</span>
            </h2>        
            <p 
              className="text-lg md:text-xl mb-6"
              style={{ color: styles.textColor }}
            >
              {component.subtitle}
            </p>
            <button
              className="font-semibold btn px-8 py-3 md:px-10 md:py-3 rounded-full mt-4" 
              style={{
                backgroundColor: styles.buttonBgColor,
                color: styles.buttonTextColor
              }}
            >
              {component.button.text}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  case "categories":
  return (
    <div 
      className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-16"
      style={{ backgroundColor: styles.backgroundColor }}
    >
      <div className="text-center">
        <p className="subtitle" style={{ color: styles.subtitleColor }}>
          {component.subtitle}
        </p>
        <h2 className="title" style={{ color: styles.titleColor }}>
          {component.title}
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-8 justify-around items-center mt-12">
        {component.items.map((item) => (
          <div 
            key={item.id} 
            className="shadow-lg rounded-md py-6 px-5 w-72 mx-auto text-center cursor-pointer hover:-translate-y-4 transition-all duration-300 z-10"
            style={{ backgroundColor: styles.cardBgColor }}
          >
            <div className="w-full mx-auto flex items-center justify-center">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt="" 
                  className="p-5 rounded-full w-28 h-28" 
                  style={{ backgroundColor: styles.highlightColor + "20" }} // 20 = 12% opacity
                />
              ) : (
                <div 
                  className="p-5 rounded-full w-28 h-28 flex items-center justify-center"
                  style={{ backgroundColor: styles.highlightColor + "20" }}
                >
                  <ImageIcon className="w-12 h-12" style={{ color: styles.highlightColor }} />
                </div>
              )}
            </div>
            <div className="mt-5 space-y-1">
              <h5 style={{ color: styles.textColor, fontWeight: "600" }}>
                {item.title}
              </h5>
              <p style={{ color: styles.subtitleColor, fontSize: "0.875rem" }}>
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
      case "hero":
        return (
          <div
            className="text-center p-10 md:p-20 rounded-lg bg-cover bg-center relative"
            style={{ backgroundImage: `url('${component.imageUrl}')` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-extrabold" style={{ color: styles.titleColor }}>
                {component.title}
              </h1>
              <p className="text-lg mt-4" style={{ color: styles.subtitleColor }}>
                {component.subtitle}
              </p>
              <a
                href={component.button.url}
                className="mt-8 inline-block px-8 py-3 rounded-md text-lg font-semibold"
                style={{
                  backgroundColor: styles.buttonBgColor || "#4F46E5",
                  color: styles.buttonTextColor || "#FFFFFF",
                }}
              >
                {component.button.text}
              </a>
            </div>
          </div>
        );
        case "appointment":
  return (
    <div className="section-container" style={{ backgroundColor: styles.backgroundColor }}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-16">
        {/* Time Cards Container */}
        <div className="relative md:w-1/2">
          {/* Weekdays Time Card */}
          <div 
            className="shadow-[7px_12px_43px_0_#00000023] rounded-[30px] w-[260px] h-[112px] text-center space-y-2 cursor-pointer hover:border hover:border-indigo-600 transition-all duration-200 flex flex-col justify-center"
            style={{ 
              backgroundColor: styles.timeCardBgColor,
              color: styles.timeCardTextColor,
              marginBottom: "1rem"
            }}
          >
            <h5 className="text-[20px] font-bold">{component.workingDays.weekdays.split('\n')[0]}</h5>
            <p className="text-[16px] font-semibold" style={{ color: styles.timeCardSubtextColor }}>
              {component.workingDays.weekdays.split('\n')[1]}
            </p>
          </div>

          {/* Weekend Time Card */}
          <div 
            className="shadow-[7px_12px_43px_0_#00000023] rounded-[30px] w-[260px] h-[112px] text-center space-y-2 cursor-pointer hover:border hover:border-indigo-600 transition-all duration-200 flex flex-col justify-center"
            style={{ 
              backgroundColor: styles.timeCardBgColor,
              color: styles.timeCardTextColor
            }}
          >
            <h5 className="text-[20px] font-bold">{component.workingDays.weekend.split('\n')[0]}</h5>
            <p className="text-[16px] font-semibold" style={{ color: styles.timeCardSubtextColor }}>
              {component.workingDays.weekend.split('\n')[1]}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="md:w-[55%]">
          <div className="text-left md:w-5/5 space-y-10">
            <p 
              className="subtitle !font-bold" 
              style={{ 
                color: styles.subtitleColor,
                fontSize: "0.875rem",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.1em"
              }}
            >
              {component.subtitle}
            </p>
            <h2 
              className="title" 
              style={{ 
                color: styles.titleColor,
                fontSize: "2.25rem",
                fontWeight: "700",
                lineHeight: "1.2"
              }}
            >
              {component.title}
            </h2>
            <p 
              className="my-5 leading-[30px]" 
              style={{ 
                color: styles.descriptionColor,
                fontSize: "1rem",
                lineHeight: "1.875rem"
              }}
            >
              {component.description}
            </p>
            <button
              className="font-semibold btn px-10 py-3 rounded-full"
              style={{
                backgroundColor: styles.buttonBgColor,
                color: styles.buttonTextColor,
                fontSize: "1rem",
                fontWeight: "600"
              }}
            >
              {component.button.text}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
      case "services":
  return (
    <div className="section-container my-16 px-4 sm:px-6" style={{ backgroundColor: styles.backgroundColor }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-0">
          {/* Text Content - Match exact classes from reference */}
          <div className="md:w-1/2">
            <div className="text-left md:w-4/5">
              <p 
                className="subtitle text-sm font-medium uppercase tracking-wider" 
                style={{ color: styles.subtitleColor }}
              >
                {component.subtitle}
              </p>
              <h2 
                className="title text-3xl md:text-4xl font-bold mt-2 mb-4" 
                style={{ color: styles.titleColor }}
              >
                {component.title}
              </h2>
              <p 
                className="my-5 leading-[30px] text-base" 
                style={{ color: styles.textColor }}
              >
                {component.description}
              </p>
              <button 
                className="font-semibold btn px-10 py-3 rounded-full"
                style={{
                  backgroundColor: styles.buttonBgColor,
                  color: styles.buttonTextColor
                }}
              >
                {component.button.text}
              </button>
            </div>
          </div>

          {/* Services Grid - Keep existing */}
          <div className="md:w-1/2">
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-8 items-center">
              {component.items.map((service) => (
                <div 
                  key={service.id} 
                  className="shadow-md rounded-sm py-5 px-4 text-center space-y-2 cursor-pointer hover:border hover:border-indigo-600 transition-all duration-200"
                  style={{ color: styles.cardTextColor }}
                >
                  {service.imageUrl ? (
                    <img src={service.imageUrl} alt="" className="mx-auto" />
                  ) : (
                    <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <h5 className="pt-3 font-semibold">{service.title}</h5>
                  <p className="px-2" style={{ color: styles.cardDescriptionColor }}>
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
      case "about":
        return (
          <div 
            className="flex flex-col md:flex-row gap-6 p-6 rounded"
            style={{ backgroundColor: styles.backgroundColor }}
          >
            <div className="flex-1">
              <h2 
                className="text-2xl font-bold mb-4"
                style={{ color: styles.textColor }}
              >
                {component.title}
              </h2>
              <p style={{ color: styles.textColor }}>{component.text}</p>
            </div>
            {component.imageUrl && (
              <div className="flex-1">
                <img 
                  src={component.imageUrl} 
                  alt="About Us" 
                  className="w-full rounded-lg" 
                />
              </div>
            )}
          </div>
        );
      // Add to your ComponentPreview switch case
case "footer":
  return (
    <footer 
      className="py-10 mt-10"
      style={{ backgroundColor: styles.backgroundColor }}
    >
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        {/* Logo & Description */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            {component.logo.imageUrl ? (
              <img src={component.logo.imageUrl} alt="Logo" className="w-20 h-16" />
            ) : (
              <span className="text-lg font-bold" style={{ color: styles.textColor }}>
                {component.logo.text}
              </span>
            )}
          </div>
          <p style={{ color: styles.textColor }}>{component.description}</p>
          <div className="flex space-x-4 mt-4">
            {component.socialLinks.map((social) => (
              <a 
                key={social.icon}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`cursor-pointer transition-colors duration-300 hover:text-[${styles.highlightColor}]`}
                style={{ color: styles.textColor }}
              >
                {social.icon === 'facebook' && <FaFacebookF />}
                {social.icon === 'twitter' && <FaTwitter />}
                {social.icon === 'instagram' && <FaInstagram />}
                {social.icon === 'youtube' && <FaYoutube />}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4" style={{ color: styles.textColor }}>
            Quick links
          </h4>
          <ul className="space-y-2">
            {component.links.map((link) => (
              <li key={link.id}>
                <a 
                  href={link.url} 
                  className="hover:text-[#16A34A]"
                  style={{ color: styles.textColor }}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h4 className="text-lg font-semibold mb-4" style={{ color: styles.textColor }}>
            Contact Us
          </h4>
          <ul className="space-y-2" style={{ color: styles.textColor }}>
            <li className="flex items-center space-x-2">
              <MdLocationOn style={{ color: styles.highlightColor }} />
              <span>{component.contactInfo.address}</span>
            </li>
            <li className="flex items-center space-x-2">
              <HiOutlineMail style={{ color: styles.highlightColor }} />
              <span>{component.contactInfo.email}</span>
            </li>
            <li className="flex items-center space-x-2">
              <HiOutlinePhone style={{ color: styles.highlightColor }} />
              <span>{component.contactInfo.phone}</span>
            </li>
          </ul>
        </div>
      </div>
      <div 
        className="border-t border-gray-300 mt-10 pt-6 text-center"
        style={{ color: styles.textColor }}
      >
        <p>{component.copyright}</p>
      </div>
    </footer>
  );
      default:
        return (
          <div className="p-4 bg-gray-200 rounded-lg" style={styles}>
            <h3 className="font-bold capitalize">{component.type}</h3>
            <p className="text-sm text-gray-600">Component preview. Click to edit.</p>
          </div>
        );
    }
  };

  return (
    <div 
      onClick={() => onClick(component)}
      className="cursor-pointer"
    >
      {renderComponent()}
    </div>
  );
};

ComponentPreview.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.shape(NavbarPropTypes),
    PropTypes.shape(BannerPropTypes),
    PropTypes.shape(CategoriesPropTypes),
    PropTypes.shape(HeroPropTypes),
    PropTypes.shape(AppointmentPropTypes),
    PropTypes.shape(ServicesPropTypes),
    PropTypes.shape(AboutPropTypes),
    PropTypes.shape(FooterPropTypes)
  ]).isRequired,
  onClick: PropTypes.func.isRequired,
};

// ======================
// CUSTOMIZATION PANELS
// ======================

const CustomizationPanel = ({ component, updateComponent, removeComponent }) => {
  if (!component) {
    return (
      <div className="text-center p-6 text-gray-500">
        <Settings className="mx-auto w-12 h-12 text-gray-300" />
        <p className="mt-4">Select a component on the canvas to customize its properties.</p>
      </div>
    );
  }

  const handleInputChange = (field, value) =>
    updateComponent(component.id, { ...component, [field]: value });

  const handleNestedInputChange = (parent, field, value) =>
    updateComponent(component.id, { ...component, [parent]: { ...component[parent], [field]: value } });

  const handleStyleChange = (property, value) =>
    updateComponent(component.id, { ...component, styles: { ...component.styles, [property]: value } });

  const renderPanel = () => {
    switch (component.type) {
      case "navbar":
        return (
          <div>
            <h3 className="font-semibold mb-3">Navbar Settings</h3>
            <div className="mb-4 p-3 border rounded-lg">
              <h4 className="font-medium mb-2">Logo</h4>
              <label className="block mb-1 font-medium text-sm">Logo Text</label>
              <input
                type="text"
                value={component.logo.text}
                onChange={(e) => handleNestedInputChange("logo", "text", e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <ImageUploadInput
                label="Logo Image"
                imageUrl={component.logo.imageUrl}
                onImageUpload={(base64) => handleNestedInputChange("logo", "imageUrl", base64)}
                onUrlChange={(url) => handleNestedInputChange("logo", "imageUrl", url)}
              />
              <ColorInput
                label="Logo Color (text only)"
                value={component.styles.logoColor || "#4F46E5"}
                onChange={(v) => handleStyleChange("logoColor", v)}
              />
            </div>
            <div className="mb-4 p-3 border rounded-lg">
              <h4 className="font-medium mb-2">Styling</h4>
              <ColorInput
                label="Background"
                value={component.styles.backgroundColor || "#FFFFFF"}
                onChange={(v) => handleStyleChange("backgroundColor", v)}
              />
              <ColorInput
                label="Link Color"
                value={component.styles.linkColor || "#374151"}
                onChange={(v) => handleStyleChange("linkColor", v)}
              />
            </div>
            <div className="mb-4 p-3 border rounded-lg">
              <h4 className="font-medium mb-2">Navigation Links</h4>
              {component.links.map((link, index) => (
                <div key={link.id} className="mb-3 p-2 border rounded">
                  <label className="block mb-1 text-sm">Link {index + 1}</label>
                  <input
                    type="text"
                    value={link.name}
                    onChange={(e) => {
                      const updatedLinks = [...component.links];
                      updatedLinks[index].name = e.target.value;
                      handleInputChange("links", updatedLinks);
                    }}
                    className="w-full p-2 border rounded mb-1"
                    placeholder="Link text"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => {
                      const updatedLinks = [...component.links];
                      updatedLinks[index].url = e.target.value;
                      handleInputChange("links", updatedLinks);
                    }}
                    className="w-full p-2 border rounded"
                    placeholder="Link URL"
                  />
                  <button
                    onClick={() => {
                      const updatedLinks = component.links.filter((_, i) => i !== index);
                      handleInputChange("links", updatedLinks);
                    }}
                    className="mt-1 text-red-500 text-sm flex items-center"
                  >
                    <Trash2 size={14} className="mr-1" /> Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newLink = {
                    id: Date.now(),
                    name: "New Link",
                    url: "#",
                  };
                  handleInputChange("links", [...component.links, newLink]);
                }}
                className="w-full p-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                <Plus size={16} className="inline mr-1" /> Add Link
              </button>
            </div>
            <div className="mb-4 p-3 border rounded-lg">
              <h4 className="font-medium mb-2">Call-to-Action Button</h4>
              <label className="block mb-1 text-sm">Button Text</label>
              <input
                type="text"
                value={component.button.text}
                onChange={(e) =>
                  handleNestedInputChange("button", "text", e.target.value)
                }
                className="w-full p-2 border rounded mb-2"
              />
              <label className="block mb-1 text-sm">Button URL</label>
              <input
                type="text"
                value={component.button.url}
                onChange={(e) =>
                  handleNestedInputChange("button", "url", e.target.value)
                }
                className="w-full p-2 border rounded"
              />
              <div className="mt-2">
                <ColorInput
                  label="Button Background"
                  value={component.styles.buttonBgColor || "#4F46E5"}
                  onChange={(v) => handleStyleChange("buttonBgColor", v)}
                />
                <ColorInput
                  label="Button Text"
                  value={component.styles.buttonTextColor || "#FFFFFF"}
                  onChange={(v) => handleStyleChange("buttonTextColor", v)}
                />
              </div>
            </div>
          </div>
        );
        // Add to your CustomizationPanel switch case
case "banner":
  return (
    <div>
      <h3 className="font-semibold mb-3">Banner Settings</h3>
      
      <div className="mb-4 p-3 border rounded-lg">
        <h4 className="font-medium mb-2">Title Content</h4>
        <label className="block mb-1 text-sm">Main Title</label>
        <input
          type="text"
          value={component.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        
        <label className="block mb-1 text-sm">Highlighted Word</label>
        <input
          type="text"
          value={component.highlightedWord}
          onChange={(e) => handleInputChange("highlightedWord", e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        
        <ColorInput
          label="Highlighted Word Color"
          value={component.styles.highlightedWordColor || "#4CAF50"}
          onChange={(v) => handleStyleChange("highlightedWordColor", v)}
        />

        <label className="block mb-1 text-sm">Subtitle</label>
        <textarea
          value={component.subtitle}
          onChange={(e) => handleInputChange("subtitle", e.target.value)}
          className="w-full p-2 border rounded mb-2"
          rows="3"
          placeholder="Where Every Trim, and Style Tells a Story..."
        />
      </div>
      
      <div className="mb-4 p-3 border rounded-lg">
        <h4 className="font-medium mb-2">Button</h4>
        <label className="block mb-1 text-sm">Button Text</label>
        <input
          type="text"
          value={component.button.text}
          onChange={(e) => handleNestedInputChange("button", "text", e.target.value)}
          className="w-full p-2 border rounded mb-2"
          placeholder="Book Now"
        />
        
        <label className="block mb-1 text-sm">Button URL</label>
        <input
          type="text"
          value={component.button.url}
          onChange={(e) => handleNestedInputChange("button", "url", e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="/appointment"
        />
      </div>
      
      <div className="mb-4 p-3 border rounded-lg">
        <h4 className="font-medium mb-2">Media</h4>
        <ImageUploadInput
          label="Banner Image"
          imageUrl={component.imageUrl}
          onImageUpload={(base64) => handleInputChange("imageUrl", base64)}
          onUrlChange={(url) => handleInputChange("imageUrl", url)}
        />
      </div>
      
      <div className="mb-4 p-3 border rounded-lg">
        <h4 className="font-medium mb-2">Styling</h4>
        <ColorInput
          label="Background Gradient From"
          value={component.styles.backgroundColor || "#FAFAFA"}
          onChange={(v) => handleStyleChange("backgroundColor", v)}
        />
        <ColorInput
          label="Background Gradient To"
          value={component.styles.gradientToColor || "#FCFCFC"}
          onChange={(v) => handleStyleChange("gradientToColor", v)}
        />
        <ColorInput
          label="Title Color"
          value={component.styles.titleColor || "#000000"}
          onChange={(v) => handleStyleChange("titleColor", v)}
        />
        <ColorInput
          label="Highlight Color"
          value={component.styles.highlightColor || "#4CAF50"}
          onChange={(v) => handleStyleChange("highlightColor", v)}
        />
        <ColorInput
          label="Text Color"
          value={component.styles.textColor || "#4A4A4A"}
          onChange={(v) => handleStyleChange("textColor", v)}
        />
        <ColorInput
          label="Button Background"
          value={component.styles.buttonBgColor || "#4CAF50"}
          onChange={(v) => handleStyleChange("buttonBgColor", v)}
        />
        <ColorInput
          label="Button Text Color"
          value={component.styles.buttonTextColor || "#FFFFFF"}
          onChange={(v) => handleStyleChange("buttonTextColor", v)}
        />
      </div>
    </div>
  );
  case "categories":
  return (
    <div>
      <h3 className="font-semibold mb-3">Categories Settings</h3>
      
      <div className="mb-4 p-3 border rounded-lg">
        <h4 className="font-medium mb-2">Content</h4>
        <label className="block mb-1 text-sm">Title</label>
        <input
          type="text"
          value={component.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className="w-full p-2 border rounded mb-2"
          placeholder="Popular Categories"
        />
        <label className="block mb-1 text-sm">Subtitle</label>
        <input
          type="text"
          value={component.subtitle}
          onChange={(e) => handleInputChange("subtitle", e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Customer Favorites"
        />
      </div>
      
      <div className="mb-4 p-3 border rounded-lg">
        <h4 className="font-medium mb-2">Category Items</h4>
        {component.items.map((item, index) => (
          <div key={item.id} className="mb-3 p-2 border rounded">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">Category {index + 1}</span>
              <button
                onClick={() => {
                  const updatedItems = component.items.filter((_, i) => i !== index);
                  handleInputChange("items", updatedItems);
                }}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <label className="block mb-1 text-xs">Title</label>
            <input
              type="text"
              value={item.title}
              onChange={(e) => {
                const updatedItems = [...component.items];
                updatedItems[index].title = e.target.value;
                handleInputChange("items", updatedItems);
              }}
              className="w-full p-2 border rounded mb-1"
            />
            <label className="block mb-1 text-xs">Description</label>
            <input
              type="text"
              value={item.description}
              onChange={(e) => {
                const updatedItems = [...component.items];
                updatedItems[index].description = e.target.value;
                handleInputChange("items", updatedItems);
              }}
              className="w-full p-2 border rounded mb-1"
            />
            <ImageUploadInput
              label="Category Image"
              imageUrl={item.imageUrl}
              onImageUpload={(base64) => {
                const updatedItems = [...component.items];
                updatedItems[index].imageUrl = base64;
                handleInputChange("items", updatedItems);
              }}
              onUrlChange={(url) => {
                const updatedItems = [...component.items];
                updatedItems[index].imageUrl = url;
                handleInputChange("items", updatedItems);
              }}
            />
          </div>
        ))}
        <button
          onClick={() => {
            const newItem = {
              id: Date.now(),
              title: "New Category",
              description: "(0 services)",
              imageUrl: ""
            };
            handleInputChange("items", [...component.items, newItem]);
          }}
          className="w-full p-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          <Plus size={16} className="inline mr-1" /> Add Category
        </button>
      </div>
      
      <div className="mb-4 p-3 border rounded-lg">
        <h4 className="font-medium mb-2">Styling</h4>
        <ColorInput
          label="Background Color"
          value={component.styles.backgroundColor || "#FFFFFF"}
          onChange={(v) => handleStyleChange("backgroundColor", v)}
        />
        <ColorInput
          label="Title Color"
          value={component.styles.titleColor || "#1E1E1E"}
          onChange={(v) => handleStyleChange("titleColor", v)}
        />
        <ColorInput
          label="Subtitle Color"
          value={component.styles.subtitleColor || "#4B5563"}
          onChange={(v) => handleStyleChange("subtitleColor", v)}
        />
        <ColorInput
          label="Text Color"
          value={component.styles.textColor || "#1E1E1E"}
          onChange={(v) => handleStyleChange("textColor", v)}
        />
        <ColorInput
          label="Card Background"
          value={component.styles.cardBgColor || "#FFFFFF"}
          onChange={(v) => handleStyleChange("cardBgColor", v)}
        />
        <ColorInput
          label="Highlight Color"
          value={component.styles.highlightColor || "#16A34A"}
          onChange={(v) => handleStyleChange("highlightColor", v)}
        />
      </div>
    </div>
  );
      case "hero":
        return (
          <div>
            <h3 className="font-semibold mb-3">Hero Section</h3>
            <div className="mb-4 p-3 border rounded-lg">
              <h4 className="font-medium mb-2">Content</h4>
              <label className="block mb-1 text-sm">Title</label>
              <input
                type="text"
                value={component.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <label className="block mb-1 text-sm">Subtitle</label>
              <textarea
                value={component.subtitle}
                onChange={(e) => handleInputChange("subtitle", e.target.value)}
                className="w-full p-2 border rounded mb-2"
                rows="3"
              />
            </div>
            <div className="mb-4 p-3 border rounded-lg">
              <h4 className="font-medium mb-2">Styling</h4>
              <ColorInput
                label="Title Color"
                value={component.styles.titleColor || "#FFFFFF"}
                onChange={(v) => handleStyleChange("titleColor", v)}
              />
              <ColorInput
                label="Subtitle Color"
                value={component.styles.subtitleColor || "#E5E7EB"}
                onChange={(v) => handleStyleChange("subtitleColor", v)}
              />
            </div>
            <div className="mb-4 p-3 border rounded-lg">
              <h4 className="font-medium mb-2">Media</h4>
              <ImageUploadInput
                label="Background Image"
                imageUrl={component.imageUrl}
                onImageUpload={(base64) => handleInputChange("imageUrl", base64)}
                onUrlChange={(url) => handleInputChange("imageUrl", url)}
              />
            </div>
            <div className="mb-4 p-3 border rounded-lg">
              <h4 className="font-medium mb-2">Call-to-Action Button</h4>
              <label className="block mb-1 text-sm">Button Text</label>
              <input
                type="text"
                value={component.button.text}
                onChange={(e) =>
                  handleNestedInputChange("button", "text", e.target.value)
                }
                className="w-full p-2 border rounded mb-2"
              />
              <label className="block mb-1 text-sm">Button URL</label>
              <input
                type="text"
                value={component.button.url}
                onChange={(e) =>
                  handleNestedInputChange("button", "url", e.target.value)
                }
                className="w-full p-2 border rounded"
              />
              <div className="mt-2">
                <ColorInput
                  label="Button Background"
                  value={component.styles.buttonBgColor || "#4F46E5"}
                  onChange={(v) => handleStyleChange("buttonBgColor", v)}
                />
                <ColorInput
                  label="Button Text"
                  value={component.styles.buttonTextColor || "#FFFFFF"}
                  onChange={(v) => handleStyleChange("buttonTextColor", v)}
                />
              </div>
            </div>
          </div>
        );
        case "appointment":
  return (
    <div>
      <h3 className="font-semibold mb-3">Appointment Settings</h3>
      
      <div className="mb-4 p-3 border rounded-lg">
        <h4 className="font-medium mb-2">Content</h4>
        <label className="block mb-1 text-sm">Title</label>
        <input
          type="text"
          value={component.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className="w-full p-2 border rounded mb-2"
          placeholder="Book Your Appointment, Skip the Wait"
        />
        <label className="block mb-1 text-sm">Subtitle</label>
        <input
          type="text"
          value={component.subtitle}
          onChange={(e) => handleInputChange("subtitle", e.target.value)}
          className="w-full p-2 border rounded mb-2"
          placeholder="Opening hours"
        />
        <label className="block mb-1 text-sm">Description</label>
        <textarea
          value={component.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="w-full p-2 border rounded mb-2"
          rows="4"
          placeholder="With our easy online booking system..."
        />
      </div>
      
      <div className="mb-4 p-3 border rounded-lg">
        <h4 className="font-medium mb-2">Working Hours</h4>
        <label className="block mb-1 text-sm">Weekdays</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={component.workingDays.weekdays.split('\n')[0]}
            onChange={(e) => {
              const updated = {...component.workingDays};
              updated.weekdays = `${e.target.value}\n${updated.weekdays.split('\n')[1]}`;
              handleNestedInputChange("workingDays", "weekdays", updated.weekdays);
            }}
            className="w-1/2 p-2 border rounded"
            placeholder="SUN - FRI"
          />
          <input
            type="text"
            value={component.workingDays.weekdays.split('\n')[1]}
            onChange={(e) => {
              const updated = {...component.workingDays};
              updated.weekdays = `${updated.weekdays.split('\n')[0]}\n${e.target.value}`;
              handleNestedInputChange("workingDays", "weekdays", updated.weekdays);
            }}
            className="w-1/2 p-2 border rounded"
            placeholder="8AM - 10PM"
          />
        </div>
        <label className="block mb-1 text-sm">Weekend</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={component.workingDays.weekend.split('\n')[0]}
            onChange={(e) => {
              const updated = {...component.workingDays};
              updated.weekend = `${e.target.value}\n${updated.weekend.split('\n')[1]}`;
              handleNestedInputChange("workingDays", "weekend", updated.weekend);
            }}
            className="w-1/2 p-2 border rounded"
            placeholder="SAT"
          />
          <input
            type="text"
            value={component.workingDays.weekend.split('\n')[1]}
            onChange={(e) => {
              const updated = {...component.workingDays};
              updated.weekend = `${updated.weekend.split('\n')[0]}\n${e.target.value}`;
              handleNestedInputChange("workingDays", "weekend", updated.weekend);
            }}
            className="w-1/2 p-2 border rounded"
            placeholder="Closed"
          />
        </div>
      </div>
      
      <div className="mb-4 p-3 border rounded-lg">
        <h4 className="font-medium mb-2">Button</h4>
        <label className="block mb-1 text-sm">Button Text</label>
        <input
          type="text"
          value={component.button.text}
          onChange={(e) => handleNestedInputChange("button", "text", e.target.value)}
          className="w-full p-2 border rounded mb-2"
          placeholder="Book Now"
        />
        <label className="block mb-1 text-sm">Button URL</label>
        <input
          type="text"
          value={component.button.url}
          onChange={(e) => handleNestedInputChange("button", "url", e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="/appointment/book"
        />
      </div>
      
      <div className="mb-4 p-3 border rounded-lg">
        <h4 className="font-medium mb-2">Styling</h4>
        <ColorInput
          label="Background Color"
          value={component.styles.backgroundColor || "#FFFFFF"}
          onChange={(v) => handleStyleChange("backgroundColor", v)}
        />
        <ColorInput
          label="Title Color"
          value={component.styles.titleColor || "#1E1E1E"}
          onChange={(v) => handleStyleChange("titleColor", v)}
        />
        <ColorInput
          label="Subtitle Color"
          value={component.styles.subtitleColor || "#16A34A"}
          onChange={(v) => handleStyleChange("subtitleColor", v)}
        />
        <ColorInput
          label="Description Color"
          value={component.styles.descriptionColor || "#6B7280"}
          onChange={(v) => handleStyleChange("descriptionColor", v)}
        />
        <ColorInput
          label="Button Background"
          value={component.styles.buttonBgColor || "#16A34A"}
          onChange={(v) => handleStyleChange("buttonBgColor", v)}
        />
        <ColorInput
          label="Button Text Color"
          value={component.styles.buttonTextColor || "#FFFFFF"}
          onChange={(v) => handleStyleChange("buttonTextColor", v)}
        />
        <ColorInput
          label="Time Card Background"
          value={component.styles.timeCardBgColor || "#FFFFFF"}
          onChange={(v) => handleStyleChange("timeCardBgColor", v)}
        />
        <ColorInput
          label="Time Card Text Color"
          value={component.styles.timeCardTextColor || "#16A34A"}
          onChange={(v) => handleStyleChange("timeCardTextColor", v)}
        />
        <ColorInput
          label="Time Card Subtext Color"
          value={component.styles.timeCardSubtextColor || "#90BD95"}
          onChange={(v) => handleStyleChange("timeCardSubtextColor", v)}
        />
      </div>
    </div>
  );
      case "services":
  return (
    <div>
      <h3 className="font-semibold mb-3">Services Settings</h3>
      
      <div className="mb-4 p-3 border rounded-lg">
        <h4 className="font-medium mb-2">Content</h4>
        <label className="block mb-1 text-sm">Subtitle</label>
        <input
          type="text"
          value={component.subtitle}
          onChange={(e) => handleInputChange("subtitle", e.target.value)}
          className="w-full p-2 border rounded mb-2"
          placeholder="Our Story & Services"
        />
        <label className="block mb-1 text-sm">Title</label>
        <input
          type="text"
          value={component.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className="w-full p-2 border rounded mb-2"
          placeholder="Our Grooming Journey And Services"
        />
        <label className="block mb-1 text-sm">Description</label>
        <textarea
          value={component.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="w-full p-2 border rounded mb-2"
          rows="4"
        />
        <label className="block mb-1 text-sm">Button Text</label>
        <input
          type="text"
          value={component.button.text}
          onChange={(e) => handleNestedInputChange("button", "text", e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <label className="block mb-1 text-sm">Button URL</label>
        <input
          type="text"
          value={component.button.url}
          onChange={(e) => handleNestedInputChange("button", "url", e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div className="mb-4 p-3 border rounded-lg">
        <h4 className="font-medium mb-2">Service Items</h4>
        {component.items.map((item, index) => (
          <div key={item.id} className="mb-3 p-2 border rounded">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">Service {index + 1}</span>
              <button
                onClick={() => {
                  const updatedItems = component.items.filter((_, i) => i !== index);
                  handleInputChange("items", updatedItems);
                }}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <label className="block mb-1 text-xs">Title</label>
            <input
              type="text"
              value={item.title}
              onChange={(e) => {
                const updatedItems = [...component.items];
                updatedItems[index].title = e.target.value;
                handleInputChange("items", updatedItems);
              }}
              className="w-full p-2 border rounded mb-1"
            />
            <label className="block mb-1 text-xs">Description</label>
            <input
              type="text"
              value={item.description}
              onChange={(e) => {
                const updatedItems = [...component.items];
                updatedItems[index].description = e.target.value;
                handleInputChange("items", updatedItems);
              }}
              className="w-full p-2 border rounded mb-1"
            />
            <ImageUploadInput
              label="Icon Image"
              imageUrl={item.imageUrl}
              onImageUpload={(base64) => {
                const updatedItems = [...component.items];
                updatedItems[index].imageUrl = base64;
                handleInputChange("items", updatedItems);
              }}
              onUrlChange={(url) => {
                const updatedItems = [...component.items];
                updatedItems[index].imageUrl = url;
                handleInputChange("items", updatedItems);
              }}
            />
          </div>
        ))}
        <button
          onClick={() => {
            const newItem = {
              id: Date.now(),
              title: "NEW SERVICE",
              description: "Service description",
              imageUrl: ""
            };
            handleInputChange("items", [...component.items, newItem]);
          }}
          className="w-full p-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          <Plus size={16} className="inline mr-1" /> Add Service Item
        </button>
      </div>
      
      <div className="mb-4 p-3 border rounded-lg">
        <h4 className="font-medium mb-2">Styling</h4>
        <ColorInput
          label="Background Color"
          value={component.styles.backgroundColor || "#FFFFFF"}
          onChange={(v) => handleStyleChange("backgroundColor", v)}
        />
        <ColorInput
          label="Title Color"
          value={component.styles.titleColor || "#1E1E1E"}
          onChange={(v) => handleStyleChange("titleColor", v)}
        />
        <ColorInput
          label="Subtitle Color"
          value={component.styles.subtitleColor || "#4B5563"}
          onChange={(v) => handleStyleChange("subtitleColor", v)}
        />
        <ColorInput
          label="Text Color"
          value={component.styles.textColor || "#4B5563"}
          onChange={(v) => handleStyleChange("textColor", v)}
        />
        <ColorInput
          label="Service Title Color"
          value={component.styles.cardTextColor || "#16A34A"}
          onChange={(v) => handleStyleChange("cardTextColor", v)}
        />
        <ColorInput
          label="Service Description Color"
          value={component.styles.cardDescriptionColor || "#90BD95"}
          onChange={(v) => handleStyleChange("cardDescriptionColor", v)}
        />
        <ColorInput
          label="Button Background"
          value={component.styles.buttonBgColor || "#16A34A"}
          onChange={(v) => handleStyleChange("buttonBgColor", v)}
        />
        <ColorInput
          label="Button Text Color"
          value={component.styles.buttonTextColor || "#FFFFFF"}
          onChange={(v) => handleStyleChange("buttonTextColor", v)}
        />
      </div>
    </div>
  );
      case "about":
        return (
          <div>
            <h3 className="font-semibold mb-3">About Section</h3>
            <div className="mb-4 p-3 border rounded-lg">
              <h4 className="font-medium mb-2">Content</h4>
              <label className="block mb-1 text-sm">Title</label>
              <input
                type="text"
                value={component.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <label className="block mb-1 text-sm">Description</label>
              <textarea
                value={component.text}
                onChange={(e) => handleInputChange("text", e.target.value)}
                className="w-full p-2 border rounded mb-2"
                rows="5"
              />
            </div>
            <div className="mb-4 p-3 border rounded-lg">
              <h4 className="font-medium mb-2">Styling</h4>
              <ColorInput
                label="Background Color"
                value={component.styles.backgroundColor || "#FFFFFF"}
                onChange={(v) => handleStyleChange("backgroundColor", v)}
              />
              <ColorInput
                label="Text Color"
                value={component.styles.textColor || "#111827"}
                onChange={(v) => handleStyleChange("textColor", v)}
              />
            </div>
            <div className="mb-4 p-3 border rounded-lg">
              <h4 className="font-medium mb-2">Media</h4>
              <ImageUploadInput
                label="About Image"
                imageUrl={component.imageUrl}
                onImageUpload={(base64) => handleInputChange("imageUrl", base64)}
                onUrlChange={(url) => handleInputChange("imageUrl", url)}
              />
            </div>
          </div>
        );
      // Add to your CustomizationPanel switch case
case "footer":
  return (
    <div>
      <h3 className="font-semibold mb-3">Footer Settings</h3>
      
      <div className="mb-4 p-3 border rounded-lg">
        <h4 className="font-medium mb-2">Logo & Description</h4>
        <ImageUploadInput
          label="Logo Image"
          imageUrl={component.logo.imageUrl}
          onImageUpload={(base64) => handleNestedInputChange("logo", "imageUrl", base64)}
          onUrlChange={(url) => handleNestedInputChange("logo", "imageUrl", url)}
        />
        <label className="block mb-1 text-sm">Description</label>
        <textarea
          value={component.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="w-full p-2 border rounded mb-2"
          rows="3"
        />
        <label className="block mb-1 text-sm">Copyright Text</label>
        <input
          type="text"
          value={component.copyright}
          onChange={(e) => handleInputChange("copyright", e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div className="mb-4 p-3 border rounded-lg">
        <h4 className="font-medium mb-2">Quick Links</h4>
        {component.links.map((link, index) => (
          <div key={link.id} className="mb-3 p-2 border rounded">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">Link {index + 1}</span>
              <button
                onClick={() => {
                  const updatedLinks = component.links.filter((_, i) => i !== index);
                  handleInputChange("links", updatedLinks);
                }}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <label className="block mb-1 text-xs">Link Text</label>
            <input
              type="text"
              value={link.name}
              onChange={(e) => {
                const updatedLinks = [...component.links];
                updatedLinks[index].name = e.target.value;
                handleInputChange("links", updatedLinks);
              }}
              className="w-full p-2 border rounded mb-1"
            />
            <label className="block mb-1 text-xs">Link URL</label>
            <input
              type="text"
              value={link.url}
              onChange={(e) => {
                const updatedLinks = [...component.links];
                updatedLinks[index].url = e.target.value;
                handleInputChange("links", updatedLinks);
              }}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
        <button
          onClick={() => {
            const newLink = {
              id: Date.now(),
              name: "New Link",
              url: "#",
            };
            handleInputChange("links", [...component.links, newLink]);
          }}
          className="w-full p-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          <Plus size={16} className="inline mr-1" /> Add Link
        </button>
      </div>
      
      <div className="mb-4 p-3 border rounded-lg">
        <h4 className="font-medium mb-2">Contact Information</h4>
        <label className="block mb-1 text-sm">Address</label>
        <input
          type="text"
          value={component.contactInfo.address}
          onChange={(e) => handleNestedInputChange("contactInfo", "address", e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <label className="block mb-1 text-sm">Email</label>
        <input
          type="text"
          value={component.contactInfo.email}
          onChange={(e) => handleNestedInputChange("contactInfo", "email", e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <label className="block mb-1 text-sm">Phone</label>
        <input
          type="text"
          value={component.contactInfo.phone}
          onChange={(e) => handleNestedInputChange("contactInfo", "phone", e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div className="mb-4 p-3 border rounded-lg">
        <h4 className="font-medium mb-2">Social Links</h4>
        {component.socialLinks.map((social, index) => (
          <div key={index} className="mb-3 p-2 border rounded">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium capitalize">{social.icon}</span>
              <button
                onClick={() => {
                  const updatedSocials = component.socialLinks.filter((_, i) => i !== index);
                  handleInputChange("socialLinks", updatedSocials);
                }}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <label className="block mb-1 text-xs">URL</label>
            <input
              type="text"
              value={social.url}
              onChange={(e) => {
                const updatedSocials = [...component.socialLinks];
                updatedSocials[index].url = e.target.value;
                handleInputChange("socialLinks", updatedSocials);
              }}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
        <button
          onClick={() => {
            const newSocial = {
              icon: "facebook",
              url: "https://www.facebook.com/"
            };
            handleInputChange("socialLinks", [...component.socialLinks, newSocial]);
          }}
          className="w-full p-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          <Plus size={16} className="inline mr-1" /> Add Social Link
        </button>
      </div>
      
      <div className="mb-4 p-3 border rounded-lg">
        <h4 className="font-medium mb-2">Styling</h4>
        <ColorInput
          label="Background Color"
          value={component.styles.backgroundColor || "#C8F5CC"}
          onChange={(v) => handleStyleChange("backgroundColor", v)}
        />
        <ColorInput
          label="Text Color"
          value={component.styles.textColor || "#4B5563"}
          onChange={(v) => handleStyleChange("textColor", v)}
        />
        <ColorInput
          label="Highlight Color"
          value={component.styles.highlightColor || "#16A34A"}
          onChange={(v) => handleStyleChange("highlightColor", v)}
        />
      </div>
    </div>
  );
      default:
        return <p>No customization options for this component.</p>;
    }
  };

  return (
    <div className="p-4">
      {renderPanel()}
      <button
        onClick={() => removeComponent(component.id)}
        className="w-full mt-6 p-2 bg-red-500 text-white rounded flex items-center justify-center gap-2 hover:bg-red-600"
      >
        <Trash2 size={16} />
        Remove Component
      </button>
    </div>
  );
};

CustomizationPanel.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.shape(NavbarPropTypes),
    PropTypes.shape(BannerPropTypes),
    PropTypes.shape(HeroPropTypes),
    PropTypes.shape(AppointmentPropTypes),
    PropTypes.shape(ServicesPropTypes),
    PropTypes.shape(AboutPropTypes),
    PropTypes.shape(FooterPropTypes)
  ]),
  updateComponent: PropTypes.func.isRequired,
  removeComponent: PropTypes.func.isRequired,
};

// ======================
// MAIN BUILDER APP
// ======================

const App = () => {
  const [components, setComponents] = useState([]);
  const [activeComponentId, setActiveComponentId] = useState(null);

  const addComponent = (type) => {
    const newComponent = getInitialComponentData(type);
    setComponents([...components, newComponent]);
    setActiveComponentId(newComponent.id);
  };

  const updateComponent = (id, updatedData) => {
    validateComponentData(updatedData);
    setComponents(components.map((c) => (c.id === id ? updatedData : c)));
  };

  const removeComponent = (id) => {
    setComponents(components.filter((comp) => comp.id !== id));
    if (activeComponentId === id) setActiveComponentId(null);
  };

  const generateInlineStyles = (styles) => {
    if (!styles) return "";
    return Object.entries(styles)
      .map(([key, value]) => {
        const cssProperty = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        return `${cssProperty}: ${value};`;
      })
      .join(" ");
  };

  const exportWebsite = () => {
    const generateComponentHTML = (comp) => {
      const styles = comp.styles || {};
      switch (comp.type) {
        case "navbar":
          return `
            <nav class="flex items-center justify-between p-6 shadow-md" style="${generateInlineStyles({
              backgroundColor: styles.backgroundColor,
            })}">
              <div class="flex items-center">
                ${
                  comp.logo.imageUrl
                    ? `<img src="${comp.logo.imageUrl}" alt="Logo" class="h-8 mr-2" />`
                    : `<div class="text-2xl font-bold" style="color: ${styles.logoColor || "#4F46E5"}">${comp.logo.text}</div>`
                }
              </div>
              <div class="hidden md:flex items-center space-x-8">
                ${comp.links
                  .map(
                    (link) =>
                      `<a href="${link.url}" class="hover:opacity-75" style="${generateInlineStyles({
                        color: styles.linkColor,
                      })}">${link.name}</a>`
                  )
                  .join("")}
              </div>
              <a href="${comp.button.url}" class="px-5 py-2 rounded-md font-semibold" style="${generateInlineStyles({
                backgroundColor: styles.buttonBgColor || "#4F46E5",
                color: styles.buttonTextColor || "#FFFFFF",
              })}">${comp.button.text}</a>
            </nav>
          `;
         
case "banner":
  return `
    <section class="w-full" style="background: linear-gradient(to right, ${styles.backgroundColor}, ${styles.gradientToColor})">
      <div class="max-w-screen-2xl container mx-auto xl:px-24">
        <div class="py-24 flex flex-col md:flex-row-reverse items-center justify-between gap-8">
          <div class="md:w-1/2">
            <img src="${comp.imageUrl}" alt="Banner" class="w-full" />
          </div>
          <div class="md:w-1/2 px-4 space-y-6">
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight md:leading-snug mt-4 md:mt-6" style="color: ${styles.titleColor}">
              ${comp.title} <span style="color: ${styles.highlightedWordColor}">${comp.highlightedWord}</span>
            </h2>

            <p class="text-lg md:text-xl mb-6" style="color: ${styles.textColor}">
              ${comp.subtitle}
            </p>
            <a href="${comp.button.url}" class="font-semibold btn px-8 py-3 md:px-10 md:py-3 rounded-full mt-4 inline-block" 
               style="background-color: ${styles.buttonBgColor}; color: ${styles.buttonTextColor}">
              ${comp.button.text}
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
  case "categories":
  return `
    <section class="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-16" style="background-color: ${styles.backgroundColor}">
      <div class="text-center">
        <p class="subtitle" style="color: ${styles.subtitleColor}">${comp.subtitle}</p>
        <h2 class="title" style="color: ${styles.titleColor}">${comp.title}</h2>
      </div>

      <div class="flex flex-col sm:flex-row flex-wrap gap-8 justify-around items-center mt-12">
        ${comp.items.map(item => `
          <div class="shadow-lg rounded-md py-6 px-5 w-72 mx-auto text-center cursor-pointer hover:-translate-y-4 transition-all duration-300 z-10" style="background-color: ${styles.cardBgColor}">
            <div class="w-full mx-auto flex items-center justify-center">
              ${item.imageUrl ? `
                <img src="${item.imageUrl}" alt="" class="p-5 rounded-full w-28 h-28" style="background-color: ${styles.highlightColor}20" />
              ` : `
                <div class="p-5 rounded-full w-28 h-28 flex items-center justify-center" style="background-color: ${styles.highlightColor}20">
                  <svg class="w-12 h-12" style="color: ${styles.highlightColor}" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                  </svg>
                </div>
              `}
            </div>
            <div class="mt-5 space-y-1">
              <h5 style="color: ${styles.textColor}; font-weight: 600">${item.title}</h5>
              <p style="color: ${styles.subtitleColor}; font-size: 0.875rem">${item.description}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
        case "hero":
          return `
            <section class="relative bg-cover bg-center text-white py-24 px-4" style="background-image: url('${
              comp.imageUrl
            }');">
              <div class="absolute inset-0 bg-black opacity-50"></div>
              <div class="relative z-10 max-w-4xl mx-auto text-center">
                <h1 class="text-4xl md:text-6xl font-extrabold" style="${generateInlineStyles({
                  color: styles.titleColor,
                })}">${comp.title}</h1>
                <p class="mt-4 text-lg md:text-xl" style="${generateInlineStyles({
                  color: styles.subtitleColor,
                })}">${comp.subtitle}</p>
                <a href="${comp.button.url}" class="mt-8 inline-block px-8 py-3 rounded-md text-lg font-semibold" style="${generateInlineStyles({
                backgroundColor: styles.buttonBgColor || "#4F46E5",
                color: styles.buttonTextColor || "#FFFFFF",
              })}">${comp.button.text}</a>
              </div>
            </section>
          `;
          case "appointment":
  return `
    <section class="py-16 px-4" style="background-color: ${styles.backgroundColor}">
      <div class="max-w-screen-2xl mx-auto">
        <div class="flex flex-col md:flex-row items-center justify-between gap-16">
          <!-- Time Cards Container -->
          <div class="relative md:w-1/2">
            <!-- Weekdays Time Card -->
            <div class="shadow-[7px_12px_43px_0_#00000023] rounded-[30px] w-[260px] h-[112px] text-center space-y-2 cursor-pointer hover:border hover:border-indigo-600 transition-all duration-200 flex flex-col justify-center"
                 style="background-color: ${styles.timeCardBgColor}; color: ${styles.timeCardTextColor}; margin-bottom: 1rem">
              <h5 class="text-[20px] font-bold">${comp.workingDays.weekdays.split('\n')[0]}</h5>
              <p class="text-[16px] font-semibold" style="color: ${styles.timeCardSubtextColor}">
                ${comp.workingDays.weekdays.split('\n')[1]}
              </p>
            </div>

            <!-- Weekend Time Card -->
            <div class="shadow-[7px_12px_43px_0_#00000023] rounded-[30px] w-[260px] h-[112px] text-center space-y-2 cursor-pointer hover:border hover:border-indigo-600 transition-all duration-200 flex flex-col justify-center"
                 style="background-color: ${styles.timeCardBgColor}; color: ${styles.timeCardTextColor}">
              <h5 class="text-[20px] font-bold">${comp.workingDays.weekend.split('\n')[0]}</h5>
              <p class="text-[16px] font-semibold" style="color: ${styles.timeCardSubtextColor}">
                ${comp.workingDays.weekend.split('\n')[1]}
              </p>
            </div>
          </div>

          <!-- Content Section -->
          <div class="md:w-[55%]">
            <div class="text-left md:w-5/5 space-y-10">
              <p class="subtitle !font-bold" style="color: ${styles.subtitleColor}; font-size: 0.875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em">
                ${comp.subtitle}
              </p>
              <h2 class="title" style="color: ${styles.titleColor}; font-size: 2.25rem; font-weight: 700; line-height: 1.2">
                ${comp.title}
              </h2>
              <p class="my-5 leading-[30px]" style="color: ${styles.descriptionColor}; font-size: 1rem; line-height: 1.875rem">
                ${comp.description}
              </p>
              <a href="${comp.button.url}" class="font-semibold btn px-10 py-3 rounded-full inline-block"
                 style="background-color: ${styles.buttonBgColor}; color: ${styles.buttonTextColor}; font-size: 1rem; font-weight: 600">
                ${comp.button.text}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
        case "services":
  return `
    <section class="py-16 px-4 sm:px-6" style="background-color: ${styles.backgroundColor}">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row items-center justify-between gap-0">
          <div class="md:w-1/2">
            <div class="text-left md:w-4/5">
              <p class="subtitle text-sm font-medium uppercase tracking-wider" style="color: ${styles.subtitleColor}">
                ${comp.subtitle}
              </p>
              <h2 class="title text-3xl md:text-4xl font-bold mt-2 mb-4" style="color: ${styles.titleColor}">
                ${comp.title}
              </h2>
              <p class="my-5 leading-[30px] text-base" style="color: ${styles.textColor}">
                ${comp.description}
              </p>
              <a href="${comp.button.url}" class="font-semibold btn px-10 py-3 rounded-full inline-block" 
                 style="background-color: ${styles.buttonBgColor}; color: ${styles.buttonTextColor}">
                ${comp.button.text}
              </a>
            </div>
          </div>

          <div class="md:w-1/2">
            <div class="grid sm:grid-cols-2 grid-cols-1 gap-8 items-center">
              ${comp.items.map(service => `
                <div class="shadow-md rounded-sm py-5 px-4 text-center space-y-2 cursor-pointer hover:border hover:border-indigo-600 transition-all duration-200" style="color: ${styles.cardTextColor}">
                  ${service.imageUrl ? `
                    <img src="${service.imageUrl}" alt="" class="mx-auto" />
                  ` : `
                    <div class="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  `}
                  <h5 class="pt-3 font-semibold">${service.title}</h5>
                  <p class="px-2" style="color: ${styles.cardDescriptionColor}">${service.description}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
        case "about":
          return `
            <section class="py-16 px-4" style="${generateInlineStyles({
              backgroundColor: styles.backgroundColor,
            })}">
              <div class="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
                <div class="flex-1">
                  <h2 class="text-3xl font-bold" style="${generateInlineStyles({
                    color: styles.textColor,
                  })}">${comp.title}</h2>
                  <div class="mt-6" style="${generateInlineStyles({
                    color: styles.textColor,
                  })}">${comp.text}</div>
                </div>
                ${
                  comp.imageUrl
                    ? `<div class="flex-1">
                        <img src="${comp.imageUrl}" alt="About Us" class="w-full rounded-lg shadow-lg" />
                      </div>`
                    : ""
                }
              </div>
            </section>
          `;
        case "footer":
  return `
    <footer style="background-color: ${styles.backgroundColor}; padding: 2.5rem 0; margin-top: 2.5rem;">
      <div class="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        <div>
          <div class="flex items-center space-x-2 mb-4">
            ${comp.logo.imageUrl ? 
              `<img src="${comp.logo.imageUrl}" alt="Logo" class="w-20 h-16" />` : 
              `<span class="text-lg font-bold" style="color: ${styles.textColor}">${comp.logo.text}</span>`
            }
          </div>
          <p style="color: ${styles.textColor}">${comp.description}</p>
          <div class="flex space-x-4 mt-4">
            ${comp.socialLinks.map(social => `
              <a href="${social.url}" target="_blank" rel="noopener noreferrer" 
                 style="color: ${styles.textColor}" class="cursor-pointer transition-colors duration-300 hover:text-[${styles.highlightColor}]">
                ${social.icon === 'facebook' ? '<i class="fab fa-facebook-f"></i>' : ''}
                ${social.icon === 'twitter' ? '<i class="fab fa-twitter"></i>' : ''}
                ${social.icon === 'instagram' ? '<i class="fab fa-instagram"></i>' : ''}
                ${social.icon === 'youtube' ? '<i class="fab fa-youtube"></i>' : ''}
              </a>
            `).join('')}
          </div>
        </div>

        <div>
          <h4 class="text-lg font-semibold mb-4" style="color: ${styles.textColor}">Quick links</h4>
          <ul class="space-y-2">
            ${comp.links.map(link => `
              <li><a href="${link.url}" style="color: ${styles.textColor}" class="hover:text-[${styles.highlightColor}]">${link.name}</a></li>
            `).join('')}
          </ul>
        </div>

        <div>
          <h4 class="text-lg font-semibold mb-4" style="color: ${styles.textColor}">Contact Us</h4>
          <ul class="space-y-2" style="color: ${styles.textColor}">
            <li class="flex items-center space-x-2">
              <i class="fas fa-map-marker-alt" style="color: ${styles.highlightColor}"></i>
              <span>${comp.contactInfo.address}</span>
            </li>
            <li class="flex items-center space-x-2">
              <i class="fas fa-envelope" style="color: ${styles.highlightColor}"></i>
              <span>${comp.contactInfo.email}</span>
            </li>
            <li class="flex items-center space-x-2">
              <i class="fas fa-phone" style="color: ${styles.highlightColor}"></i>
              <span>${comp.contactInfo.phone}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="border-t border-gray-300 mt-10 pt-6 text-center" style="color: ${styles.textColor}">
        <p>${comp.copyright}</p>
      </div>
    </footer>
  `;
        default:
          return `<!-- ${comp.type} component -->`;
      }
    };

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Custom Website</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { 
      font-family: 'Inter', sans-serif;
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body>
${components.map(generateComponentHTML).join("\n")}
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-website.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const activeComponent = components.find((c) => c.id === activeComponentId);

  const componentTypes = [
    { type: "navbar", name: "Navbar" },
    { type: "banner", name: "Banner" },
    { type: "categories", name: "Categories" },
    { type: "hero", name: "Hero Section" },
    { type: "appointment", name: "Appointment" },
    { type: "services", name: "Services" },
    { type: "about", name: "About Us" },
    { type: "footer", name: "Footer" },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Left Sidebar */}
      <div className="w-64 bg-white shadow-lg p-5 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Add Sections</h2>
        <div className="space-y-2">
          {componentTypes.map(({ type, name }) => (
            <button
              key={type}
              onClick={() => addComponent(type)}
              className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 rounded-lg hover:bg-indigo-100 hover:text-indigo-800 transition-colors"
            >
              <Plus size={18} />
              <span>{name}</span>
            </button>
          ))}
        </div>
        <button
          onClick={exportWebsite}
          className="w-full mt-8 p-3 bg-green-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
        >
          <Code size={18} />
          <span>Export Website</span>
        </button>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-full mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-4 min-h-full">
            {components.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <h2 className="text-2xl font-semibold">Canvas is Empty</h2>
                <p className="mt-2">Add a section to begin.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {components.map((comp) => (
                  <div
                    key={comp.id}
                    className={`relative p-2 border-2 rounded-lg transition-all duration-300 ${
                      activeComponentId === comp.id
                        ? "border-indigo-500 shadow-lg"
                        : "border-transparent hover:border-indigo-200"
                    }`}
                  >
                    <ComponentPreview
                      component={comp}
                      onClick={() => setActiveComponentId(comp.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-96 bg-white shadow-lg overflow-y-auto">
        <h2 className="text-xl font-bold p-4 border-b text-gray-800 sticky top-0 bg-white z-10">
          Customize Section
        </h2>
        <CustomizationPanel
          component={activeComponent}
          updateComponent={updateComponent}
          removeComponent={removeComponent}
        />
      </div>
    </div>
  );
};

export default App;
