class ModalDialog extends HTMLElement {
    constructor() {
      super();

      // 点击空白区域关闭
      this.addEventListener("click", (event) => {
        if (event.target === this) this.hide();
      });

      // 绑定内部关闭按钮
      this.querySelector(".close-btn")?.addEventListener("click", () => this.hide());
    }

    show() {
      this.setAttribute("open", "");
      document.body.style.overflow = "hidden"; // 禁止滚动
    }

    hide() {
      this.removeAttribute("open");
      document.body.style.overflow = ""; // 恢复滚动
    }
}

  // 注册自定义元素
  customElements.define("modal-dialog", ModalDialog);

  // 监听所有热点点击，控制对应的弹窗
  document.querySelectorAll(".hotspot").forEach(hotspot => {
    hotspot.addEventListener("click", function () {
      let modalId = this.getAttribute("data-modal-target");
      let modal = document.getElementById(modalId);
      if (modal) {
        modal.show(); // 打开对应弹窗
      }
    });
  });