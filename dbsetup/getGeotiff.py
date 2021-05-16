from osgeo import gdal
import sqlite3 as sql
import numpy as np
# 更换求距离的函数
from math import radians, cos, sin, asin, sqrt

station = {'普陀': 'putuo', '上海第十五制药厂': 'drug15',
           '虹口': 'hongkou', '徐汇上师大': 'xvhuishida',
           '杨浦第四漂染厂': 'yangpupiaoran', '静安': 'jiangan', '浦东川沙': 'chuansha',
           '浦东新区监测站': 'putongcezhan',
           '浦东张江': 'pudongzhangjiang', '宝山庙行': 'baoshanmiaohang',
           '崇明上实东滩': 'dongtan', '嘉定南翔': 'nanxiang',
           '金山新城': 'jinshanxincheng', '闵行浦江': 'minhangpujiang',
           '青浦徐泾': 'xvjing', '松江图书馆': 'songjiangtushuguan',
           '长宁仙霞': 'xianxia', '浦东惠南': 'huinan',
           '奉贤南桥新城': 'nanqiaoxincheng'}
# key是db名，value是表名

station_db = {'十五厂': '上海第十五制药厂',
              '杨浦四漂': '杨浦第四漂染厂',
              '静安监测站': '静安'}

dbpath = "../dbsetup/dbs/"
stalonlat = {}
stationdatas={}
Paras = ["time", "name", "AQI", "quantity",
         "PM25", "PM10", "CO", "NO2", "O3", "SO2"]
inpath = "../tiff数据/demoxt2.tif"

tifGridlon,tifGridlat = "",""

def getLonlat():
    with sql.connect(dbpath+'stationloc.db') as conn:
        cur = conn.cursor()
        for staname in station.keys():
            cur.execute(
                'SELECT longitude,latitude from stationloc where name = "{}"'.format(staname))
            (lon, lat) = cur.fetchall()[0]
            stalonlat[staname] = [eval(lon), eval(lat)]
        # print(stalonlat)


def getAllstation(hour=1,target=2):
    # print(hour)
    # "content":{"staionname1":{time1:{各项指标}, time2:{}, ......},"stationname2":{}}的形式
    content_dic = {}
    for stationname in station.keys():
        with sql.connect(dbpath+stationname+'.db') as conn:
            cur = conn.cursor()
            cur.execute(
                'select * from {} order by rowid desc limit 0,{}'.format(station[stationname], hour))
            values = cur.fetchall()

            singlestationdata = []
            singleitem = values[0]
            #多态 根据target的不同进行指标的获取 2代表AQI 4为PM2.5 5为PM10 类推为 CO NO2 O3 SO2
            AQI = singleitem[target] 
            lon,lat = stalonlat[stationname]
            lon_simp = float(str(lon)[0:6])
            lat_simp = float(str(lat)[0:5])
            singlestationdata = [lon_simp,lat_simp]+[AQI]

        content_dic[stationname] = singlestationdata
    
    stationdatas = content_dic
    return content_dic


def haversine(lon1, lat1, lon2, lat2):
    R = 6372.8
    dLon = radians(lon2 - lon1)
    dLat = radians(lat2 - lat1)
    lat1 = radians(lat1)
    lat2 = radians(lat2)
    a = sin(dLat/2)**2 + cos(lat1)*cos(lat2)*sin(dLon/2)**2
    c = 2*asin(sqrt(a))
    d = R * c
    return d

def getGrid(dt):
    tifGridlon = np.zeros((130,140), dtype = np.float32)
    tifGridlat = np.zeros((130,140), dtype = np.float32)
    for col in range(np.size(tifGridlon,1)):
        #根据行数，对每一行的经度longitude进行赋值
        tifGridlon[:,col] = 120.8+0.01*col+0.005
    
    for row in range(np.size(tifGridlat,0)):
        #根据行数，对每一行的经度longitude进行赋值
        tifGridlat[row,:] = 31.9-0.01*row+0.005
    
    print(tifGridlon)
    print(tifGridlat)
    return tifGridlon,tifGridlat

