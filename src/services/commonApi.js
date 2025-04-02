import axios from "axios";

export const commonApi = async (
  method,
  url,
  reqBody,
  reqHeader = {}
) => {
  const config = {
    method,
    url,
    data: reqBody,
    headers: {
      "Content-Type": "application/json",
      ...reqHeader, // Ensure Authorization header is merged correctly
    },
  };

  try {
    const result = await axios(config);
    return { success: true, data: result.data, status: result.status };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data : error.message,
      status: error.response ? error.response.status : 500,
    };
  }
};



