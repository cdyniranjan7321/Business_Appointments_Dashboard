
import { useEffect, useRef, useState } from 'react';
import { FiMoreHorizontal, FiUpload, FiPlus, FiSearch, FiChevronDown, FiX, FiImage, FiPrinter, 
  FiCopy, FiEdit2, FiTrash2, FiChevronUp, FiEye } from 'react-icons/fi';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

const ProductPages = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [showVariantBox, setShowVariantBox] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const moreActionsRef = useRef(null);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sortConfig, setSortConfig] = useState({

    key: 'name',
    direction: 'asc'
  });
  const sortRef = useRef(null);

  const navigate = useNavigate();


  // Close more actions dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (moreActionsRef.current && !moreActionsRef.current.contains(event.target)) {
      setShowMoreActions(false);
    }
    if (sortRef.current && !sortRef.current.contains(event.target)) {
      setShowSortOptions(false);
    }
  };

  // Add event listener when component mounts
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Add these sorting functions
const requestSort = (key) => {
  let direction = 'asc';
  if (sortConfig.key === key && sortConfig.direction === 'asc') {
    direction = 'desc';
  }
  setSortConfig({ key, direction });
};

const getSortedProducts = (items) => {
  if (!sortConfig.key) return items;
  
  return [...items].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

  // Handle product selection
  const handleProductSelect = (productId, isSelected) => {
    if (isSelected) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  // Handle select all products
  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedProducts(filteredProducts.map(product => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  // Handle update action
  const handleUpdate = async () => {
  if (selectedProducts.length !== 1) {
    alert('Please select exactly one product to update');
    return;
  }

  try {
    const productId = selectedProducts[0];
    const productToUpdate = products.find(p => p.id === productId);
    
    // Set the product data in your form state
    setNewProduct({
      title: productToUpdate.name || '',
      description: productToUpdate.description || '',
      status: productToUpdate.status || 'active',
      price: productToUpdate.price || 0,
      compareAtPrice: productToUpdate.compareAtPrice || 0,
      costPerItem: productToUpdate.costPerItem || 0,
      trackQuantity: productToUpdate.trackQuantity || false,
      quantity: productToUpdate.inventory || productToUpdate.quantity || 0,
      continueSelling: productToUpdate.continueSelling || false,
      sku: productToUpdate.sku || '',
      barcode: productToUpdate.barcode || '',
      category: productToUpdate.category || '',
      type: productToUpdate.type || '',
      vendor: productToUpdate.vendor || '',
      collections: productToUpdate.collections || '',
      tags: productToUpdate.tags?.join(', ') || '',
      variants: productToUpdate.variants || [],
      image: productToUpdate.image || null
    });

    if (productToUpdate.image) {
      setUploadedImage(productToUpdate.image);
    }

    // Set the editing product ID
    setEditingProduct(productId);
    
    // Open the modal
    setShowAddProduct(true);

  } catch (error) {
    console.error('Error preparing product for update:', error);
    alert('Failed to prepare product for update');
  }
};

  // Handle delete action
  const handleDelete = async () => {
  if (selectedProducts.length === 0) {
    alert('Please select at least one product to delete');
    return;
  }

  if (!window.confirm(`Are you sure you want to delete ${selectedProducts.length} selected product(s)?`)) {
    return;
  }

  try {
    const response = await fetch('http://localhost:6001/api/products/bulk-delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productIds: selectedProducts
      })
    });

    const data = await response.json();
    
    if (data.success) {
      // Refresh products list
      const refreshResponse = await fetch(`http://localhost:6001/api/products?status=${activeTab}`);
      const refreshData = await refreshResponse.json();
      if (refreshData.success) {
        setProducts(refreshData.products);
      }
      setSelectedProducts([]);
      setShowMoreActions(false);
    }
  } catch (error) {
    console.error('Error deleting products:', error);
  }
};

  // Handle duplicate action
  const handleDuplicate = async () => {
  if (selectedProducts.length === 0) {
    alert('Please select at least one product to duplicate');
    return;
  }

  try {
    const response = await fetch('http://localhost:6001/api/products/bulk-duplicate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productIds: selectedProducts
      })
    });

    const data = await response.json();
    
    if (data.success) {
      // Refresh products list
      const refreshResponse = await fetch(`http://localhost:6001/api/products?status=${activeTab}`);
      const refreshData = await refreshResponse.json();
      if (refreshData.success) {
        setProducts(refreshData.products);
      }
      setSelectedProducts([]);
      setShowMoreActions(false);
    }
  } catch (error) {
    console.error('Error duplicating products:', error);
  }
};

  const handlePrint = () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.text('Products List', 14, 15);
      
      // Prepare data for the table
      const tableData = filteredProducts.map(product => [
        product.name || 'N/A',
        product.status || 'N/A',
        product.inventory !== '' ? product.inventory : 'N/A',
        product.salesChannels || 'N/A',
        product.markets || 'N/A',
        product.category || 'N/A',
        product.type || 'N/A'
      ]);

      // Add the table
      autoTable(doc, {
        head: [['Product', 'Status', 'Inventory', 'Size', 'Quantity', 'Category', 'Type']],
        body: tableData,
        startY: 20,
        styles: {
          fontSize: 8,
          cellPadding: 2,
          valign: 'middle'
        },
        headStyles: {
          fillColor: [34, 139, 34],
          textColor: 255
        }
      });
      
      // Open print dialog
      window.open(doc.output('bloburl'), '_blank');
    } catch (error) {
      console.error('Error generating print document:', error);
      alert('Failed to generate print document. Please try again.');
    }
  };

  // Add this to your existing functions
