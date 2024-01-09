import express, { Router, Request, Response } from "express";

const router: Router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    res.send("NOT IMPLEMENTED: GET ALL LOCATIONS").end();
});

router.get("/:id", async (req: Request, res: Response) => {
    res.send("NOT IMPLEMENTED: GET INDIVIDUAL LOCATION").end();
});

router.post("/", async (req: Request, res: Response) => {
    res.send("NOT IMPLEMENTED: CREATE INDIVIDUAL LOCATION").end();
});

router.put("/:id", async (req: Request, res: Response) => {
    res.send("NOT IMPLEMENTED: UPDATE INDIVIDUAL LOCATION").end();
});

router.delete("/:id", async (req: Request, res: Response) => {
    res.send("NOT IMPLEMENTED: DELETE INDIVIDUAL LOCATION").end();
});

export default router;