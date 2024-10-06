import cors from "cors";

const corsOption = {
  origin: "*",
  methods: "GET, POST, PUT, DELETE",
  allowHeaders: ["Content-Type", "Authorization"],
};

const corsMiddleware = cors(corsOption);

export { corsMiddleware };
