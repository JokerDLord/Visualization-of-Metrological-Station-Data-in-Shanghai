let baseLayer;
let Gaodest;
let infodemo;
let stationinfo;

let mylatitude;
let mylongitude;
let myaccuracy;

let singlestationData;//点击单个站点后会将查询的数据
let boxcard;
let statisticCarousel;//统计图表走马灯

var markers = new Array();
var divmarkers = new Array();
var eventsmarkers = new Array()
eventsmarkers[0] = "我是个什么东西？"

var aqiChartstorage;
var aqiChartstorage2;



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

let locatingicon = L.icon({
    iconUrl: '../static/Markers/站点.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    // popupAnchor:[]
})

let eventsicon = L.icon({
    iconUrl: '../static/Markers/事件站点.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    // popupAnchor:[]
})



/////////////基于高德api的定位功能
var map = new AMap.Map('container', {
    resizeEnable: true
});
AMap.plugin('AMap.Geolocation', function () {
    var geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：5s
        buttonPosition: 'RB',    //定位按钮的停靠位置
        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点

    });
    map.addControl(geolocation);
    geolocation.getCurrentPosition(function (status, result) {
        if (status == 'complete') {
            onComplete(result)
        } else {
            onError(result)
        }
    });
});
//解析定位结果
function onComplete(data) {
    console.log(data)
    mylatitude = data.position.lat
    mylongitude = data.position.lng
    console.log(mylongitude, mylatitude)
}
//解析定位错误信息
function onError(data) {
    console.log(data);
}
////////////

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
// 将背景更改为模糊样式
function changeClassBackground(px) {
    $("#basemap").css({
        filter: "blur(" + px + "px)"
    })
}

function returnNormalBackgroud() {
    $("#basemap").css({
        filter: ""
    })
}
///////

function getCurrentDTime() {
    let myDate = new Date();
    let myYear = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
    let myMonth = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    let myToday = myDate.getDate(); //获取当前日(1-31)
    let myDay = myDate.getDay(); //获取当前星期X(0-6,0代表星期天)
    let myHour = myDate.getHours(); //获取当前小时数(0-23)
    let myMinute = myDate.getMinutes(); //获取当前分钟数(0-59)
    let mySecond = myDate.getSeconds(); //获取当前秒数(0-59)

    let nowTime = myYear + '-' + fillZero(myMonth) + '-' + fillZero(myToday) + ' ' + fillZero(myHour) + ':' + fillZero(myMinute);
    //  + ':' + fillZero(mySecond) + '  ' + week[myDay] + '  ';
    return nowTime
}
function fillZero(str) {
    var realNum;
    if (str < 10) {
        realNum = '0' + str;
    } else {
        realNum = str;
    }
    return realNum;
}

//将marker获取的经纬度放入elinput中
function insertLocation(eventform, position) {
    eventform.ruleForm.longitude = position.lng;
    eventform.ruleForm.latitude = position.lat;
    $("#ruleFormLon").val(position.lng);
    $("#ruleFormLat").val(position.lat);

}

//逆地理编码 根据经纬度获取地名
function getPositionByLonLats(lng, lat) {
    // console.log("经度："+lng+"纬度"+lat);
    let lnglatXY = [lng, lat];// 地图上所标点的坐标
    AMap.service('AMap.Geocoder', function () {// 回调函数
        geocoder = new AMap.Geocoder({});
        geocoder.getAddress(lnglatXY, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
                // console.log(result.regeocode.formattedAddress);
                let address = result.regeocode.formattedAddress;
                console.log(result)
                console.log(address);
                return address
            } else {
                console.log(status, result)
                return ""
            }
        });
    });
}
getPositionByLonLats(31.03195, 121.15318)

// // 图标icon切换函数
// function changeicon(marker, flg) {
//     if (flg) {
//         marker.setIcon(locatingicon)
//     } else if (!flg) {
//         marker.setIcon(eventsicon)
//     }
// }

