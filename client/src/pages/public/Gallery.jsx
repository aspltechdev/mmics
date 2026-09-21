// import React, {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import {
//   X,
//   ChevronLeft,
//   ChevronRight,
//   Images,
//   Loader2,
//   ArrowRight,
//   ZoomIn,
// } from "lucide-react";

// import { Link } from "react-router-dom";

// import api from "../../services/api";

// import "./Gallery.css";


// // ============================================================
// // SERVER URL
// // ============================================================

// const API_URL =
//   import.meta.env.VITE_API_URL ||
//   "http://localhost:5000/api";

// const SERVER_URL =
//   API_URL.replace(
//     /\/api\/?$/,
//     ""
//   );


// // ============================================================
// // IMAGE URL
// // ============================================================

// const getImageUrl = (imageUrl) => {
//   if (!imageUrl) {
//     return "";
//   }

//   if (
//     imageUrl.startsWith("http://") ||
//     imageUrl.startsWith("https://")
//   ) {
//     return imageUrl;
//   }

//   return `${SERVER_URL}/${imageUrl.replace(
//     /^\//,
//     ""
//   )}`;
// };


// // ============================================================
// // RESPONSE NORMALIZER
// // ============================================================

// const normalizeGalleries = (
//   response
// ) => {
//   if (
//     Array.isArray(response)
//   ) {
//     return response;
//   }

//   if (
//     Array.isArray(
//       response?.galleries
//     )
//   ) {
//     return response.galleries;
//   }

//   if (
//     Array.isArray(
//       response?.data
//     )
//   ) {
//     return response.data;
//   }

//   if (
//     Array.isArray(
//       response?.data?.galleries
//     )
//   ) {
//     return response.data.galleries;
//   }

//   return [];
// };


// // ============================================================
// // GALLERY
// // ============================================================

// const Gallery = () => {

//   const [galleries, setGalleries] =
//     useState([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState("");

//   const [activeGallery, setActiveGallery] =
//     useState("all");

//   const [selectedImage, setSelectedImage] =
//     useState(null);

//   const [selectedIndex, setSelectedIndex] =
//     useState(0);

//   const [lightboxImages, setLightboxImages] =
//     useState([]);

//   const [imageErrors, setImageErrors] =
//     useState({});


//   // ==========================================================
//   // FETCH GALLERIES
//   // ==========================================================

//   const fetchGalleries = async () => {

//     try {

//       setLoading(true);

//       setError("");

//       const response =
//         await api.get(
//           "/galleries"
//         );

//       const data =
//         normalizeGalleries(
//           response.data
//         );

//       const activeData =
//         data.filter(
//           (gallery) =>
//             gallery.isActive !== false
//         );

//       setGalleries(
//         activeData
//       );

//     } catch (err) {

//       console.error(
//         "Gallery fetch error:",
//         err
//       );

//       setError(
//         "Unable to load gallery."
//       );

//     } finally {

//       setLoading(false);

//     }

//   };


//   // ==========================================================
//   // INITIAL LOAD
//   // ==========================================================

//   useEffect(() => {

//     fetchGalleries();

//   }, []);


//   // ==========================================================
//   // GALLERY FILTERS
//   // ==========================================================

//   const galleryFilters =
//     useMemo(() => {

//       return [
//         {
//           id: "all",
//           title: "All",
//         },
//         ...galleries.map(
//           (gallery) => ({
//             id: gallery.id,
//             title: gallery.title,
//           })
//         ),
//       ];

//     }, [galleries]);


//   // ==========================================================
//   // FILTERED GALLERIES
//   // ==========================================================

//   const filteredGalleries =
//     useMemo(() => {

//       if (
//         activeGallery ===
//         "all"
//       ) {
//         return galleries;
//       }

//       return galleries.filter(
//         (gallery) =>
//           gallery.id ===
//           activeGallery
//       );

//     }, [
//       galleries,
//       activeGallery,
//     ]);


//   // ==========================================================
//   // TOTAL IMAGES
//   // ==========================================================

//   const totalImages =
//     useMemo(() => {

