import { useState, useRef } from 'react';
import { PhotoIcon, TrashIcon, PlusIcon,MapPinIcon} from '@heroicons/react/24/outline';

const ProductPage = () => {
  // Form state
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    costPerItem: '',
    weight: '',
    weightUnit: 'kg',
    inventoryManagement: false,
    variants: [],
    media: [],
    locations: []
  });

  const [variantOptions, setVariantOptions] = useState([]);
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [newVariant, setNewVariant] = useState({
    name: '',
    values: '',
    price: '',
    sku: '',
    inventory: ''
  });

  const [showLocationForm, setShowLocationForm] = useState(false);
  const [newLocation, setNewLocation] = useState({
    name: '',
    inventory: ''
  });
  const fileInputRef = useRef(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle media upload
  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setProduct(prev => ({
      ...prev,
      media: [...prev.media, ...newMedia]
    }));
  };

  // Remove media item
  const removeMedia = (index) => {
    const updatedMedia = [...product.media];
    updatedMedia.splice(index, 1);
    setProduct(prev => ({
      ...prev,
      media: updatedMedia
    }));
  };

  // Handle variant option changes
  const handleVariantOptionChange = (e) => {
    const { name, value } = e.target;
    setNewVariant(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add variant option
  const addVariantOption = () => {
    if (!newVariant.name || !newVariant.values) return;
    
    const valuesArray = newVariant.values.split(',').map(v => v.trim());
    const option = {
      name: newVariant.name,
      values: valuesArray
    };
    
    setVariantOptions(prev => [...prev, option]);
    setNewVariant({
      name: '',
      values: '',
      price: '',
      sku: '',
      inventory: ''
    });
    setShowVariantForm(false);
  };

  // Generate all possible variant combinations
  const generateVariants = () => {
    if (variantOptions.length === 0) return;

    // Generate cartesian product of all variant options
    const generateCombinations = (options) => {
      if (options.length === 0) return [];
      if (options.length === 1) {
        return options[0].values.map(value => ({
          name: `${options[0].name}: ${value}`,
          option: `${options[0].name}`,
          value: value,
          price: product.price || 0,
          sku: '',
          inventory: 0
        }));
      }

      const [first, ...rest] = options;
      const restCombinations = generateCombinations(rest);
      
      return first.values.flatMap(value => 
        restCombinations.map(combination => ({
          name: `${first.name}: ${value}, ${combination.name}`,
          option: `${first.name},${combination.option}`,
          value: `${value},${combination.value}`,
          price: product.price || 0,
          sku: '',
          inventory: 0
        }))
      );
    };

    const newVariants = generateCombinations(variantOptions);
    
    setProduct(prev => ({
      ...prev,
      variants: [...prev.variants, ...newVariants]
    }));
  };

  // Update variant
  const updateVariant = (index, field, value) => {
    const updatedVariants = [...product.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value
    };
    setProduct(prev => ({
      ...prev,
      variants: updatedVariants
    }));
  };

  // Remove variant
  const removeVariant = (index) => {
    const updatedVariants = [...product.variants];
    updatedVariants.splice(index, 1);
    setProduct(prev => ({
      ...prev,
      variants: updatedVariants
    }));
  };

  // Handle location changes
  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setNewLocation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add location
  const addLocation = () => {
    if (!newLocation.name) return;
    
    setProduct(prev => ({
      ...prev,
      locations: [...prev.locations, newLocation]
    }));
    
    setNewLocation({
      name: '',
      inventory: ''
    });
    setShowLocationForm(false);
  };

  // Remove location
  const removeLocation = (index) => {
    const updatedLocations = [...product.locations];
    updatedLocations.splice(index, 1);
    setProduct(prev => ({
      ...prev,
      locations: updatedLocations
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Product submitted:', product);
    // Here you would typically send the data to your backend
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Add Product</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Product Information Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Information</h2>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={product.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={product.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Media</label>
              <div className="mt-1 flex flex-wrap gap-4">
                {product.media.map((item, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={item.preview}
                      alt={`Preview ${index}`}
                      className="h-24 w-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="h-24 w-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400"
                >
                  <PhotoIcon className="h-8 w-8" />
                  <span className="text-xs mt-1">Add Media</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleMediaUpload}
                  className="hidden"
                  multiple
                  accept="image/*"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Pricing Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="compareAtPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Compare at price
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="compareAtPrice"
                  name="compareAtPrice"
                  value={product.compareAtPrice}
                  onChange={handleChange}
                  className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="costPerItem" className="block text-sm font-medium text-gray-700 mb-1">
                Cost per item
                <span className="text-xs text-gray-500 ml-1">(Customers won&apos;t see this)</span>
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="costPerItem"
                  name="costPerItem"
                  value={product.costPerItem}
                  onChange={handleChange}
                  className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Inventory Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Inventory</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="inventoryManagement"
                  name="inventoryManagement"
                  checked={product.inventoryManagement}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="inventoryManagement" className="ml-2 block text-sm text-gray-700">
                  Track inventory
                </label>
              </div>
              
              {product.inventoryManagement && (
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setShowLocationForm(true)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" />
                    Add Location
                  </button>
                  
                  {showLocationForm && (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="locationName" className="block text-sm font-medium text-gray-700 mb-1">
                            Location Name
                          </label>
                          <input
                            type="text"
                            id="locationName"
                            name="name"
                            value={newLocation.name}
                            onChange={handleLocationChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="locationInventory" className="block text-sm font-medium text-gray-700 mb-1">
                            Inventory
                          </label>
                          <input
                            type="number"
                            id="locationInventory"
                            name="inventory"
                            value={newLocation.inventory}
                            onChange={handleLocationChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            min="0"
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowLocationForm(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={addLocation}
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Add Location
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {product.locations.length > 0 && (
                    <div className="border rounded-md divide-y">
                      {product.locations.map((location, index) => (
                        <div key={index} className="p-3 flex justify-between items-center">
                          <div className="flex items-center">
                            <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="font-medium">{location.name}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span>{location.inventory || 0} available</span>
                            <button
                              type="button"
                              onClick={() => removeLocation(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Weight
              </label>
              <div className="flex">
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={product.weight}
                  onChange={handleChange}
                  className="block w-full rounded-l-md border-r-0 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                <select
                  name="weightUnit"
                  value={product.weightUnit}
                  onChange={handleChange}
                  className="rounded-r-md border-l-0 border-gray-300 bg-gray-50 text-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="lb">lb</option>
                  <option value="oz">oz</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Variants Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Variants</h2>
          
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => setShowVariantForm(true)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" />
              Add Variant Option
            </button>
            
            {showVariantForm && (
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="variantName" className="block text-sm font-medium text-gray-700 mb-1">
                      Option Name (e.g., Size, Color)
                    </label>
                    <input
                      type="text"
                      id="variantName"
                      name="name"
                      value={newVariant.name}
                      onChange={handleVariantOptionChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Size"
                    />
                  </div>
                  <div>
                    <label htmlFor="variantValues" className="block text-sm font-medium text-gray-700 mb-1">
                      Option Values
                    </label>
                    <input
                      type="text"
                      id="variantValues"
                      name="values"
                      value={newVariant.values}
                      onChange={handleVariantOptionChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Small, Medium, Large"
                    />
                    <p className="mt-1 text-xs text-gray-500">Separate values with commas</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowVariantForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={addVariantOption}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Option
                  </button>
                </div>
              </div>
            )}
            
            {variantOptions.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Variant Options</h3>
                <div className="space-y-2">
                  {variantOptions.map((option, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium">{option.name}:</span> {option.values.join(', ')}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...variantOptions];
                          updated.splice(index, 1);
                          setVariantOptions(updated);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={generateVariants}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Generate Variants
                </button>
              </div>
            )}
            
            {product.variants.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Variant Combinations</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Variant
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SKU
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Inventory
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {product.variants.map((variant, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {variant.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              value={variant.price}
                              onChange={(e) => updateVariant(index, 'price', e.target.value)}
                              className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              min="0"
                              step="0.01"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={variant.sku}
                              onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                              className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              value={variant.inventory}
                              onChange={(e) => updateVariant(index, 'inventory', e.target.value)}
                              className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              min="0"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              type="button"
                              onClick={() => removeVariant(index)}
                              className="text-red-500 hover:text-red-700 mr-2"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductPage;