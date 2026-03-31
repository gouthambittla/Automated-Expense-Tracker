// src/server.js
import { config } from "./config/env.js";
import app from "./app.js";

const PORT = config.port;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