// 高亮函数
function syncHighlight(di, flg) {
    if (flg) {
        $(di.innerName).css('background', 'burlywood')
        eventsmarkers[di.innerID].setIcon(locatingicon)

    }
    else {
        $(di.innerName).css('background', 'white')
        eventsmarkers[di.innerID].setIcon(eventsicon)

    }
}



function getXdataormore(singlestationData) {
    let timelst = Array()
    let aqilst = Array()
    let colst = Array()
    let no2lst = Array()
    let o3lst = Array()
    let pm10lst = Array()
    let pm25lst = Array()
    let so2lst = Array()
    contents = singlestationData.contents
    for (let i in contents) {
        if (i != '__proto__') {
            timelst.push(i + ':00')
            aqilst.push(contents[i].AQI)
            colst.push(contents[i].CO)
            no2lst.push(contents[i].NO2)
            o3lst.push(contents[i].O3)
            pm10lst.push(contents[i].PM10)
            pm25lst.push(contents[i].PM25)
            so2lst.push(contents[i].SO2)
        }
    }
    timelst.reverse()
    aqilst.reverse()
    colst.reverse()
    no2lst.reverse()
    o3lst.reverse()
    pm10lst.reverse()
    pm25lst.reverse()
    so2lst.reverse()
    console.log(timelst)
    console.log(aqilst)

    return [timelst, aqilst, colst, no2lst, o3lst, pm10lst, pm25lst, so2lst]


}

