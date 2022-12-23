<template>
  <div class="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{ cartLength }})</div>
    </nav-bar>
    <!-- 商品列表 -->
    <cart-list />
    <!-- 底部汇总 -->
    <cart-bottom-bar />
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";

import CartList from "./childcomps/CartList.vue";
import CartBottomBar from "./childcomps/CartBottomBar.vue";

import { mapGetters } from "vuex";

export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    CartBottomBar,
  },
  computed: {
    // cartLength() {
    //   return this.$store.getters.cartLength
    // },
    // 从vuex的Getters获取所有需要的计算属性 两种用法
    // 用法一
    ...mapGetters(["cartLength"]),

    // 用法二
    // ...mapGetters(
    //   {
    //     length:'cartLength'
    //   }),
  },
};
</script>

<style  scoped>
.cart {
  height: 100vh;
}
.nav-bar {
  background-color: var(--color-tint);
  color: #fff;

  /* font-weight: 700; */
}
</style>