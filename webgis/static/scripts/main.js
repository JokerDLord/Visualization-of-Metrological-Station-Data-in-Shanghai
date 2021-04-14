let baseLayer;
let Gaodest;
let infodemo;
let stationinfo;

let mylatitude;
let mylongitude;
let myaccuracy;

let singlestationData;//点击单个站点后会将查询的数据
let boxcard;

var markers = new Array();
var divmarkers = new Array();
var aqiChartstorage;



let metstationicon = L.icon({
    iconUrl: '../static/Markers/气象站-蓝.png',
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    // popupAnchor:[]
})

let youicon = L.icon({
    iconUrl: '../static/Markers/气象站-优.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    // popupAnchor:[]
})

let liangicon = L.icon({
    iconUrl: '../static/Markers/气象站-良.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    // popupAnchor:[]
})

let qingduicon = L.icon({
    iconUrl: '../static/Markers/气象站-轻度污染.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    // popupAnchor:[]
})

let zhongduicon = L.icon({
    iconUrl: '../static/Markers/气象站-中度污染.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    // popupAnchor:[]
})

let zhongzhongduicon = L.icon({
    iconUrl: '../static/Markers/气象站-重度污染.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    // popupAnchor:[]
})

let yanzhongicon = L.icon({
    iconUrl: '../static/Markers/气象站-严重污染.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    // popupAnchor:[]
})


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("浏览器不支持地理定位。");
    }
}
function showPosition(position) {
    mylatitude = position.coords.latitude;
    mylongitude = position.coords.longitude;
    myaccuracy = position.coords.accuracy;
}
function clearDom(dom) {
    while (dom.firstChild) {
        dom.firstChild.remove();
    }
}



function getXdataormore(singlestationData) {
    let timelst = Array()
    let aqilst = Array()
    contents = singlestationData.contents
    for (let i in contents) {
        if (i != '__proto__') {
            timelst.push(i+':00')
            aqilst.push(contents[i].AQI)
        }
    }
    timelst.reverse()
    aqilst.reverse()
    console.log(timelst)
    console.log(aqilst)

    return [timelst, aqilst]


}