//       return galleries.reduce(
//         (
//           total,
//           gallery
//         ) =>
//           total +
//           (
//             Array.isArray(
//               gallery.images
//             )
//               ? gallery.images.length
//               : 0
//           ),
//         0
//       );

//     }, [galleries]);


//   // ==========================================================
//   // IMAGE ERROR
//   // ==========================================================

//   const handleImageError = (
//     imageId
//   ) => {

//     setImageErrors(
//       (previous) => ({
//         ...previous,
//         [imageId]: true,
//       })
//     );

//   };


//   // ==========================================================
//   // OPEN LIGHTBOX
//   // ==========================================================

//   const openLightbox = (
//     gallery,
//     imageIndex
//   ) => {

//     const images =
//       Array.isArray(
//         gallery.images
//       )
//         ? gallery.images
//             .filter(
//               (image) =>
//                 image?.imageUrl
//             )
//             .map(
//               (image) => ({
//                 id: image.id,
//                 url: getImageUrl(
//                   image.imageUrl
//                 ),
//                 caption:
//                   image.caption ||
//                   gallery.title,
//                 galleryTitle:
//                   gallery.title,
//               })
//             )
//         : [];

//     if (
//       images.length === 0
//     ) {
//       return;
//     }

//     setLightboxImages(
//       images
//     );

//     setSelectedIndex(
//       Math.min(
//         imageIndex,
//         images.length - 1
//       )
//     );

//     setSelectedImage(
//       images[
//         Math.min(
//           imageIndex,
//           images.length - 1
//         )
//       ]
//     );

//   };


//   // ==========================================================
//   // CLOSE LIGHTBOX
//   // ==========================================================

//   const closeLightbox = () => {

//     setSelectedImage(
//       null
//     );

//     setLightboxImages(
//       []
//     );

//     setSelectedIndex(
//       0
//     );

//   };


//   // ==========================================================
//   // PREVIOUS IMAGE
//   // ==========================================================

//   const previousImage = () => {

//     if (
//       lightboxImages.length <= 1
//     ) {
//       return;
//     }

//     setSelectedIndex(
//       (previous) => {

//         const nextIndex =
//           previous === 0
//             ? lightboxImages.length - 1
//             : previous - 1;

//         setSelectedImage(
//           lightboxImages[
//             nextIndex
//           ]
//         );

//         return nextIndex;

//       }
//     );

//   };


//   // ==========================================================
//   // NEXT IMAGE
//   // ==========================================================

//   const nextImage = () => {

//     if (
//       lightboxImages.length <= 1
//     ) {
//       return;
//     }

//     setSelectedIndex(
//       (previous) => {

//         const nextIndex =
//           previous ===
//           lightboxImages.length - 1
//             ? 0
//             : previous + 1;

//         setSelectedImage(
//           lightboxImages[
//             nextIndex
//           ]
//         );

//         return nextIndex;

//       }
//     );

//   };


//   // ==========================================================
//   // KEYBOARD CONTROLS
//   // ==========================================================

//   useEffect(() => {

//     if (!selectedImage) {
//       return;
//     }

//     const handleKeyDown = (
//       event
//     ) => {

//       if (
//         event.key ===
//         "Escape"
//       ) {
//         closeLightbox();
//       }

//       if (
//         event.key ===
//         "ArrowLeft"
//       ) {
//         previousImage();
//       }

//       if (
//         event.key ===
//         "ArrowRight"
//       ) {
//         nextImage();
//       }

//     };

//     window.addEventListener(
//       "keydown",
//       handleKeyDown
//     );

//     document.body.style.overflow =
//       "hidden";

//     return () => {

//       window.removeEventListener(
//         "keydown",
//         handleKeyDown
//       );

//       document.body.style.overflow =
//         "";

//     };

//   }, [
//     selectedImage,
//     lightboxImages,
//   ]);


//   // ==========================================================
//   // RENDER
//   // ==========================================================

//   return (
//     <main className="mmics-public-gallery-page">


//       {/* ====================================================
//           HERO
//       ==================================================== */}

//       <section className="mmics-public-gallery-hero">

//         <div className="mmics-public-gallery-hero-content">

//           <span>
//             MMICS GALLERY
//           </span>

//           <h1>
//             A Look Inside{" "}
//             <strong>
//               MMICS
//             </strong>
//           </h1>

