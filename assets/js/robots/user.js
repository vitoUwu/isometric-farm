import imageLoader from "../imageLoader.js";
import { Robot } from "./index.js";

export const USER_ID = "user";

export function createUser() {
  return new Robot(USER_ID, {
    up: imageLoader.get("/assets/images/robot/right-top.png"),
    down: imageLoader.get("/assets/images/robot/left-bottom.png"),
    left: imageLoader.get("/assets/images/robot/left-top.png"),
    right: imageLoader.get("/assets/images/robot/right-bottom.png"),
  });
}
