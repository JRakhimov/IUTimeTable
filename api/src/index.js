import bodyParser from "body-parser";
import Express from "express";
import morgan from "morgan";
import cors from "cors";

import { Logger } from "./utils";
import routes from "./routes";

const app = Express();
const logger = Logger("Main");

app.use(morgan("dev", { stream: { write: (reqs) => logger.info(reqs) } }));
app.use(bodyParser.urlencoded({ extended: true, limit: "2mb" }));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

app.use(routes);

app.listen(process.env.PORT, () => logger.info(`.::Magic happens at ${process.env.PORT} port::.`));