//           <p>
//             Explore our products, people,
//             facilities and moments that
//             showcase the MMICS community.
//           </p>

//         </div>

//       </section>


//       {/* ====================================================
//           GALLERY CONTENT
//       ==================================================== */}

//       <section className="mmics-public-gallery-section">

//         <div className="mmics-public-gallery-container">


//           {/* ==================================================
//               SECTION HEADING
//           ================================================== */}

//           <div className="mmics-public-gallery-heading">

//             <div>

//               <span>
//                 OUR GALLERY
//               </span>

//               <h2>
//                 Moments That{" "}
//                 <strong>
//                   Matter
//                 </strong>
//               </h2>

//             </div>

//             <p>
//               A collection of moments,
//               activities and experiences
//               from the MMICS community.
//             </p>

//           </div>


//           {/* ==================================================
//               STATS
//           ================================================== */}

//           {!loading &&
//             !error &&
//             galleries.length >
//               0 && (

//               <div className="mmics-public-gallery-stats">

//                 <div>
//                   <strong>
//                     {galleries.length}
//                   </strong>

//                   <span>
//                     Galleries
//                   </span>
//                 </div>

//                 <div>
//                   <strong>
//                     {totalImages}
//                   </strong>

//                   <span>
//                     Photos
//                   </span>
//                 </div>

//               </div>

//             )}


//           {/* ==================================================
//               FILTERS
//           ================================================== */}

//           {!loading &&
//             !error &&
//             galleries.length >
//               0 && (

//               <div className="mmics-public-gallery-filters">

//                 {galleryFilters.map(
//                   (
//                     filter
//                   ) => (

//                     <button
//                       type="button"
//                       key={
//                         filter.id
//                       }
//                       className={
//                         activeGallery ===
//                         filter.id
//                           ? "active"
//                           : ""
//                       }
//                       onClick={() =>
//                         setActiveGallery(
//                           filter.id
//                         )
//                       }
//                     >
//                       {filter.title}
//                     </button>

//                   )
//                 )}

//               </div>

//             )}


//           {/* ==================================================
//               LOADING
//           ================================================== */}

//           {loading && (

//             <div className="mmics-public-gallery-state">

//               <Loader2 className="mmics-public-gallery-spinner" />

//               <span>
//                 Loading gallery...
//               </span>

//             </div>

//           )}


//           {/* ==================================================
//               ERROR
//           ================================================== */}

//           {!loading &&
//             error && (

//               <div className="mmics-public-gallery-state">

//                 <Images />

//                 <h3>
//                   Unable to Load Gallery
//                 </h3>

//                 <p>
//                   Please try again.
//                 </p>

//                 <button
//                   type="button"
//                   onClick={
//                     fetchGalleries
//                   }
//                 >
//                   Try Again
//                 </button>

//               </div>

//             )}


//           {/* ==================================================
//               EMPTY
//           ================================================== */}

//           {!loading &&
//             !error &&
//             filteredGalleries.length ===
//               0 && (

//               <div className="mmics-public-gallery-state">

//                 <Images />

//                 <h3>
//                   No Gallery Images
//                 </h3>

//                 <p>
//                   Gallery images will appear
//                   here once they are added.
//                 </p>

//               </div>

//             )}


//           {/* ==================================================
//               GALLERY LIST
//           ================================================== */}

//           {!loading &&
//             !error &&
//             filteredGalleries.length >
//               0 && (

//               <div className="mmics-public-gallery-list">

//                 {filteredGalleries.map(
//                   (
//                     gallery
//                   ) => {

//                     const images =
//                       Array.isArray(
//                         gallery.images
//                       )
//                         ? gallery.images
//                         : [];

//                     if (
//                       images.length ===
//                       0
//                     ) {
//                       return null;
//                     }

//                     return (

//                       <article
//                         className="mmics-public-gallery-group"
//                         key={
//                           gallery.id
//                         }
//                       >


//                         {/* ==================================================
//                             GALLERY HEADER
//                         ================================================== */}

//                         <div className="mmics-public-gallery-group-header">

//                           <div>

//                             <span>
//                               GALLERY
//                             </span>