def IDW(lon_es,lat_es,lon_ct,lat_ct,v_ct):
    lst_tif = []
    for idx_e,lon in enumerate(lon_es): 
        #遍历所有图中像素
        lst_dist = []
        for idx_c,lon_c in enumerate(lon_ct):
            d = haversine(lon_ct[idx_c], lat_ct[idx_c], lon_es[idx_e],  lat_es[idx_e])
            lst_dist.append(d)
        
        sup = list((1/np.power(lst_dist,2)))
        suminf = np.sum(sup) # 倒距离权重的除数
        sumsup = np.sum(np.array(sup)*np.array(v_ct))
        v_idw = sumsup/suminf
        lst_tif.append(v_idw)
    
    lst_tif = np.array(lst_tif)
    lst_tif = lst_tif.reshape(130,140)
    print(lst_tif)    
    return(lst_tif)


def clipTif(input_raster,output_raster,input_shape):
    ds = gdal.Warp(output_raster,
              input_raster,
              format = 'GTiff',
              cutlineDSName = input_shape,      
              
              dstNodata = 0)# cutlineWhere="FIELD = 'whatever'",
    
    ds=None
    return ds

def geneTiff(inpath,cube_tif,stationdatas):
    # 借助一个上海范围的tiff图去生成相应的实时tiff图
    # 该tiff图为140x130的矩阵，每个站点针对每一行每一列都先算出其权重，
    # 再根据各个站点的权重计算出实际的值
    # tiff图范围[120.8 , 31.9]作为左上角的起点 格网为0.01x0.01
    ds = gdal.Open(inpath)
    row = ds.RasterXSize
    col = ds.RasterYSize
    bandcount = ds.RasterCount
    print(bandcount, f"row={row},col={col}")
    geoTransform = ds.GetGeoTransform()
    proj = ds.GetGeoTransform()
    print(proj)
    # data=np.zeros([row,col,bandcount])
    dt = ds.GetRasterBand(1)
    # print(dt)
    data = dt.ReadAsArray(buf_xsize=row, buf_ysize=col)
    # print(data)
    
    tifGridlon,tifGridlat = getGrid(dt) #根据tiff图生成实际每个像素对应的格网的经纬度 实际格网经纬度是固定的
    
    # 计算IDW结果
    longitude_estimate = tifGridlon.flatten().tolist()
    latitude_estimate = tifGridlat.flatten().tolist()
    longitude_certain = []
    latitude_certian = []
    value_certain = []
    for (idx,stationname) in enumerate(stationdatas.keys()):
        val = stationdatas[stationname][2]
        if(val == ''):
            continue
        else:
            longitude_certain.append(stationdatas[stationname][0])
            latitude_certian.append(stationdatas[stationname][1])
            value_certain.append(stationdatas[stationname][2])
    
    gettif = IDW(longitude_estimate,latitude_estimate,
                 longitude_certain,latitude_certian,
                 value_certain)
    
    # 在此执行写入文件操作
    driver = gdal.GetDriverByName('Gtiff')
    tiffraster = cube_tif
    outRaster = driver.Create(tiffraster,
                              xsize=row, ysize=col, bands=1, eType=dt.DataType)
    outRaster.SetProjection(ds.GetProjection())
    outRaster.SetGeoTransform(proj)
    outband = outRaster.GetRasterBand(1)
    outband.WriteArray(gettif)
    outband.FlushCache()
    outband.ComputeBandStats(False)
    
    

    return tiffraster

# def excuteIDW():
#     getLonlat()
#     stationdatas = getAllstation()
#     print(stationdatas)
#     geneTiff(inpath)

def getTiffbyclass(inpath,cube_tif,output_raster,input_shape,target):

    getLonlat()
    stationdatas = getAllstation(target = target)
    print(stationdatas)
    tiffraster = geneTiff(inpath,cube_tif,stationdatas)
    input_raster =tiffraster
    # output_raster=r"../tiff数据/out_test_warp.tif"
    # input_shape = r"../tiff数据/上海市/上海市.shp"
    clipTif(input_raster,output_raster,input_shape)


if __name__ == "__main__":
    # getLonlat()
    # stationdatas = getAllstation()
    # print(stationdatas)
    # tiffraster = geneTiff(inpath)
    # input_raster =tiffraster
    # output_raster=r"../tiff数据/out_test_warp.tif"
    # input_shape = r"../tiff数据/上海市/上海市.shp"
    # clipTif(input_raster,output_raster,input_shape)
    cube_tif = r"../tiff数据/out_test.tif"
    output_raster=r"../tiff数据/out_test_warp.tif"
    input_shape = r"../tiff数据/上海市/上海市.shp"
    getTiffbyclass(inpath,cube_tif,output_raster,input_shape,target=2)
