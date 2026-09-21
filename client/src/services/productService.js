const handleSubmit = async (
  event
) => {
  event.preventDefault();

  if (!form.categoryId) {
    setError(
      "Please select a category."
    );

    return;
  }

  if (!form.name.trim()) {
    setError(
      "Product name is required."
    );

    return;
  }

  if (!form.slug.trim()) {
    setError(
      "Product slug is required."
    );

    return;
  }

  try {

    setSaving(true);

    setError("");

    setSuccessMessage("");


    const payload = {

      categoryId:
        form.categoryId,

      name:
        form.name.trim(),

      slug:
        form.slug.trim(),

      description:
        form.description
          .trim() ||
        null,

      status:
        form.status,

    };


    /* =====================================================
       UPDATE PRODUCT
    ===================================================== */

    if (editingProduct) {

      await productService.update(
        editingProduct.id,
        payload
      );


      setShowModal(false);

      resetForm();

      resetImageUpload();


      await fetchProducts();


      setSuccessMessage(
        "Product updated successfully."
      );


      setTimeout(() => {

        setSuccessMessage("");

      }, 3000);


      return;
    }


    /* =====================================================
       CREATE PRODUCT
    ===================================================== */

    const createResponse =
      await productService.create(
        payload
      );


    console.log(
      "CREATE PRODUCT RESPONSE:",
      createResponse
    );


    /*
      Handle different backend
      response formats safely.
    */

    const createdProduct =

      createResponse?.product ||

      createResponse?.data
        ?.product ||

      (
        createResponse?.id
          ? createResponse
          : null
      ) ||

      (
        createResponse?.data?.id
          ? createResponse.data
          : null
      );


    console.log(
      "CREATED PRODUCT:",
      createdProduct
    );


    /* =====================================================
       IMAGE UPLOAD

       Product creation has already succeeded.
       Therefore image failure should NOT produce
       "Unable to save product".
    ===================================================== */

    if (imageFile) {

      if (
        !createdProduct?.id
      ) {

        console.error(
          "Created product ID missing:",
          createResponse
        );


        setShowModal(false);

        resetForm();

        resetImageUpload();


        await fetchProducts();


        setError(
          "Product was created successfully, but the server did not return the product ID required to upload the image."
        );


        return;
      }


      try {

        console.log(
          "Uploading image for product:",
          createdProduct.id
        );


        const imageResponse =
          await productService.addImage(
            createdProduct.id,
            imageFile,
            imagePrimary
          );


        console.log(
          "IMAGE UPLOAD RESPONSE:",
          imageResponse
        );


      } catch (
        imageError
      ) {

        console.error(
          "PRODUCT IMAGE UPLOAD ERROR:",
          imageError
        );


        console.error(
          "IMAGE API RESPONSE:",
          imageError
            ?.response
            ?.data
        );


        const imageErrorMessage =

          imageError
            ?.response
            ?.data
            ?.message ||

          imageError
            ?.message ||

          "Unable to upload product image.";


        /*
          Product already exists.

          So close create modal and
          refresh the list.

          Do NOT say:
          "Unable to save product".
        */

        setShowModal(false);

        resetForm();

        resetImageUpload();


        await fetchProducts();


        setError(
          `Product created successfully, but image upload failed: ${imageErrorMessage}`
        );


        return;
      }
    }


    /* =====================================================
       SUCCESS
    ===================================================== */

    setShowModal(false);


    resetForm();

    resetImageUpload();


    /*
      Important:

      Refresh only AFTER image upload
      completes so the product response
      contains ProductImage records.
    */

    await fetchProducts();


    setSuccessMessage(

      imageFile

        ? "Product and image created successfully."

        : "Product created successfully."

    );


    setTimeout(() => {

      setSuccessMessage("");

    }, 3000);


  } catch (err) {

    /*
      This catch now means the actual
      PRODUCT create/update request failed.
    */

    console.error(
      "SAVE PRODUCT ERROR:",
      err
    );


    console.error(
      "SAVE PRODUCT API RESPONSE:",
      err
        ?.response
        ?.data
    );


    setError(

      err
        ?.response
        ?.data
        ?.message ||

      err
        ?.message ||

      "Unable to save product."

    );

  } finally {

    setSaving(false);

  }
};