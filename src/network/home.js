import { requset } from "./request";

export function getHomeMultidata() {
  return requset({
    url: '/home/multidata'
  })
}
export function getHomeGoods(type, page) {
  return requset({
    url: '/home/data',
    params: {
      type,
      page
    }
  })
}