// 显示单个站点的echart图表 有一下几种形式
function showsingleEchart(singlestationData) {
    if (!boxcard.showcard)
        boxcard.showcard = !boxcard.showcard // 如果未显示，便显示出来，如果已经显示出来了，便不更改该卡片显示状态即可
    let stationname = singlestationData.stationname
    let [xdata, aqidata, codata, no2data, o3data, pm10data, pm25data, so2data] = getXdataormore(singlestationData)


    let chartDom = document.getElementById('text-item1');
    let chartDom2 = document.getElementById('text-item2');
    // clearDom(chartDom)//每次绘图都先清空dom上所有的元素 //我们换另一种方法 用echart的方法销毁原图表
    let aqiChart = aqiChartstorage;
    let aqiChart2 = aqiChartstorage;

    if (aqiChart != null && aqiChart != "" && aqiChart != undefined) {
        aqiChart.dispose();//销毁
    }
    if (aqiChart2 != null && aqiChart2 != "" && aqiChart2 != undefined) {
        aqiChart2.dispose();//销毁
    }

    aqiChart = echarts.init(chartDom);
    aqiChart2 = echarts.init(chartDom2);

    let option;
    aqiChart.setOption(
        option = {
            title: {
                text: '8小时内' + stationname + 'AQI及其他指标数据',
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
                right: 0,
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
    option && aqiChart.setOption(option);
    aqiChartstorage = aqiChart;

    //chart2的设置
    let app = {};
    let option2;
    let posList = [
        'left', 'right', 'top', 'bottom',
        'inside',
        'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
        'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
    ];

    app.configParameters = {
        rotate: {
            min: -90,
            max: 90
        },
        align: {
            options: {
                left: 'left',
                center: 'center',
                right: 'right'
            }
        },
        verticalAlign: {
            options: {
                top: 'top',
                middle: 'middle',
                bottom: 'bottom'
            }
        },
        position: {
            options: posList.reduce(function (map, pos) {
                map[pos] = pos;
                return map;
            }, {})
        },
        distance: {
            min: 0,
            max: 100
        }
    };

    app.config = {
        rotate: 90,
        align: 'left',
        verticalAlign: 'middle',
        position: 'insideBottom',
        distance: 12,
        onChange: function () {
            var labelOption = {
                normal: {
                    rotate: app.config.rotate,
                    align: app.config.align,
                    verticalAlign: app.config.verticalAlign,
                    position: app.config.position,
                    distance: app.config.distance
                }
            };
            myChart.setOption({
                series: [{
                    label: labelOption
                }, {
                    label: labelOption
                }, {
                    label: labelOption
                }, {
                    label: labelOption
                }]
            });
        }
    };


    var labelOption = {
        show: true,
        position: app.config.position,
        distance: app.config.distance,
        align: app.config.align,
        verticalAlign: app.config.verticalAlign,
        rotate: app.config.rotate,
        formatter: '{c}  ',//{name|{a}}
        fontSize: 12,
        rich: {
            name: {
            }
        }
    };

    option2 = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['CO', 'NO2', '03', 'PM10', 'PM25', 'SO2']
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '8%'
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        xAxis: [
            {
                type: 'category',
                axisTick: { show: false },
                data: xdata
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: 'CO',
                type: 'bar',
                barGap: 0,
                label: labelOption,
                emphasis: {
                    focus: 'series'
                },
                data: codata
            },
            {
                name: 'NO2',
                type: 'bar',
                label: labelOption,
                emphasis: {
                    focus: 'series'
                },
                data: no2data
            },
            {
                name: '03',
                type: 'bar',
                label: labelOption,
                emphasis: {
                    focus: 'series'
                },
                data: o3data
            },
            {
                name: 'PM10',
                type: 'bar',
                label: labelOption,
                emphasis: {
                    focus: 'series'
                },
                data: pm10data
            },
            {
                name: 'PM25',
                type: 'bar',
                label: labelOption,
                emphasis: {
                    focus: 'series'
                },
                data: pm25data
            },
            {
                name: 'SO2',
                type: 'bar',
                label: labelOption,
                emphasis: {
                    focus: 'series'
                },
                data: so2data
            }
        ]
    };

    option2 && aqiChart2.setOption(option2);
    aqiChartstorage2 = aqiChart2;


}

//显示统计数据-雷达图
function showstatisticEchart(allstationsData) {
    // time,AQIindex,PM2.5,PM10,CO,NO2,SO2 以此种形式组织数据
    let divcount = 1 //div选择 注意是从1开始的
    for (let stationindex in allstationsData) {
        let singlestationData = new Array()
        if (stationindex != '__proto__') {
            let station = allstationsData[stationindex]
            for (let dtime in station) {
                let singletimeData = new Array()//单个时间的数据
                if (dtime != '__proto__') {
                    let dtimedata = station[dtime]
                    singletimeData.push(dtimedata.AQI)
                    singletimeData.push(dtimedata.PM25)
                    singletimeData.push(dtimedata.PM10)
                    singletimeData.push(dtimedata.CO)
                    singletimeData.push(dtimedata.NO2)
                    singletimeData.push(dtimedata.SO2)
                    singletimeData.push(dtimedata.time)
                    singlestationData.push(singletimeData)//每个时间的数据数组都放入最终的站点数据数组中作为rader的数据
                }

                ////
            }
            let statisticchartDom = document.getElementById('radardiv' + divcount);
            let mystatisChart = echarts.init(statisticchartDom);
            let option;

            let shanghaistation = singlestationData

            let lineStyle = {
                normal: {
                    width: 1,
                    opacity: 0.5
                }
            };

            option = {
                backgroundColor: 'rgb(84, 92, 100)',
                title: {
                    text: stationindex + '24小时站点AQI - 雷达图',
                    left: 'center',
                    top: '3%',
                    textStyle: {
                        color: '#eee'
                    }
                },
                // legend: {
                //     bottom: 5,
                //     data: ['北京', '上海', '广州'],
                //     itemGap: 20,
                //     textStyle: {
                //         color: '#fff',
                //         fontSize: 14
                //     },
                //     selectedMode: 'single'
                // },
                // visualMap: {
                //     show: true,
                //     left:"10%",
                //     min: 0,
                //     max: 20,
                //     dimension: 6,
                //     inRange: {
                //         colorLightness: [0.5, 0.8]
                //     }
                // },
                radar: {
                    indicator: [
                        { name: 'AQI', max: 300 },
                        { name: 'PM2.5', max: 250 },
                        { name: 'PM10', max: 300 },
                        { name: 'CO', max: 5 },
                        { name: 'NO2', max: 200 },
                        { name: 'SO2', max: 100 }
                    ],
                    shape: 'circle',
                    splitNumber: 5,
                    name: {
                        textStyle: {
                            color: 'rgb(238, 197, 102)'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: [
                                'rgba(238, 197, 102, 0.5)', 'rgba(238, 197, 102, 0.6)',
                                'rgba(238, 197, 102, 0.7)', 'rgba(238, 197, 102, 0.8)',
                                'rgba(238, 197, 102, 0.9)', 'rgba(238, 197, 102, 1)'
                            ].reverse()
                        }
                    },
                    splitArea: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(238, 197, 102, 0.5)'
                        }
                    }
                },
                series: [
                    {
                        name: stationindex,
                        type: 'radar',
                        lineStyle: lineStyle,
                        data: shanghaistation,
                        symbol: 'none',
                        itemStyle: {
                            color: '#F9713C' // #F9713C
                        },
                        areaStyle: {
                            opacity: 0.05
                        }
                    },
                    // {
                    //     name: '上海',
                    //     type: 'radar',
                    //     lineStyle: lineStyle,
                    //     data: dataSH,
                    //     symbol: 'none',
                    //     itemStyle: {
                    //         color: '#B3E4A1'
                    //     },
                    //     areaStyle: {
                    //         opacity: 0.05
                    //     }
                    // },
                    // {
                    //     name: '广州',
                    //     type: 'radar',
                    //     lineStyle: lineStyle,
                    //     data: dataGZ,
                    //     symbol: 'none',
                    //     itemStyle: {
                    //         color: 'rgb(238, 197, 102)'
                    //     },
                    //     areaStyle: {
                    //         opacity: 0.05
                    //     }
                    // }
                ]
            };

            option && mystatisChart.setOption(option);
            window.onresize = function () {
                mystatisChart.resize();
                //myChart1.resize();    //若有多个图表变动，可多写

            }

            divcount++
        }

    }

}




