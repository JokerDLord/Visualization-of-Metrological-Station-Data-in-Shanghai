import sqlite3 as sql
import requests
import json


station = ['普陀','上海第十五制药厂','虹口','徐汇上师大','杨浦第四漂染厂'\
    ,'静安','浦东川沙','浦东新区监测站',\
    '浦东张江','宝山庙行','崇明上实东滩','嘉定南翔',\
        '金山新城','闵行浦江','青浦徐泾','松江图书馆',\
            '长宁仙霞','浦东惠南','奉贤南桥新城']

dbname1 = "stationloc.db"

def creatstarionloc():
    conn = sql.connect(dbname1)
    conn.execute('''CREATE TABLE stationloc
        (name   TEXT    NOT NULL,
        longitude text,
        latitude text );''')
    conn.commit()
    conn.close()
    print("creat successfully")

def getapiloc():
    conn = sql.connect(dbname1)
    c = conn.cursor()
    for s in station:
        par = {'city':'上海','address': s, 'key': '7ef6e29e2350602e8169226aab75f142'}  # get请求参数
        url = 'http://restapi.amap.com/v3/geocode/geo'
        res = requests.get(url, par)
        json_data = json.loads(res.text)
        print(json_data)
        geo = json_data['geocodes'][0]['location'].split(",")
        print(geo)
        sen = "INSERT INTO stationloc (name,longitude,latitude) VALUES('{}',{},{})".format(s,geo[0],geo[1])
        
        c.execute(sen)
    conn.commit()
    conn.close()


if __name__ == '__main__':
    creatstarionloc()
    getapiloc()
