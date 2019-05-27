export default class Swiper {
    constructor(options = {}) {
        this.options = Object.assign({
            swiper: '#swiper',
            item: '.swiper-name',
            autoplay: false,
            duration: 3000
        }, options);

        // 所有的Element对象和集合
        this.elements = {
            swiper: document.querySelector(this.options.swiper),
            items: null,
            container: null,
        };

        // 一些状态
        this.states = {
            index: 0,           // 当前滑块的下标，从0开始
            left: 0,            // container的一个left位置
            touch: 0,           // 触摸状态 0：未触摸 1：手指触摸/鼠标按下
            autoplay: this.options.autoplay,
            touchTrack: {
                start: null,    // 手指触摸/鼠标按下时的位置
                old: null,      // 手指/鼠标上一次的位置
            },
        };

        // 检测是在pc端还是移动端
        this.isTouch = 'ontouchstart' in window; 

        if (!this.elements.swiper) {
            throw `${this.options.swiper} not found`;
        }
        
        this.wrapContainer();
        this.initStyle();
        this.touchEvent();

        if (this.options.autoplay) {
            this.autoplay();
            this.elements.swiper.addEventListener('mouseover', () => {
                this.states.autoplay = false;
            });
            this.elements.swiper.addEventListener('mouseout', () => {
                this.states.autoplay = true;
            });
        }
    }

    /**
     * 把滑块外层再包裹一个div
     * 这个div负责整个滑块的移动
     */
    wrapContainer() {
        const html = this.elements.swiper.innerHTML;
        this.elements.swiper.innerHTML = '';
        this.elements.container = document.createElement('div');
        this.elements.container.innerHTML = html;
        this.elements.swiper.append(this.elements.container);
        this.elements.items = this.elements.swiper.querySelectorAll(this.options.item);
    }

    /**
     * 初始化样式
     */
    initStyle() {
        this.elements.swiper.setAttribute('style', `
            position: relative; 
            overflow: hidden;
        `);
        this.elements.container.setAttribute('style', `
            display: flex;
            width: 10000%;
            position: relative;
            left: 0;
        `);
        this.elements.items.forEach(item => {
            item.style.cssText += `width: 1%;`;
        });
    }

    /**
     * 监听触摸事件
     */
    touchEvent() {
        if (this.isTouch) {
            this.elements.container.addEventListener('touchstart', () => this.touchStart(event));
            this.elements.container.addEventListener('touchmove', () => this.touchMove(event));
            this.elements.container.addEventListener('touchend', () => this.touchEnd(event));
        }
        else {
            this.elements.container.addEventListener('mousedown', () => this.touchStart(event));
            this.elements.container.addEventListener('mousemove', () => this.touchMove(event));
            this.elements.container.addEventListener('mouseup', () => this.touchEnd(event));
        }
    }

    touchStart(event) {
        // 阻止浏览器默认的拖拽行为
        event.preventDefault();
        this.states.touch = 1;
        this.states.autoplay = false;
        this.states.touchTrack.start = this.states.touchTrack.old = event.touches ? event.touches[0] : event;
    }

    touchMove(event) {
        // 必须是手指/鼠标按下了才允许移动
        if (this.states.touch != 1) return;
        // 阻止浏览器默认的拖拽行为
        event.preventDefault();
        // 触摸和鼠标事件event不一样，要区分开来。
        event = event.touches ? event.touches[0] : event;

        // event.pageX表示当前手指/鼠标所移动的位置
        // 而我们this.states.touchTrack.old表示手指/鼠标的上一个位置
        // 所以可以通过比对来判断是向左滑动还是向右滑动
        if (event.pageX < this.states.touchTrack.old.pageX) {
            this.states.left -= this.states.touchTrack.old.pageX - event.pageX;
        }
        else {
            this.states.left += event.pageX - this.states.touchTrack.old.pageX;
        }
        this.states.touchTrack.old = event;
        this.elements.container.style.left = this.states.left + 'px';
    }

    touchEnd(event) {
        // 移除触摸状态
        this.states.touch = 0;
        this.states.autoplay = true;
        event = event.changedTouches ? event.changedTouches[0] : event;
        if (event.pageX < this.states.touchTrack.start.pageX) {
            this.states.index ++;
        }
        else {
            this.states.index --;
        }

        // 防止滑块溢出
        if (this.states.index < 0) {
            this.states.index = 0;
        }
        else if (this.states.index > this.elements.items.length - 1) {
            this.states.index = this.elements.items.length - 1;
        }

        this.change(this.states.index);
    }

    change(index) {
        // 当前滑块的index乘以滑块宽度的相反数即为container的left位置。
        this.states.left =  - (this.elements.items[0].offsetWidth * index);
        this.elements.container.style.left = this.states.left + 'px';

        // 用transition属性实现一个左右移动动画效果
        this.elements.container.style.cssText += `transition: left 0.3s ease-in;`;
        // 当动画结束后，去掉transition属性
        this.elements.container.addEventListener('transitionend', () => {
            this.elements.container.style.cssText = this.elements.container.style.cssText.replace('transition', '');
        });
        
        this.states.index = index;
        // 触发一个事件
        if (this.options.change && typeof this.options.change == 'function') {
            this.options.change.bind(this)(index);
        }
    }

    /**
     * 自动播放
     */
    autoplay() {
        // 设置一个定时器
        setInterval(() => {
            if (!this.states.autoplay) return;
            // 默认向左滑动
            this.states.index ++;
            // 如果滑动到最后一个滑块，则设置index为第一个滑块
            if (this.states.index > this.elements.items.length - 1) {
                this.states.index = 0;
            }
            this.change(this.states.index);
        }, this.options.duration);
    }
};