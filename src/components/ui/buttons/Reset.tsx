import Button from "../Button";

export default function Reset() {
  return (
    <Button
      style="flex-direction: column;display: flex;align-items: center;aspect-ratio: 1/1;justify-content: center;padding:4px"
      variant="danger"
      onClick={() => {
        const dev = localStorage.getItem("dev") === "true";
        const debug = localStorage.getItem("debug") === "true";
        localStorage.clear();
        if (dev) {
          localStorage.setItem("dev", "true");
        }
        if (debug) {
          localStorage.setItem("debug", "true");
        }
        window.location.reload();
      }}
    >
      <span style="font-size: 32px">🔄</span>
      <span>Reset</span>
    </Button>
  );
}
