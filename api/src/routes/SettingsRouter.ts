import express, { Router } from "express";

const router: Router = express.Router();

router
    .route("/general")
    .put((req, res) => {
        res.send("NOT IMPLEMENTED - UPDATE GENERAL SETTINGS").end();
    });

export default router;