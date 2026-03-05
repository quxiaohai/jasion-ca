class MobileDock extends HTMLElement {
  constructor() {
    super();
    new theme.initWhenVisible(this.init.bind(this));
  }

  get section() {
    return this._section = this._section || this.closest('.mobile-dock-section');
  }

  init() {
    this.detectForHeader();
    setTimeout(this.setHeight.bind(this));
  }

  detectForHeader() {
    const header = document.querySelector('.header-section');
    if (header === null) {
      this.section.classList.add('active');
      return;
    }

    if (!header.classList.contains('header-sticky')) {
      this.scrollY  = parseInt(header.getBoundingClientRect().bottom);
      window.addEventListener('scroll', theme.utils.throttle(this.onScrollForHeader.bind(this)), false);
      this.detectForFooter();
    }
  }

  onScrollForHeader() {
    if (window.scrollY >= this.scrollY) {
      this.section.classList.add('active');
    }
    else {
      this.section.classList.remove('active');
    }
  }

  detectForFooter() {
    const footer = document.querySelector('.footer-copyright');
    if (footer === null) return;
    this.lastScrollY = 0;
    this.isHidden = $heybike.ref(true);
    $heybike.watch(this.isHidden, (n, o) => {
      this.classList.toggle('active', o);
    });
    window.addEventListener('scroll', theme.utils.throttle(this.onScrollForFooter.bind(this)), false);
  }

  onScrollForFooter() {
    if (!theme.config.mqlSmall) return;
    const scrolledTo = window.scrollY;
    this.isHidden.value = scrolledTo < this.lastScrollY;
    this.lastScrollY = scrolledTo;
  }

  setHeight() {
    document.documentElement.style.setProperty('--mobile-dock-height', `61px`);
  }
}
customElements.define('mobile-dock', MobileDock);
