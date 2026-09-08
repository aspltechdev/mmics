import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productAPI, categoryAPI } from '../../../services/api';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  // =========================================================
  // STATE
  // =========================================================

  const [pageLoading, setPageLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    categoryId: '',
    shortDescription: '',
    fullDescription: '',
    material: '',
    moq: '',
    customization: '',
    isFeatured: false,
    isActive: true,
  });

  // New images selected from computer
  const [selectedImages, setSelectedImages] = useState([]);

  // Preview URLs for new images
  const [imagePreviews, setImagePreviews] = useState([]);

  // Images already uploaded to Cloudinary
  const [existingImages, setExistingImages] = useState([]);

  const [error, setError] = useState('');
  const [imageError, setImageError] = useState('');


  // =========================================================
  // FETCH DATA
  // =========================================================

  useEffect(() => {
    fetchCategories();

    if (isEdit) {
      fetchProduct();
    }
  }, [id]);


  // =========================================================
  // FETCH CATEGORIES
  // =========================================================

  const fetchCategories = async () => {
    try {
      const data = await categoryAPI.getAll({
        active: 'true',
      });

      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);

      setError(
        error.response?.data?.message ||
        'Failed to load categories'
      );
    }
  };


  // =========================================================
  // FETCH PRODUCT
  // =========================================================

  const fetchProduct = async () => {
    try {
      setPageLoading(true);
      setError('');

      /*
       * Your existing API uses /products/:slug.
       *
       * The backend code should support both slug and ID.
       * See the small backend change provided below this file.
       */
      const product = await productAPI.getBySlug(id);

      if (!product) {
        throw new Error('Product not found');
      }

      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        categoryId: product.categoryId || '',
        shortDescription: product.shortDescription || '',
        fullDescription: product.fullDescription || '',
        material: product.material || '',
        moq: product.moq || '',
        customization: product.customization || '',

        isFeatured:
          product.isFeatured === true,

        isActive:
          product.isActive !== undefined
            ? product.isActive === true
            : true,
      });

      setExistingImages(
        Array.isArray(product.images)
          ? product.images
          : []
      );

    } catch (error) {
      console.error('Error fetching product:', error);

      setError(
        error.response?.data?.message ||
        error.message ||
        'Failed to load product'
      );
    } finally {
      setPageLoading(false);
    }
  };


  // =========================================================
  // HANDLE FORM CHANGES
  // =========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }));
  };


  // =========================================================
  // IMAGE SELECTION
  // =========================================================

  const handleImageChange = (e) => {
    setImageError('');

    const files = Array.from(
      e.target.files || []
    );

    if (files.length === 0) {
      return;
    }

    // Maximum 10 images
    if (files.length > 10) {
      setImageError(
        'You can upload a maximum of 10 images.'
      );

      e.target.value = '';
      return;
    }

    // Allowed file types
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    const invalidFile = files.find(
      (file) =>
        !allowedTypes.includes(file.type)
    );

    if (invalidFile) {
      setImageError(
        'Only JPG, PNG and WebP images are allowed.'
      );

      e.target.value = '';
      return;
    }

    // Maximum 5MB per image
    const maxSize = 5 * 1024 * 1024;

    const oversizedFile = files.find(
      (file) => file.size > maxSize
    );

    if (oversizedFile) {
      setImageError(
        'Each image must be smaller than 5MB.'
      );

      e.target.value = '';
      return;
    }

    setSelectedImages(files);

    // Create preview URLs
    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setImagePreviews(previews);
  };


  // =========================================================
  // REMOVE SELECTED NEW IMAGE
  // =========================================================

  const removeSelectedImage = (index) => {
    const updatedFiles =
      selectedImages.filter(
        (_, fileIndex) => fileIndex !== index
      );

    const updatedPreviews =
      imagePreviews.filter(
        (_, previewIndex) =>
          previewIndex !== index
      );

    setSelectedImages(updatedFiles);
    setImagePreviews(updatedPreviews);
  };


  // =========================================================
  // DELETE EXISTING IMAGE
  // =========================================================

  const handleDeleteExistingImage = async (
    imageId
  ) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this image?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setImageError('');

      await productAPI.deleteImage(
        imageId
      );

      setExistingImages((prev) =>
        prev.filter(
          (image) => image.id !== imageId
        )
      );

    } catch (error) {
      console.error(
        'Error deleting image:',
        error
      );

      setImageError(
        error.response?.data?.message ||
        'Failed to delete image'
      );
    }
  };


  // =========================================================
  // UPLOAD IMAGES
  // =========================================================

  const uploadImages = async (productId) => {
    if (
      !productId ||
      selectedImages.length === 0
    ) {
      return;
    }

    try {
      setUploadingImages(true);
      setImageError('');

      const uploadedImages =
        await productAPI.uploadImages(
          productId,
          selectedImages
        );

      /*
       * Add newly uploaded images to the
       * existing image list.
       */
      if (Array.isArray(uploadedImages)) {
        setExistingImages((prev) => [
          ...prev,
          ...uploadedImages,
        ]);
      }

      // Clear selected images
      setSelectedImages([]);
      setImagePreviews([]);

    } catch (error) {
      console.error(
        'Error uploading images:',
        error
      );

      throw new Error(
        error.response?.data?.message ||
        'Product saved, but image upload failed.'
      );
    } finally {
      setUploadingImages(false);
    }
  };


  // =========================================================
  // SUBMIT FORM
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setImageError('');

    // Basic validation
    if (!formData.name.trim()) {
      setError(
        'Product name is required.'
      );
      return;
    }

    if (!formData.slug.trim()) {
      setError(
        'Product slug is required.'
      );
      return;
    }

    if (!formData.categoryId) {
      setError(
        'Please select a category.'
      );
      return;
    }

    try {
      setSaving(true);

      let product;

      // =====================================================
      // UPDATE
      // =====================================================

      if (isEdit) {
        product =
          await productAPI.update(
            id,
            formData
          );
      }

      // =====================================================
      // CREATE
      // =====================================================

      else {
        product =
          await productAPI.create(
            formData
          );
      }

      /*
       * Product must exist before images can
       * be uploaded because images require
       * productId.
       */
      const productId =
        product?.id || id;

      // =====================================================
      // UPLOAD IMAGES
      // =====================================================

      if (
        selectedImages.length > 0 &&
        productId
      ) {
        await uploadImages(productId);
      }

      // =====================================================
      // SUCCESS
      // =====================================================

      navigate('/admin/products');

    } catch (error) {
      console.error(
        'Error saving product:',
        error
      );

      /*
       * If product was saved but image upload
       * failed, show that information clearly.
       */
      if (
        error.message?.includes(
          'image upload failed'
        )
      ) {
        setError(error.message);
      } else {
        setError(
          error.response?.data?.message ||
          error.message ||
          'Failed to save product'
        );
      }
    } finally {
      setSaving(false);
    }
  };


  // =========================================================
  // CLEAN UP IMAGE PREVIEW URLS
  // =========================================================

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [imagePreviews]);


  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (pageLoading) {
    return (
      <div
        className="flex-center"
        style={{
          minHeight: '300px',
        }}
      >
        <div className="spinner"></div>
      </div>
    );
  }


  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="dashboard-container">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className="flex-between"
        style={{
          marginBottom: '24px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1a202c',
            }}
          >
            {isEdit
              ? 'Edit Product'
              : 'Add New Product'}
          </h1>

          <p
            style={{
              color: '#718096',
              fontSize: '14px',
            }}
          >
            {isEdit
              ? 'Update product details and images'
              : 'Create a new product'}
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate('/admin/products')
          }
          className="btn btn-secondary"
        >
          ← Back to Products
        </button>
      </div>


      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div
          className="login-error"
          style={{
            marginBottom: '16px',
          }}
        >
          <span className="error-icon">
            ✕
          </span>

          {error}
        </div>
      )}


      {/* =====================================================
          FORM
      ====================================================== */}

      <form
        onSubmit={handleSubmit}
        className="card"
        style={{
          padding: '24px',
        }}
      >

        {/* ===================================================
            BASIC INFORMATION
        ==================================================== */}

        <h2
          style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '20px',
            color: '#1a202c',
          }}
        >
          Product Information
        </h2>

        <div className="grid-2">

          {/* PRODUCT NAME */}

          <div className="form-group">
            <label className="form-label">
              Product Name *
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              required
              placeholder="e.g. Corrugated Boxes"
            />
          </div>


          {/* SLUG */}

          <div className="form-group">
            <label className="form-label">
              Slug *
            </label>

            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="form-control"
              required
              placeholder="e.g. corrugated-boxes"
            />

            <small
              style={{
                color: '#718096',
                fontSize: '12px',
                marginTop: '5px',
                display: 'block',
              }}
            >
              Use lowercase letters,
              numbers and hyphens.
            </small>
          </div>


          {/* CATEGORY */}

          <div className="form-group">
            <label className="form-label">
              Category *
            </label>

            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">
                Select Category
              </option>

              {categories.map((cat) => (
                <option
                  key={cat.id}
                  value={cat.id}
                >
                  {cat.name}
                </option>
              ))}
            </select>
          </div>


          {/* MATERIAL */}

          <div className="form-group">
            <label className="form-label">
              Material
            </label>

            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. Kraft Paper"
            />
          </div>


          {/* MOQ */}

          <div className="form-group">
            <label className="form-label">
              MOQ
            </label>

            <input
              type="text"
              name="moq"
              value={formData.moq}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. 500 pieces"
            />
          </div>


          {/* CUSTOMIZATION */}

          <div className="form-group">
            <label className="form-label">
              Customization
            </label>

            <input
              type="text"
              name="customization"
              value={formData.customization}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. Custom printing available"
            />
          </div>

        </div>


        {/* ===================================================
            SHORT DESCRIPTION
        ==================================================== */}

        <div className="form-group">
          <label className="form-label">
            Short Description
          </label>

          <input
            type="text"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            className="form-control"
            placeholder="Brief product description"
          />
        </div>


        {/* ===================================================
            FULL DESCRIPTION
        ==================================================== */}

        <div className="form-group">
          <label className="form-label">
            Full Description
          </label>

          <textarea
            name="fullDescription"
            value={formData.fullDescription}
            onChange={handleChange}
            className="form-control"
            rows="6"
            placeholder="Detailed product description"
          />
        </div>


        {/* ===================================================
            PRODUCT IMAGES
        ==================================================== */}

        <div
          style={{
            marginTop: '28px',
            paddingTop: '24px',
            borderTop: '1px solid #e2e8f0',
          }}
        >

          <h2
            style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#1a202c',
            }}
          >
            Product Images
          </h2>

          <p
            style={{
              color: '#718096',
              fontSize: '13px',
              marginBottom: '16px',
            }}
          >
            Upload up to 10 images.
            JPG, PNG and WebP are supported.
            Maximum 5MB per image.
          </p>


          {/* IMAGE ERROR */}

          {imageError && (
            <div
              style={{
                background: '#fff5f5',
                color: '#c53030',
                border: '1px solid #feb2b2',
                borderRadius: '6px',
                padding: '10px 12px',
                marginBottom: '16px',
                fontSize: '13px',
              }}
            >
              {imageError}
            </div>
          )}


          {/* FILE INPUT */}

          <div className="form-group">
            <label
              className="form-label"
              htmlFor="productImages"
            >
              Select Images
            </label>

            <input
              id="productImages"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImageChange}
              className="form-control"
              disabled={
                saving ||
                uploadingImages
              }
            />
          </div>


          {/* =================================================
              NEW IMAGE PREVIEWS
          ================================================== */}

          {imagePreviews.length > 0 && (
            <div
              style={{
                marginTop: '20px',
              }}
            >
              <h3
                style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  marginBottom: '12px',
                }}
              >
                Images to Upload
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: '16px',
                }}
              >

                {imagePreviews.map(
                  (preview, index) => (
                    <div
                      key={preview}
                      style={{
                        border:
                          '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '8px',
                        background: '#fff',
                        position: 'relative',
                      }}
                    >

                      <img
                        src={preview}
                        alt={`Product preview ${
                          index + 1
                        }`}
                        style={{
                          width: '100%',
                          height: '130px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          display: 'block',
                        }}
                      />

                      <div
                        style={{
                          fontSize: '12px',
                          color: '#4a5568',
                          marginTop: '8px',
                        }}
                      >
                        {index === 0
                          ? 'First Image'
                          : `Image ${
                              index + 1
                            }`}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeSelectedImage(
                            index
                          )
                        }
                        style={{
                          marginTop: '8px',
                          width: '100%',
                          padding: '6px',
                          border: '1px solid #e53e3e',
                          background: '#fff',
                          color: '#e53e3e',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        Remove
                      </button>

                    </div>
                  )
                )}

              </div>
            </div>
          )}


          {/* =================================================
              EXISTING IMAGES
          ================================================== */}

          {isEdit &&
            existingImages.length > 0 && (
              <div
                style={{
                  marginTop: '28px',
                }}
              >

                <h3
                  style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    marginBottom: '12px',
                  }}
                >
                  Existing Images
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: '16px',
                  }}
                >

                  {existingImages.map(
                    (image) => (
                      <div
                        key={image.id}
                        style={{
                          border:
                            '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '8px',
                          background: '#fff',
                        }}
                      >

                        <img
                          src={image.url}
                          alt={
                            image.altText ||
                            formData.name ||
                            'Product image'
                          }
                          style={{
                            width: '100%',
                            height: '130px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                            display: 'block',
                          }}
                        />

                        <div
                          style={{
                            marginTop: '8px',
                            display: 'flex',
                            justifyContent:
                              'space-between',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >

                          <span
                            style={{
                              fontSize: '12px',
                              color: '#4a5568',
                            }}
                          >
                            {image.isPrimary
                              ? 'Primary'
                              : 'Image'}
                          </span>

                          {image.isPrimary && (
                            <span
                              style={{
                                fontSize: '11px',
                                background:
                                  '#edf2f7',
                                padding:
                                  '3px 6px',
                                borderRadius:
                                  '4px',
                              }}
                            >
                              Main
                            </span>
                          )}

                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteExistingImage(
                              image.id
                            )
                          }
                          disabled={
                            saving ||
                            uploadingImages
                          }
                          style={{
                            marginTop: '8px',
                            width: '100%',
                            padding: '6px',
                            border:
                              '1px solid #e53e3e',
                            background: '#fff',
                            color: '#e53e3e',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          Delete Image
                        </button>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}


          {/* NO EXISTING IMAGE */}

          {isEdit &&
            existingImages.length === 0 && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '14px',
                  background: '#f7fafc',
                  borderRadius: '6px',
                  color: '#718096',
                  fontSize: '13px',
                }}
              >
                No product images uploaded yet.
              </div>
            )}

        </div>


        {/* ===================================================
            STATUS
        ==================================================== */}

        <div
          style={{
            marginTop: '28px',
            paddingTop: '24px',
            borderTop:
              '1px solid #e2e8f0',
          }}
        >

          <h2
            style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '20px',
              color: '#1a202c',
            }}
          >
            Product Status
          </h2>

          <div className="grid-2">

            {/* FEATURED */}

            <div
              className="form-group"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >

              <input
                id="isFeatured"
                type="checkbox"
                name="isFeatured"
                checked={
                  formData.isFeatured
                }
                onChange={handleChange}
              />

              <label
                htmlFor="isFeatured"
                className="form-label"
                style={{
                  margin: 0,
                  cursor: 'pointer',
                }}
              >
                Featured Product
              </label>

            </div>


            {/* ACTIVE */}

            <div
              className="form-group"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >

              <input
                id="isActive"
                type="checkbox"
                name="isActive"
                checked={
                  formData.isActive
                }
                onChange={handleChange}
              />

              <label
                htmlFor="isActive"
                className="form-label"
                style={{
                  margin: 0,
                  cursor: 'pointer',
                }}
              >
                Active
              </label>

            </div>

          </div>

        </div>


        {/* ===================================================
            BUTTONS
        ==================================================== */}

        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '28px',
            paddingTop: '24px',
            borderTop:
              '1px solid #e2e8f0',
          }}
        >

          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              saving ||
              uploadingImages
            }
          >
            {uploadingImages
              ? 'Uploading Images...'
              : saving
                ? 'Saving...'
                : isEdit
                  ? 'Update Product'
                  : 'Create Product'}
          </button>

          <button
            type="button"
            onClick={() =>
              navigate('/admin/products')
            }
            className="btn btn-secondary"
            disabled={
              saving ||
              uploadingImages
            }
          >
            Cancel
          </button>

        </div>

      </form>
    </div>
  );
};

export default ProductForm;