// import { Routes, Route } from "react-router-dom";
// import ProtectedRoute from "./ProtectedRoute";

// const AppRoutes = () => {
//   return (
//     <Routes>
//       {/* PUBLIC ROUTES */}

//       <Route path="/" element={<div>Home</div>} />

//       <Route
//         path="/member-login"
//         element={<div>Member Login</div>}
//       />

//       {/* MEMBER ROUTES */}

//       <Route
//         element={
//           <ProtectedRoute allowedRoles={["MEMBER"]} />
//         }
//       >
//         <Route
//           path="/member"
//           element={<div>Member Dashboard</div>}
//         />

//         <Route
//           path="/member/profile"
//           element={<div>Member Profile</div>}
//         />
//       </Route>

//       {/* ADMIN ROUTES */}

//       <Route
//         element={
//           <ProtectedRoute allowedRoles={["ADMIN"]} />
//         }
//       >
//         <Route
//           path="/admin"
//           element={<div>Admin Dashboard</div>}
//         />

//         <Route
//           path="/admin/members"
//           element={<div>Members</div>}
//         />

//         <Route
//           path="/admin/categories"
//           element={<div>Categories</div>}
//         />

//         <Route
//           path="/admin/products"
//           element={<div>Products</div>}
//         />

//         <Route
//           path="/admin/gallery"
//           element={<div>Gallery</div>}
//         />

//         <Route
//           path="/admin/hero-slides"
//           element={<div>Hero Slides</div>}
//         />

//         <Route
//           path="/admin/website-content"
//           element={<div>Website Content</div>}
//         />

//         <Route
//           path="/admin/enquiries"
//           element={<div>Enquiries</div>}
//         />
//       </Route>

//       {/* 404 */}

//       <Route
//         path="*"
//         element={<div>Page Not Found</div>}
//       />
//     </Routes>
//   );
// };

// export default AppRoutes;

import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import PublicLayout from "../components/layout/PublicLayout";

import AdminLayout from "../components/layout/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import MemberLogin from "../pages/auth/MemberLogin";
import Members from "../pages/admin/Members";
import Categories from "../pages/admin/Categories";
import Products from "../pages/admin/Products";
import HeroSlides from "../pages/admin/HeroSlides";
import Gallery from "../pages/admin/Gallery";
import Enquiries from "../pages/admin/Enquiries";


const AppRoutes = () => {
  return (
    <Routes>

      {/* =================================================
          PUBLIC
      ================================================= */}

      <Route element={<PublicLayout />}>

        <Route
          path="/"
          element={<div>Home</div>}
        />

        <Route
          path="/about"
          element={<div>About</div>}
        />

        <Route
          path="/organization"
          element={<div>Organization</div>}
        />

        <Route
          path="/members"
          element={<div>Members</div>}
        />

        <Route
          path="/products"
          element={<div>Products</div>}
        />

        <Route
          path="/products/:slug"
          element={<div>Product Details</div>}
        />

        <Route
          path="/gallery"
          element={<div>Gallery</div>}
        />

        <Route
          path="/contact"
          element={<div>Contact</div>}
        />

      </Route>

      {/* =================================================
          AUTH
      ================================================= */}

     <Route
  path="/member-login"
  element={<MemberLogin />}
/>

      {/* =================================================
          MEMBER
      ================================================= */}

      <Route
        element={
          <ProtectedRoute allowedRoles={["MEMBER"]} />
        }
      >
        <Route
          path="/member"
          element={<div>Member Dashboard</div>}
        />

        <Route
          path="/member/profile"
          element={<div>Member Profile</div>}
        />
      </Route>

      {/* =================================================
          ADMIN
      ================================================= */}

      {/* <Route
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]} />
        }
      >
        <Route
          path="/admin"
          element={<div>Admin Dashboard</div>}
        />

        <Route
          path="/admin/members"
          element={<div>Members</div>}
        />

        <Route
          path="/admin/categories"
          element={<div>Categories</div>}
        />

        <Route
          path="/admin/products"
          element={<div>Products</div>}
        />

        <Route
          path="/admin/gallery"
          element={<div>Gallery</div>}
        />

        <Route
          path="/admin/hero-slides"
          element={<div>Hero Slides</div>}
        />

        <Route
          path="/admin/website-content"
          element={<div>Website Content</div>}
        />

        <Route
          path="/admin/enquiries"
          element={<div>Enquiries</div>}
        />
      </Route> */}



      {/* =================================================
    ADMIN
================================================= */}

      <Route
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]} />
        }
      >
        <Route element={<AdminLayout />}>

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/members"
            element={<Members/>}
          />

          <Route
            path="/admin/categories"
            element={<Categories/>}
          />

          <Route
            path="/admin/products"
            element={<Products/>}
          />

          <Route
            path="/admin/hero-slides"
            element={<HeroSlides/>}
          />

          <Route
            path="/admin/gallery"
            element={<Gallery/>}
          />

          <Route
            path="/admin/website-content"
            element={<div>Website Content</div>}
          />

          <Route
            path="/admin/enquiries"
            element={<Enquiries/>}
          />

        </Route>
      </Route>

      {/* =================================================
          404
      ================================================= */}

      <Route
        path="*"
        element={<div>Page Not Found</div>}
      />

    </Routes>
  );
};

export default AppRoutes;