import { closeModal } from ".";
import Daily from "../../lib/bank/daily";
import Button from "../ui/Button";

export default function DailyModal() {
  return (
    <>
      <h1>Daily Reward</h1>
      <p>
        You collected your daily reward and won {Daily.reward} coins!
      </p>
      <Button
        variant="success"
        style="margin-top: 12px"
        onClick={() => closeModal()}
      >
        Yay!
      </Button>
    </>
  );
}
