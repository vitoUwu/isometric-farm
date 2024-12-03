import { GAMESTATE_KEYS, MIGRATION_FLOW, VERSION } from "../constants";
import logger from "../logger";

export default function migrate() {
  let version = localStorage.getItem(GAMESTATE_KEYS.VERSION);
  logger.debug("Raw current version", version);
  if (version === VERSION) {
    logger.debug("Already migrated");
    return;
  }

  if (typeof version !== "string" || !(version in MIGRATION_FLOW)) {
    version = undefined;
  }

  logger.debug("Game version", version);
  const nextVersion = MIGRATION_FLOW[version];
  logger.debug("Next version", nextVersion);

  if (localStorage.length === 0) {
    return;
  }

  const debug = localStorage.getItem("debug") === "true";
  const dev = localStorage.getItem("dev") === "true";

  switch (nextVersion) {
    case MIGRATION_FLOW.undefined:
      const cameraX = localStorage.getItem("cameraX");
      const cameraY = localStorage.getItem("cameraY");
      const cash = localStorage.getItem("cash");
      const scale = localStorage.getItem("scale");
      const tilesLevel = localStorage.getItem("tilesLevel");

      localStorage.clear();

      setItem(GAMESTATE_KEYS.CAMERA, { cameraX, cameraY, scale });
      setItem(GAMESTATE_KEYS.BANK, { balance: cash });
      setItem(GAMESTATE_KEYS.CROPS, { crops: [], level: 1 });
      setItem(GAMESTATE_KEYS.STORAGE, { items: [], level: 1 });
      setItem(GAMESTATE_KEYS.TILES, { fieldLevel: Number(tilesLevel) });
      setItem(GAMESTATE_KEYS.VERSION, nextVersion);
      setItem("debug", debug);
      setItem("dev", dev);
      setTimeout(() => {
        window.location.reload();
      }, 0);
      break;
    default:
      logger.error("Unknown migration version", nextVersion);
      break;
  }
}

function setItem(key: string, value: unknown) {
  localStorage.setItem(
    key,
    typeof value === "object" ? JSON.stringify(value) : String(value),
  );
}
