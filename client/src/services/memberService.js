// import api from "./api";

// const memberService = {
//   getAll: async () => {
//     const response = await api.get("/members");
//     return response.data;
//   },

//   getById: async (id) => {
//     const response = await api.get(`/members/${id}`);
//     return response.data;
//   },

//   create: async (data) => {
//     const response = await api.post("/members", data);
//     return response.data;
//   },

//   update: async (id, data) => {
//     const response = await api.put(`/members/${id}`, data);
//     return response.data;
//   },

//   updateStatus: async (id, status) => {
//     const response = await api.patch(`/members/${id}/status`, {
//       status,
//     });
//     return response.data;
//   },

//   remove: async (id) => {
//     const response = await api.delete(`/members/${id}`);
//     return response.data;
//   },
// };

// export default memberService;

import api from "./api";

const memberService = {
  /* =====================================================
     GET ALL MEMBERS
  ===================================================== */
  getAll: async () => {
    const response = await api.get("/members");
    return response.data;
  },

  /* =====================================================
     GET SINGLE MEMBER
  ===================================================== */
  getById: async (id) => {
    const response = await api.get(
      `/members/${id}`
    );

    return response.data;
  },

  /* =====================================================
     CREATE MEMBER
     Supports JSON + FormData
  ===================================================== */
  create: async (data) => {
    const response = await api.post(
      "/members",
      data
    );

    return response.data;
  },

  /* =====================================================
     UPDATE MEMBER
     Supports JSON + FormData
  ===================================================== */
  update: async (id, data) => {
    const response = await api.put(
      `/members/${id}`,
      data
    );

    return response.data;
  },

  /* =====================================================
     UPDATE MEMBER STATUS
  ===================================================== */
  updateStatus: async (
    id,
    status
  ) => {
    const response = await api.patch(
      `/members/${id}/status`,
      {
        status,
      }
    );

    return response.data;
  },

  /* =====================================================
     DELETE MEMBER
  ===================================================== */
  remove: async (id) => {
    const response = await api.delete(
      `/members/${id}`
    );

    return response.data;
  },
};

export default memberService;