<template>
  <div id="detail">
    <!-- 事件怎么传入怎么写 -->
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
    >
      <!-- 标签内绑定属性时是不区分大小写的 所以传入值写成：top-images -->
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imgLoad" />
      <detail-param-info ref="params" :param-info="paramInfo" />
      <detail-comment-info ref="comment" :comment-info="commentInfo" />
      <goods-list ref="recommend" :goods="recommends" />
    </scroll>
    <detail-bottom-bar @addToCart="addToCart" />
    <back-top @click.native="backClick" v-show="isShowBackTap" />
    <toast :message="message" :show="show" />
  </div>
</template>

<script>
import DetailNavBar from "./childcomps/DetailNavBar.vue";
import DetailSwiper from "./childcomps/DetailSwiper.vue";
import DetailBaseInfo from "./childcomps/DetailBaseInfo.vue";
import DetailShopInfo from "./childcomps/DetailShopInfo.vue";
import DetailGoodsInfo from "./childcomps/DetailGoodsInfo.vue";
import DetailParamInfo from "./childcomps/DetailParamInfo.vue";
import DetailCommentInfo from "./childcomps/DetailCommentInfo.vue";
import DetailBottomBar from "./childcomps/DetailBottomBar.vue";

import Scroll from "components/common/scroll/Scroll.vue";
import GoodsList from "components/content/goods/GoodsList.vue";
import Toast from "components/common/toast/Toast";

import { debounce } from "common/utils";
import { itemListenerMixin, backTopMixin } from "common/mixin.js";
import { mapActions } from "vuex";

import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend,
} from "network/detail.js";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    GoodsList,
    Scroll,
    Toast,
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
      message: "",
      show: false,
    };
  },
  created() {
    // 1 保存传入的iid
    this.iid = this.$route.params.iid;
    // 2 根据iid请求详细数据
    getDetail(this.iid).then((res) => {
      // console.log(res);
      const data = res.result;
      // 1 获取顶部的轮播图图片数据
      this.topImages = data.itemInfo.topImages;

      // 2 获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );
      // 3 获取店铺信息
      this.shop = new Shop(data.shopInfo);
      // 4 获取店铺信息
      this.detailInfo = data.detailInfo;
      // 5 获取参数信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );
      // 6 取出评论的信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }
      // 等上面渲染完后回调这个函数
      // this.$nextTick(() => {
      //   // 根据最新的数据，对应的DOM是已经被渲染出来
      //   // 但是图片依然是没有加载完（目前获取的offsetTop不包含其中的图片）
      //   this.themeTopYs.push(0);
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      //   console.log(this.themeTopYs);
      // });
    });
    // 3 请求推荐数据
    getRecommend().then((res) => {
      this.recommends = res.data.list;
    });
    // 4 给getThemeTopY 赋值
    this.getThemeTopY = debounce(() => {
      // this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      // console.log(this.themeTopYs);
    }, 200);
  },

  methods: {
    ...mapActions(["addCart"]),
    imgLoad() {
      this.$refs.scroll.refresh();

      this.getThemeTopY();
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200);
    },
    contentScroll(position) {
      this.isShowBackTap = -position.y > 1000;

      const positionY = -position.y;
      // for (let i in this.themeTopYs) {
      //   // console.log(i); i得到的是字符串类型
      //   if (
      //     positionY > this.themeTopYs[i] &&
      //     positionY > this.themeTopYs[i * 1 + 1] // 给i*1将其转换为数字型
      //   ) {
      //     console.log(i);
      //   }
      // }
      let length = this.themeTopYs.length;
      for (let i = 0; i < length; i++) {
        if (
          this.currentIndex !== i &&
          ((i < length - 1 &&
            positionY >= this.themeTopYs[i] &&
            positionY < this.themeTopYs[i + 1]) ||
            (i === length - 1 && positionY >= this.themeTopYs[i]))
        ) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }
    },
    addToCart() {
      // 获取购物车需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;
      // 将商品添加到购物车里
      // this.$store.commit("addCart", product);
      // this.$store.dispatch("addCart", product);
      // this.$store.dispatch("addCart", product).then((res) => {
      //   console.log(res);
      // });
      this.addCart(product).then((res) => {
        this.message = res;
        this.show = true;
        setTimeout(() => {
          this.message = "";
          this.show = false;
        }, 1500);
      });
    },
  },
  destroyed() {
    this.$bus.$off("itemImgLoad", this.itemImgListner);
  },
};
</script>

<style  scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.content {
  height: calc(100% - 44px - 49px);
}
.detail-nav {
  position: relative;
  background-color: #fff;
  z-index: 9;
}
</style>