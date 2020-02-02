import { Router } from "express";

import { students } from "../../controllers";
import { authCheck } from "../../middlewares";

const router = Router();

router.post("/add", authCheck.admin, students.add);
router.post("/import", authCheck.admin, students.importFromJSON);
router.get("/:studentID", authCheck.student, students.get);
router.put("/logout", authCheck.student, students.setLogoutFalse);

export default router;
