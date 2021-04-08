

# # -*- coding: utf-8 -*-
# import psycopg2
# # 获得连接
# conn = psycopg2.connect(database="postgres", user="postgres", password="5432", host="127.0.0.1", port="5432")
# # 获得游标对象
# cursor = conn.cursor()
# # sql语句
# sql = "SELECT VERSION()"
# # 执行语句
# cursor.execute(sql)
# # 获取单条数据.
# data = cursor.fetchone()
# # 打印
# print("database version : %s " % data)
# # 创建一个数据表
# # cursor.execute('''
# #     create table public .scoreList(
# #     id integer not null primary key,
# #     name varchar(32) not null,
# #     grade integer not null
# #     )''')
# # 增加一条数据
# # cursor.execute("insert into public .scoreList(id,name,grade)\
# #     values (10,'Shawn.zhang','100') ")
 
# # 打印所有数据
# cursor.execute("select id,name,grade from public.scoreList")
# allData = cursor.fetchall()
# for data in allData:
#     print(data)
 
# # 更改id=5的数据
# cursor.execute("update public.scoreList set name = 'Sean.li' where id = 5")
# print("after update :")
 
# # 再次打印所有数据
# cursor.execute("select id,name,grade from public.scoreList")
# allData = cursor.fetchall()
# for data in allData:
#     print(data)
 
# # 删掉id = 1的数据
# cursor.execute("delete from public.scoreList where id = 1")
# print("after delete :")
 
# # 再次打印所有数据
# cursor.execute("select id,name,grade from public.scoreList")
# allData = cursor.fetchall()
# for data in allData:
#     print(data)
 
# # 事物提交
# conn.commit()
# # 关闭数据库连接


import schedule
import time

def f1():
    print("我开始执行了")

schedule.every().hour.at("36:01").do(f1)
while True:
    schedule.run_pending() # 运行所有可运行的任务
    time.sleep(1)