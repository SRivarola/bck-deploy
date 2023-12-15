export default {
    failed: { message: "Failed", code: 400 },
    credentials: { message: "Invalid Credentials", code: 401 },
    auth: { message: "Unauthenticated", code: 401 },
    forbidden: { message: "Unauthorized", code: 403 },
    notFound: (payload) => {
      return { message: `${payload} not found`, code: 404 };
    },
  };