function querysingleHistory(name) {
    // axios.post("/queryStation", {
    //     ID: name
    // })
    //     .then(response => (singlestationData = response.data))
    //     .catch(function (error) { // 请求失败处理
    //         console.log(error);
    //     }); //此处换用jquery进行数据交互 
    let para = { "ID": name }
    $.ajax({
        url: "/queryStation",
        methods: "get",
        data: para,
        // contentType: 'application/json',
        success: function (response) {
            let resdata = JSON.parse(response)
            if (resdata.success) {
                singlestationData = resdata;
                console.log(singlestationData)
                showsingleEchart(singlestationData)
            }
            else {
                console.log(resdata.error);
                return;
            }
        }
    })

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

    // const usrname = new Vue({
    //     el: "#imloser",
    //     data: {
    //         usrname: "用户未登录"
    //     }
    // })
    const usricon = new Vue({

        el: "#usricon-avator-h",
        data: {
            isLogin: false,
            notLogin: !this.isLogin,
            picpath: "./static/img/smile.jpg"
        }
    })

    // 这是页面的主干控件 左边的导航条上的所有元素和属性、方法都由它渲染
    let navMenu = new Vue({
        el: "#navMenu",
        date: {
            info: "hondosimida",
            usrname: "用户未登录",
            defauName: "用户未登录",
            isLogin: false,
            show: false,
            usrpicture: "./static/img/smile.jpg",
            addPointWindow: false
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

            },
            showStatis() {
                statisticCarousel.isShow = !statisticCarousel.isShow

                //如果此时isShow，则执行数据获取功能
                if (statisticCarousel.isShow) {
                    $.ajax({
                        url: "/queryallStations",
                        methods: "get",
                        data: { hours: 24 },
                        // contentType: 'application/json',
                        success: function (response) {
                            let resdata = JSON.parse(response)
                            if (resdata.success) {
                                allstationsData = resdata.contents;
                                console.log(allstationsData)
                                showstatisticEchart(allstationsData)
                            }
                            else {
                                console.log(resdata.error);
                                return;
                            }
                        }
                    })
                    // $("#basemap").css({
                    //     filter: "blur(5px)"
                    // })
                    changeClassBackground(5)

                } else {
                    // $("#basemap").css({
                    //     filter: ""
                    // })
                    returnNormalBackgroud()
                }
            },
            openLogin() {
                login1.centerDialogVisible = true
            },
            addPoint() {
                if (this.isLogin) {
                    if (!this.addPointWindow) {
                        $("#event-card").css("display", 'inline-block');
                        this.addPointWindow = !this.addPointWindow
                        let marker = L.marker([mylatitude, mylongitude], { icon: locatingicon, draggable: true })
                        marker.addTo(mymap)
                        marker.name = "自定义事件点"//

                        let position = marker.getLatLng();
                        insertLocation(eventform, position)

                        marker.on('drag', function (event) {
                            let position = marker.getLatLng();
                            // console.log('实时坐标：' + marker.getLatLng(), position.lat, position.lng);
                            // eventform.ruleForm.longitude = position.lng;
                            // eventform.ruleForm.latitude = position.lat;
                            // $("#ruleFormLon").val(position.lng);
                            // $("#ruleFormLat").val(position.lat);
                            insertLocation(eventform, position)

                        })
                        this.positionmarker = marker

                    } else if (this.addPointWindow) {
                        $("#event-card").css("display", 'none');
                        this.addPointWindow = !this.addPointWindow
                        this.positionmarker.remove();
                    }
                }
            },
            showEvent() {
                if (this.isLogin) {
                    //打开drawer前请先获取
                    if (eventDrawer.drawer) {
                        for (let i = 0; i < eventsmarkers.length; i++) {
                            eventsmarkers[i].remove()
                        }
                        eventDrawer.drawer = !eventDrawer.drawer //这里我们直接将drawer打开 以免dom未来得及渲染
                    }
                    else {
                        eventDrawer.drawer = !eventDrawer.drawer
                        $.ajax({
                            url: "/getEvents",
                            methods: "get",
                            data: { usrname: this.usrname },
                            // contentType: 'application/json',
                            success: function (response) {
                                let resdata = JSON.parse(response)
                                if (resdata.success) {
                                    this.eventsdata = resdata.contents
                                    this.eventCounts = resdata.counts
                                    console.log(this.eventsdata)


                                    for (let i = 0; i < this.eventCounts; i++) {
                                        let index = i + 1
                                        let headerid = "#drawerc-headerspan" + (index)
                                        let pcontentid = "#drawerc-p" + (index)

                                        let eventtime = this.eventsdata[index].eventtime
                                        let [eventlon, eventlat] = this.eventsdata[index].eventlonlat.split(",")
                                        let eventdetails = this.eventsdata[index].eventdetails
                                        let eventSite = getPositionByLonLats(eventlat, eventlon)
                                        // console.log(eventtime)
                                        $(headerid).text("事件添加时间" + eventtime)
                                        $(pcontentid).html("事件发生地址： " + eventSite + "<br>事件点经度: " + eventlon + "  事件点纬度: " + eventlat + "<br>事件详情：<br> " + eventdetails)

                                        let speDomDiv = $("#drawer-card" + index)
                                        speDomDiv.innerID = index
                                        speDomDiv.innerName = "#drawer-card" + index
                                        speDomDiv.mouseover(function () {
                                            syncHighlight(this, true);
                                        });
                                        speDomDiv.mouseout(function () {
                                            syncHighlight(this, false);
                                        });
                                        speDomDiv.click(function () {
                                            mymap.flyTo(eventsmarkers[this.innerID].getLatLng(), zoom = 12, options = { duration: 0.8 });
                                        });

                                        let emarker = L.marker([eventlat, eventlon], { icon: eventsicon, draggable: false })
                                        emarker.innerID = index
                                        emarker.addTo(mymap)

                                        emarker.on({
                                            'mouseover': function (e) {
                                                // changeicon(this, true)
                                                syncHighlight(speDomDiv, true)
                                            },
                                            'mouseout': function (e) {
                                                // changeicon(this, false)
                                                syncHighlight(speDomDiv, false)
                                            },
                                            'click': function (e) {
                                                mymap.flyTo(this.getLatLng(), zoom = 12, options = { duration: 0.8 })
                                            }
                                        })


                                        eventsmarkers[index] = emarker
                                        // emarker.name = "自定义事件点"//
                                    }


                                }
                                else {
                                    console.log(resdata.contents);
                                    return;
                                }

                            }
                        })
                        // eventDrawer.drawer = !eventDrawer.drawer
                        // console.log(eventDrawer.drawer)
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
            // console.log(stationinfo)

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

    let eventDrawer = new Vue({
        el: "#eventDrawer",
        data: {
            drawer: false,
            eventCounts: 18,
            title: "事件添加时间",
            lon: "114",
            lat: "514",
            details: "like the ceiling cant hold us"

        },
        methods: {
            a: function () {
                return lon + lat
            }
        }
    })



    let registerform = new Vue({
        el: "#register-form",
        data() {
            let checkName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('昵称不能为空'));
                }
                setTimeout(() => {
                    // if (!Number.isInteger(value)) {
                    //     callback(new Error('请输入数字值'));
                    // } else {
                    //     if (value < 18) {
                    //         callback(new Error('必须年满18岁'));
                    //     } else {
                    //         callback();
                    //     }
                    // }
                    callback();
                }, 1000);
            };
            let validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            let validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                ruleForm: {
                    pass: '',
                    checkPass: '',
                    name: ''
                },
                rules: {
                    pass: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                    name: [
                        { validator: checkName, trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //如果有效，先建立后端链接，根据是否成功注册账户进行判断
                        const _this = this //哈哈哈哈想不到吧 在这里用_this方便子作用域使用消息框
                        $.ajax({
                            url: "/registerAccount",
                            methods: "get",
                            data: this.ruleForm,
                            success: function (response) {
                                this.registerResult = JSON.parse(response)
                                $("#register-form").css("display", 'none');
                                returnNormalBackgroud()
                                if (this.registerResult.success) {
                                    // alert('submit!');
                                    _this.$message({
                                        showClose: true,
                                        message: '注册成功啦！',
                                        type: "success"
                                    });
                                } else {
                                    _this.$message.error(this.registerResult.contents);
                                }
                            }
                        })

                        // this.$message({
                        //     showClose: true,
                        //     message: this.registerResult.contents
                        // });
                        // console.log(this.ruleForm.name, this.ruleForm.pass)
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            cancel() {
                $("#register-form").css("display", 'none');
                returnNormalBackgroud()
            }

        }
    })

    let loginform = new Vue({
        el: "#login-form",
        data() {
            let checkName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('昵称不能为空'));
                }
                setTimeout(() => {
                    // if (!Number.isInteger(value)) {
                    //     callback(new Error('请输入数字值'));
                    // } else {
                    //     if (value < 18) {
                    //         callback(new Error('必须年满18岁'));
                    //     } else {
                    //         callback();
                    //     }
                    // }
                    callback();
                }, 1000);
            };
            let validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            // let validatePass2 = (rule, value, callback) => {
            //     if (value === '') {
            //         callback(new Error('请再次输入密码'));
            //     } else if (value !== this.ruleForm.pass) {
            //         callback(new Error('两次输入密码不一致!'));
            //     } else {
            //         callback();
            //     }
            // };//  
            return {
                ruleForm: {
                    pass: '',
                    // checkPass: '',
                    name: ''
                },
                rules: {
                    pass: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    // checkPass: [
                    //     { validator: validatePass2, trigger: 'blur' }
                    // ],
                    name: [
                        { validator: checkName, trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //如果有效，先建立后端链接，根据是否成功注册账户进行判断
                        const _this = this //哈哈哈哈想不到吧 在这里用_this方便子作用域使用消息框
                        $.ajax({
                            url: "/loginAccount",
                            methods: "get",
                            data: this.ruleForm,
                            success: function (response) {
                                this.loginResult = JSON.parse(response)
                                $("#login-form").css("display", 'none');
                                returnNormalBackgroud()
                                if (this.loginResult.success) {
                                    // alert('submit!');
                                    //登录成功后 这里处理的事务比较多 例如更改头像 更改登录名字
                                    _this.$message({
                                        showClose: true,
                                        message: '登录成功！',
                                        type: "success"
                                    });
                                    navMenu.isLogin = !navMenu.isLogin
                                    usricon.isLogin = !usricon.isLogin
                                    $("#imloser").text(_this.ruleForm.name);
                                    navMenu.usrname = _this.ruleForm.name;
                                } else {
                                    _this.$message.error(this.loginResult.contents);
                                }
                            }
                        })

                        // this.$message({
                        //     showClose: true,
                        //     message: this.registerResult.contents
                        // });
                        // console.log(this.ruleForm.name, this.ruleForm.pass)
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            cancel() {
                $("#login-form").css("display", 'none');
                returnNormalBackgroud()
            }

        }
    })

    const login1 = new Vue({
        el: "#login-1",
        data: {
            info: "请用户选择登录或是注册",
            centerDialogVisible: false,
            registerFormVisible: false // 注意这是控制注册窗口的判定变量
        },
        methods: {
            register() {
                // this.registerFormVisible = !this.registerFormVisible//???不起作用
                $("#register-form").css("display", 'inline-block');
                changeClassBackground(5)
                this.centerDialogVisible = false
            },
            loggin() {
                $("#login-form").css("display", 'inline-block');
                changeClassBackground(5)
                this.centerDialogVisible = false
                // $("#imloser").text("汉奸王九科必死");
            }
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

    // let eventcard = new Vue({
    //     el: "#event-card",
    //     data: {
    //         isShow: true
    //     },
    //     methods: {

    //     }

    // })

    let eventform = new Vue({
        el: "#event-form",
        data() {
            let checklon = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('经度不能为空'));
                }
                // callback();
                setTimeout(() => {
                    // if (!Number.isInteger(value)) {
                    //     callback(new Error('请输入数字值'));
                    // } else {
                    //     if (value < 18) {
                    //         callback(new Error('必须年满18岁'));
                    //     } else {
                    //         callback();
                    //     }
                    // }
                    callback();
                }, 500);
            };
            let checklat = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('纬度不能为空'));
                } else {
                    callback();
                }
            };
            var checkevent = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入事件详情'));
                } else {
                    callback();
                }
            };
            return {
                ruleForm: {
                    longitude: '',
                    latitude: '',
                    eventRecor: '',
                    addtime: '',
                    usrname: ''
                },
                rules: {
                    longitude: [
                        { validator: checklon, trigger: 'blur' }
                    ],
                    latitude: [
                        { validator: checklat, trigger: 'blur' }
                    ],
                    eventRecor: [
                        { validator: checkevent, trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // alert('submit!');
                        this.ruleForm.addtime = getCurrentDTime()
                        this.ruleForm.usrname = loginform.ruleForm.name //登陆的用户名是啥？ 访问loginform登录框元素中的name找到答案
                        const _this = this
                        $.ajax({
                            url: "/submitEvent",
                            methods: "get",
                            data: this.ruleForm,
                            success: function (response) {
                                this.eventResult = JSON.parse(response)
                                if (this.eventResult.success) {
                                    // alert('submit!');
                                    _this.$message({
                                        showClose: true,
                                        message: '上传成功！',
                                        type: "success"
                                    });
                                } else {
                                    _this.$message.error(this.eventResult.contents);
                                }
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            Dlocation(ruleForm) {
                navMenu.positionmarker.setLatLng([mylatitude, mylongitude]);
                insertLocation(this, navMenu.positionmarker.getLatLng())
            }
        }
    })

    //统计信息功能的走马灯
    statisticCarousel = new Vue({
        el: "#statistic-echarts-carousel",
        data: {
            isShow: false,
            fade: "这里放上啥？"
        },
        methods: {},
    })

    // 右上角的天气信息按钮
    const weatherButton = new Vue({
        el: "#weather-button",
        data: {
            flg: false,
            weartherinfo4: "nono",
            Chartstorage: ""
        },
        methods: {
            showweatherInfo() {
                if (!this.flg) {
                    this.flg = !this.flg;
                    //加载天气查询插件
                    AMap.plugin('AMap.Weather', function () {
                        //创建天气查询实例
                        let weather = new AMap.Weather();

                        // //执行实时天气信息查询
                        // weather.getLive('上海市', function (err, data) {
                        //     console.log(err, data);
                        // });
                        //执行未来天气信息查询

                        weather.getForecast('上海市', function (err, data) {
                            console.log(err, data);
                            this.weartherinfo4 = data.forecasts
                            this.datelst = new Array()
                            this.templst = new Array()
                            for (let i = 0; i < this.weartherinfo4.length; i++) {
                                this.datelst.push(this.weartherinfo4[i].date + "日间")
                                this.datelst.push(this.weartherinfo4[i].date + "夜间")
                                this.templst.push(this.weartherinfo4[i].dayTemp)
                                this.templst.push(this.weartherinfo4[i].nightTemp)
                            }

                            let contents = "<h1 align='center' style='font-size:12px'>上海市今日天气情况</h1>" +
                                "<p style='font-size:10px;line-height:22px '>日间气温(℃) : " + this.weartherinfo4[0].dayTemp + "<br>日间天气 : " + this.weartherinfo4[0].dayWeather +
                                "<br>日间风速|风力 : " + this.weartherinfo4[0].dayWindDir + " | " + this.weartherinfo4[0].dayWindPower +
                                "<br>夜间气温(℃) : " + this.weartherinfo4[0].nightTemp + "<br>夜间天气 : " + this.weartherinfo4[0].nightWeather +
                                "<br>夜间风速|风力 : " + this.weartherinfo4[0].nightWindDir + " | " + this.weartherinfo4[0].nightWindPower + "</p>"
                            document.getElementById('today-info').innerHTML = contents


                            let chartDom = document.getElementById('forecast-echart');
                            let myChart = echarts.init(chartDom, null, { renderer: 'svg' });
                            this.Chartstorage = myChart
                            let option;

                            option = {
                                title: {
                                    // subtext: '三天内日夜气温变化',
                                    text: '今日-三日后',
                                    textStyle: {
                                        "fontSize": 10
                                    }
                                },
                                grid: {
                                    left: '20%',
                                    right: '15%',
                                    bottom: '20%'
                                },
                                tooltip: {
                                    trigger: 'axis'
                                },
                                // legend: {
                                //     data: ['气温变化']
                                // },
                                toolbox: {
                                    show: true,
                                    feature: {
                                        dataZoom: {
                                            yAxisIndex: 'none'
                                        },
                                        dataView: { readOnly: false },
                                        magicType: { type: ['line', 'bar'] },
                                        restore: {},
                                        saveAsImage: {}
                                    }
                                },
                                xAxis: {
                                    // type: 'category',
                                    boundaryGap: false,
                                    data: this.datelst,
                                    axisLabel: {
                                        show: true,
                                        textStyle: {
                                            //    color: '#c3dbff',  //更改坐标轴文字颜色
                                            fontSize: 9      //更改坐标轴文字大小
                                        }
                                    },
                                },
                                yAxis: {
                                    type: 'value',
                                    axisLabel: {
                                        formatter: '{value} °C',
                                        textStyle: {
                                            //    color: '#c3dbff',  //更改坐标轴文字颜色
                                            fontSize: 9      //更改坐标轴文字大小
                                        }
                                    }

                                },
                                series: [
                                    {
                                        name: '气温变化',
                                        type: 'line',
                                        data: this.templst,
                                        markPoint: {
                                            data: [
                                                { type: 'max', name: '气温值' }
                                            ]
                                        },
                                        markLine: {
                                            data: [
                                                { type: 'average', name: '平均值' }
                                            ]
                                        }
                                    }

                                ]
                            };

                            option && myChart.setOption(option);

                        });
                        $(".weather-info").show(400)
                    });

                } else {
                    this.flg = !this.flg;
                    $(".weather-info").hide(400)
                }
            }
        }
    })


}