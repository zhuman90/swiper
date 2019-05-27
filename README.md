## 演示
![滑块插件演示](https://img-blog.csdnimg.cn/2019052417041397.gif#pic_center#pic_center)

## 使用
    请查看/demo/demo.html


```html

<!-- swiper名称可以自定义的啦 -->
<div id="swiper">
	<!-- swiper-item名称也可以自定义啦，相当于一个滑块 -->
    <div class="swiper-item">
        <img src="./images/1.jpg" />
    </div>
    <div class="swiper-item">
        <img src="./images/2.jpg" />
    </div>
    <div class="swiper-item">
        <img src="./images/3.jpg" />
    </div>
</div>

<script src="../dist/swiper.js"></script>
<script>
    new Swiper({
        swiper: '#swiper',		// swiper节点名称
        item: '.swiper-item',	// swiper内部滑块的节点名称
        autoplay: false,		// 是否自动滑动
        duration: 3000,			// 自动滑动间隔时间
        change(index) {			// 每滑动一个滑块，插件就会触发change函数，index表示当前的滑块下标
            console.log(index);
        }
    });
</script>
```

## 其他
仍在完善