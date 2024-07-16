import sqlite3
import pandas as pd
db = sqlite3.connect('test.db')
cursor = db.cursor()
def create():
# Подключаемся к базе данных SQLite
    # Создаем таблицу, если она не существует
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS information(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student TEXT, 
            tutors TEXT, 
            school_results TEXT,
            health_group TEXT,
            olympiad TEXT,
            place TEXT,
            class TEXT,
            subject TEXT        
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS students(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT, 
            surname TEXT, 
            patronymic TEXT,
            age TEXT,
            class TEXT  
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS mugs(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mugs_name TEXT
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS teacher(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            login TEXT, 
            password TEXT, 
            name TEXT,
            surname TEXT, 
            patronymic TEXT,
            classes TEXT
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS subject(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject TEXT
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS olympiads(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            place TEXT           
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS classes(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            class TEXT
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS health_group(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student TEXT, 
            healthgroup TEXT
            
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS school_result(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student TEXT, 
            subject TEXT, 
            school_result TEXT
        );
    """)
    cursor.execute("""
            CREATE TABLE IF NOT EXISTS mugs_student(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student TEXT, 
                mugs TEXT
                
            );
        """)

    db.commit()

    print("готово")

def pars():
    df = pd.read_excel('mugs.xlsx')

    # Преобразование DataFrame в список кортежей
    data = [tuple(x) for x in df[['ID', 'mugs_name']].values]

    # Выполнение SQL-запроса на вставку данных
    cursor.executemany("INSERT OR IGNORE INTO mugs (id, mugs_name) VALUES (?, ?)", data)

    # Получение и вывод столбцов таблицы mugs
    cursor.execute("PRAGMA table_info(mugs)")
    mugs_columns = [column[1] for column in cursor.fetchall()]

    print("\nMugs Table:")
    # print("{:<5} {:<15}".format(*mugs_columns))
    for column in mugs_columns:
        print(column, end=' ')
    print()  # Печать новой строки для разделения заголовков и данных

    # Вывод данных таблицы mugs
    cursor.execute("SELECT * FROM mugs")
    mugs_data = cursor.fetchall()

    for row in mugs_data:
        print(row)
    db.commit()
def pars1():
    # Чтение данных из файла Excel
    df = pd.read_excel('olympiads.xlsx')

    # Преобразование DataFrame в список кортежей
    data = [tuple(x) for x in df[['id', 'place']].values]

    # Выполнение SQL-запроса на вставку данных
    cursor.executemany("INSERT OR IGNORE INTO olympiads (id , place) VALUES (?, ?)", data)

    # Получение и вывод столбцов таблицы teacher
    cursor.execute("PRAGMA table_info(olympiads)")
    olympiads_columns = [column[1] for column in cursor.fetchall()]

    print("\nOlympiads Table:")
    for column in olympiads_columns:
        print(column, end=' ')
    print()  # Печать новой строки для разделения заголовков и данных

    # Вывод данных таблицы teacher
    cursor.execute("SELECT * FROM olympiads")
    olympiads_data = cursor.fetchall()

    for row in olympiads_data:
        print(row)
    db.commit()

create()
pars()
pars1()
