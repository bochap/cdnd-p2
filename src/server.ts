import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  app.get(
    "/filteredimage",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const path = new URL(req.query.image_url);
      } catch (error) {
        res.status(400);
        res.send(`invalid url: ${req.query.image_url}`);
        return;
      }

      try {
        const filteredImageFromURL = await filterImageFromURL(
          req.query.image_url
        );
        res.status(200).sendFile(filteredImageFromURL);
      } catch (error) {
        res.status(500);
        res.send(`provided url cannot be processed: ${req.query.image_url}`);
      }
    }
  );

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
