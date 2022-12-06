module.exports = {
  // transpileDependencies: true
  configureWebpack: {
    resolve: {
      // extensions:[], 在里面可以配置，这样有些路径的文件后缀名可以不写
      // 起别名
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views'

      }
    }
  }
}
