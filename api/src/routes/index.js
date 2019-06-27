import { Router } from "express";

import timetable from "./src/timetable";
import students from "./src/students";
import friends from "./src/friends";
import groups from "./src/groups";
import auth from "./src/auth";

const router = Router();

router.get("/", (_req, res) => res.sendStatus(200));

router.use("/timetable", timetable);
router.use("/students", students);
router.use("/friends", friends);
router.use("/groups", groups);
router.use("/auth", auth);

router.all("*", (_req, res) => res.status(404).send({ status: false, message: "Not Found" }));

export default router;