const handleDetails = () => {
  if (selectedProducts.length === 1) {
    const productToView = products.find(p => p.id === selectedProducts[0]);
    // Navigate to details page with the product ID
   navigate(`/products/${productToView.id}`);
  } else {
    alert('Please select exactly one product to view details');
  }
};
  
   const handleExport = () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.text('Products Export', 14, 15);
      
      // Prepare data for the table
      const tableData = filteredProducts.map(product => [
        product.name || 'N/A',
        product.status || 'N/A',
        product.inventory !== '' ? product.inventory : 'N/A',
        product.size || 'N/A',
        product.quantity || 'N/A',
        product.category || 'N/A',
        product.type || 'N/A'
      ]);
      
      // Add the table
      autoTable(doc, {
        head: [['Product', 'Status', 'Inventory', 'Size', 'Quantity', 'Category', 'Type']],
        body: tableData,
        startY: 20,
        styles: {
          fontSize: 8,
          cellPadding: 2,
          valign: 'middle'
        },
        headStyles: {
          fillColor: [34, 139, 34],
          textColor: 255
        }
      });
      
      // Save the PDF
      doc.save('products_export.pdf');
    } catch (error) {
      console.error('Error generating export document:', error);
      alert('Failed to generate export document. Please try again.');
    }
  };


  // Sample initial product data
  const [products, setProducts] = useState([]);

 const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://localhost:6001/api/products?status=${activeTab}&search=${searchQuery}&sort=${sortConfig.key}&direction=${sortConfig.direction}`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, [activeTab, searchQuery, sortConfig]);

  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    status: 'active',
    salesChannels: ['Online Store', 'Google & YouTube', 'Point of Sale'],
    markets: ['Nepal', 'International'],
    price: 0.00,
    compareAtPrice: 0.00,
    costPerItem: 0.00,
    trackQuantity: false,
    continueSelling: false,
    hasSKU: false,
    quantity: '',
    size: '',
    sku: '',
    barcode: '',
    physicalProduct: false,
    weight: 0.0,
    weightUnit: 'kg',
    countryOfOrigin: '',
    hsCode: '',
    category: '',
    vendor: '',
    collections: '',
    tags: '',
    seoTitle: '',
    seoDescription: '',
    template: 'Default product',
    variants: [],
  });

// Handler for variant detail changes
const handleVariantDetailChange = (variantIndex, valueIndex, field, value) => {
  setNewProduct(prev => {
    const updatedVariants = [...prev.variants];
    if (!updatedVariants[variantIndex][field]) {
      updatedVariants[variantIndex][field] = [];
    }
    updatedVariants[variantIndex][field][valueIndex] = value;
    return {
      ...prev,
      variants: updatedVariants
    };
  });
};

// Handler for variant image upload
const handleVariantImageUpload = (variantIndex, valueIndex, e) => {
  const file = e.target.files[0];
  if (file) {
    setNewProduct(prev => {
      const updatedVariants = [...prev.variants];
      if (!updatedVariants[variantIndex].images) {
        updatedVariants[variantIndex].images = [];
      }
      updatedVariants[variantIndex].images[valueIndex] = file;
      return {
        ...prev,
        variants: updatedVariants
      };
    });
  }
};

