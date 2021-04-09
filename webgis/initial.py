from flask import render_template, request
from os import environ
import random
import math
import json
import sqlite3 as sql
from flask import Flask
app = Flask(__name__)

'''
run server
# from os import environ
# from webgis import app

# if __name__ == '__main__':
#     HOST = environ.get('SERVER_HOST', 'localhost')
#     try:
#         PORT = int(environ.get('SERVER_PORT', '5555'))
#     except ValueError:
#         PORT = 5555
#     app.run(HOST, PORT, debug=True)
'''

# from webgis import app

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


def getLonlat():
    with sql.connect(dbpath+'stationloc.db') as conn:
        cur = conn.cursor()
        for staname in station.keys():
            cur.execute(
                'SELECT longitude,latitude from stationloc where name = "{}"'.format(staname))
            (lon, lat) = cur.fetchall()[0]
            stalonlat[staname] = [eval(lon), eval(lat)]
        # print(stalonlat)

@app.route('/')
def cover():
    return render_template('mainmap.html')


@app.route('/try', methods=['POST'])
def trytry():
    # axios的post/get方法默认使用的是'Content-Type':'application/json;charset=utf-8'，
    # 即json方式，后端只能使用json方式（Flask：get_json()、SpringMVC：@RequestBody ）接收，如果以其他方式接收是无法接收的。
    get_json = request.get_json()
    print(get_json['aiming']+'你这个'+get_json['ID'])
    # getter = json.loads(get_json)
    # print(getter)
    # for i in getter:
    #     print(i)

    result = json.dumps({"success": True, "name": '???', "data": '我不到啊'})
    return result


@app.route('/stationdata', methods=['POST'])
def getStaSata():
    get_json = request.get_json()

    # 传到前端的数据采用{"success":bool,"time":string,
    # "content":{"staionname1":{"lonlat":[longitude,latitude],其他指标},"staionname1":[]}}的形式
    content_dic = {}
    Paras = ["time", "name", "AQI", "quantity",
             "PM25", "PM10", "CO", "NO2", "O3", "SO2"]
    for stationname in station.keys():
        stations_datas = {}
        stations_datas["lonlat"] = stalonlat[stationname]
        with sql.connect(dbpath+stationname+'.db') as conn:
            cur = conn.cursor()
            cur.execute(
                'select * from {} order by rowid desc limit 0,1'.format(station[stationname]))
            values = cur.fetchall()[0]
            for (index, element) in enumerate(Paras):
                if not element:
                    element = '-'  # 部分不存在的值替换为-
                stations_datas[element] = values[index]

        content_dic[stationname] = stations_datas
    
    # print(content_dic)

    return json.dumps({'success': True, 'contents': content_dic})


if __name__ == '__main__':
    getLonlat()

    HOST = environ.get('SERVER_HOST', 'localhost')
    try:
        PORT = int(environ.get('SERVER_PORT', '5555'))
    except ValueError:
        PORT = 5555
    app.run(HOST, PORT, debug=True)
