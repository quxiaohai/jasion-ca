if (!window.customElements.get('card-slider-media')) {
  
  class CardSliderMedia extends HTMLElement {
    constructor() {
      super();
      this.autoPlay = this.getAttribute('auto-play') === 'true';
      Motion.inView(this, this.init.bind(this), { margin: '200px 0px 200px 0px' });
    }

    disconnectedCallback() {
      if (this.carousel) {
        this.carousel.destroy();
      }
      if (this.thumbnailContainer) {
        this.thumbnailContainer.removeEventListener("click", this.onThumbnailClick);
      }
      if (this.thumbnailCarousel) {
        this.thumbnailCarousel.destroy();
      }
    }

    init() {
      this.mediaCount = this.querySelectorAll('.media').length;
      if (this.mediaCount > 1) {
        const sliderId = this.getAttribute("slider-media-id");
        this.thumbnailContainer = document.querySelector(`[slider-thumbnail-id="${sliderId}"]`);
        const thumbnailMode = this.getAttribute("thumbnail-mode") || "click";

        this.carousel = new Flickity(this, {
          groupCells : false,
          accessibility: false,
          draggable: true,
          pageDots: true,
          prevNextButtons: false,
          wrapAround: true,
          autoPlay: this.autoPlay ? 3000 : false, // 启用时为3秒间隔
          on: {
            ready: () => { 
              this.setFlickityViewportHeight();
            },
          }
        });


        if (this.thumbnailContainer) {
          if (thumbnailMode === "click") {
            this.onThumbnailClick = (event) => {
              const clickedThumbnail = event.target.closest("li");
              if (!clickedThumbnail) return;

              const index = Array.from(this.thumbnailContainer.children).indexOf(clickedThumbnail);
              if (index !== -1) {
                this.carousel.select(index);
              }
            };
            this.thumbnailContainer.addEventListener("click", this.onThumbnailClick);

            this.carousel.on("change", (index) => {
              this.updateActiveThumbnail(index);
            });

            this.updateActiveThumbnail(this.carousel.selectedIndex);
          } else if (thumbnailMode === "flickity") {
            this.thumbnailCarousel = new Flickity(this.thumbnailContainer, {
              asNavFor: `[slider-media-id="${sliderId}"]`,
              contain: true,
              pageDots: false,
              prevNextButtons: false,
              cellAlign: "left",
              draggable: true,
            });

          }
        }

        setTimeout(() => {
          this.carousel.resize();
        }, 500);


      }
    }

    updateActiveThumbnail(index) {

      if (!this.thumbnailContainer) return;
      const thumbnails = Array.from(this.thumbnailContainer.children);
      thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle("active", i === index);
      });
    }
    // 新增方法：设置 flickity-viewport 高度
    setFlickityViewportHeight() {
      const viewport = this.querySelector('.flickity-viewport');  // 获取 .flickity-viewport 元素
      if (viewport) {
        const height = this.offsetHeight;  // 获取 this（product-card__carousel）的高度
        console.log('carousel height:', height);  // 打印 height
        viewport.style.height = `${height}px`;
        viewport.style.width = `100%`;
      }
    }
    
    
  }

  customElements.define('card-slider-media', CardSliderMedia);
}
