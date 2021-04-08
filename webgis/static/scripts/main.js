let baseLayer;
let Gaodest;
let infodemo;
let stationinfo;

function onLoad() {
    mymap = L.map("basemap", {
        crs: L.CRS.EPSG3857,//这里坐标系一定要改成3857的！！！
        minZoom: 5,
        maxZoom: 18,
        center: [31.23138, 121.469897],
        zoom: 10,
        zoomDelta: 0.1,
        // fullscreenControl: false,
        zoomControl: false,
        // attributionControl: false
    });
    //http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}//arcgis在线地图
    baseLayer = L.tileLayer("http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
        attribution: '&copy; 高德地图',
        maxZoom: 18,
        minZoom: 5,
        subdomains: "1234"
    });

    Gaodest = L.tileLayer("http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}", {
        attribution: '&copy; 高德卫星地图',
        maxZoom: 18,
        minZoom: 5,
        subdomains: "1234"
    });

    // mymap.addLayer(Gaodest);
    // mymap.removeLayer(Gaodest);
    mymap.addLayer(baseLayer);

    let switchbtn = new Vue({
        el: '#switchbt',
        data: function () {
            return {
                value: false
            }
        },
        methods: {
            changelay(val) {
                if (val) {
                    console.log('st图层已打开')
                    mymap.removeLayer(baseLayer)
                    mymap.addLayer(Gaodest);
                }
                else if (!val) {
                    mymap.removeLayer(Gaodest)
                    mymap.addLayer(baseLayer);
                }
            }
        }
    }
    )

    let navMenu = new Vue({
        el: "#navMenu",
        date: {
            info:"hondosimida",
            name: "wjk",
            defauName: "用户未登录",
            show: false
        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            nmsl() {
                axios.post("/try", {
                    ID: '狗汉奸',
                    aiming: '王九科',
                    age: 21
                })
                    .then(response => (this.info = response.data))
                    .catch(function (error) { // 请求失败处理
                        console.log(error);
                    });
                console.log(this.info.name, this.info.data)
                console.log(this.info);
            },
            // 显示站点函数
            showStation() {
                this.show = !this.show
                console.log(this.show)
                if (this.show) {
                    axios.post("/stationdata", { aiming: "right" })
                        .then(response => (stationinfo = response.data))
                        .catch(function (error) { // 请求失败处理
                            console.log(error);
                        });
                    console.log(stationinfo)
                    // stationinfo每次点击都会更新，每次关闭站点显示都会空置
                }
                
            }

        },
        mounted() {
            axios.post("/stationdata", { aiming: "right" })
                .then(response => (stationinfo = response.data))
                .catch(function (error) { // 请求失败处理
                    console.log(error);
                });
            console.log(stationinfo)
            
            axios.post("/try", {
                ID: '狗汉奸',
                aiming: '王九科',
                age: 21
            })
                .then(response => (this.info = response.data))
                .catch(function (error) { // 请求失败处理
                    console.log(error);
                });
            console.log(this.info.name, this.info.data)
            console.log(this.info);
        }
    })

    // let usrlogin = new Vue({
    //     el:"#usr-login-name",
    //     data:{
    //         defaultName:"用户未登录"
    //     },
    //     methods:{

    //     }
    // })

}