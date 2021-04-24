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
Paras = ["time", "name", "AQI", "quantity",
         "PM25", "PM10", "CO", "NO2", "O3", "SO2"]


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

# 查询单个站点的历史数据 8hours


@app.route('/queryStation', methods=['get'])
def querystation():
    get_args = request.args.get("ID")
    print(get_args)
    stationname = get_args
    if stationname in station_db.keys():
        stationname = station_db[stationname]
    # "content":{"staionname1":{time1:{各项指标}, time2:{}, ......}}的形式
    content_dic = {}
    with sql.connect(dbpath+stationname+'.db') as conn:
        cur = conn.cursor()
        # 这里是选择最近的8小时的数据
        sqlsen = "select * from {} order by rowid desc limit 0,8".format(
            station[stationname])
        cur.execute(sqlsen)
        values = cur.fetchall()
        for i in range(8):
            singletimedata = {}
            singleitem = values[i]
            time = singleitem[0]  # 单个条目的时间

            for (index, element) in enumerate(Paras):
                # if not element:
                #     element = '-'  # 部分不存在的值替换为-
                singletimedata[element] = singleitem[index]
            content_dic[time] = singletimedata

    return json.dumps({'success': True, 'stationname': stationname, 'contents': content_dic})


@app.route('/queryallStations', methods=['get'])
def queryallStations():
    get_args = request.args.get("hours")
    print(get_args)
    queryhours = int(get_args)
    # "content":{"staionname1":{time1:{各项指标}, time2:{}, ......},"stationname2":{}}的形式
    content_dic = {}
    for stationname in station.keys():
        station_datas = {}
        with sql.connect(dbpath+stationname+'.db') as conn:
            cur = conn.cursor()
            cur.execute(
                'select * from {} order by rowid desc limit 0,{}'.format(station[stationname], queryhours))
            values = cur.fetchall()
            for i in range(queryhours):
                singletimedata = {}
                singleitem = values[i]
                time = singleitem[0]  # 取出每一行的时间

                for (index, element) in enumerate(Paras):
                    # if not element:
                    #     element = '-'  # 部分不存在的值替换为-
                    singletimedata[element] = singleitem[index]
                station_datas[time] = singletimedata
        content_dic[stationname] = station_datas

    return json.dumps({'success': True, 'contents': content_dic})


@app.route('/registerAccount', methods=['get', 'post'])
def retgister():
    name = request.args.get('name')
    password = request.args.get('pass')
    print(name, password)
    logins = ""  # 暂时无日志处理
    with sql.connect(dbpath+"usrinfo"+'.db') as conn:
        cur = conn.cursor()
        insertResult = "Is that all right？ All right!"
        success = True
        try:
            cur.execute("insert into usrinfo values('{}','{}','{}') ".format(
                name, password, logins))
        except Exception as unkownResult:
            print(unkownResult)
            success = False
            insertResult = "注册错误，可能是用户已经存在，请直接登录或者更改账户密码"
        finally:
            pass

    return json.dumps({'success': success, 'contents': insertResult})


@app.route('/loginAccount', methods=['get', 'post'])
def loginning():
    name = request.args.get('name')
    password = request.args.get('pass')
    print(name, password)
    counts = 0 # 记录usr总共有多少个事件，如果登陆不成功，直接为0就行
    with sql.connect(dbpath+"usrinfo"+'.db') as conn:
        cur = conn.cursor()
        insertResult = "Is that all right？ All right!"
        success = True
        try:
            cur.execute(
                "select password from usrinfo where usrname = '{}'".format(name))
            value = cur.fetchall()
            print(value[0][0])

            if len(value) == 0:
                success = False
                insertResult = "登录错误，用户不存在或者用户密码输入错误1"
            elif (value[0][0] == password):
                insertResult = "Is that all right？ All right!"
                success = True
            else:  # 这种情况下 密码和实际值不相等
                success = False
                insertResult = "登录错误，用户不存在或者用户密码输入错误2"
        except Exception as unkownResult:
            print(unkownResult)
            success = False
            insertResult = "登录错误，用户不存在或者用户密码输入错误3"
        finally:
            pass

    with sql.connect(dbpath+"usrdetails.db") as conn:
        cur = conn.cursor()
        cur.execute(
            "select * from usrdetails where usrname = '{}'".format(name))
        events = cur.fetchall()
        counts = len(events)

    return json.dumps({'success': success,'counts':counts, 'contents': insertResult})


