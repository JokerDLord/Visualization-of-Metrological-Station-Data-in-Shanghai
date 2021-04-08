import sqlite3 as sql
import requests
import json

import os
import pandas as pd
import time
import datetime
import threading
import schedule 
from bs4 import BeautifulSoup

from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
import selenium.webdriver.support.expected_conditions as EC
import selenium.webdriver.support.ui as ui 


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
station_db = {'十五厂':'上海第十五制药厂', \
              '杨浦四漂':'杨浦第四漂染厂',
              '静安监测站':'静安'}
#  数值单位：μg/m3(CO为mg/m3)
# 可直接爬取静态网页，但我们选择使用selenium模拟浏览器工作


# 一直等待某元素可见，默认超时10秒
# 注意此处用By.ID选择可见的table以爬取其中的数据
def is_visible(driver,locator, timeout=10):
    try:
        ui.WebDriverWait(driver, timeout).until(EC.visibility_of_element_located((By.ID, locator)))
        print('yes')
        return True
    except TimeoutException:
        print('no')
        return False

#获取网页表格元素
def GetPage(driver):
    url = "http://www.pm25.in/shanghai"
    print(3)
    driver.get(url)
    print(4)
    if is_visible(driver,'detail-data'):
        df = pd.DataFrame(columns = station.keys())
        df = ParseHtml(driver, df)

    #     break
    # else:
    #     time.sleep(5)#等待标签加载完成
    
    
  

def ParseHtml(driver,df):
    #此处由于是直接插入数据库，故未用到df
    soup = BeautifulSoup(driver.page_source,'lxml')
    # count = int(soup.select('#Count')[0].text)
    # for idx,tr in enumerate(soup.find_all(attrs={'id':'detail-data'})[0]):
    #     print(idx,'haha',tr)
    tby = soup.find_all(attrs={'id':'detail-data'})[0]
    #print(tby)
    tr = tby.find_all('tr')
    for idx,r in enumerate(tr):
        if idx!=0: #第一行是空列表
            tds = r.find_all('td')
            # print(idx,tds[0],tds[1])
            insertlst = []
            for idx,con in enumerate(tds):
                if idx!=3 and idx!=9:
                    insertlst  += [ParseRow(con.contents)]
            print(insertlst)
            StoreDB(insertlst)
                    

def StoreDB(insertlst):
    if insertlst[0] in station_db.keys():
        dbname = station_db[insertlst[0]]
    elif insertlst[0] in station.keys():
        dbname = insertlst[0]
    else:
        return None
    
    # tstime = time.strftime("%Y-%m-%d %H", time.localtime())
    tstime = (datetime.datetime.now()-datetime.timedelta(hours=1)).strftime("%Y-%m-%d %H")
    insertlst = [tstime] + insertlst
    # insertlst 可能出现_ [] 等特殊内容及与数据库格式不匹配的问题
    for i,con in enumerate(insertlst):
        if (i not in (0,1,3)) and (con != "_") and con:
            insertlst[i] = float(con)
        elif i in (0,1,3) and con:
            continue
        else:
            insertlst[i] = ''
    conn = sql.connect("dbs/"+dbname+'.db')
    val = tuple(insertlst)
    sen = '''INSERT INTO {} VALUES(?,?,?,?,?,?,?,?,?,?)'''.format(station[dbname])
    sen = str(sen)
    print(sen)
    try:
        conn.execute(sen,val)
    except Exception as ve:
        print("可能是表中已经存在该时间的记录")
        print(ve)
    else:
        print("成功插入啦！")
    finally:
        conn.commit()
        conn.close()
    
    

                    
def ParseRow(contents):
    if contents:
        return contents[0]
    else:
        return contents

#启用定时器每小时爬取一次数据
def MyTimer():
    schedule.every().hour.at(":01").do(Craw)
    while True:
        schedule.run_pending()
        time.sleep(1)
    pass

#注意，我们main函数里面的内容不是只执行一次的，二是每一小时都执行的，
#所以要封装在一个单独的函数里面定时执行
def Craw():
    options = Options()
    options.headless = True
    print(1)
    driver = webdriver.Firefox(options = options)
    print(2)
    GetPage(driver)
    driver.quit() #注意一定释放浏览器资源 不然电脑会爆炸
    

if __name__ == '__main__':
    Craw()
    MyTimer()