// Modified handleAddVariant
const handleAddVariant = () => {
  const values = variantOptions.values.split(',').map(v => v.trim());
  setNewProduct(prev => ({
    ...prev,
    variants: [
      ...prev.variants,
      {
        name: variantOptions.name,
        values: values,
        sku: Array(values.length).fill(''),
        prices: Array(values.length).fill(''),
        available: Array(values.length).fill(''),
        images: Array(values.length).fill(null)
      }
    ]
  }));
  setShowVariantBox(false);
  setVariantOptions({ name: '', values: '' });
};

  const [variantOptions, setVariantOptions] = useState({
    values: '',
  });


  const handleVariantCheckboxChange = (variantIndex, valueIndex, checked) => {
  setNewProduct(prev => {
    const updatedVariants = [...prev.variants];
    if (!updatedVariants[variantIndex].active) {
      updatedVariants[variantIndex].active = [];
    }
    updatedVariants[variantIndex].active[valueIndex] = checked;
    return {
      ...prev,
      variants: updatedVariants
    };
  });
};

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setImageLoading(false);
      };
      reader.onerror = () => {
        setImageLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const productData = {
      name: newProduct.title,
      description: newProduct.description,
      status: newProduct.status,
      price: newProduct.price,
      compareAtPrice: newProduct.compareAtPrice,
      costPerItem: newProduct.costPerItem,
      trackQuantity: newProduct.trackQuantity,
      inventory: newProduct.quantity,
      continueSelling: newProduct.continueSelling,
      sku: newProduct.sku,
      barcode: newProduct.barcode,
      category: newProduct.category,
      type: newProduct.type,
      vendor: newProduct.vendor,
      collections: newProduct.collections,
      tags: newProduct.tags.split(',').map(tag => tag.trim()),
      variants: newProduct.variants,
      image: uploadedImage
    };

    let response;
    if (editingProduct) {
      // Update existing product
      response = await fetch(`http://localhost:6001/api/products/${editingProduct}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
    } else {
      // Create new product
      response = await fetch('http://localhost:6001/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
    }

    const data = await response.json();
    
    if (data.success) {
      // Refresh products list
      const refreshResponse = await fetch(`http://localhost:6001/api/products?status=${activeTab}`);
      const refreshData = await refreshResponse.json();
      if (refreshData.success) {
        setProducts(refreshData.products);
      }
      handleCloseModal();
    }
  } catch (error) {
    console.error('Error saving product:', error);
    alert('Failed to save product');
  }
};

  const handleCloseModal = () => {
  setNewProduct({
    title: '',
    description: '',
    status: 'active',
    price: 0.00,
    compareAtPrice: 0.00,
    costPerItem: 0.00,
    trackQuantity: true,
    continueSelling: false,
    quantity: '',
    sku: '',
    barcode: '',
    category: '',
    type: '',
    vendor: '',
    collections: '',
    tags: '',
    variants: []
  });
  setUploadedImage(null);
  setEditingProduct(null);
  setShowAddProduct(false);
};

  // Filter products based on active tab and search query
  const filteredProducts = getSortedProducts(
  products.filter(product => {
    const matchesTab = activeTab === 'all' || 
                     (activeTab === 'active' && product.status === 'active') ||
                     (activeTab === 'draft' && product.status === 'draft') ||
                     (activeTab === 'archived' && product.status === 'archived');
    
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  })
);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addVariant = () => {
    setShowVariantBox(true);
    setVariantOptions({
      name: '',
      values: ''
    });
  };

  const handleVariantInputChange = (e) => {
    const { name, value } = e.target;
    setVariantOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  
  
  return (
    <div className="fixed inset-0 bg-gray-100 overflow-auto p-6">
      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-7">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Add product</h2>
                <button 
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-red-600"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Title */}
                <div className="space-y-2 text-left">
                  <h3 className="text-lg font-medium">Title</h3>
                  <input
                    type="text"
                    name="title"
                    value={newProduct.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Enter product name..."
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2 text-left">
                  <h3 className="text-lg font-medium">Description</h3>
                  <textarea
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded h-32"
                    placeholder="Paragraph"
                  />
                </div>

                {/* Media */}
                <div className="space-y-2 text-left">
                  <h3 className="text-lg font-medium">Media</h3>
                  <div className="flex space-x-4 border border-spacing-2 py-3 px-3 bg-gray-100">
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        disabled={imageLoading}
                        className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded p-4 w-32 h-32 hover:bg-gray-200 bg-white
                           ${imageLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {imageLoading ? (
                          <span className="text-sm">Uploading...</span>
                        ) : (
                          <>
                            <FiUpload className="text-gray-400 mb-2" />
                            <span className="text-sm">Upload now</span>
                          </>
                        )}
                      </button>
                    </div>
                    {uploadedImage && (
                      <div className="relative">
                        <img 
                          src={uploadedImage} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => setUploadedImage(null)}
                          className="absolute top-0 right-0 bg-gray-200 rounded-full p-1 hover:bg-gray-300"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Accepts images, videos, or 3D models</p>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {/* Left Column */}
                  <div className="col-span-2 space-y-6">

                    {/* Pricing */}
                 <div className="space-y-2 border border-spacing-3 pb-4 py-2 px-3 shadow-md rounded-lg">
                    <h3 className="text-lg font-medium">Pricing</h3>
                     <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium mb-1">Price</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                           <span className="text-gray-500">रु</span>
                  </div>
                   <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    className="w-full p-2 pl-8 border border-gray-300 rounded"
                    step="0.01"
                    min="0"
                    required
                   />
                 </div>
              </div>
           <div>
                <label className="block text-sm font-medium mb-1">Compare-at price</label>
                  <div className="relative">
                   <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">रु</span>
                   </div>
        <input
          type="number"
          name="compareAtPrice"
          value={newProduct.compareAtPrice}
          onChange={handleInputChange}
          className="w-full p-2 pl-8 border border-gray-300 rounded"
          step="0.01"
          min="0"
        />
      </div>
    </div>
  </div>
  
  {/* Charge Tax Checkbox */}
  <div className="mt-4 flex items-center">
    <input
      type="checkbox"
      id="chargeTax"
      name="chargeTax"
      checked={newProduct.chargeTax}
      onChange={handleInputChange}
      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
    />
    <label htmlFor="chargeTax" className="ml-2 block text-sm text-black">
      Charge tax on this product
    </label>
  </div>

  <div className="mt-2">
    <label className="block text-sm font-medium mb-1">Cost per item</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <span className="text-gray-500">रु</span>
      </div>
      <input
        type="number"
        name="costPerItem"
        value={newProduct.costPerItem}
        onChange={handleInputChange}
        className="w-full p-2 pl-8 border border-gray-300 rounded"
        step="0.01"
        min="0"
      />
    </div>
    <p className="text-xs text-gray-500 mt-1">Customers won&apos;t see this</p>
  </div>
</div>

                    {/* Inventory Section */}
                    <div className="space-y-4 border border-spacing-3 py-3 px-3 pb-6 shadow-md rounded-lg">
                      <h3 className="text-lg font-medium">Inventory</h3>
                      
                      {/* Track Quantity */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="trackQuantity"
                          name="trackQuantity"
                          checked={newProduct.trackQuantity}
                          onChange={handleInputChange}
                          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <label htmlFor="trackQuantity" className="ml-2 block text-sm text-gray-700">
                          Track quantity
                        </label>
                      </div>

                      {/* Quantity Input */}
                      {newProduct.trackQuantity && (
                        <div className="mt-2 flex items-center justify-between">
                          <div className="border-b border-gray-300 pb-1 w-1/3">
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                              Quantity
                            </label>
                          </div>
                          <div className="w-2/3 flex justify-end">
                            <input
                              type="text"
                              id="quantity"
                              name="quantity"
                              value={newProduct.quantity}
                              onChange={handleInputChange}
                              className="w-1/2 p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500 text-sm"
                              placeholder="0"
                            />
                          </div>
                        </div>
                      )}

                      {/* Continue Selling When Out of Stock */}
                      <div className="flex items-center mt-4">
                        <input
                          type="checkbox"
                          id="continueSelling"
                          name="continueSelling"
                          checked={newProduct.continueSelling}
                          onChange={handleInputChange}
                          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <label htmlFor="continueSelling" className="ml-2 block text-sm text-gray-700">
                          Continue selling when out of stock
                        </label>
                      </div>

                      {/* SKU/Barcode Section */}
                      <div className="mt-6">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="hasSKU"
                            name="hasSKU"
                            checked={newProduct.hasSKU}
                            onChange={handleInputChange}
                            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <label htmlFor="hasSKU" className="ml-2 block text-sm text-gray-700">
                            This product has a SKU or barcode
                          </label>
                        </div>

                        {newProduct.hasSKU && (
                          <div className="mt-4">
                            <div className="grid grid-cols-2 gap-4">
                              {/* SKU Input */}
                              <div>
                                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                                  SKU (Stock Keeping Unit)
                                </label>
                                <input
                                  type="text"
                                  id="sku"
                                  name="sku"
                                  value={newProduct.sku}
                                  onChange={handleInputChange}
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500 text-sm"
                                />
                              </div>

                              {/* Barcode Input */}
                              <div>
                                <label htmlFor="barcode" className="block text-sm font-medium text-gray-700 mb-1">
                                  Barcode (ISBN, UPC, GTIN, etc.)
                                </label>
                                <input
                                  type="text"
                                  id="barcode"
                                  name="barcode"
                                  value={newProduct.barcode}
                                  onChange={handleInputChange}
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500 text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>        

        {/* Variants */}
<div className="space-y-2 border border-spacing-2 py-3 px-3 shadow-md rounded-lg">
  <h3 className="text-lg font-medium">Variants</h3>
  <button 
    type="button"
    onClick={addVariant}
    className="px-3 py-1 text-sm border border-gray-300 rounded flex items-center hover:bg-gray-200"
  >
    <FiPlus className="mr-1" /> Add another option
  </button>

  {showVariantBox && (
    <div className="border border-gray-200 rounded p-4 mt-2 bg-white">
      <div>
        <label className="block text-sm font-medium mb-1">Size</label>
        <input
          type="text"
          name="values"
          placeholder="Enter comma-separated values (e.g., 3kg, 6kg)"
          className="w-full p-2 border border-gray-300 rounded text-sm"
          value={variantOptions.values}
          onChange={handleVariantInputChange}
        />
        <p className="text-xs text-gray-500 mt-1">Separate options with a comma</p>
      </div>
      <div className="flex justify-between mt-4">
        <button 
          type="button"
          className="px-3 py-1 bg-white text-red-500 rounded text-sm hover:bg-gray-300"
          onClick={() => {
            setShowVariantBox(false);
            setVariantOptions({
              values: ''
            });
          }}
        >
          Delete
        </button>
        <button 
          type="button"
          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          onClick={handleAddVariant}
          disabled={!variantOptions.values}
        >
          Done
        </button>
      </div>
    </div>
  )}

  {/* Display added variants */}
  {newProduct.variants.length > 0 && (
    <div className="mt-4 space-y-4">
      <h4 className="text-md font-medium mb-2">Current Variants</h4>
      
      {/* Variant options - Simplified to match screenshot */}
      <div className="border border-gray-200 rounded p-4">
        {/* Header row */}
        <div className="flex items-center mb-2 border-b pb-2">
          <span className="font-medium w-10"></span> {/* Checkbox space */}
          <span className="font-medium w-40">Variant</span> {/* Combined photo + size */}
          <span className="font-medium flex-1">Price</span>
          <span className="font-medium w-32">Available</span>
        </div>
        
        {/* Variant rows */}
        {newProduct.variants.map((variant, index) => (
          <div key={index} className="space-y-2">
            {variant.values.map((value, valueIndex) => (
              <div key={valueIndex} className="flex items-center py-2">
                {/* Checkbox - now on far left */}
                <div className="w-10 flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={variant.active?.[valueIndex] !== false}
                    onChange={(e) => handleVariantCheckboxChange(index, valueIndex, e.target.checked)}
                  />
                </div>
                
                {/* Combined photo + size name + SKU */}
                <div className="w-40">
                  <div className="flex items-center">
                    <div className="mr-3">
                      {variant.images?.[valueIndex] ? (
                        <img 
                          src={URL.createObjectURL(variant.images[valueIndex])} 
                          alt={value}
                          className="h-10 w-10 object-cover rounded"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                          <FiImage className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="block">{value}</span>
                      <span className="block text-xs text-gray-500">
                        SKU: {variant.sku?.[valueIndex] || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Price */}
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="रु"
                    className="w-34 p-2 border border-gray-300 rounded text-sm"
                    value={variant.prices?.[valueIndex] || ''}
                    onChange={(e) => handleVariantDetailChange(index, valueIndex, 'prices', e.target.value)}
                  />
                </div>
                
                {/* Available */}
                <div className="w-30 px-2">
                  <input
                    type="text"
                    placeholder="Available value"
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    value={variant.available?.[valueIndex] || ''}
                    onChange={(e) => handleVariantDetailChange(index, valueIndex, 'available', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )}
</div>
</div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Status */}
                    <div className="space-y-2 border border-spacing-2 px-3 py-3 shadow-md rounded-lg">
                      <h3 className="text-lg font-medium">Status</h3>
                      <select
                        name="status"
                        value={newProduct.status}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      >
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>                    

                    {/* Product Organization */}
                    <div className="space-y- border border-spacing-3 px-2 py-2 shadow-md rounded-lg">
                      <h3 className="text-lg font-medium">Product organization</h3>
                      <div className="space-y-4">
                        <div className="text-left">
                          <label className="block text-sm font-medium mb-1">Type</label>
                          <input
                            type="text"
                            name="type"
                            value={newProduct.type}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="e.g. Clothing"
                          />
                        </div>
                        <div className="text-left">
                          <label className="block text-sm font-medium mb-1">Vendor</label>
                          <input
                            type="text"
                            name="vendor"
                            value={newProduct.vendor}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="e.g. Nike"
                          />
                        </div>
                        <div className="text-left">
                          <label className="block text-sm font-medium mb-1">Category</label>
                          <input
                            type="text"
                            name="category"
                            value={newProduct.category}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="e.g. Apparel"
                          />
                        </div>
                        <div className="text-left">
                          <label className="block text-sm font-medium mb-1">Collections</label>
                          <input
                            type="text"
                            name="collections"
                            value={newProduct.collections}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="e.g. Summer Collection"
                          />
                        </div>
                        <div className="text-left">
                          <label className="block text-sm font-medium mb-1">Tags</label>
                          <input
                            type="text"
                            name="tags"
                            value={newProduct.tags}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Add tags..."
                          />
                        </div>
                      </div>
                    </div>                    
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 mt-6 border-t pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Save product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`${showAddProduct ? 'blur-sm' : ''}`}>
        {/* Header with actions */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <div className="flex space-x-2">
            <button
               onClick={handlePrint}
            className="px-3 py-2 bg-gray-200 border border-gray-300 rounded-md text-sm flex items-center hover:bg-white">
              <FiPrinter className="mr-2" /> Print
            </button>
            <button 
               onClick={handleExport}
            className="px-3 py-2 bg-gray-200 border border-gray-300 rounded-md text-sm flex items-center hover:bg-white">
              <FiUpload className="mr-2" /> Export
            </button>
            <div className="relative" ref={moreActionsRef}>
              <button 
                className="px-3 py-2 bg-gray-200 border border-gray-300 rounded-md text-sm flex items-center hover:bg-white"
                onClick={() => setShowMoreActions(!showMoreActions)}
                disabled={selectedProducts.length === 0}
              >
                <FiMoreHorizontal className="mr-2" /> More actions
              </button>
              
              {showMoreActions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="py-1">
                    <button
                      onClick={handleUpdate}
                      disabled={selectedProducts.length !== 1}
                      className={`flex items-center px-4 py-2 text-sm w-full text-left ${selectedProducts.length === 1 ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-400 cursor-not-allowed'}`}
                    >
                      <FiEdit2 className="mr-2" /> Update
                    </button>
                    <button
                      onClick={handleDuplicate}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <FiCopy className="mr-2" /> Duplicate
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-100 w-full text-left"
                    >
                      <FiTrash2 className="mr-2" /> Delete
                    </button>
                    <button
                      onClick={() => handleDetails()}
                      disabled={selectedProducts.length !== 1}
                      className={`flex items-center px-4 py-2 text-sm w-full text-left
                       ${selectedProducts.length === 1 ? 
                       'text-gray-700 hover:bg-gray-100' : 'text-gray-400 cursor-not-allowed'
                       }`}
                     >
                         <FiEye className="mr-2" /> Details
                     </button>
                  </div>
                </div>
              )}
            </div>
            
            <button 
              className="px-4 py-2 bg-green-600 text-white rounded-md text-sm flex items-center hover:bg-green-700"
              onClick={() => setShowAddProduct(true)}
            >
              <FiPlus className="mr-2" /> Add product
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 my-4"></div>

        {/* Product Table Section */}
        <div className="mt-4">
          {/* Top Navigation Tabs and Search */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-1 border-b border-gray-200 pb-1">
              <button 
                className={`px-3 py-2 text-sm rounded-t-md ${activeTab === 'all' ? 'bg-white border-t border-l border-r border-gray-200 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button 
                className={`px-3 py-2 text-sm rounded-t-md ${activeTab === 'active' ? 'bg-white border-t border-l border-r border-gray-200 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('active')}
              >
                Active
              </button>
              <button 
                className={`px-3 py-2 text-sm rounded-t-md ${activeTab === 'draft' ? 'bg-white border-t border-l border-r border-gray-200 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('draft')}
              >
                Draft
              </button>
              <button 
                className={`px-3 py-2 text-sm rounded-t-md ${activeTab === 'archived' ? 'bg-white border-t border-l border-r border-gray-200 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('archived')}
              >
                Archived
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Sort Dropdown */}
      <div className="relative" ref={sortRef}>
        <button 
          className="px-3 py-2 bg-gray-200 border border-gray-300 rounded-md text-sm flex items-center hover:bg-gray-50"
          onClick={() => setShowSortOptions(!showSortOptions)}
        >
          Sort <FiChevronDown className="ml-2" />
        </button>
        
        {showSortOptions && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200 py-1">
            <div className="py-1">
              <button
                onClick={() => {
                  requestSort('name');
                  setShowSortOptions(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => {
                  requestSort('status');
                  setShowSortOptions(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => {
                  requestSort('inventory');
                  setShowSortOptions(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Inventory {sortConfig.key === 'inventory' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 text-xs text-gray-500 font-medium mb-3 px-2 py-3 bg-gray-200">
            <div className="col-span-1 flex items-center">
              <input 
                  type="checkbox" 
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
              onChange={(e) => handleSelectAll(e.target.checked)}
                  />
            </div>
            
            <div 
      className="col-span-4 flex items-center cursor-pointer hover:text-gray-700"
      onClick={() => requestSort('name')}
    >
      Product
      {sortConfig.key === 'name' && (
        sortConfig.direction === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
      )}
    </div>
    <div 
      className="col-span-1 cursor-pointer hover:text-gray-700"
      onClick={() => requestSort('status')}
    >
      Status
      {sortConfig.key === 'status' && (
        sortConfig.direction === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
      )}
    </div>
    <div 
      className="col-span-1 cursor-pointer hover:text-gray-700"
      onClick={() => requestSort('inventory')}
    >
      Inventory
      {sortConfig.key === 'inventory' && (
        sortConfig.direction === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
      )}
    </div>
    <div className="col-span-1">Size</div>
    <div className="col-span-1">Quantity</div>
    <div className="col-span-2">Category</div>
    <div className="col-span-1">Type</div>
  </div>

          {/* Table Rows */}
          <div className="space-y-2">
            {filteredProducts.map((product) => (
              <div key={product.id} className="grid grid-cols-12 gap-4 text-sm border-b border-gray-200 pb-3 px-2 hover:bg-green-200 items-center">
                <div className="col-span-1 flex items-center">
                  <input 
                       type="checkbox" 
                       className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                       checked={selectedProducts.includes(product.id)}
                  onChange={(e) => handleProductSelect(product.id, e.target.checked)}
                       />
                </div>
                <div className="col-span-4 flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-md mr-3 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150';
                        }}
                      />
                    ) : (
                      <FiImage className="text-gray-400" />
                    )}
                  </div>
                  <span className="truncate">{product.name}</span>
                </div>
                <div className="col-span-1">
                  {product.status && (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.status === 'active' ? 'bg-green-100 text-green-800' : 
                      product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {product.status}
                    </span>
                  )}
                </div>
                <div className="col-span-1">
                  {product.inventory !== '' ? `${product.inventory} in stock` : ''}
                </div>
                <div className="col-span-1">
                  {product.size || ''}
                </div>
                <div className="col-span-1">
                  {product.quantity || ''}
                </div>
                <div className="col-span-2">
                  {product.category || ''}
                </div>
                <div className="col-span-1">
                  {product.type || ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductPages;