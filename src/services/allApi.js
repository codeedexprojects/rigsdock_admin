import axios from "axios";
import { BASE_URL } from "./baseUrl";
import { commonApi } from "./commonApi";

export const adminLoginApi = async (loginData) => {
  const url = `${BASE_URL}/admin/auth/login`;
  return await commonApi("POST", url, loginData);
};

export const getMainCategoriesApi = async () => {
  const url = `${BASE_URL}/admin/maincategory/get`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching main categories",
    };
  }
};

export const createMainCategoryApi = async (categoryData) => {
  const url = `${BASE_URL}/admin/maincategory/create`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("POST", url, categoryData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error creating main category",
    };
  }
};

export const updateMainCategoryApi = async (id, categoryData) => {
  const url = `${BASE_URL}/admin/maincategory/update/${id}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PUT", url, categoryData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error updating main category",
    };
  }
};

export const deleteMainCategoryApi = async (id) => {
  const url = `${BASE_URL}/admin/maincategory/delete/${id}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("DELETE", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error deleting main category",
    };
  }
};

export const createCategoryApi = async (categoryData) => {
  const url = `${BASE_URL}/admin/category/create`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("POST", url, categoryData, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error creating main category",
    };
  }
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("rigsdock_refreshToken");

  if (!refreshToken) {
    return { success: false, error: "No refresh token available" };
  }

  try {
    const response = await axios.post(`${BASE_URL}/token/refresh-token`, {
      refreshToken,
    });

    if (response.data.accessToken) {
      localStorage.setItem("rigsdock_accessToken", response.data.accessToken);
      return { success: true, accessToken: response.data.accessToken };
    } else {
      return { success: false, error: "Invalid refresh token" };
    }
  } catch (error) {
    return { success: false, error: "Failed to refresh token" };
  }
};

export const updateCategoryApi = async (id, categoryData) => {
  const url = `${BASE_URL}/admin/category/update/${id}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PUT", url, categoryData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error updating main category",
    };
  }
};

export const deleteCategoryApi = async (id) => {
  const url = `${BASE_URL}/admin/category/delete/${id}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("DELETE", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error deleting main category",
    };
  }
};
export const getCategoriesApi = async () => {
  const url = `${BASE_URL}/admin/category/view`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching  categories",
    };
  }
};

export const getCategoryByMainCategoryIdApi = async (mainCategoryId) => {
  const url = `${BASE_URL}/admin/category/view/category/${mainCategoryId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching category by main category ID",
    };
  }
};

export const getSubcategoryByMainCategoryAndCategoryIdApi = async (
  mainCategoryId,
  categoryId
) => {
  const url = `${BASE_URL}/admin/subcategory/view/${mainCategoryId}/${categoryId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching subcategory",
    };
  }
};

export const getSubCategoriesApi = async () => {
  const url = `${BASE_URL}/admin/subcategory/get`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching  categories",
    };
  }
};

export const updateSubCategoryApi = async (id, categoryData) => {
  const url = `${BASE_URL}/admin/subcategory/update/${id}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, categoryData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error updating main category",
    };
  }
};

export const deleteSubCategoryApi = async (id) => {
  const url = `${BASE_URL}/admin/subcategory/delete/${id}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("DELETE", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error deleting main category",
    };
  }
};

export const createSubCategoryApi = async (categoryData) => {
  const url = `${BASE_URL}/admin/subcategory/create`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("POST", url, categoryData, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error creating main category",
    };
  }
};

export const getproductsApi = async () => {
  const url = `${BASE_URL}/admin/product/get`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching  products",
    };
  }
};

export const getProductByIdApi = async (productId) => {
  const url = `${BASE_URL}/admin/product/get/${productId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching product by ID",
    };
  }
};

export const createProductApi = async (productData) => {
  const url = `${BASE_URL}/admin/product/create`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("POST", url, productData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data", // Ensure proper headers
    });
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error creating Product" };
  }
};

export const bulkUploadProductsApi = async (file) => {
  const url = `${BASE_URL}/admin/product/bulk-upload`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await commonApi("POST", url, formData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data", // Required for file uploads
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error uploading Excel sheet",
    };
  }
};

export const editProductApi = async (productId, productData) => {
  const url = `${BASE_URL}/admin/product/update/${productId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, productData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data", // Ensure proper headers
    });
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error editing Product" };
  }
};

export const deleteProductApi = async (productId) => {
  const url = `${BASE_URL}/admin/product/delete/${productId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi(
      "DELETE",
      url,
      {},
      {
        Authorization: `Bearer ${accessToken}`,
      }
    );
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error deleting Product" };
  }
};

export const deleteProductImageApi = async (imageId) => {
  const url = `${BASE_URL}/admin/product/delete/${imageId}/image`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi(
      "DELETE",
      url,
      {},
      {
        Authorization: `Bearer ${accessToken}`,
      }
    );
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error deleting image" };
  }
};
export const getsellerApi = async () => {
  const url = `${BASE_URL}/admin/vendor/get`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching  products",
    };
  }
};

export const getSellerRequestApi = async () => {
  const url = `${BASE_URL}/admin/vendor/pending`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching  seller request",
    };
  }
};

export const updateSellerRequestApi = async (id) => {
  if (!id) {
    return { success: false, error: "Seller ID is required" };
  }

  const url = `${BASE_URL}/admin/vendor/${id}/request`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    if (response?.success) {
      return response;
    }

    return {
      success: false,
      error: response?.error || "Failed to update seller request",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Error updating seller request",
    };
  }
};

export const getSellerProfileRequestApi = async () => {
  const url = `${BASE_URL}/admin/vendor/profile/pending`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching  seller request",
    };
  }
};

export const updateSellerProfileRequestApi = async (id, data) => {
  if (!id) {
    return { success: false, error: "Seller ID is required" };
  }

  const url = `${BASE_URL}/admin/vendor/profile/${id}/update`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, data, {
      Authorization: `Bearer ${accessToken}`,
    });

    if (response?.success) {
      return response;
    }

    return {
      success: false,
      error: response?.error || "Failed to update seller request",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Error updating seller request",
    };
  }
};

export const getSellerByIdApi = async (productId) => {
  const url = `${BASE_URL}/admin/vendor/get/${productId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching product by ID",
    };
  }
};

export const createSellerApi = async (productData) => {
  const url = `${BASE_URL}/admin/vendor/create`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("POST", url, productData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data", 
    });
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error creating Product" };
  }
};

export const editSellerApi = async (productId, productData) => {
  const url = `${BASE_URL}/admin/vendor/update/${productId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, productData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    });
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error editing Product" };
  }
};

export const deleteSelllerApi = async (productId) => {
  const url = `${BASE_URL}/admin/vendor/delete/${productId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi(
      "DELETE",
      url,
      {},
      {
        Authorization: `Bearer ${accessToken}`,
      }
    );
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error deleting Product" };
  }
};

export const getnotificationApi = async () => {
  const url = `${BASE_URL}/admin/notification/get`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching  notification",
    };
  }
};

export const createNotificationApi = async (productData) => {
  const url = `${BASE_URL}/admin/notification/create`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("POST", url, productData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data", // Ensure proper headers
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error creating Notification",
    };
  }
};

export const deleteNotificationApi = async (notificationId) => {
  const url = `${BASE_URL}/admin/notification/delete/${notificationId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi(
      "DELETE",
      url,
      {},
      {
        Authorization: `Bearer ${accessToken}`,
      }
    );
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error deleting Notification",
    };
  }
};

export const getcouponApi = async () => {
  const url = `${BASE_URL}/admin/coupon/get`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error fetching  coupon" };
  }
};

export const getCouponByIdApi = async (productId) => {
  const url = `${BASE_URL}/admin/coupon/get/${productId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching product by ID",
    };
  }
};

export const createcouponApi = async (reqBody) => {
  const url = `${BASE_URL}/admin/coupon/create`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  return await commonApi("POST", url, reqBody, {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  });
};

export const editCouponApi = async (couponId, couponData) => {
  const url = `${BASE_URL}/admin/coupon/update/${couponId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, couponData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data", // Ensure proper headers
    });
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error editing Product" };
  }
};

export const deleteCouponApi = async (couponId) => {
  const url = `${BASE_URL}/admin/coupon/delete/${couponId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi(
      "DELETE",
      url,
      {},
      {
        Authorization: `Bearer ${accessToken}`,
      }
    );
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error deleting coupon" };
  }
};

export const getOrdersApi = async () => {
  const url = `${BASE_URL}/admin/order/get`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error fetching  orders" };
  }
};

export const getOrderByIdApi = async (orderId) => {
  const url = `${BASE_URL}/admin/order/get/${orderId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching order details",
    };
  }
};
export const updateOrderStatusApi = async (orderId, orderStatus) => {
  const url = `${BASE_URL}/admin/order/update/${orderId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, { orderStatus }, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error updating order status",
    };
  }
};

export const getCarouselApi = async () => {
  const url = `${BASE_URL}/admin/carousel/view`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching  carousel",
    };
  }
};

export const createCarouselApi = async (reqBody) => {
  const url = `${BASE_URL}/admin/carousel/create`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  return await commonApi("POST", url, reqBody, {
    Authorization: `Bearer ${accessToken}`,
    // Remove "Content-Type", Axios will set it automatically
  });
};

export const editCarouselApi = async (carouselId, couponData) => {
  const url = `${BASE_URL}/admin/carousel/update/${carouselId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, couponData, {
      Authorization: `Bearer ${accessToken}`,
      // Remove "Content-Type", Axios will set it automatically
    });
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error editing Carousel" };
  }
};

export const deleteCarouselApi = async (carouselId) => {
  const url = `${BASE_URL}/admin/carousel/delete/${carouselId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi(
      "DELETE",
      url,
      {},
      {
        Authorization: `Bearer ${accessToken}`,
      }
    );
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error deleting carousel",
    };
  }
};

export const getCustomersApi = async () => {
  const url = `${BASE_URL}/admin/user/get`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching  customers",
    };
  }
};

export const getCustomersByIdApi = async (customerId) => {
  const url = `${BASE_URL}/admin/user/get/${customerId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching customers details",
    };
  }
};

export const createcustomerApi = async (reqBody) => {
  const url = `${BASE_URL}/admin/user/create`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  return await commonApi("POST", url, reqBody, {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  });
};

export const getdealofthedayApi = async () => {
  const url = `${BASE_URL}/admin/product/get`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching  products",
    };
  }
};

export const getdealofthedaybyidApi = async (productId) => {
  const url = `${BASE_URL}/admin/product/get/${productId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching product by ID",
    };
  }
};

export const createDealOftheDayApi = async (dealdata) => {
  const url = `${BASE_URL}/admin/product/create`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("POST", url, dealdata, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error creating deal of the day",
    };
  }
};




export const getDashboardSalesApi = async (period) => {
  const url = `${BASE_URL}/admin/dashboard/sales?period=${period}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, {}, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching dashboard sales",
    };
  }
};

export const getMonthlySalesApi = async () => {
  const url = `${BASE_URL}/admin/dashboard/monthly-sales`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, {}, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching monthly sales data",
    };
  }
};

export const getDashboardCustomersApi = async (period) => {
  const url = `${BASE_URL}/admin/dashboard/total-customers?period=${period}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, { period }, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching dashboard customers",
    };
  }
};

export const getDashboardPendingOrdersApi = async (period) => {
  const url = `${BASE_URL}/admin/dashboard/total-pending-orders?period=${period}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, { period }, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching pending orders",
    };
  }
};

export const getDashboardTotalProductsApi = async (period) => {
  const url = `${BASE_URL}/admin/dashboard/total-products-ordered?period=${period}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, { period }, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching total products ordered",
    };
  }
};
export const getAvailableYearsApi = async () => {
  const url = `${BASE_URL}/admin/dashboard/get-years`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, {}, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching available years",
    };
  }
};
export const getreportsApi = async () => {
  const url = `${BASE_URL}/admin/review/reported-reviews`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching reported reviews",
    };
  }
};

export const reportResolveApi = async (reportId, reportReason) => {
  const url = `${BASE_URL}/admin/review/resolve-review/${reportId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi(
      "POST",
      url,
      { action: reportReason },
      {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      }
    );
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error resolving  report",
    };
  }
};


export const vendorLoginApi = async (loginData) => {
  const url = `${BASE_URL}/vendor/auth/login`;
  return await commonApi("POST", url, loginData);
};

export const vendorRegisterApi = async (registerData) => {
  const url = `${BASE_URL}/vendor/auth/register`;
  return await commonApi("POST", url, registerData);
};

export const getvendorCategoriesApi = async () => {
  const url = `${BASE_URL}/vendor/category/view`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching  categories",
    };
  }
};

export const getvendorSubCategoriesApi = async () => {
  const url = `${BASE_URL}/vendor/subcategory/view`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching  subcategories",
    };
  }
};

export const getvendorcouponApi = async () => {
  const url = `${BASE_URL}/vendor/coupon/get`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error fetching  coupon" };
  }
};

export const getvendorCouponByIdApi = async (productId) => {
  const url = `${BASE_URL}/vendor/coupon/get/${productId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching product by ID",
    };
  }
};

export const createvedorcouponApi = async (reqBody) => {
  const url = `${BASE_URL}/vendor/coupon/create`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  return await commonApi("POST", url, reqBody, {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  });
};

export const editvendorCouponApi = async (couponId, couponData) => {
  const url = `${BASE_URL}/vendor/coupon/update/${couponId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, JSON.stringify(couponData), {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    });
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error editing coupon" };
  }
};

export const deletevendorCouponApi = async (couponId) => {
  const url = `${BASE_URL}/vendor/coupon/delete/${couponId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi(
      "DELETE",
      url,
      {},
      {
        Authorization: `Bearer ${accessToken}`,
      }
    );
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error deleting coupon" };
  }
};

export const getvendorproductsApi = async () => {
  const url = `${BASE_URL}/vendor/product/get`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching  products",
    };
  }
};
export const deletevendorProductImageApi = async (imageId, imageName) => {
  const url = `${BASE_URL}/vendor/product/delete/${imageId}/image`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi(
      "DELETE",
      url,
      { imageName }, // Pass imageName in the body
      {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      }
    );
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error deleting image" };
  }
};


export const getvendorProductByIdApi = async (productId) => {
  const url = `${BASE_URL}/vendor/product/get/${productId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching product by ID",
    };
  }
};
export const editVendorProductApi = async (productId, productData) => {
  const url = `${BASE_URL}/vendor/product/update/${productId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, productData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data", // Ensure proper headers
    });
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error editing Product" };
  }
};

export const createvendorProductApi = async (productData) => {
  const url = `${BASE_URL}/vendor/product/create`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    // Debug: Log what's in the FormData before sending
    console.log("FormData contents before sending:");
    for (let pair of productData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
      if (pair[0] === "attributes") {
        console.log("Attributes value type:", typeof pair[1]);
        console.log("Raw attributes value:", pair[1]);
      }
    }

    const response = await commonApi("POST", url, productData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    });
    return response;
  } catch (error) {
    console.error("Full API error:", error);
    return { success: false, error: error.message || "Error creating Product" };
  }
};

export const deleteVendorProductApi = async (productId) => {
  const url = `${BASE_URL}/vendor/product/delete/${productId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi(
      "DELETE",
      url,
      {},
      {
        Authorization: `Bearer ${accessToken}`,
      }
    );
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error deleting Product" };
  }
};
export const getvendordealofthedayApi = async () => {
  const url = `${BASE_URL}/vendor/dealoftheday/get`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching  deals",
    };
  }
};
export const createvendorDealOftheDayApi = async (productData) => {
  const url = `${BASE_URL}/vendor/dealoftheday/create`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("POST", url, productData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error creating deal of the day",
    };
  }
};

export const deletevendordealofthedayApi = async (couponId) => {
  const url = `${BASE_URL}/vendor/dealoftheday/delete/${couponId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi(
      "DELETE",
      url,
      {},
      {
        Authorization: `Bearer ${accessToken}`,
      }
    );
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error deleting deal of the day",
    };
  }
};

export const getVendorMainCategoriesApi = async () => {
  const url = `${BASE_URL}/vendor/maincategory/get`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching main categories",
    };
  }
};

export const getVendorCategoryByMainCategoryIdApi = async (mainCategoryId) => {
  const url = `${BASE_URL}/vendor/category/view/${mainCategoryId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching category by main category ID",
    };
  }
};

export const getVendorSubcategoryByCategoryIdApi = async (categoryId) => {
  const url = `${BASE_URL}/vendor/subcategory/view/${categoryId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching subcategory",
    };
  }
};

export const getVendorCarouselApi = async () => {
  const url = `${BASE_URL}/vendor/carousel/view`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching  carousel",
    };
  }
};

export const createVenorCarouselApi = async (reqBody) => {
  const url = `${BASE_URL}/vendor/carousel/create`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  return await commonApi("POST", url, reqBody, {
    Authorization: `Bearer ${accessToken}`,
    // Remove "Content-Type", Axios will set it automatically
  });
};

export const editVendorCarouselApi = async (carouselId, couponData) => {
  const url = `${BASE_URL}/vendor/carousel/update/${carouselId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, couponData, {
      Authorization: `Bearer ${accessToken}`,
      // Remove "Content-Type", Axios will set it automatically
    });
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error editing Carousel" };
  }
};

export const deleteVendorCarouselApi = async (carouselId) => {
  const url = `${BASE_URL}/vendor/carousel/delete/${carouselId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi(
      "DELETE",
      url,
      {},
      {
        Authorization: `Bearer ${accessToken}`,
      }
    );
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error deleting carousel",
    };
  }
};

export const getvendornotificationApi = async () => {
  const url = `${BASE_URL}/vendor/notification/get`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching  notification",
    };
  }
};

export const createvendorNotificationApi = async (productData) => {
  const url = `${BASE_URL}/vendor/notification/create`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("POST", url, productData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data", // Ensure proper headers
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error creating Notification",
    };
  }
};

export const deletevendorNotificationApi = async (notificationId) => {
  const url = `${BASE_URL}/vendor/notification/delete/${notificationId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi(
      "DELETE",
      url,
      {},
      {
        Authorization: `Bearer ${accessToken}`,
      }
    );
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error deleting Notification",
    };
  }
};

export const getvendorOrdersApi = async () => {
  const url = `${BASE_URL}/vendor/order/get`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error fetching  orders" };
  }
};

export const getvendorOrderByIdApi = async (orderId) => {
  const url = `${BASE_URL}/vendor/order/get/${orderId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching order details",
    };
  }
};

export const getvendorProfileApi = async () => {
  const url = `${BASE_URL}/vendor/profile/view`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching  profile",
    };
  }
};

export const updateVendorProfileApi = async (formData) => {
  const url = `${BASE_URL}/vendor/profile/update`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, formData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error updating profile",
    };
  }
};





export const getVendorDashboardSalesApi = async (period) => {
  const url = `${BASE_URL}/vendor/dashboard/sales?period=${period}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, {}, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching dashboard sales",
    };
  }
};

export const getVendorMonthlySalesApi = async () => {
  const url = `${BASE_URL}/vendor/dashboard/monthly-sales`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, {}, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching monthly sales data",
    };
  }
};



export const getVendorDashboardPendingOrdersApi = async (period) => {
  const url = `${BASE_URL}/vendor/dashboard/total-pending-orders?period=${period}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, { period }, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching pending orders",
    };
  }
};

export const getVendorDashboardTotalProductsApi = async (period) => {
  const url = `${BASE_URL}/vendor/dashboard/total-products-ordered?period=${period}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, { period }, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching total products ordered",
    };
  }
};
export const getVendorAvailableYearsApi = async () => {
  const url = `${BASE_URL}/vendor/dashboard/get-years`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, {}, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching available years",
    };
  }
};




export const getVendorOfferApi = async () => {
  const url = `${BASE_URL}/vendor/offer/get`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching  offer",
    };
  }
};

export const createVendorOfferApi = async (reqBody) => {
  const url = `${BASE_URL}/vendor/offer/create`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  return await commonApi("POST", url, reqBody, {
    Authorization: `Bearer ${accessToken}`,
    // Remove "Content-Type", Axios will set it automatically
  });
};

export const editVendorOfferApi = async (offerId, offerData) => {
  const url = `${BASE_URL}/vendor/offer/update/${offerId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, offerData, {
      Authorization: `Bearer ${accessToken}`,
      // Remove "Content-Type", Axios will set it automatically
    });
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error editing offer" };
  }
};

export const deleteVendorOfferApi = async (offerId) => {
  const url = `${BASE_URL}/vendor/offer/delete/${offerId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi(
      "DELETE",
      url,
      {},
      {
        Authorization: `Bearer ${accessToken}`,
      }
    );
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error deleting offer",
    };
  }
};





export const getProductReviewsApi = async () => {
  const url = `${BASE_URL}/vendor/review/product-reviews`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching product reviews",
    };
  }
};

export const getTopSellingproductApi = async () => {
  const url = `${BASE_URL}/vendor/analytics/get`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching top selling product ",
    };
  }
};
export const respondToReviewApi = async (reviewId, responseText) => {
  const url = `${BASE_URL}/vendor/review/respond/${reviewId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi(
      "POST",
      url,
      { response: responseText },
      {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      }
    );
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error responding to review",
    };
  }
};

export const reportReviewApi = async (reviewId, reportReason) => {
  const url = `${BASE_URL}/vendor/review/report/${reviewId}`;
  const accessToken = localStorage.getItem("rigsdock_accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi(
      "POST",
      url,
      { reason: reportReason },
      {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      }
    );
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error reporting review",
    };
  }
};

