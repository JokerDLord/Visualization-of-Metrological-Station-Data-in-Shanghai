import sqlite3 as sql


def creatdbs1():
    conn = sql.connect("dbs/usrinfo.db")
    conn.execute('''CREATE TABLE usrinfo
    (usrname    TEXT primary key    NOT NULL,
    password text NOT NULL,
    logins text );''')
    conn.commit()
    conn.close()
    print("creat usrInfo.db successfully")

def creatdbs2():   
    connn = sql.connect("dbs/usrDetails.db")
    connn.execute('''CREATE TABLE usrdetails
    (usrname   TEXT   NOT NULL,
     pointname text not null,
    eventtime text NOT NULL,
    eventlonlat text NOT NULL,
    eventdetails text,
    otherinfo text,
    pointtype text
    );''')
    connn.commit()
    connn.close()
    print("creat usrDetails.db successfully")



if __name__ == "__main__":
    # creatdbs1()
    creatdbs2()
