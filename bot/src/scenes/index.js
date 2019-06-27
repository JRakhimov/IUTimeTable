import Stage from "telegraf/stage";

import { logInScene } from "./login";

const stage = new Stage([ logInScene ], { ttl: 300 });

export default stage;
