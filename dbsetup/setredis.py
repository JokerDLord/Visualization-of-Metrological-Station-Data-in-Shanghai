import sqlite3 as sql
import requests
import json


station = {'普陀':'putuo','上海第十五制药厂':'drug15',\
    '虹口':'hongkou','徐汇上师大':'xvhuishida',\
        '杨浦第四漂染厂':'yangpupiaoran'\
    ,'静安':'jiangan','浦东川沙':'chuansha',\
        '浦东新区监测站':'putongcezhan',\
    '浦东张江':'pudongzhangjiang','宝山庙行':'baoshanmiaohang',\
        '崇明上实东滩':'dongtan','嘉定南翔':'nanxiang',\
        '金山新城':'jinshanxincheng','闵行浦江':'minhangpujiang',\
            '青浦徐泾':'xvjing','松江图书馆':'songjiangtushuguan',\
            '长宁仙霞':'xianxia','浦东惠南':'huinan',\
                '奉贤南桥新城':'nanqiaoxincheng'}

# 以站点时间作为主键，有站名，AQI，空气质量，PM10,PM2.5，CO,NO2,SO2,O3等字段
#  数值单位：μg/m3(CO为mg/m3)
def creatdbs():
    for i in station.keys():
        dbname = i+".db"
        conn = sql.connect("dbs/"+dbname)
        conn.execute('''CREATE TABLE '{}'
        (time   TEXT  PRIMARY Key  NOT NULL,
        name text,
        AQI FLOAT,
        quantity TEXT,
        PM25 FLOAT,
        PM10 FLOAT,        
        CO FLOAT,
        NO2 FLOAT,
        O3 FLOAT,
        SO2 FLOAT
        );'''.format(station[i]))
        conn.commit()
        conn.close()
        print("creat {} successfully".format(station[i]))


if __name__ == '__main__':
    creatdbs()

