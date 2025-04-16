import { useState } from 'react';
import { FiMail, FiPhone, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

const Marketing = () => {
  const [campaign, setCampaign] = useState({
    title: '',
    description: '',
    targetAudience: '',
    startDate: '',
    endDate: '',
    budget: '',
    image: null,
    previewImage: null
  });

  const [shareOptions, setShareOptions] = useState({
    email: false,
    phone: false,
    facebook: false,
    twitter: false,
    instagram: false,
    linkedin: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCampaign(prev => ({ ...prev, [name]: value }));
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
          budget: '',
          image: null,
          previewImage: null
        });
        setShareOptions({
          email: false,
          phone: false,
          facebook: false,
          twitter: false,
          instagram: false,
          linkedin: false
        });
      }, 600000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Create Marketing Campaign</h1>
          <p className="mt-2 text-lg text-gray-600">
            Design and share your campaign across multiple channels
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
                  Description
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

              {/* Target Audience */}
              <div>
                <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">
                  Target Audience
                </label>
                <input
                  type="text"
                  id="targetAudience"
                  name="targetAudience"
                  value={campaign.targetAudience}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
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

              {/* Budget */}
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                  Budget ($)
                </label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  min="0"
                  value={campaign.budget}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Campaign Image
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
                {/* Email */}
                <button
                  onClick={() => toggleShareOption('email')}
                  className={`flex items-center px-4 py-2 rounded-md ${shareOptions.email ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-700'} border border-gray-300 shadow-sm`}
                >
                  <FiMail className="mr-2" />
                  Email
                </button>

                {/* Phone */}
                <button
                  onClick={() => toggleShareOption('phone')}
                  className={`flex items-center px-4 py-2 rounded-md ${shareOptions.phone ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-700'} border border-gray-300 shadow-sm`}
                >
                  <FiPhone className="mr-2" />
                  SMS/Phone
                </button>

                {/* Facebook */}
                <button
                  onClick={() => toggleShareOption('facebook')}
                  className={`flex items-center px-4 py-2 rounded-md ${shareOptions.facebook ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700'} border border-gray-300 shadow-sm`}
                >
                  <FiFacebook className="mr-2" />
                  Facebook
                </button>

                {/* Twitter */}
                <button
                  onClick={() => toggleShareOption('twitter')}
                  className={`flex items-center px-4 py-2 rounded-md ${shareOptions.twitter ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700'} border border-gray-300 shadow-sm`}
                >
                  <FiTwitter className="mr-2" />
                  Twitter
                </button>

                {/* Instagram */}
                <button
                  onClick={() => toggleShareOption('instagram')}
                  className={`flex items-center px-4 py-2 rounded-md ${shareOptions.instagram ? 'bg-pink-100 text-pink-700' : 'bg-white text-gray-700'} border border-gray-300 shadow-sm`}
                >
                  <FiInstagram className="mr-2" />
                  Instagram
                </button>

                {/* LinkedIn */}
                <button
                  onClick={() => toggleShareOption('linkedin')}
                  className={`flex items-center px-4 py-2 rounded-md ${shareOptions.linkedin ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700'} border border-gray-300 shadow-sm`}
                >
                  <FiLinkedin className="mr-2" />
                  LinkedIn
                </button>
              </div>

              {/* Share form based on selected option */}
              {(shareOptions.email || shareOptions.phone) && (
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-2">
                    {shareOptions.email ? 'Send via Email' : 'Send via SMS/Phone'}
                  </h4>
                  <div className="flex">
                    <input
                      type={shareOptions.email ? 'email' : 'tel'}
                      placeholder={shareOptions.email ? 'Enter email addresses (comma separated)' : 'Enter phone numbers (comma separated)'}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Send
                    </button>
                  </div>
                </div>
              )}

              {shareOptions.facebook && (
                <div className="mt-6 p-4 bg-blue-50 rounded-md">
                  <p className="text-blue-700">Your campaign is ready to be shared on Facebook. Click below to post.</p>
                  <button className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Share on Facebook
                  </button>
                </div>
              )}

              {shareOptions.twitter && (
                <div className="mt-6 p-4 bg-blue-50 rounded-md">
                  <p className="text-blue-700">Your campaign is ready to be shared on Twitter. Click below to tweet.</p>
                  <button className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Share on Twitter
                  </button>
                </div>
              )}

              {shareOptions.instagram && (
                <div className="mt-6 p-4 bg-pink-50 rounded-md">
                  <p className="text-pink-700">Your campaign is ready to be shared on Instagram. Click below to post.</p>
                  <button className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                    Share on Instagram
                  </button>
                </div>
              )}

              {shareOptions.linkedin && (
                <div className="mt-6 p-4 bg-blue-50 rounded-md">
                  <p className="text-blue-700">Your campaign is ready to be shared on LinkedIn. Click below to post.</p>
                  <button className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Share on LinkedIn
                  </button>
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