//                             <h3>
//                               {gallery.title}
//                             </h3>

//                             {gallery.description && (
//                               <p>
//                                 {
//                                   gallery.description
//                                 }
//                               </p>
//                             )}

//                           </div>

//                           <div className="mmics-public-gallery-image-count">

//                             <Images />

//                             <span>
//                               {images.length}{" "}
//                               {images.length ===
//                               1
//                                 ? "Photo"
//                                 : "Photos"}
//                             </span>

//                           </div>

//                         </div>


//                         {/* ==================================================
//                             IMAGE GRID
//                         ================================================== */}

//                         <div className="mmics-public-gallery-grid">

//                           {images.map(
//                             (
//                               image,
//                               index
//                             ) => {

//                               const imageUrl =
//                                 getImageUrl(
//                                   image.imageUrl
//                                 );

//                               const isFeatured =
//                                 index ===
//                                 0;

//                               return (

//                                 <button
//                                   type="button"
//                                   className={`mmics-public-gallery-image ${
//                                     isFeatured
//                                       ? "featured"
//                                       : ""
//                                   }`}
//                                   key={
//                                     image.id ||
//                                     index
//                                   }
//                                   onClick={() =>
//                                     openLightbox(
//                                       gallery,
//                                       index
//                                     )
//                                   }
//                                 >

//                                   {imageUrl &&
//                                   !imageErrors[
//                                     image.id
//                                   ] ? (

//                                     <img
//                                       src={
//                                         imageUrl
//                                       }
//                                       alt={
//                                         image.caption ||
//                                         gallery.title
//                                       }
//                                       loading={
//                                         index >
//                                         3
//                                           ? "lazy"
//                                           : "eager"
//                                       }
//                                       onError={() =>
//                                         handleImageError(
//                                           image.id
//                                         )
//                                       }
//                                     />

//                                   ) : (

//                                     <div className="mmics-public-gallery-image-placeholder">

//                                       <Images />

//                                     </div>

//                                   )}


//                                   <div className="mmics-public-gallery-image-overlay">

//                                     <span>

//                                       <ZoomIn />

//                                     </span>

//                                     {image.caption && (
//                                       <small>
//                                         {
//                                           image.caption
//                                         }
//                                       </small>
//                                     )}

//                                   </div>

//                                 </button>

//                               );

//                             }
//                           )}

//                         </div>

//                       </article>

//                     );

//                   }
//                 )}

//               </div>

//             )}

//         </div>

//       </section>


//       {/* ====================================================
//           CTA
//       ==================================================== */}

//       <section className="mmics-public-gallery-cta">

//         <div className="mmics-public-gallery-cta-pattern" />

//         <div className="mmics-public-gallery-cta-content">

//           <span>
//             LET'S CONNECT
//           </span>

//           <h2>
//             Want to Know{" "}
//             <strong>
//               More About MMICS?
//             </strong>
//           </h2>

//           <p>
//             Discover our members, products
//             and business community.
//           </p>

//           <Link
//             to="/contact"
//             className="mmics-public-gallery-cta-button"
//           >
//             Contact Us

//             <ArrowRight />

//           </Link>

//         </div>

//       </section>


//       {/* ====================================================
//           LIGHTBOX
//       ==================================================== */}

//       {selectedImage && (

//         <div
//           className="mmics-gallery-lightbox"
//           onClick={
//             closeLightbox
//           }
//         >

//           <button
//             type="button"
//             className="mmics-gallery-lightbox-close"
//             onClick={
//               closeLightbox
//             }
//             aria-label="Close gallery"
//           >
//             <X />
//           </button>


//           {/* PREVIOUS */}

//           {lightboxImages.length >
//             1 && (

//             <button
//               type="button"
//               className="mmics-gallery-lightbox-prev"
//               onClick={(
//                 event
//               ) => {

//                 event.stopPropagation();

//                 previousImage();

//               }}
//               aria-label="Previous image"
//             >
//               <ChevronLeft />
//             </button>

//           )}


//           {/* IMAGE */}

//           <div
//             className="mmics-gallery-lightbox-content"
//             onClick={(
//               event
//             ) =>
//               event.stopPropagation()
//             }
//           >

