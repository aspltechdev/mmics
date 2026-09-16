import api from "./api";

const dashboardService = {
  getAnalytics: async () => {
    const response =
      await api.get("/dashboard/analytics");

    return response.data;
  },
};

export default dashboardService;