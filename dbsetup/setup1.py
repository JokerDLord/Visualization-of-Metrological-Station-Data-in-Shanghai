import psycopg2

conn = psycopg2.connect(database="testdb", user="postgres", password="123321", host="127.0.0.1", port="5432")
print(0)
cursor = conn.cursor()

# sql = "select * from brand where country = Germany"
# cursor.execute(sql)
# rows = cursor.fetchall()
# for row in rows:
#     print(row)
# conn.commit()
conn.close()
print("Opened database successfully")

# cur = conn.cursor()
# cur.execute('''CREATE TABLE COMPANY
#        (ID INT PRIMARY KEY     NOT NULL,
#        NAME           TEXT    NOT NULL,
#        AGE            INT     NOT NULL,
#        ADDRESS        CHAR(50),
#        SALARY         REAL);''')
# print("Table created successfully")

# conn.commit()
# conn.close()


