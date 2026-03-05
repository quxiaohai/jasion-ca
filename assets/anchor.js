class AnchorElement extends HTMLElement {
    constructor() {
      super();
      this.addEventListener('click', this.scrollToTarget);
    }
  
    scrollToTarget() {
      const targetId = this.getAttribute('anchor-controls');
      const targetElement = document.querySelector(`[anchor-target="${targetId}"]`);
      
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        setTimeout(() => targetElement.click(), 1000);
      }
    }
  }
  
  customElements.define('anchor-element', AnchorElement);
  