import { web } from "./app/web";

web.listen(3003, () => {
    console.log("Server is running on http://localhost:3003");
}).on("error", (err) => {
    console.error("Error starting server:", err);
});
