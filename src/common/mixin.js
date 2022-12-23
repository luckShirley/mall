import { debounce } from "./utils.js";
import BackTop from "components/content/backTop/BackTop";

export const itemListenerMixin = {
  data() {
    return {
      itemImgListner: null,
    }
  },
  mounted() {
    let refresh = debounce(this.$refs.scroll.refresh, 200);
    // 1 监听item中的图片加载完成
    this.itemImgListner = () => {
      refresh();
    };
    this.$bus.$on("itemImgLoad", this.itemImgListner);
  },
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTap: false,
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500);
    },
  }
}