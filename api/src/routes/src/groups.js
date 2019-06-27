import { Router } from "express";

import { groups } from "../../controllers";
import { authCheck } from "../../middlewares";

const router = Router();

router.post("/form", authCheck.admin, groups.formGroups);
router.get("/:groupName", authCheck.student, groups.getGroupStudents);

export default router;
