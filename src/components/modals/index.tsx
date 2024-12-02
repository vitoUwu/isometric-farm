import { type ReactElement, useRef } from "jsx-dom";
import Button from "../ui/Button";

const modalRef = useRef<HTMLDivElement>(null);
const contentRef = useRef<HTMLDivElement>(null);

export function renderModal(content: ReactElement) {
  if (!modalRef.current) throw new Error("Modal not found");
  if (!contentRef.current) throw new Error("Modal content not found");

  modalRef.current.setAttribute("data-modal-open", "true");

  contentRef.current.innerHTML = "";
  contentRef.current.appendChild(content);
}

export function closeModal() {
  if (!modalRef.current) throw new Error("Modal not found");
  if (!contentRef.current) throw new Error("Modal content not found");

  modalRef.current.removeAttribute("data-modal-open");
  contentRef.current.innerHTML = "";
}

export default function Modal() {
  return (
    <>
      <div onClick={closeModal} class="backdrop"></div>
      <div id="modal" data-modal-open="false" ref={modalRef}>
        <Button
          variant="danger"
          onClick={closeModal}
        >
          X
        </Button>
        <div id="modal-content" style="padding-top:12px" ref={contentRef}>
        </div>
      </div>
    </>
  );
}
