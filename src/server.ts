import app from "./app";

const port = process.env.PORT;

if (!port) {
  throw new Error("PORT is not defined");
}

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
