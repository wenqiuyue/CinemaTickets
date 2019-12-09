module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/manager':{
                target:'http://127.0.0.1:8088',
                changeOrigin:true,
            }
        }
    }
}