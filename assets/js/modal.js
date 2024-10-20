const modal = document.getElementById("modal");
const backdrop = document.getElementById("backdrop");

export function closeModal() {
  modal.setAttribute("data-modal-open", false);
}

export function showModal(content) {
  modal.setAttribute("data-modal-open", true);
  modal.innerHTML = `
    <div id='modal-content'>
      <button style='position:absolute;top:0;right:0;color:black;background:transparent' onclick="window.closeModal()">X</button>
      <div style='padding-top:12px'>${content}</div>
    </div>`;
}

backdrop.addEventListener("click", () => {
  closeModal();
});

window.closeModal = closeModal;
