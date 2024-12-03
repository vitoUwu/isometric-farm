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
      const cameraX = localStorage.getItem("cameraX") || 0;
      const cameraY = localStorage.getItem("cameraY") || 0;
      const cash = localStorage.getItem("cash") || 1000;
      const scale = localStorage.getItem("scale") || 1;
      const tilesLevel = localStorage.getItem("tilesLevel") || 1;

      localStorage.clear();

      setItem("camera", { cameraX, cameraY, scale });
      setItem("bank", { balance: cash });
      setItem("crops", { crops: [], level: 1 });
      setItem("inventory", { items: {}, level: 1 });
      setItem("tiles", { fieldLevel: Number(tilesLevel) });
      setItem("version", nextVersion);
      setItem("debug", debug);
      setItem("dev", dev);
      window.location.reload();
      break;
    case MIGRATION_FLOW["1.0.0"]:
      const storage = localStorage.getItem("storage");

      if (storage) {
        try {
          const parsed = JSON.parse(storage);
          if (Array.isArray(parsed.items)) {
            parsed.items = parsed.items.reduce((acc, item) => {
              acc[item.id] = item;
              return acc;
            }, {} as Record<string, unknown>);
          }
          setItem("inventory", parsed);
        } catch (error) {
          logger.error("Error parsing storage", error);
          setItem("inventory", { items: {}, level: 1 });
        }
      } else {
        setItem("inventory", { items: {}, level: 1 });
      }

      setItem("version", nextVersion);

      localStorage.removeItem("storage");
      window.location.reload();
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
