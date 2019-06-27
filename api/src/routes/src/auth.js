import { Router } from "express";
import { auth } from "../../controllers";

const router = Router();

router.post("/eclass", auth.eclass);
router.post("/admin", auth.admin);

export default router;
