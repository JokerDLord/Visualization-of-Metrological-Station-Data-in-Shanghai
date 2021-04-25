import sqlite3 as sql
import requests
import json


station = {'普陀':'普陀区杏山路317号曹杨社区文化中心', '上海第十五制药厂':'黄浦区局门路478号', 
           '虹口':'虹口区凉城路854号', '徐汇上师大':'徐汇区桂林路100号上师大', 
           '杨浦第四漂染厂':'杨浦区平凉路1398号', '静安':'静安区武定西路1480号', 
           '浦东川沙':'浦东新区川环南路319号', '浦东新区监测站':'浦东新区灵山路51号',
            '浦东张江':'浦东新区祖冲之路295号', '宝山庙行':'宝山区长临路1368号', 
            '崇明上实东滩':'崇明区团旺南路东滩物业管理有限公司', '嘉定南翔':'嘉定区古猗园南路与金脉路交叉口西200米',
            '金山新城':'金山区金山大道2000号区政府', '闵行浦江':'闵行区浦驰路50号', 
            '青浦徐泾':'青浦区高泾路599号北斗西虹桥基地', '松江图书馆':'松江区人民北路1626号松江图书馆',
            '长宁仙霞':'长宁区虹古路206号仙霞街道办事处', '浦东惠南':'浦东新区惠南镇曲幽路487号', 
            '奉贤南桥新城':'奉贤区解放东路8号'}

dbname1 = "stationloc.db"


def creatstarionloc():
    conn = sql.connect(dbname1)
    conn.execute('''CREATE TABLE stationloc
        (name   TEXT    NOT NULL,
        address text not null,
        longitude text,
        latitude text );''')
    conn.commit()
    conn.close()
    print("creat successfully")


def getapiloc():
    conn = sql.connect(dbname1)
    c = conn.cursor()
    for s in station.keys():
        par = {'city': '上海', 'address': station[s],
               'key': '7ef6e29e2350602e8169226aab75f142'}  # get请求参数
        url = 'http://restapi.amap.com/v3/geocode/geo'
        res = requests.get(url, par)
        json_data = json.loads(res.text)
        print(json_data)
        geo = json_data['geocodes'][0]['location'].split(",")
        print(geo)
        sen = "INSERT INTO stationloc (name,address,longitude,latitude) VALUES('{}','{}',{},{})".format(
            s, station[s], geo[0], geo[1])

        c.execute(sen)
    conn.commit()
    conn.close()


def examlonlat():
    par = {'city': '上海', 'address': '嘉定区古猗园南路与金脉路交叉口西200米',
           'key': '7ef6e29e2350602e8169226aab75f142'}  # get请求参数
    url = 'http://restapi.amap.com/v3/geocode/geo'
    res = requests.get(url, par)
    json_data = json.loads(res.text)
    print(json_data)
    geo = json_data['geocodes'][0]['location'].split(",")
    print(geo)


if __name__ == '__main__':
    creatstarionloc()
    getapiloc()
    # examlonlat()
