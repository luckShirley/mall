<template>
  <div class="bottom-bar">
    <div class="checked-all">
      <check-button :is-checked="isSelectAll" class="checked-button" />
      <span>全选</span>
    </div>
    <div class="price">合计：{{ totalPrice }}</div>
    <div class="caculate">去计算({{ checkLength }})</div>
  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton.vue";

export default {
  name: "CartBottomBar",
  components: {
    CheckButton,
  },

  computed: {
    totalPrice() {
      return (
        "￥" +
        this.$store.state.cartList
          .filter((item) => {
            return item.checked;
          })
          .reduce((preValue, item) => {
            return preValue + item.price * item.count;
          }, 0)
          .toFixed(2)
      );
    },
    checkLength() {
      return this.$store.state.cartList.filter((item) => item.checked).length;
    },
    isSelectAll() {
      if (this.$store.state.cartList.length === 0) return false;

      // 1 使用filter
      // return !this.cartList.filter((item) => !item.checked).length;

      // 2 使用find
      // return !this.$store.state.cartList.find(item => !item.checked)

      // 3 普通遍历
      for (let item of this.$store.state.cartList) {
        if (!item.checked) {
          return false;
        }
      }
      return true;
    },
  },
};
</script>

<style  scoped>
.bottom-bar {
  position: relative;
  display: flex;
  height: 40px;
  background-color: #eee;
  line-height: 40px;
}
.checked-all {
  display: flex;
  align-items: center;
  margin-left: 10px;
  width: 60px;
}
.checked-button {
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-right: 5px;
}
.price {
  flex: 1;
  margin-left: 25px;
}
.caculate {
  width: 90px;
  text-align: center;
  background-color: hotpink;
  color: #fff;
}
</style>