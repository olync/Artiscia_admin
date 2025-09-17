import React, { useState, useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ProductForm = ({ product, categories, subcategories , onClose, onSuccess }) => {
  const { addProduct, updateProduct } = useProducts();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    material: '',
    type: '',
    Product_length: '',
    Product_breadth: '',
    Product_height: '',
    brand: '',
    category: '',
    subcategory: '',
    price: '',
    color: '',
    discountPrice: '',
    currency: 'INR',
    stockQuantity: '',
    availabilityStatus: 'In Stock',
    videoUrl: '',
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    tags: [],
    handlingTime: '',
    returnPolicy: '',
    shippingWeight: '',
    featured: '',
    featuredDisplayOrder : '',
    shippingDimensions: {
      length: '',
      width: '',
      height: ''
    }
  });

  const [images, setImages] = useState({
    mainImage: null,
    additionalImages: []
  });

  // Image preview states
  const [imagePreviews, setImagePreviews] = useState({
    mainImage: null,
    additionalImages: []
  });

  // Image management states for tracking removals
  const [imageStates, setImageStates] = useState({
    mainImageRemoved: false,
    removedAdditionalImages: [], // URLs of additional images that were removed
    keepAdditionalImages: [], // URLs of additional images to keep
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  // WYSIWYG Editor configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  };

  const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet',
    'indent',
    'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  // Populate form when editing
  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || '',
        description: product.description || '',
        material: product.material || '',
        type: product.type || '',
        Product_length: product.Product_length || '',
        Product_breadth: product.Product_breadth || '',
        Product_height: product.Product_height || '',
        brand: product.brand || '',
        category: product.category?._id || '',
        subcategory: product.subcategory?._id || '',
        price: product.price || '',
        color: product.color || '',
        discountPrice: product.discountPrice || '',
        currency: product.currency || 'INR',
        stockQuantity: product.stockQuantity || '',
        availabilityStatus: product.availabilityStatus || 'In Stock',
        videoUrl: product.videoUrl || '',
        metaTitle: product.metaTitle || '',
        metaDescription: product.metaDescription || '',
        keywords: product.keywords || [],
        tags: product.tags || [],
        handlingTime: product.handlingTime || '',
        returnPolicy: product.returnPolicy || '',
        featured: product.featured?.toString() || '',
        featuredDisplayOrder : product.featuredDisplayOrder || '' ,
        shippingWeight: product.shippingWeight || '',
        shippingDimensions: {
          length: product.shippingDimensions?.length || '',
          width: product.shippingDimensions?.width || '',
          height: product.shippingDimensions?.height || ''
        }
      });

      // Reset image states for editing
      setImageStates({
        mainImageRemoved: false,
        removedAdditionalImages: [],
        keepAdditionalImages: product.additionalImageUrls || []
      });

      // Set existing image previews for editing
      if (product.mainImageUrl) {
        setImagePreviews(prev => ({
          ...prev,
          mainImage: product.mainImageUrl
        }));
      }

      if (product.additionalImageUrls && product.additionalImageUrls.length > 0) {
        setImagePreviews(prev => ({
          ...prev,
          additionalImages: product.additionalImageUrls
        }));
      }
    } else {
      // Reset for new product
      setImageStates({
        mainImageRemoved: false,
        removedAdditionalImages: [],
        keepAdditionalImages: []
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle WYSIWYG editor change
  const handleDescriptionChange = (content) => {
    setFormData(prev => ({
      ...prev,
      description: content
    }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    
    if (name === 'mainImage' && files[0]) {
      const file = files[0];
      setImages(prev => ({
        ...prev,
        mainImage: file
      }));

      // Reset main image removal flag
      setImageStates(prev => ({
        ...prev,
        mainImageRemoved: false
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => ({
          ...prev,
          mainImage: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    } else if (name === 'additionalImages' && files.length > 0) {
      const fileArray = Array.from(files);
      setImages(prev => ({
        ...prev,
        additionalImages: fileArray
      }));

      // Create previews for multiple images
      const previewPromises = fileArray.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(previewPromises).then(previews => {
        setImagePreviews(prev => ({
          ...prev,
          additionalImages: [...prev.additionalImages, ...previews]
        }));
      });

      // Reset additional images management
      setImageStates(prev => ({
        ...prev,
        removedAdditionalImages: [],
      }));
    }
  };

  const removeMainImage = () => {
    setImages(prev => ({
      ...prev,
      mainImage: null
    }));
    setImagePreviews(prev => ({
      ...prev,
      mainImage: null
    }));
    
    // Mark main image for removal if it's an existing image
    if (product && product.mainImageUrl) {
      setImageStates(prev => ({
        ...prev,
        mainImageRemoved: true
      }));
    }
    
    // Clear the file input
    const mainImageInput = document.querySelector('input[name="mainImage"]');
    if (mainImageInput) mainImageInput.value = '';
  };

  const removeAdditionalImage = (index) => {
    const imageUrlToRemove = imagePreviews.additionalImages[index];
    
    // If it's an existing image URL (not a new file), add to removal list
    if (typeof imageUrlToRemove === 'string' && imageUrlToRemove.startsWith('http')) {
      setImageStates(prev => ({
        ...prev,
        removedAdditionalImages: [...prev.removedAdditionalImages, imageUrlToRemove],
        keepAdditionalImages: prev.keepAdditionalImages.filter(url => url !== imageUrlToRemove)
      }));
    }
    
    setImages(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }));
    
    setImagePreviews(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }));
    
    // Clear the file input if no images left and no existing images
    const remainingImages = imagePreviews.additionalImages.filter((_, i) => i !== index);
    const hasExistingImages = remainingImages.some(url => typeof url === 'string' && url.startsWith('http'));
    const hasNewFiles = images.additionalImages.length > 0;
    
    if (!hasExistingImages && !hasNewFiles) {
      const additionalImagesInput = document.querySelector('input[name="additionalImages"]');
      if (additionalImagesInput) additionalImagesInput.value = '';
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (index) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        ...images
      };

      // Add image management data for updates
      if (product) {
        if (imageStates.mainImageRemoved) {
          submitData.mainImageRemoved = 'true';
        }
        
        if (imageStates.removedAdditionalImages.length > 0) {
          submitData.removedAdditionalImages = JSON.stringify(imageStates.removedAdditionalImages);
        }
        
        // Send list of additional images to keep (existing ones that weren't removed)
        if (imageStates.keepAdditionalImages.length > 0) {
          submitData.keepAdditionalImages = JSON.stringify(imageStates.keepAdditionalImages);
        }
      }

      console.log('Submit data:', submitData);

      if (product) {
        await updateProduct(product._id, submitData);
      } else {
        await addProduct(submitData);
      }

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h3 className="text-2xl font-bold text-gray-800">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter brand name"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <div className="border border-gray-300 rounded-lg">
                  <ReactQuill
                    theme="snow"
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Enter detailed product description..."
                    style={{
                      minHeight: '200px',
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Use the toolbar above to format your description with headings, lists, links, and more.
                </p>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Product Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="e.g., Polyresin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="e.g., Showpiece"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select Subcategory</option>
                 {subcategories &&
                  subcategories
                    .filter(sub => {
                      const parent = sub.parentCategory;
                      return typeof parent === 'object'
                        ? parent._id === formData.category
                        : parent === formData.category;
                    })
                    .map(sub => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Color */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="eg. golden"
                  />
                </div>

                {/* Featured */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"> Featured Product</label>
                   <select
                      name="featured"
                      value={formData.featured}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select</option>
                      <option value="true">true</option>
                      <option value="false">false</option>
                    </select>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Featured Display Order</label>
                  <input
                    type="number"
                   name="featuredDisplayOrder"
        value={formData.featuredDisplayOrder || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="eg. 2"
                  />
                </div>
            </div>
          </div>

          {/* Dimensions */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Dimensions (cm) </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Length </label>
                <input
                  type="number"
                  name="Product_length"
                  value={formData.Product_length}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Width </label>
                <input
                  type="number"
                  name="Product_breadth"
                  value={formData.Product_breadth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height </label>
                <input
                  type="number"
                  name="Product_height"
                  value={formData.Product_height}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="0"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Pricing & Inventory</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Original Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discounted Price</label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="availabilityStatus"
                  value={formData.availabilityStatus}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Pre-order">Pre-order</option>
                </select>
              </div>
            </div>
          </div>

          {/* Images with Previews */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Product Images</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Main Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Image *</label>
                <input
                  type="file"
                  name="mainImage"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required={!product && !imagePreviews.mainImage}
                />
                
                {/* Main Image Preview */}
                {imagePreviews.mainImage && (
                  <div className="mt-4 relative inline-block">
                    <img 
                      src={imagePreviews.mainImage} 
                      alt="Main product preview" 
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeMainImage}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Additional Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
                <input
                  type="file"
                  name="additionalImages"
                  onChange={handleImageChange}
                  accept="image/*"
                  multiple
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                
                {/* Additional Images Preview */}
                {imagePreviews.additionalImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Selected Images ({imagePreviews.additionalImages.length})</p>
                    <div className="grid grid-cols-3 gap-3">
                      {imagePreviews.additionalImages.map((preview, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={preview} 
                            alt={`Additional preview ${index + 1}`} 
                            className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeAdditionalImage(index)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Keywords & Tags */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">SEO & Tags</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="Add keyword"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  />
                  <button
                    type="button"
                    onClick={addKeyword}
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.keywords.map((keyword, index) => (
                    <span key={index} className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm flex items-center">
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(index)}
                        className="ml-2 text-teal-600 hover:text-teal-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Meta Information */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="SEO title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="https://youtube.com/..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="SEO description"
                />
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Shipping Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Weight (kg)</label>
                <input
                  type="number"
                  name="shippingWeight"
                  value={formData.shippingWeight}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Length (cm)</label>
                <input
                  type="number"
                  name="shippingDimensions.length"
                  value={formData.shippingDimensions.length}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Width (cm)</label>
                <input
                  type="number"
                  name="shippingDimensions.width"
                  value={formData.shippingDimensions.width}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Height (cm)</label>
                <input
                  type="number"
                  name="shippingDimensions.height"
                  value={formData.shippingDimensions.height}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="0"
                  step="0.1"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Handling Time</label>
                <input
                  type="text"
                  name="handlingTime"
                  value={formData.handlingTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="e.g., 1-2 business days"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Return Policy</label>
                <input
                  type="text"
                  name="returnPolicy"
                  value={formData.returnPolicy}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="e.g., 30 days return"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {product ? 'Updating...' : 'Adding...'}
                </div>
              ) : (
                product ? 'Update Product' : 'Add Product'
              )}
            </button>
          </div>

          {/* Debug Information (Remove in production) */}
          {/* {process.env.NODE_ENV === 'development' && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h5 className="text-yellow-800 font-medium mb-2">Debug Info (Development Only)</h5>
              <div className="text-xs text-yellow-700">
                <p><strong>Main Image Removed:</strong> {imageStates.mainImageRemoved.toString()}</p>
                <p><strong>Removed Additional Images:</strong> {imageStates.removedAdditionalImages.length}</p>
                <p><strong>Keep Additional Images:</strong> {imageStates.keepAdditionalImages.length}</p>
                <p><strong>Current Additional Previews:</strong> {imagePreviews.additionalImages.length}</p>
              </div>
            </div>
          )} */}
        </form>
      </div>
    </div>
  );
};

export default ProductForm;