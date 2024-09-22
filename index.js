import server from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