@app.route('/submitEvent', methods=['get', 'post'])
def submitevent():
    elongitude = request.args.get('longitude')
    elatitude = request.args.get('latitude')
    erecord = request.args.get('eventRecor')
    addtime = request.args.get('addtime')
    usrname = request.args.get('usrname')
    others = ""  # 暂时无其他信息
    # 注意数据库中的时间为添加时间
    print(elongitude, elatitude, erecord, addtime, usrname)
    with sql.connect(dbpath+"usrdetails.db") as conn:
        cur = conn.cursor()
        success = True
        try:
            cur.execute("insert into usrdetails values('{}','{}','{}','{}','{}')".format(
                usrname, addtime, (elongitude+","+elatitude), erecord, others))
            success = True
            eventResult = "上传个人时间记录成功"
        except Exception as unkownResult:
            print(unkownResult)
            success = False
            eventResult = "个人事件上传失败"
        finally:
            pass

    return json.dumps({'success': success, 'contents': eventResult})


@app.route('/getEvents', methods=['get'])
def getEvents():
    usrname = request.args.get("usrname")
    print(usrname)
    # contents采用{1：{各项指标}}这种形式记录
    eventsdic = {}
    with sql.connect(dbpath+"usrdetails.db") as conn:
        cur = conn.cursor()
        success = True
        counts = 0
        try:
            cur.execute(
                "select * from usrdetails where usrname = '{}'".format(usrname))
            events = cur.fetchall()
            print(events)
            success = True
            counts = len(events)
            for i in range(counts):
                dici = {}
                dici['eventtime'] = events[i][1]
                dici['eventlonlat'] = events[i][2]
                dici['eventdetails'] = events[i][3]

                eventsdic[str(i+1)] = dici

        except Exception as unkownResult:
            print(unkownResult)
            success = False
            events = "获取个人事件记录失败"
        finally:
            pass

    print(eventsdic)

    return json.dumps({'success': success, 'counts': counts, 'contents': eventsdic})


@app.route('/deleEvent', methods=['get', 'post'])
def deleEvent():
    usrname = request.args.get('usrname')
    eventlonlat = request.args.get('eventlonlat')
    eventtime = request.args.get('eventtime')
    eventdetails = request.args.get('eventdetails')
    # 注意数据库中的时间为添加时间
    print(usrname, eventlonlat)
    with sql.connect(dbpath+"usrdetails.db") as conn:
        cur = conn.cursor()
        success = True
        try:
            sqlsen = "delete from usrdetails where usrname = '{}' and eventtime = '{}' and eventlonlat = '{}' and eventdetails = '{}'".format(
                usrname, eventtime, eventlonlat,  eventdetails)
            print(sqlsen)
            cur.execute(sqlsen)
            success = True
            deleteResult = "删除成功"
        except Exception as unkownResult:
            print(unkownResult)
            success = False
            deleteResult = "删除失败"
        finally:
            pass

    return json.dumps({'success': success, 'contents': deleteResult})


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

    for stationname in station.keys():
        stations_datas = {}
        stations_datas["lonlat"] = stalonlat[stationname]
        with sql.connect(dbpath+stationname+'.db') as conn:
            cur = conn.cursor()
            cur.execute(
                'select * from {} order by rowid desc limit 0,1'.format(station[stationname]))
            values = cur.fetchall()[0]
            for (index, element) in enumerate(Paras):
                # if not element:
                #     element = '-'  # 部分不存在的值替换为-
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
