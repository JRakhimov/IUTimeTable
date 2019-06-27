import { Router } from "express";

import { timetable } from "../../controllers";
import { authCheck } from "../../middlewares";

const router = Router();

router.post("/add", authCheck.admin, timetable.add);
router.delete("/groupName", authCheck.admin, timetable.remove);
router.get("/:groupName", authCheck.student, timetable.getForGroup);

export default router;
