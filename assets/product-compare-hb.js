const wrapper = document.querySelector(".compare-option-wrapper");

// 点击 compare-select
document.querySelectorAll(".compare-select").forEach(select => {
    select.addEventListener("click", () => {
        const handle = select.dataset.handle;
        wrapper.dataset.target = handle;

        const handles = Array.from(document.querySelectorAll(".compare-select"))
            .filter(el => el.offsetParent !== null)
            .map(el => el.dataset.handle);

        document.querySelectorAll("#modal-product-list .compare-option-wrapper .pr-item")
            .forEach(item => item.classList.toggle("active", handles.includes(item.dataset.handle)));
    });
});

// 点击 pr-item
document.querySelectorAll(".compare-option-wrapper .pr-item").forEach(item => {
    item.addEventListener("click", function () {
        if (this.classList.contains("active")) return;

        const targetHandle = wrapper.dataset.target;

        // 切换 active
        this.classList.add("active");
        this.parentElement.querySelector(`.pr-item[data-handle="${targetHandle}"]`)?.classList.remove("active");

        // 获取所有已激活 pr-item 的 handle
        const activeHandles = Array.from(document.querySelectorAll(".pr-item.active"))
            .map(i => i.dataset.handle);

        // 批量处理 .pr-result-wrapper 和 .compare-select
        document.querySelectorAll(".pr-result-wrapper, .sticky-bikes .compare-select").forEach(el => {
            el.classList.toggle("active", activeHandles.includes(el.dataset.handle));
        });

        // 关闭模态窗口
        document.querySelector("#modal-product-list .close-btn")?.click();
    });
});

const [spesWrapper, stickyBikes] = ['.spes-wrapper', '.sticky-bikes'].map(q => document.querySelector(q));

spesWrapper && stickyBikes && (() => {
  const wrapperTop = spesWrapper.offsetTop;
  const wrapperHeight = spesWrapper.offsetHeight;
  const wrapperBottom = wrapperTop + wrapperHeight;

  const toggleBikes = () => {
    const scrollY = window.scrollY;
    console.log('滚动高度:', scrollY);

    stickyBikes.style.display =
      scrollY > wrapperTop && scrollY < wrapperBottom
        ? 'block'
        : 'none';
  };

  window.addEventListener('scroll', toggleBikes);
  toggleBikes(); // 初始化
})();


// 创建媒体查询
const mobileMediaQuery = window.matchMedia('(max-width: 768px)');
// 处理函数
function handleMobileChange(e) {
  if (e.matches) {
    // 屏幕小于769px
    document.querySelectorAll('.pr-result-wrapper.active')[2]?.classList.remove('active');
    document.querySelectorAll('.modal-product-list .pr-item.active')[2]?.classList.remove('active');
    document.querySelectorAll('.sticky-bikes .compare-select.active')[2]?.classList.remove('active');
  }
}
// 初始检查
handleMobileChange(mobileMediaQuery);
// 监听变化
mobileMediaQuery.addListener(handleMobileChange);