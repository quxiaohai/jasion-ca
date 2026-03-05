(function (){
    const node = document.getElementById('{{ section.id }}-wall');
    const nodeList = $heybike.getNodeList(node);
    const track = nodeList.marquee;
    let currentTranslate = 0; // 当前手动位移量
    let prevTranslate = 0;    // 上一帧的translateX值（用于计算速度）
    let lastTime;             // 上一帧的时间戳（用于精确计算速度）
    let velocity = 0;         // 当前速度0
    let animationId = null;   // 动画帧ID
    let itemWidth = track.scrollWidth / 3;
    let maxSize = itemWidth * 1.5;
    let minSize = itemWidth * 0.5;

    function resetTranslate() {
        const current = Math.abs(currentTranslate);
        if (current >= maxSize || current <= minSize) {
            currentTranslate = current >= maxSize ? -minSize : -maxSize;
        }
    }

    function loopScroll() {
        currentTranslate = -itemWidth;
        const duration = Number(track.dataset.duration);
        const direct = Number(track.dataset.direct);
        let time = Math.round(duration / itemWidth);
        let step = direct * 16 / time;
        let isAnimating = true, animationId = null;

        $heybike.on('resize', () => {
            itemWidth = track.scrollWidth / 3;
            maxSize = itemWidth * 1.5;
            minSize = itemWidth * 0.5;
            time = Math.round(duration / itemWidth);
            step = direct * 16 / time;
        });

        function run() {
            if (!isAnimating) {
                return false;
            }
            currentTranslate += step;
            resetTranslate();
            track.style.transform = `translate3d(${currentTranslate}px,0,0)`;
            cancelAnimationFrame(animationId);
            animationId = requestAnimationFrame(run);
        }

        const onStart = () => {
            isAnimating = true;
            animationId = requestAnimationFrame(run);
        }

        const onStop = () => {
            isAnimating = false;
            cancelAnimationFrame(animationId);
        }

        return {
            onStart,
            onStop
        }
    }

    const {onStart, onStop} = loopScroll();

    $heybike.inView(node, () => {
        onStart();
        return () => onStop();
    });

// --- 速度计算辅助函数：使用更平滑的低通滤波 ---
    function updateVelocity(currentPosition, timestamp) {
        if (lastTime !== undefined) {
            const deltaTime = timestamp - lastTime;
            // 避免deltaTime为0导致异常
            if (deltaTime > 0) {
                // 计算瞬时速度 (像素/毫秒)
                const instantVelocity = (currentPosition - prevTranslate) / deltaTime;
                // 低通滤波平滑速度，避免抖动。系数越小越平滑。
                const smoothingFactor = 0.2;
                velocity = velocity * (1 - smoothingFactor) + instantVelocity * smoothingFactor;
            }
        }
        prevTranslate = currentPosition;
        lastTime = timestamp;
    }

// --- 惯性动画函数 ---
    function inertiaAnimation() {
        // 摩擦力系数，决定减速快慢 (0.9-0.99之间效果较自然)
        const friction = 0.98;
        // 速度阈值，低于此值停止动画
        const velocityThreshold = 0.05;

        // 动画循环函数
        function animate() {
            // 应用摩擦力减速
            velocity *= friction;
            // 更新位置
            currentTranslate += velocity;
            resetTranslate();
            // 应用变换
            track.style.transform = `translateX(${currentTranslate}px)`;
            // 判断是否继续动画
            if (Math.abs(velocity) > velocityThreshold) {
                // 速度仍足够大，继续下一帧
                animationId = requestAnimationFrame(animate);
            } else {
                // 速度已很小，停止动画，并确保停在边界内
                velocity = 0;
                onStart();
            }
        }

        // 启动第一帧动画
        animationId = requestAnimationFrame(animate);
    }

    function overTrack() {
        cancelAnimationFrame(animationId);
        velocity = 0;
        onStop();
    }

    const initEvent = (start, move, end, mobile) => {
        nodeList.drag.addEventListener(start, e => {
            e.preventDefault();
            const pageX = mobile ? e.touches[0].pageX : e.pageX;
            node.classList.add('overlay');
            overTrack();
            // track.style.transitionDuration = `0ms`;
            let initX = currentTranslate;

            let _mousemove = (ev) => {
                ev.preventDefault();
                // 总位移 = 动画已产生的位移 + 本次手动拖拽的位移
                const moveX = (mobile ? ev.touches[0].pageX : ev.pageX) - pageX;
                currentTranslate = moveX + initX;
                const current = Math.abs(currentTranslate);
                if (current >= maxSize || current <= minSize) {
                    initX = -(current >= maxSize ? minSize : maxSize) - moveX;
                    currentTranslate = initX + moveX;
                }
                track.style.transform = `translateX(${currentTranslate}px)`;
                // 更新速度
                updateVelocity(moveX, performance.now());
            };

            let _mouseup = () => {
                document.body.removeEventListener(move, _mousemove);
                document.body.removeEventListener(end, _mouseup);
                !mobile && document.body.removeEventListener('mouseleave', _mouseup);
                _mousemove = undefined;
                _mouseup = undefined;
                node.classList.remove('overlay');
                if (currentTranslate === 0) {
                    onStart();
                } else {
                    inertiaAnimation();
                }
            };

            document.body.addEventListener(move, _mousemove);
            document.body.addEventListener(end, _mouseup);
            !mobile && document.body.addEventListener('mouseleave', _mouseup);
        });
    }

    initEvent('mousedown', 'mousemove', 'mouseup', false);
    initEvent('touchstart', 'touchmove', 'touchend', true);
})();