//             <img
//               src={
//                 selectedImage.url
//               }
//               alt={
//                 selectedImage.caption ||
//                 selectedImage.galleryTitle
//               }
//             />

//             <div className="mmics-gallery-lightbox-caption">

//               <span>
//                 {selectedImage.galleryTitle}
//               </span>

//               {selectedImage.caption && (
//                 <p>
//                   {
//                     selectedImage.caption
//                   }
//                 </p>
//               )}

//               {lightboxImages.length >
//                 1 && (

//                 <small>
//                   {selectedIndex + 1} /{" "}
//                   {
//                     lightboxImages.length
//                   }
//                 </small>

//               )}

//             </div>

//           </div>


//           {/* NEXT */}

//           {lightboxImages.length >
//             1 && (

//             <button
//               type="button"
//               className="mmics-gallery-lightbox-next"
//               onClick={(
//                 event
//               ) => {

//                 event.stopPropagation();

//                 nextImage();

//               }}
//               aria-label="Next image"
//             >
//               <ChevronRight />
//             </button>

//           )}

//         </div>

//       )}

//     </main>
//   );
// };

// export default Gallery;



import React, {
  useEffect,
  useState,
} from "react";

import {
  X,
  ChevronLeft,
  ChevronRight,
  Images,
  Loader2,
  ArrowRight,
  ZoomIn,
} from "lucide-react";

import { Link } from "react-router-dom";

import api from "../../services/api";

import "./Gallery.css";
import galleryHero from "../../assets/product-hero.png";
import productCta from "../../assets/about-cta-bg.png";


// ============================================================
// SERVER URL
// ============================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const SERVER_URL =
  API_URL.replace(
    /\/api\/?$/,
    ""
  );


// ============================================================
// IMAGE URL
// ============================================================

const getImageUrl = (imageUrl) => {

  if (!imageUrl) {
    return "";
  }

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  return `${SERVER_URL}/${imageUrl.replace(
    /^\//,
    ""
  )}`;
};


// ============================================================
// RESPONSE NORMALIZER
// ============================================================

const normalizeGalleries = (
  response
) => {

  if (
    Array.isArray(response)
  ) {
    return response;
  }

  if (
    Array.isArray(
      response?.galleries
    )
  ) {
    return response.galleries;
  }

  if (
    Array.isArray(
      response?.data
    )
  ) {
    return response.data;
  }

  if (
    Array.isArray(
      response?.data?.galleries
    )
  ) {
    return response.data.galleries;
  }

  return [];
};


// ============================================================
// GALLERY
// ============================================================

