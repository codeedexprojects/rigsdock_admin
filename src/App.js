import React, { useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  CssBaseline,
  createTheme,
  ThemeProvider,
  Typography,
} from "@mui/material";
import "@fontsource/poppins";
import Sidebar from "./Admin/Components/Sidebar";
import AdminHeader from "./Admin/Components/AdminHeader";
import Dashboard from "./Admin/Pages/Dashboard";
import SellerPage from "./Admin/Pages/SellerPage";
import OrdersPage from "./Admin/Pages/OrdersPage";
import SellerDetails from "./Admin/Pages/SellerDetails";
import OrderDetails from "./Admin/Pages/OrderDetails";
import AddCategory from "./Admin/Pages/AddCategory";
import BulkUpload from "./Admin/Pages/BulkUpload";
import SubCategoryList from "./Admin/Pages/SubCategory";
import SellerRequests from "./Admin/Pages/SellerRequest";
import AddSeller from "./Admin/Pages/AddSeller";
import ViewProducts from "./Admin/Components/Products/ViewProducts";
import Login from "./Admin/Pages/Login";
import Category from "./Admin/Pages/Category";
import MainCategoryManagement from "./Admin/Pages/MainiCategory";
import EditProduct from "./Admin/Components/Products/EditProduct";
import Notification from "./Admin/Pages/Notification";
import SendNotification from "./Admin/Components/Notification/SendNotification";
import Coupon from "./Admin/Pages/Coupon";
import AddCoupon from "./Admin/Pages/AddCoupon";
import Carousel from "./Admin/Pages/Carousel";
import EditCategoryPage from "./Admin/Components/Category/EditCategoryPage";
import ViewCustomer from "./Admin/Pages/ViewCustomer";
import DealOftheDay from "./Admin/Pages/DealOftheDay";
import AddDeal from "./Admin/Pages/AddDeal";
import ViewCategory from "./Vendor/Category/ViewCategory";
import Viewsubcategory from "./Vendor/Subcategory/Viewsubcategory";
import VendorCoupon from "./Vendor/Coupon/VendorCoupon";
import AddVendorCoupon from "./Vendor/Coupon/AddVendorCoupon";
import EditVendorCoupon from "./Vendor/Coupon/EditVendorCoupon";
import DealOfTheDay from "./Vendor/Deal/DealOfTheDay";
import AddDealOftheDay from "./Vendor/Deal/AddDealOftheDay";
import ViewVendorProduct from "./Vendor/Product/ViewVendorProduct";
import AddVendorProduct from "./Vendor/Product/AddVendorProduct";
import ViewVendorCarousel from "./Vendor/Carousel/ViewVendorCarousel";
import AddVendorCarousel from "./Vendor/Carousel/AddVendorCarousel";
import NotificationVendor from "./Vendor/vendornotification/NotificationVendor";
import SendVendorNotification from "./Vendor/vendornotification/SendVendorNotification";
import ViewVendororder from "./Vendor/Orders/ViewVendororder";
import VendorOrderDetails from "./Vendor/Orders/VendorOrderDetails";
import ViewVendorProfile from "./Vendor/Profile/ViewVendorProfile";
import SellerProfileRequest from "./Admin/Pages/SellerProfileRequest";
import VenodorDashboard from "./Vendor/Vendor-Dashboard/VenodorDashboard";
import ViewOffer from "./Vendor/Offer/ViewOffer";
import AdminChatPage from "./Admin/Pages/AdminChatPage";
import ChatPage from "./Vendor/Chat/ChatPage";
import ViewSingleVendorProduct from "./Vendor/Product/ViewSingleVendorProduct";
import VendorReviews from "./Vendor/Review/VendorReviews";
import AdminReport from "./Admin/Pages/AdminReport";
import { RoleProtectedRoute } from "./Admin/Pages/RoleProtectedRoute";
import { Button, Modal } from "react-bootstrap";
import Shipping from "./Admin/Pages/Shipping";
import Customers from "./Admin/Pages/Customers";
const theme = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif",
    allVariants: {
      fontFamily: "Poppins, sans-serif",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: "Poppins, sans-serif",
        },
      },
    },
  },
});

