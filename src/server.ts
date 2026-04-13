import app from "./app.js";

const PORT = process.env.PORT || 5000;

const bootstrap = () => {
  try {
    app.listen(process.env.PORT || PORT, () => {
      console.log(`Server is running on port ${process.env.PORT || PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};
bootstrap();
