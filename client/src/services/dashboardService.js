import api from "./api";

const dashboardService = {
  getAnalytics: async () => {
    const { data } = await api.get("/dashboard/analytics");

    // Map the backend response to the structure Dashboard.jsx expects.
    return {
      ...(data?.analytics || {}),
      recentMembers: data?.recent?.members || [],
      recentProducts: data?.recent?.products || [],
      recentEnquiries: data?.recent?.enquiries || [],
    };
  },
};

export default dashboardService;