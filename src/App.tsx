import { useEffect, useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import ContactPage from './pages/ContactPage';
import AboutUs from './pages/AboutUs';

const WHATSAPP_URL = 'https://wa.me/918882473038';

const AppRoutes = () => {
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    message: '',
  });
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    company: '',
    phone: '',
  });

  const validateName = (value: string) => {
    if (value.length > 20) {
      return 'Name must be 20 characters or less';
    }
    return '';
  };

  const validateCompany = (value: string) => {
    if (value.length > 30) {
      return 'Company name must be 30 characters or less';
    }
    return '';
  };

  const validatePhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 10) {
      return 'Phone number must be exactly 10 digits';
    }
    return '';
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    if (name === 'name') {
      const error = validateName(value);
      setValidationErrors(prev => ({
        ...prev,
        name: error,
      }));
    } else if (name === 'company') {
      const error = validateCompany(value);
      setValidationErrors(prev => ({
        ...prev,
        company: error,
      }));
    } else if (name === 'phone') {
      const error = validatePhone(value);
      setValidationErrors(prev => ({
        ...prev,
        phone: error,
      }));
    }

    if (name === 'name') {
      setFormData(prev => ({
        ...prev,
        name: value.slice(0, 50),
      }));
    } else if (name === 'company') {
      setFormData(prev => ({
        ...prev,
        company: value.slice(0, 50),
      }));
    } else if (name === 'phone') {
      setFormData(prev => ({
        ...prev,
        phone: value,
      }));
    } else if (name === 'message') {
      setFormData(prev => ({
        ...prev,
        message: value.slice(0, 50),
      }));
    }
  };

  const startPopupTimer = () => {
    // Clear any existing timer
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    // Set popup to appear after 30 seconds
    timerRef.current = window.setTimeout(() => {
      setShowPopup(true);
    }, 30000);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Don't show popup on contact page
    if (location.pathname === '/contact') {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setShowPopup(false);
      return;
    }

    // Start timer when entering non-contact pages
    startPopupTimer();

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [location.pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nameError = validateName(formData.name);
    const companyError = validateCompany(formData.company);
    const phoneError = validatePhone(formData.phone);

    setValidationErrors({
      name: nameError,
      company: companyError,
      phone: phoneError,
    });

    if (nameError || companyError || phoneError) {
      return;
    }

    const message = `Hello! I would like to know more about your products.

Name: ${formData.name}
Company: ${formData.company}
Phone: ${formData.phone}
Message: ${formData.message}

Please get back to me.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `${WHATSAPP_URL}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');

    setFormData({
      name: '',
      company: '',
      phone: '',
      message: '',
    });

    setValidationErrors({
      name: '',
      company: '',
      phone: '',
    });

    handleClose();
  };

  const handleClose = () => {
    setShowPopup(false);
    // Restart timer after closing popup
    startPopupTimer();
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>

      {showPopup && location.pathname !== '/contact' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl leading-none"
              aria-label="Close contact popup"
            >
              ×
            </button>
            <div className="mb-4 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Perfect Group
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Have questions about our products or need a custom packaging solution? Get in touch with our team.
              </p>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-3 mt-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#f89a24] focus:ring-1 focus:ring-[#f89a24] outline-none text-sm"
                  value={formData.name}
                  onChange={handleInputChange}
                  maxLength={50}
                  required
                />
                {validationErrors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {validationErrors.name}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="company"
                  placeholder="Company Name"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#f89a24] focus:ring-1 focus:ring-[#f89a24] outline-none text-sm"
                  value={formData.company}
                  onChange={handleInputChange}
                  maxLength={50}
                  required
                />
                {validationErrors.company && (
                  <p className="mt-1 text-xs text-red-500">
                    {validationErrors.company}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#f89a24] focus:ring-1 focus:ring-[#f89a24] outline-none text-sm"
                  maxLength={10}
                  value={formData.phone}
                  onChange={handleInputChange}
                  pattern="\d{10}"
                  onInvalid={(event) => event.currentTarget.setCustomValidity('Please enter 10 digit number')}
                  onInput={(event) => event.currentTarget.setCustomValidity('')}
                />
                {validationErrors.phone && (
                  <p className="mt-1 text-xs text-red-500">
                    {validationErrors.phone}
                  </p>
                )}
              </div>
              <textarea
                rows={3}
                name="message"
                placeholder="How can we help you? (max 50 characters)"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#f89a24] focus:ring-1 focus:ring-[#f89a24] outline-none text-sm resize-none"
                value={formData.message}
                onChange={handleInputChange}
              />
              <button
                type="submit"
                className="w-full bg-[#f89a24] hover:bg-[#e08a1d] text-white font-bold uppercase tracking-widest px-6 py-3 rounded-lg text-xs sm:text-sm shadow-lg transition-colors"
              >
                Contact Us on WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