// 显示单个站点的echart图表 有一下几种形式
function showsingleEchart(singlestationData) {
    if (!boxcard.showcard) boxcard.showcard = !boxcard.showcard // 如果未显示，便显示出来，如果已经显示出来了，便不更改该卡片显示状态即可
    let stationname = singlestationData.stationname
    let [xdata, aqidata] = getXdataormore(singlestationData)


    let chartDom = document.getElementById('text-item1');
    // clearDom(chartDom)//每次绘图都先清空dom上所有的元素 //我们换另一种方法 用echart的方法销毁原图表
    let aqiChart = aqiChartstorage;
    if (aqiChart != null && aqiChart != "" && aqiChart != undefined) {
        aqiChart.dispose();//销毁
    }
    aqiChart = echarts.init(chartDom);
    let option;
    aqiChart.setOption(
        option = {
            title: {
                text: '8小时内' + stationname + 'AQI数据',
                left: '1%'
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '5%',
                right: '15%',
                bottom: '10%'
            },
            xAxis: {
                // type: 'category',
                data: xdata
            },
            yAxis: {

            },
            toolbox: {
                right: 10,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
            // dataZoom: [{
            //     startValue: xdata[0]
            // }, {
            //     type: 'inside'
            // }],
            visualMap: {
                top: 50,
                right: 10,
                pieces: [{
                    gt: 0,
                    lte: 50,
                    color: '#93CE07'
                }, {
                    gt: 50,
                    lte: 100,
                    color: '#FBDB0F'
                }, {
                    gt: 100,
                    lte: 150,
                    color: '#FC7D02'
                }, {
                    gt: 150,
                    lte: 200,
                    color: '#FD0100'
                }, {
                    gt: 200,
                    lte: 300,
                    color: '#AA069F'
                }, {
                    gt: 300,
                    color: '#AC3B2A'
                }],
                outOfRange: {
                    color: '#999'
                }
            },
            series: {
                name: stationname + ' AQI',
                type: 'line',
                data: aqidata,//????
                markLine: {
                    silent: true,
                    lineStyle: {
                        color: '#333'
                    },
                    data: [{
                        yAxis: 50
                    }, {
                        yAxis: 100
                    }, {
                        yAxis: 150
                    }, {
                        yAxis: 200
                    }, {
                        yAxis: 300
                    }]
                }
            }
        }
    )
    if (option && typeof option === 'object') {
        aqiChart.setOption(option);
    }
    aqiChartstorage = aqiChart;
}


function querysingleHistory(name) {
    axios.post("/queryStation", {
        ID: name
    })
        .then(response => (singlestationData = response.data))
        .catch(function (error) { // 请求失败处理
            console.log(error);
        });

    if (singlestationData) {
        console.log(singlestationData)
        showsingleEchart(singlestationData)
    }
}


// 将后端传来的数据做成marker显示
function showStation(stationinfo) {
    let contents = stationinfo.contents
    stationname = Object.keys(contents) // 站点名列表
    let count = 0;
    for (let i in contents) {
        if (i != '__proto__') {
            singlestation = contents[i]
            let [lon, lat] = singlestation.lonlat
            let aqi = singlestation.AQI
            let name = singlestation.name
            let tmpicon;
            if (aqi <= 50) {
                tmpicon = youicon;
            } else if (aqi > 50 && aqi <= 100) {
                tmpicon = liangicon
            } else if (aqi > 100 && aqi <= 150) {
                tmpicon = qingduicon
            } else if (aqi > 150 && aqi <= 200) {
                tmpicon = zhongduicon
            } else if (aqi > 200 && aqi <= 300) {
                tmpicon = zhongzhongduicon
            } else if (aqi > 300) {
                tmpicon = yanzhongicon
            }

            let marker = L.marker([lat, lon], { icon: tmpicon })
            marker.addTo(mymap)
            marker.name = singlestation.name//
            markers[count] = marker

            let mydivIcon = L.divIcon({
                html: aqi,
                className: 'station-annotation-div-icon',
                iconSize: 70,
                iconAnchor: [10, 35]
            })

            let divmarker = L.marker([lat, lon], { icon: mydivIcon }).addTo(mymap)
            let divline = "<hr align=center color=#987cb9 size=1>"
            let clickicon = "<img src='../static/Markers/clickcli.png' style='width:30px;height:30px;padding:0px;margin:0px;vertical-align:middle;'><img>"
            let toolTipcontent = "<h2 align='center'>" + singlestation.name + "</h2>" + divline + "<p class='update-tip'>updated one hour ago at " + singlestation.time + ":00</p>" + divline +
                "<p font-size='15'>数值单位：μg/m3(CO为mg/m3)</p><p>PM2.5 : " + singlestation.PM25 + "<br>PM10 : " + singlestation.PM10 + "<br>O₃ : " + singlestation.O3 + "<br>NO₂ : " + singlestation.NO2 + "<br>SO₂ : "
                + singlestation.NO2 + "<br>CO : " + singlestation.CO + "</p>" + divline + "<p align='center'>" + clickicon + "点击获取更多信息" + clickicon + "</p>" + divline + "<p align='center'>source:上海市环境监测中心</p>"

            divmarker.bindTooltip(toolTipcontent, {
                maxWidth: 300,
                minWidth: 50,
                sticky: true,
                // offset:[10,10],
                opacity: 0.8,
                className: "marker-tootip"
            })
            //绑定marker点击事件
            divmarker.on('click', function (e) {
                let latlon = this.getLatLng()
                // console.log(latlon)
                mymap.flyTo(latlon, zoom = 14, options = { duration: 0.8 })
                //
                querysingleHistory(name)

            })
            divmarker.name = name//
            divmarkers[count] = divmarker

            count++
        }


    }
}



function onLoad() {
    // getLocation()// 获取使用者的位置

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


    // L.marker([31.23138, 121.469897], { icon: metstationicon }).addTo(mymap)
    // let mydivIcon = L.divIcon({
    //     html:"45",
    //     className:'station-annotation-div-icon',
    //     iconSize: 70,
    //     iconAnchor: [10, 35]
    // })
    // L.marker([31.23138, 121.469897],{icon: mydivIcon}).addTo(mymap)

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
            info: "hondosimida",
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
                        .then(function (response) {
                            stationinfo = response.data
                            showStation(stationinfo)
                        })//response => (stationinfo = response.data)
                        .catch(function (error) { // 请求失败处理
                            console.log(error);
                        });
                    console.log(stationinfo)


                    // stationinfo每次点击都会更新，每次关闭站点显示都会空置
                } else if (!this.show) {
                    for (let i = 0; i < markers.length; i++) {
                        markers[i].remove()
                        divmarkers[i].remove()
                    }
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
    let aqilabel = new Vue({
        el: "#class-lable",
        data: {
            ifshow: true,
            content: "优秀",
            visible: false
        },
        methods: {

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

    boxcard = new Vue({
        el: "#singlestation-box-card",
        data: {
            info: "站点信息",
            showcard: false
        },
        methods: {
            closeCard() {
                this.showcard = !this.showcard
            }
        },
        mounted() {
            axios.post("/queryStation", {
                ID: 'name'
            })
                .then(response => (singlestationData = response.data))
                .catch(function (error) { // 请求失败处理
                    console.log(error);
                });
        }
    })

}