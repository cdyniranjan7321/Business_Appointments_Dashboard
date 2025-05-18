// ProductDetailsPage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiArrowLeft, FiEdit, FiTrash2, FiPrinter } from 'react-icons/fi';

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:6001/api/products/${productId}`);
        const data = await response.json();
        
        if (data.success) {
          setProduct(data.product);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to fetch product details');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="p-4">Product not found</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FiArrowLeft className="mr-2" /> Back to products
        </button>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded flex items-center hover:bg-blue-700">
            <FiEdit className="mr-2" /> Edit
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded flex items-center hover:bg-red-700">
            <FiTrash2 className="mr-2" /> Delete
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded flex items-center hover:bg-gray-300">
            <FiPrinter className="mr-2" /> Print
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Product Image */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-center p-4">
                  No image available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className={`mt-1 px-2 py-1 inline-block rounded-full text-xs ${
                      product.status === 'active' ? 'bg-green-100 text-green-800' : 
                      product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {product.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="mt-1">{product.description || 'No description'}</p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Pricing</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="mt-1">रु {product.price?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Compare-at Price</p>
                    <p className="mt-1">रु {product.compareAtPrice?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cost per item</p>
                    <p className="mt-1">रु {product.costPerItem?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Inventory</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">SKU</p>
                    <p className="mt-1">{product.sku || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Barcode</p>
                    <p className="mt-1">{product.barcode || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quantity</p>
                    <p className="mt-1">{product.inventory || '0'} in stock</p>
                  </div>
                </div>
              </div>

              {/* Organization */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Organization</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="mt-1">{product.category || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="mt-1">{product.type || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vendor</p>
                    <p className="mt-1">{product.vendor || 'Not set'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Variants Section */}
            {product.variants?.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">Variants</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Option</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inventory</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {product.variants.map((variant, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {variant.images?.[0] && (
                                <div className="flex-shrink-0 h-10 w-10 mr-3">
                                  <img className="h-10 w-10 rounded" src={variant.images[0]} alt="" />
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">{variant.values?.join(', ') || 'Variant'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            रु {variant.prices?.[0] || product.price?.toFixed(2) || '0.00'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {variant.sku?.[0] || product.sku || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {variant.available?.[0] || product.inventory || '0'} in stock
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
      </div>
    </div>
  );
};

export default ProductDetailsPage;