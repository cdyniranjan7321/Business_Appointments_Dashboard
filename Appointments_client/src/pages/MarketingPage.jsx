import { useState } from 'react';
import { FiMail, FiPhone } from 'react-icons/fi';

const Marketing = () => {
  const [campaign, setCampaign] = useState({
    title: '',
    description: '',
    targetAudience: '',
    startDate: '',
    endDate: '',
    platformType: 'email', // 'email', 'sms', or 'both'
    image: null,
    previewImage: null
  });

  const [shareOptions, setShareOptions] = useState({
    email: false,
    phone: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCampaign(prev => ({ ...prev, [name]: value }));
    
    // Clear image if switching to SMS
    if (name === 'platformType' && value === 'sms') {
      setCampaign(prev => ({ ...prev, image: null, previewImage: null }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCampaign(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setCampaign(prev => ({ ...prev, previewImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleShareOption = (option) => {
    setShareOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Campaign submitted:', campaign);
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset form after 10 minutes (600,000 milliseconds)
      setTimeout(() => {
        setIsSuccess(false);
        setCampaign({
          title: '',
          description: '',
          targetAudience: '',
          startDate: '',
          endDate: '',
          platformType: 'email',
          image: null,
          previewImage: null
        });
        setShareOptions({
          email: false,
          phone: false
        });
      }, 600000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-gray-100 overflow-auto p-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Create SMS/Email Marketing Campaign</h1>
          <p className="mt-2 text-lg text-gray-600">
            Design and share your campaign via email or SMS
          </p>
        </div>

        {isSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            Campaign created successfully! Sharing options are now available.
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Campaign Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Campaign Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={campaign.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              {/* Campaign Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Message Content
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={campaign.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>


              {/* Platform Type */}
              <div>
                <label htmlFor="platformType" className="block text-sm font-medium text-gray-700">
                  Platform Type
                </label>
                <select
                  id="platformType"
                  name="platformType"
                  value={campaign.platformType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="email">Email Only</option>
                  <option value="sms">SMS Only</option>
                  <option value="both">Both Email and SMS</option>
                </select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={campaign.startDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={campaign.endDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>

              {/* Image Upload (only show for email options) */}
              {(campaign.platformType === 'email' || campaign.platformType === 'both') && (
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                    Campaign Image (for email)
                  </label>
                  <div className="mt-1 flex items-center">
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Upload Image
                    </label>
                    <input
                      id="image-upload"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                    {campaign.previewImage && (
                      <div className="ml-4">
                        <img
                          src={campaign.previewImage}
                          alt="Campaign preview"
                          className="h-16 w-16 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Creating Campaign...' : 'Create Campaign'}
              </button>
            </div>
          </form>

          {/* Share Options (visible after successful submission) */}
          {isSuccess && (
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Share Campaign</h3>
              <div className="flex flex-wrap gap-4">
                {/* Email - only show if platformType includes email */}
                {(campaign.platformType === 'email' || campaign.platformType === 'both') && (
                  <button
                    onClick={() => toggleShareOption('email')}
                    className={`flex items-center px-4 py-2 rounded-md ${shareOptions.email ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-700'} border border-gray-300 shadow-sm`}
                  >
                    <FiMail className="mr-2" />
                    Email
                  </button>
                )}

                {/* SMS - only show if platformType includes sms */}
                {(campaign.platformType === 'sms' || campaign.platformType === 'both') && (
                  <button
                    onClick={() => toggleShareOption('phone')}
                    className={`flex items-center px-4 py-2 rounded-md ${shareOptions.phone ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-700'} border border-gray-300 shadow-sm`}
                  >
                    <FiPhone className="mr-2" />
                    SMS
                  </button>
                )}
              </div>

              {/* Email form */}
              {shareOptions.email && (
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-2">
                    Send via Email
                  </h4>
                  <div className="flex">
                    <input
                      type="email"
                      placeholder="Enter email addresses (comma separated)"
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Send
                    </button>
                  </div>
                </div>
              )}

              {/* SMS form */}
              {shareOptions.phone && (
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-2">
                    Send via SMS
                  </h4>
                  <div className="flex">
                    <input
                      type="tel"
                      placeholder="Enter phone numbers (comma separated)"
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketing;