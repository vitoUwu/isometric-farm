import { styled, useRef } from "jsx-dom";
import Daily from "../../../lib/bank/daily";
import { renderModal } from "../../modals";
import DailyModal from "../../modals/Daily";
import Button, { type Props as ButtonProps } from "../Button";

const Span = styled.span`
  font-size: 32px;
`;
const StyledButton = styled<ButtonProps & { style: any; ref: unknown }>(Button)`
  flex-direction: column;
  display: flex;
  align-items: center;
  aspect-ratio: 1/1;
  justify-content: center;
  padding: 8px;
  position: absolute;
  bottom: 10px;
  right: 10px;
`;

export const ref = useRef<HTMLButtonElement>(null);

export default function DailyButton() {
  return (
    <StyledButton
      ref={ref}
      style={{}}
      variant="success"
      disabled={!Daily.isDailyClaimable()}
      onClick={() => {
        Daily.tryClaimReward();
        renderModal(DailyModal())
      }}
    >
      <Span>☀️</Span>
      <p>Collect Daily</p>
    </StyledButton>
  );
}