const App = () => {
  const [activeSection, setActiveSection] = useState("/dashboard");
  const location = useLocation();
  const [tokenExpired, setTokenExpired] = useState(false);

  const navigate = useNavigate();
  const handleSelect = (path) => {
    setActiveSection(path);
  };
  const handleLogout = () => {
    navigate("/");
  };

  const isLoginPage = location.pathname === "/";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        {!isLoginPage && <Sidebar onSelect={handleSelect} />}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            width: { xs: "100%", md: `calc(100% - 250px)` },
            ml: "auto",
            position: "relative",
          }}
        >
          {!isLoginPage && (
            <Box
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1100,
              }}
            >
              <AdminHeader />
            </Box>
          )}

          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/shipping" element={<Shipping />} />

            <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/home" element={<Dashboard />} />
              <Route path="/seller" element={<SellerPage />} />
              <Route
                path="/sellerdetails/:sellerId"
                element={<SellerDetails />}
              />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orderDetails/:id" element={<OrderDetails />} />
              <Route path="/addCategory" element={<AddCategory />} />
              <Route path="/bulkUpload" element={<BulkUpload />} />
              <Route path="/viewSub" element={<SubCategoryList />} />
              <Route path="/viewCategory" element={<Category />} />
              <Route
                path="/maincategory"
                element={<MainCategoryManagement />}
              />
              <Route path="/edit-category/:id" element={<EditCategoryPage />} />
              <Route path="/sellerRequest" element={<SellerRequests />} />
              <Route
                path="/seller-ProfileRequest"
                element={<SellerProfileRequest />}
              />
              <Route path="/addSeller" element={<AddSeller />} />
              <Route path="/viewProducts" element={<ViewProducts />} />
              <Route
                path="/products/edit/:productId"
                element={<EditProduct />}
              />
              <Route path="/notification" element={<Notification />} />
              <Route path="/sendnotification" element={<SendNotification />} />
              <Route path="/coupon" element={<Coupon />} />
              <Route path="/addcoupon" element={<AddCoupon />} />
              <Route path="/customerlist" element={<ViewCustomer />} />
              <Route path="/carousel" element={<Carousel />} />
              <Route path="/dealsoftheday" element={<DealOftheDay />} />
              <Route path="/adddeal" element={<AddDeal />} />
              <Route path="/customers" element={<Customers />} />

              <Route path="/admin-chat/:sellerId" element={<AdminChatPage />} />
              <Route path="/reports" element={<AdminReport />} />
            </Route>

            {/* Vendor */}
            <Route element={<RoleProtectedRoute allowedRoles={["vendor"]} />}>
              <Route path="/vendor-viewCategory" element={<ViewCategory />} />
              <Route path="/vendor-viewSub" element={<Viewsubcategory />} />
              <Route path="/vendor-coupon" element={<VendorCoupon />} />
              <Route path="/vendor-add-coupon" element={<AddVendorCoupon />} />
              <Route
                path="/vendor-edit-coupon/:id"
                element={<EditVendorCoupon />}
              />
              <Route path="/vendor-dealsoftheday" element={<DealOfTheDay />} />
              <Route path="/add-vendor-deal" element={<AddDealOftheDay />} />
              <Route
                path="/vendor-viewProducts"
                element={<ViewVendorProduct />}
              />
              <Route
                path="/add-vendor-product"
                element={<AddVendorProduct />}
              />
              <Route path="/vendor-carousel" element={<ViewVendorCarousel />} />
              <Route
                path="/add-vendor-carousel"
                element={<AddVendorCarousel />}
              />
              <Route
                path="/vendornotification"
                element={<NotificationVendor />}
              />
              <Route
                path="/sendvendornotification"
                element={<SendVendorNotification />}
              />
              <Route path="/vendor-orders" element={<ViewVendororder />} />
              <Route
                path="/vendororderDetails/:id"
                element={<VendorOrderDetails />}
              />
              <Route path="/vendor-profile" element={<ViewVendorProfile />} />
              <Route path="/vendor-dashboard" element={<VenodorDashboard />} />
              <Route path="/vendor-offer" element={<ViewOffer />} />
              <Route path="/vendor-chat" element={<ChatPage />} />
              <Route
                path="/vendor-products/edit/:productId"
                element={<ViewSingleVendorProduct />}
              />
              <Route path="/vendor-review" element={<VendorReviews />} />
            </Route>
          </Routes>

          <Modal
            open={tokenExpired}
            aria-labelledby="token-expired-modal"
            aria-describedby="token-expired-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography id="token-expired-modal" variant="h6" component="h2">
                Session Expired
              </Typography>
              <Typography id="token-expired-description" sx={{ mt: 2 }}>
                Your session has expired. Please login again to continue.
              </Typography>
              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLogout}
                >
                  Login
                </Button>
              </Box>
            </Box>
          </Modal>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
