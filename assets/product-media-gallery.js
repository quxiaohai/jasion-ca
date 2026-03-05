class ThumbnailHeightAdjuster {
  constructor() {
    this.mediaList = document.querySelector('.product__media-list');
    this.thumbnailsList = document.querySelector('.product__thumbnails--beside .product__thumbnails-list');
    
    if (this.mediaList && this.thumbnailsList) {
      this.adjustThumbnailHeight();
    }
  }

  adjustThumbnailHeight() {
    const mediaListHeight = this.mediaList.clientHeight;
    this.thumbnailsList.style.maxHeight = `${mediaListHeight}px`;
  }
}

// 实例化类
const thumbnailHeightAdjuster = new ThumbnailHeightAdjuster();