const Gallery = () => {

  const [galleries, setGalleries] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // Selected album
  const [selectedGallery, setSelectedGallery] =
    useState(null);

  // Fullscreen image
  const [selectedImage, setSelectedImage] =
    useState(null);

  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const [lightboxImages, setLightboxImages] =
    useState([]);

  const [imageErrors, setImageErrors] =
    useState({});


  // ==========================================================
  // FETCH GALLERIES
  // ==========================================================

  const fetchGalleries = async () => {

    try {

      setLoading(true);

      setError("");

      const response =
        await api.get(
          "/galleries"
        );

      const data =
        normalizeGalleries(
          response.data
        );

      const activeGalleries =
        data.filter(
          (gallery) =>
            gallery.isActive !== false
        );

      setGalleries(
        activeGalleries
      );

    } catch (err) {

      console.error(
        "Gallery fetch error:",
        err
      );

      setError(
        "Unable to load gallery."
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {

    fetchGalleries();

  }, []);


  // ==========================================================
  // IMAGE ERROR
  // ==========================================================

  const handleImageError = (
    imageId
  ) => {

    setImageErrors(
      (previous) => ({
        ...previous,
        [imageId]: true,
      })
    );

  };


  // ==========================================================
  // OPEN ALBUM
  // ==========================================================

  const openAlbum = (
    gallery
  ) => {

    if (
      !gallery?.images ||
      gallery.images.length === 0
    ) {
      return;
    }

    setSelectedGallery(
      gallery
    );

  };


  // ==========================================================
  // CLOSE ALBUM
  // ==========================================================

  const closeAlbum = () => {

    setSelectedGallery(
      null
    );

  };


  // ==========================================================
  // OPEN FULLSCREEN IMAGE
  // ==========================================================

  const openImage = (
    images,
    index
  ) => {

    const formattedImages =
      images
        .filter(
          (image) =>
            image?.imageUrl
        )
        .map(
          (image) => ({
            id: image.id,

            url: getImageUrl(
              image.imageUrl
            ),

            caption:
              image.caption ||
              "",

          })
        );

    if (
      formattedImages.length === 0
    ) {
      return;
    }

    setLightboxImages(
      formattedImages
    );

    setSelectedIndex(
      index
    );

    setSelectedImage(
      formattedImages[index]
    );

  };


  // ==========================================================
  // CLOSE FULLSCREEN IMAGE
  // ==========================================================

  const closeImage = () => {

    setSelectedImage(
      null
    );

    setLightboxImages(
      []
    );

    setSelectedIndex(
      0
    );

  };


  // ==========================================================
  // PREVIOUS
  // ==========================================================

  const previousImage = () => {

    if (
      lightboxImages.length <= 1
    ) {
      return;
    }

    const nextIndex =
      selectedIndex === 0
        ? lightboxImages.length - 1
        : selectedIndex - 1;

    setSelectedIndex(
      nextIndex
    );

    setSelectedImage(
      lightboxImages[
        nextIndex
      ]
    );

  };


  // ==========================================================
  // NEXT
  // ==========================================================

  const nextImage = () => {

    if (
      lightboxImages.length <= 1
    ) {
      return;
    }

    const nextIndex =
      selectedIndex ===
      lightboxImages.length - 1
        ? 0
        : selectedIndex + 1;

    setSelectedIndex(
      nextIndex
    );

    setSelectedImage(
      lightboxImages[
        nextIndex
      ]
    );

  };


  // ==========================================================
  // KEYBOARD
  // ==========================================================

  useEffect(() => {

    if (
      !selectedImage
    ) {
      return;
    }

    const handleKeyDown = (
      event
    ) => {

      if (
        event.key ===
        "Escape"
      ) {
        closeImage();
      }

      if (
        event.key ===
        "ArrowLeft"
      ) {
        previousImage();
      }

      if (
        event.key ===
        "ArrowRight"
      ) {
        nextImage();
      }

    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    document.body.style.overflow =
      "hidden";

    return () => {

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        "";

    };

  }, [
    selectedImage,
    selectedIndex,
    lightboxImages,
  ]);


  // ==========================================================
  // ALBUM MODAL ESCAPE
  // ==========================================================

  useEffect(() => {

    if (
      !selectedGallery ||
      selectedImage
    ) {
      return;
    }

    const handleEscape = (
      event
    ) => {

      if (
        event.key ===
        "Escape"
      ) {
        closeAlbum();
      }

    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    document.body.style.overflow =
      "hidden";

    return () => {

      window.removeEventListener(
        "keydown",
        handleEscape
      );

      if (!selectedImage) {
        document.body.style.overflow =
          "";
      }

    };

  }, [
    selectedGallery,
    selectedImage,
  ]);


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (
      <main className="mmics-public-gallery-page">

        <section className="mmics-public-gallery-state">

          <Loader2 className="mmics-public-gallery-spinner" />

          <span>
            Loading gallery...
          </span>

        </section>

      </main>
    );

  }


  // ==========================================================
  // MAIN
  // ==========================================================

  return (
    <main className="mmics-public-gallery-page">


      {/* ====================================================
          HERO
      ==================================================== */}

      <section className="mmics-public-gallery-hero">

        <img
          src={galleryHero}
          alt="MMICS packaging and industrial solutions"
          className="mmics-gallery-hero-image"
        />
        
        <div className="mmics-gallery-hero-overlay" />

        <div className="mmics-public-gallery-hero-content">


          <span>
            MMICS GALLERY
          </span>

          <h1>
            A Look Inside{" "}
            <strong>
              MMICS
            </strong>
          </h1>

          <p>
            Explore our products, people,
            facilities and moments that
            showcase the MMICS community.
          </p>

        </div>

      </section>


      {/* ====================================================
          ALBUM SECTION
      ==================================================== */}

      <section className="mmics-public-gallery-section">

        <div className="mmics-public-gallery-container">


          {/* HEADING */}

          <div className="mmics-public-gallery-heading">

            <span>
              OUR GALLERY
            </span>

            <h2>
              Explore Our{" "}
              <strong>
                Moments
              </strong>
            </h2>

            <p>
              Browse our collection of
              events, activities, products
              and moments from the MMICS
              community.
            </p>

          </div>


          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (

            <div className="mmics-public-gallery-state">

              <Images />

              <h3>
                Unable to Load Gallery
              </h3>

              <p>
                Please try again.
              </p>

              <button
                type="button"
                onClick={
                  fetchGalleries
                }
              >
                Try Again
              </button>

            </div>

          )}


          {/* ==================================================
              EMPTY
          ================================================== */}

          {!error &&
            galleries.length ===
              0 && (

              <div className="mmics-public-gallery-state">

                <Images />

                <h3>
                  No Albums Available
                </h3>

                <p>
                  Gallery albums will appear
                  here once they are added.
                </p>

              </div>

            )}


          {/* ==================================================
              ALBUM GRID
          ================================================== */}

          {!error &&
            galleries.length >
              0 && (

              <div className="mmics-gallery-albums">

                {galleries.map(
                  (
                    gallery
                  ) => {

                    const images =
                      Array.isArray(
                        gallery.images
                      )
                        ? gallery.images
                        : [];

                    if (
                      images.length === 0
                    ) {
                      return null;
                    }

                    const coverImage =
                      images[0];

                    const coverUrl =
                      getImageUrl(
                        coverImage?.imageUrl
                      );

                    return (

                      <article
                        className="mmics-gallery-album-card"
                        key={
                          gallery.id
                        }
                        onClick={() =>
                          openAlbum(
                            gallery
                          )
                        }
                      >

                        {/* COVER */}

                        <div className="mmics-gallery-album-cover">

                          {coverUrl &&
                          !imageErrors[
                            coverImage.id
                          ] ? (

                            <img
                              src={
                                coverUrl
                              }
                              alt={
                                gallery.title
                              }
                              onError={() =>
                                handleImageError(
                                  coverImage.id
                                )
                              }
                            />

                          ) : (

                            <div className="mmics-gallery-album-placeholder">

                              <Images />

                            </div>

                          )}


                          {/* HOVER */}

                          <div className="mmics-gallery-album-hover">

                            <span>
                              <ZoomIn />
                            </span>

                            <small>
                              View Album
                            </small>

                          </div>

                        </div>


                        {/* ALBUM CONTENT */}

                        <div className="mmics-gallery-album-content">

                          <span>
                            GALLERY
                          </span>

                          <h3>
                            {gallery.title}
                          </h3>

                          {gallery.description && (
                            <p>
                              {
                                gallery.description
                              }
                            </p>
                          )}


                          <div className="mmics-gallery-album-link">

                            <span>
                              Explore Album
                            </span>

                            <ArrowRight />

                          </div>

                        </div>

                      </article>

                    );

                  }
                )}

              </div>

            )}

        </div>

      </section>


      {/* ====================================================
          CTA
      ==================================================== */}

      {/* <section className="mmics-public-gallery-cta">

        <div className="mmics-public-gallery-cta-pattern" />

        <div className="mmics-public-gallery-cta-content">

          <span>
            LET'S CONNECT
          </span>

          <h2>
            Want to Know{" "}
            <strong>
              More About MMICS?
            </strong>
          </h2>

          <p>
            Discover our members, products
            and business community.
          </p>

          <Link
            to="/contact"
            className="mmics-public-gallery-cta-button"
          >
            Contact Us

            <ArrowRight />

          </Link>

        </div>

      </section> */}


      {/* ====================================================
          ALBUM POPUP
      ==================================================== */}

      {selectedGallery && (

        <div
          className="mmics-gallery-album-modal"
          onClick={
            closeAlbum
          }
        >

          <div
            className="mmics-gallery-album-modal-inner"
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >


            {/* ==================================================
                MODAL HEADER
            ================================================== */}

            <div className="mmics-gallery-album-modal-header">

              <div>

                <span>
                  MMICS GALLERY
                </span>

                <h2>
                  {
                    selectedGallery.title
                  }
                </h2>

                {selectedGallery.description && (
                  <p>
                    {
                      selectedGallery.description
                    }
                  </p>
                )}

              </div>


              <button
                type="button"
                className="mmics-gallery-album-close"
                onClick={
                  closeAlbum
                }
                aria-label="Close album"
              >
                <X />
              </button>

            </div>


            {/* ==================================================
                ALBUM PHOTOS
            ================================================== */}

            <div className="mmics-gallery-album-modal-grid">

              {selectedGallery.images.map(
                (
                  image,
                  index
                ) => {

                  const imageUrl =
                    getImageUrl(
                      image.imageUrl
                    );

                  return (

                    <button
                      type="button"
                      className="mmics-gallery-album-modal-image"
                      key={
                        image.id ||
                        index
                      }
                      onClick={() =>
                        openImage(
                          selectedGallery.images,
                          index
                        )
                      }
                    >

                      {imageUrl &&
                      !imageErrors[
                        image.id
                      ] ? (

                        <img
                          src={
                            imageUrl
                          }
                          alt={
                            image.caption ||
                            selectedGallery.title
                          }
                          onError={() =>
                            handleImageError(
                              image.id
                            )
                          }
                        />

                      ) : (

                        <div className="mmics-gallery-album-placeholder">

                          <Images />

                        </div>

                      )}

                      <div className="mmics-gallery-album-modal-image-hover">

                        <ZoomIn />

                      </div>

                    </button>

                  );

                }
              )}

            </div>

          </div>

        </div>

      )}


      {/* ====================================================
          FULLSCREEN IMAGE
      ==================================================== */}

      {selectedImage && (

        <div
          className="mmics-gallery-lightbox"
          onClick={
            closeImage
          }
        >

          {/* CLOSE */}

          <button
            type="button"
            className="mmics-gallery-lightbox-close"
            onClick={
              closeImage
            }
          >
            <X />
          </button>


          {/* PREVIOUS */}

          {lightboxImages.length >
            1 && (

            <button
              type="button"
              className="mmics-gallery-lightbox-prev"
              onClick={(
                event
              ) => {

                event.stopPropagation();

                previousImage();

              }}
            >
              <ChevronLeft />
            </button>

          )}


          {/* IMAGE */}

          <div
            className="mmics-gallery-lightbox-content"
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >

            <img
              src={
                selectedImage.url
              }
              alt={
                selectedImage.caption ||
                "Gallery image"
              }
            />

            {selectedImage.caption && (

              <div className="mmics-gallery-lightbox-caption">

                {
                  selectedImage.caption
                }

              </div>

            )}

            {lightboxImages.length >
              1 && (

              <small className="mmics-gallery-lightbox-counter">

                {selectedIndex + 1}
                {" / "}
                {
                  lightboxImages.length
                }

              </small>

            )}

          </div>


          {/* NEXT */}

          {lightboxImages.length >
            1 && (

            <button
              type="button"
              className="mmics-gallery-lightbox-next"
              onClick={(
                event
              ) => {

                event.stopPropagation();

                nextImage();

              }}
            >
              <ChevronRight />
            </button>

          )}

        </div>

      )}

      {/* ====================================================
                CTA
            ==================================================== */}
      
            <section className="mmics-products-cta">
      
              <img
                src={productCta}
                alt=""
                className="mmics-products-cta-image"
              />
      
              <div className="mmics-products-cta-overlay" />
      
      
              <div className="mmics-products-cta-content">
      
                <span>
                  LET'S CONNECT
                </span>
      
      
                <h2>
                  Ready to Find the{" "}
                  <strong>
                    Right Solution?
                  </strong>
                </h2>
      
      
                <p>
                  Tell us your requirement and let
                  our team help you choose the right
                  product for your business.
                </p>
      
      
                <a
                  href="/contact"
                  className="mmics-products-cta-button"
                >
                  Contact Us
      
                  <ArrowRight />
      
                </a>
      
              </div>
      
            </section>

    </main>
  );
};

export default Gallery;