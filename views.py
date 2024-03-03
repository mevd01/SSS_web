import time
import requests
from django.shortcuts import render
import random
import sqlite3
import os
import base64
import string
import smtplib
from email.header import Header
from email.mime.text import MIMEText
from PIL import Image, ImageDraw, ImageFont
from rest_framework.decorators import api_view
import datetime as dt
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_200_OK, HTTP_502_BAD_GATEWAY
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import re
from django.http import HttpResponse
import httplib2
from googleapiclient.discovery import build
from oauth2client.service_account import ServiceAccountCredentials

TOK = "6829204293:AAH1WWHLUaTtwHyZ8oFnyZNkYHxzQGnvNyo"
admins = [811073879, 1047465317, 547523349]


def home(request):
    return render(request, 'home.html')


def add_oper(ind, cursor, db):
    s = str(dt.datetime.now())
    s = s[:s.find(':', s.find(':') + 1)]
    if cursor.execute(f"SELECT * FROM traffic_limit WHERE ind='{ind}' AND time='{s}'").fetchone():
        cnt = int(cursor.execute(f"SELECT cnt FROM traffic_limit WHERE ind='{ind}' AND time='{s}'").fetchone()[0])
        if cnt >= 100:
            return True
        else:
            cursor.execute(f"UPDATE traffic_limit SET cnt=cnt+1 WHERE ind='{ind}' AND time='{s}'")
            db.commit()
    else:
        cursor.execute(f"DELETE FROM 'traffic_limit' WHERE ind='{ind}'")
        cursor.execute(f"INSERT INTO traffic_limit ('ind','time','cnt') VALUES ('{ind}','{s}','{1}')")
        db.commit()
    return False


def get_cost(rubles, cursor):
    ves = 2
    if rubles == '-':
        return 0
    uan = cursor.execute(f"SELECT uan FROM sys").fetchone()[0]
    s = str(int(((rubles + (rubles * 0.04 + 40 * ves + 25 + 5)) * uan) * 1.25))
    return s[:-3] + ' ' + s[-3:]


def get_uans(rubles, cursor):
    if rubles == 0:
        return 0
    uan = cursor.execute(f"SELECT uan FROM sys").fetchone()[0]
    cost = rubles / 1.25
    cost = cost / uan
    cost -= 110
    cost /= 1.04
    return int(cost)


def add_logs(cursor, db, oper):
    cursor.execute(
        f"INSERT INTO logs ('log') VALUES ('{oper}')")
    db.commit()


@api_view(['GET', 'POST'])
def users_list(request):
    if request.method == 'POST':  # если это запрос к api от фронта
        db = sqlite3.connect('C:/inetpub/wwwroot/backend_api/local_db.db', check_same_thread=False)
        sql = db.cursor()
        if request.data.get('oper') == 'user_exist':
            '''проверяем, зарегестрирован ли пользователь  ('mail':'x') ->{'exist':true/false}'''
            add_logs(sql, db, 'user_exist')
            if add_oper(request.data.get('mail'), sql, db):
                return Response({'error': None})
            return Response(
                {'exist': bool(sql.execute(f"SELECT * FROM users WHERE mail='{request.data.get('mail')}'").fetchone())})

        elif request.data.get('oper') == 'reg_user':
            '''регистрируем пользователя, ('mail':x,'password':x) -> None'''
            add_logs(sql, db, 'reg_user')
            mail = request.data.get('mail')
            if add_oper(request.data.get('mail'), sql, db):
                return Response({'error': None})
            pwrd = request.data.get('password')
            sql.execute(
                f"INSERT INTO users ('mail','password','date') VALUES ('{mail}','{pwrd}','{dt.datetime.now()}')")
            db.commit()
            return Response()

        elif request.data.get('oper') == 'update_password':
            '''Обновляет пароль для пользователя с почтой mail '''
            add_logs(sql, db, 'update_password')
            if add_oper(request.data.get('mail'), sql, db):
                return Response({'error': None})
            sql.execute(
                f"UPDATE users SET password='{request.data.get('new_pswrd')}' WHERE mail='{request.data.get('mail')}'")
            db.commit()
            return Response({'ok': 1})

        elif request.data.get('oper') == 'get_cost_by_id_and_size':
            '''регистрируем пользователя, ('mail':x,'password':x) -> None'''
            add_logs(sql, db, 'get_cost_by_id_and_size')
            id = request.data.get('id')
            size = request.data.get('size')
            sizes = sql.execute(f"SELECT * FROM sizes WHERE id = '{id}'").fetchone()
            if add_oper(request.data.get('mail'), sql, db):
                return Response({'error': None})
            for i in sizes[1].split(';'):
                sz, cost = i.split(',')
                if (str(sz) == str(size)):
                    a = str(get_cost(int(str(cost).replace('.', '').replace(',', '')), sql))
                    return Response({'cost': a})
            return Response()

        elif request.data.get('oper') == 'check_correct_mail':
            add_logs(sql, db, 'check_correct_mail')
            ''' проверям корректность введённой почты, ('mail':x) -> 1/2/3'''
            mail = request.data.get('mail')
            idd = request.data.get('user_id')
            if add_oper(idd, sql, db):
                return Response({'error': None})
            pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if re.match(pattern, mail) and len(mail) != '':
                if bool(sql.execute(f"SELECT * FROM users WHERE mail='{request.data.get('mail')}'").fetchone()):
                    return Response({'answer': '2', 'msg': 'already_in'})
                return Response({'answer': '3', 'msg': "ok"})
            else:
                return Response({'answer': '1', 'msg': 'incorrect text'})

        elif request.data.get('oper') == 'get_photo_by_tov_id':
            add_logs(sql, db, 'get_photo_by_tov_id')

            ''' Возвращает фотографию по id товара и ее номеру '''
            folder = sql.execute(f"SELECT * FROM items WHERE id='{request.data.get('id')}'").fetchone()[6]
            try:
                if add_oper(request.data.get('mail'), sql, db):
                    return Response({'error': None})
                if str(request.data.get('num')) == '-1':
                    s = open(f'C:/inetpub/wwwroot/backend_api/media/small_img/{folder}.jpg', 'rb').read()
                else:
                    s = open(
                        f'C:/inetpub/wwwroot/backend_api/media/img/{folder}/' + f'photo_{str(request.data.get('num'))}.png',
                        'rb').read()
                image = base64.b64encode(s)
                return Response({'photo': image})
            except Exception as ex:
                return Response({'photo': str(ex)})


        elif request.data.get('oper') == 'get_cnt_photos_by_tov_id':
            ''' Возвращает количество фотографий по tov_id'''
            add_logs(sql, db, 'get_cnt_photos_by_tov_id')
            if add_oper(request.data.get('mail'), sql, db):
                return Response({'error': None})
            folder = sql.execute(f"SELECT * FROM items WHERE id='{request.data.get('id')}'").fetchone()[6]
            return Response({'cnt': len(os.listdir(f'C:/inetpub/wwwroot/backend_api/media/img/{folder}'))})

        elif request.data.get('oper') == 'get_new_cookies_id':
            ''' return id for coockie'''
            add_logs(sql, db, 'get_new_cookies_id')
            new_id = ''.join([str(random.randint(1, 9)) for _ in range(35)])
            while sql.execute(f"SELECT * FROM ids WHERE id='{new_id}'").fetchone():
                new_id = ''.join([str(random.randint(1, 9)) for _ in range(35)])
            sql.execute(f"INSERT INTO ids ('id') VALUES ('{new_id}')")
            db.commit()
            return Response({'id': new_id})


        elif request.data.get('oper') == 'create_captcha':
            add_logs(sql, db, 'create_captcha')
            '''создаём капчу ('cock_id':x) -> FileResponce'''
            # путь к папке с изображениями
            img_folder = r"C:\inetpub\wwwroot\backend_api\media\form_captcha"

            # путь к папке для сохранения измененных изображений
            output_folder = r"C:\inetpub\wwwroot\backend_api\media\captcha"

            # выбираем случайное слово из списка

            # получаем список файлов в папке с изображениями
            img_files = os.listdir(img_folder)

            # выбираем случайное изображение
            random_img = random.choice(img_files)

            # открываем выбранное изображение
            img = Image.open(os.path.join(img_folder, random_img))

            draw = ImageDraw.Draw(img)

            # Загружаем шрифт
            font = ImageFont.truetype(r'C:/inetpub/wwwroot/backend_api/arial_bold.ttf', 70)

            w, h = 350, 100
            rand_x = random.randint(50, 200)
            rand_y = random.randint(50, 420)

            # Добавляем текст на изображение
            symbols = 'qwertyuiopasdfghjklzxcvbnm1234567890'
            text = ''.join([random.choice(symbols).upper() for _ in range(5)])
            random_word = text
            colors = [(255, 192, 203), (255, 187, 153), (192, 255, 193), (173, 216, 230), (221, 160, 221),
                      (152, 251, 152)]
            draw.text((rand_x, rand_y), text, fill=random.choice(colors), font=font)
            for _ in range(2):
                draw.line([(rand_x + 5, rand_y + random.randint(0, 65) + 15),
                           (rand_x + 240 + 5, rand_y + random.randint(0, 65) + 15)], (255, 255, 255), 6)

            # сохраняем измененное изображение в другую папку
            def generate_random_string(length):
                letters = string.ascii_lowercase
                return ''.join(random.choice(letters) for _ in range(length))

            # путь к папке, где будем проверять наличие файла
            folder_path = r'C:\inetpub\wwwroot\backend_api\media\captcha'

            # генерируем случайную строку длиной 30 символов
            random_string = generate_random_string(30)

            # проверяем, существует ли файл с таким именем в папке
            while os.path.exists(os.path.join(folder_path, random_string)):
                random_string = generate_random_string(30)
            random_string += '.jpg'
            output_path = folder_path + '/' + random_string
            img.save(output_path)
            if add_oper(request.data.get('cock_id'), sql, db):
                return Response({'error': None})
            sql.execute(
                f"INSERT INTO captcha ('cock_id','direct','key') VALUES ('{request.data.get('cock_id')}','{random_string.lower()}','{random_word.lower()}')")
            db.commit()
            s = open(output_path, 'rb').read()
            return HttpResponse(s)


        elif request.data.get('oper') == 'check_captcha':
            '''   Проверяем капчу ('user_input':'x','cock_id':x) -> 'ans':true/false   '''
            add_logs(sql, db, 'check_captcha')
            user_input = request.data.get('user_input')
            cock_id = request.data.get('cock_id')
            if add_oper(request.data.get('cock_id'), sql, db):
                return Response({'error': None})
            return Response({'ans': bool(
                sql.execute(
                    f"SELECT * FROM 'captcha' WHERE cock_id='{cock_id}' AND key='{user_input.lower()}'").fetchall())})

        elif request.data.get('oper') == 'get_all_photos_by_id':
            '''   возвращаем список фоток ('id':'x') -> 'photos':[x,x,x,x]     '''
            add_logs(sql, db, 'get_all_photos_by_id')
            photo = sql.execute(f"SELECT * FROM items WHERE id='{request.data.get('id')}'").fetchone()[6]
            arr = []
            if add_oper(request.data.get('mail'), sql, db):
                return Response({'error': None})
            for filename in os.listdir(f"../frontend/public/img/item_photos/{photo}"):
                if os.path.isfile(os.path.join(f"../frontend/public/img/item_photos/{photo}", filename)):
                    arr.append(photo + '/' + filename)
            return Response({'photos': arr})

        elif request.data.get('oper') == 'delete_captcha':
            '''   Удаляем капчу по названию фотки   '''
            add_logs(sql, db, 'delete_captcha')
            cock_id = request.data.get('cock_id')
            sql.execute(f"DELETE FROM 'captcha' WHERE cock_id='{cock_id}'")
            if add_oper(cock_id, sql, db):
                return Response({'error': None})
            db.commit()
            for i in os.listdir(f"C:/inetpub/wwwroot/backend_api/media/captcha"):
                if not sql.execute(f"SELECT * FROM captcha WHERE direct='{i}'").fetchone():
                    try:
                        os.remove(f"C:/inetpub/wwwroot/backend_api/media/captcha/{i}")
                    except:
                        pass
            return Response()

        elif request.data.get('oper') == 'request_avail_size':
            add_logs(sql, db, 'request_avail_size')
            tov_id = request.data.get('tov_id')
            len1 = len(sql.execute(f"SELECT * FROM update_order").fetchall())
            len2 = len(sql.execute(f"SELECT * FROM update_order2").fetchall())
            if add_oper(request.data.get('mail'), sql, db):
                return Response({'error': None})
            if len1 > len2:
                sql.execute(f"INSERT INTO update_order2 ('id') VALUES ('{tov_id}')")
                db.commit()
            else:
                sql.execute(f"INSERT INTO update_order ('id') VALUES ('{tov_id}')")
                db.commit()
            return Response()

        elif request.data.get('oper') == 'already_updated_tov':
            add_logs(sql, db, 'already_updated_tov')
            tov_id = request.data.get('tov_id')
            if add_oper(request.data.get('mail'), sql, db):
                return Response({'error': None})
            if len(sql.execute(f"SELECT * FROM update_order WHERE id='{tov_id}'").fetchall()) or \
                    len(sql.execute(f"SELECT * FROM update_order2 WHERE id='{tov_id}'").fetchall()):
                return Response({'ans': 0})
            else:
                return Response({'ans': 1})

        elif request.data.get('oper') == 'get_sizes_by_id':
            '''   Возвращаем двумерный массив размеров-цен по id товара ('id':'x') -> {'sizes':'x'}   '''
            add_logs(sql, db, 'get_sizes_by_id')
            idd = request.data.get('id')
            arr = sql.execute(f"SELECT * FROM sizes WHERE id='{idd}'").fetchone()[1].split(';')
            if add_oper(request.data.get('mail'), sql, db):
                return Response({'error': None})
            for i in range(len(arr)):
                try:
                    a = str(get_cost(int(arr[i].split(',')[1].replace('.', '').replace(',', '')), sql))
                    arr[i] = [arr[i].split(',')[0], a]
                except:
                    arr[i] = [arr[i].split(',')[0], '-']

            return Response({'sizes': arr})



        elif request.data.get('oper') == 'get_item_info_by_id':
            '''возвращаем инфу о товаре по его id ('id':x) -> ('description':x 'brand':x,'price':x,'name':x  '''
            add_logs(sql, db, 'get_item_info_by_id')
            if add_oper(request.data.get('mail'), sql, db):
                return Response({'error': None})
            ret_arr = []
            mail = request.data.get('mail')
            for i in request.data.get('ask_ids'):
                arr = sql.execute(f"SELECT * FROM items WHERE id='{i}'").fetchone()
                folder = arr[6]
                tov_id = i
                if not (arr):
                    return Response({'answer': 0})
                s = open(f'C:/inetpub/wwwroot/backend_api/media/small_img/{folder}.jpg', 'rb').read()
                image = base64.b64encode(s)
                slov = {'id': i, 'answer': 1, 'description': arr[-2].split('\n'), 'name': arr[1], 'brand': arr[3],
                        'price': 'Нет в наличии' if int(arr[4]) == -1 else str(get_cost(int(arr[4]), sql)),
                        'is_liked': bool(
                            sql.execute(f"SELECT * FROM likes WHERE tov_id='{tov_id}' AND mail='{mail}'").fetchone()),
                        'photo': image}
                ret_arr.append(slov)
            return Response({'list': ret_arr})

        elif request.data.get('oper') == 'clicked_tov_with_id':
            '''Добавляет в базу данных количество к популярности товара '''
            add_logs(sql, db, 'clicked_tov_with_id')
            sql.execute(f"UPDATE items SET popular=popular+1 WHERE id='{request.data.get('id')}'")
            db.commit()
            return Response()

        elif request.data.get('oper') == 'get_list_by_search':
            '''Добавляет в базу данных количество к популярности товара '''
            if add_oper(request.data.get('mail'), sql, db):
                return Response({'error': None})
            add_logs(sql, db, 'get_list_by_search')
            ask = request.data.get('ask')
            type = request.data.get('type')
            gen = request.data.get('gen')
            add1, add2, add3 = '', '', ''
            if 'm' in gen:
                add1 = " AND description NOT LIKE '%Women%' OR description NOT LIKE '%(w)%'"
            if 'w' in gen:
                add2 = " AND description LIKE '%Women%' OR description LIKE '%(w)%'"
            if 'u' in gen:
                add3 = " AND description LIKE '%unisex%'"
            cost_min = int(get_uans(int(request.data.get('cost_min')), sql))
            cost_max = int(get_uans(int(request.data.get('cost_max')), sql))
            if ask == '':
                try:
                    if int(type) == 1:
                        return Response({'ids': sql.execute(
                            f"SELECT id FROM items WHERE price BETWEEN {cost_min} AND {cost_max} {add1} {add2} {add3} ORDER BY price").fetchall()})
                    elif int(type) == -1:
                        return Response({'ids': sql.execute(
                            f"SELECT id FROM items WHERE price BETWEEN {cost_min} AND {cost_max} {add1} {add2} {add3} ORDER BY price DESC").fetchall()})
                    else:
                        return Response(
                            {'ids': sql.execute(
                                f"SELECT id FROM items WHERE price BETWEEN {cost_min} AND '{cost_max}' {add1} {add2} {add3} ORDER BY popular DESC").fetchall()})
                except:
                    return Response({'ids': '-1'})
            else:
                try:
                    if int(type) == 1:
                        asad = sql.execute(
                            f"SELECT id FROM items WHERE description LIKE '%{ask}%' AND price BETWEEN {cost_min} AND {cost_max} {add1} {add2} {add3} ORDER BY price").fetchall()
                        return Response({'ids': '-1' if len(asad) == 0 else asad})
                    elif int(type) == -1:
                        asad = sql.execute(
                            f"SELECT id FROM items WHERE description LIKE '%{ask}%' AND price BETWEEN {cost_min} AND {cost_max} {add1} {add2} {add3} ORDER BY price DESC").fetchall()
                        return Response({'ids': '-1' if len(asad) == 0 else asad})
                    else:
                        asad = sql.execute(
                            f"SELECT id FROM items WHERE description LIKE '%{ask}%' AND price BETWEEN {cost_min} AND {cost_max} {add1} {add2} {add3} ORDER BY popular DESC").fetchall()
                        return Response({'ids': '-1' if len(asad) == 0 else asad})
                except:
                    return Response({'ids': '-1'})

        elif request.data.get('oper') == 'add_in_busket':
            '''По Id товара, размеру и почте добавляем в локальную БД заказ к пользователю'''
            if add_oper(request.data.get('mail'), sql, db):
                return Response({'error': None})
            add_logs(sql, db, 'add_in_busket')
            slov = request.data
            tov_id = slov.get('id')
            size_of = slov.get('size')
            mail = slov.get('mail')

            sql.execute(f"INSERT INTO baskets ('mail','tov_id','size') VALUES ('{mail}','{tov_id}','{size_of}')")
            db.commit()
            return Response()

        elif request.data.get('oper') == 'delete_from_busket':
            '''По Id товара, размеру и почте удаляет из локальной БД заказ у пользователя           '''
            if add_oper(request.data.get('mail'), sql, db):
                return Response({'error': None})
            add_logs(sql, db, 'delete_from_busket')
            slov = request.data
            tov_id = slov.get('id')
            size_of = slov.get('size')
            mail = slov.get('mail')

            sql.execute(f"DELETE FROM baskets WHERE mail='{mail}' AND size='{size_of}' AND tov_id='{tov_id}'")
            db.commit()
            return Response()

        elif request.data.get('oper') == 'get_busket':
            ''' По почте возвращает список id и размера добавленного в корзину товара'''
            if add_oper(request.data.get('mail'), sql, db):
                return Response({'error': None})
            add_logs(sql, db, 'get_busket')
            mail = request.data.get('mail')

            ans = {'ans': []}
            for info in sql.execute(f"SELECT * FROM baskets WHERE mail='{mail}'").fetchall():
                ans['ans'].append([info[1], info[2]])
            return Response(ans)


        elif request.data.get('oper') == 'add_like':
            '''Добавляет товар в избранное'''
            if add_oper(request.data.get('mail'), sql, db):
                return Response({'error': None})
            add_logs(sql, db, 'add_like')
            slov = request.data
            tov_id = slov.get('id')
            mail = slov.get('mail')

            sql.execute(
                f"INSERT INTO likes ('mail','tov_id','date') VALUES ('{mail}','{tov_id}','{dt.datetime.now()}')")
            db.commit()
            return Response()

        elif request.data.get('oper') == 'is_liked':
            '''добавлен ли товар с таким id в избранное'''
            if add_oper(request.data.get('mail'), sql, db):
                return Response({'error': None})
            add_logs(sql, db, 'is_liked')
            slov = request.data
            tov_id = slov.get('id')
            mail = slov.get('mail')

            return Response(
                {'ans': bool(sql.execute(f"SELECT * FROM likes WHERE tov_id='{tov_id}' AND mail='{mail}'").fetchone())})

        elif request.data.get('oper') == 'liked_list':
            '''добавлен ли товар с таким id в избранное'''
            if add_oper(request.data.get('mail'), sql, db):
                return Response({'error': None})
            add_logs(sql, db, 'liked_list')
            slov = request.data
            mail = slov.get('mail')

            arr = sql.execute(f"SELECT * FROM likes WHERE mail='{mail}'").fetchall()
            tmp = []
            for i in arr:
                tmp.append(i)
            tmp.sort(key=lambda x: dt.datetime.strptime(str(x[2]), '%Y-%m-%d %H:%M:%S.%f'), reverse=True)
            for i in range(len(tmp)):
                tmp[i] = tmp[i][1]
            return Response({'ans': tmp})

        elif request.data.get('oper') == 'delete_like':
            '''Удаляет товар из избранного'''
            if add_oper(request.data.get('mail'), sql, db):
                return Response({'error': None})
            add_logs(sql, db, 'delete_like')
            slov = request.data
            tov_id = int(slov.get('id'))
            mail = slov.get('mail')

            sql.execute(f"DELETE FROM likes WHERE mail='{mail}' AND tov_id='{tov_id}'")
            db.commit()
            return Response()



        elif request.data.get('oper') == 'send_apply_update_password_mail':
            '''Отправляет пользователю сообщение на почту для подтверждения почты'''
            if add_oper(request.data.get('mail'), sql, db):
                return Response({'error': None})
            add_logs(sql, db, 'send_apply_update_password_mail')
            slov = request.data
            mail = slov.get('mail')
            sql.execute(f"DELETE FROM mail_accept WHERE mail='{mail}'").fetchall()
            code = ''.join(random.choice(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']) for i in range(6))
            sql.execute(f"INSERT INTO mail_accept ('mail','code') VALUES ('{mail}','{code}')")
            db.commit()
            text = f"""Для восстановления пароля аккаунта введите этот код:

{code}

Срок действия кода подтверждения истекает через 48 часов.

Если вы не запрашивали этот код, игнорируйте это сообщение.
"""
            smtp_server = smtplib.SMTP("smtp.yandex.ru", 587)
            smtp_server.starttls()
            smtp_server.login("Gidra1231223@yandex.ru", "zaharov20010974")

            # Настройка параметров сообщения
            msg = MIMEMultipart()
            msg["From"] = "Gidra1231223@yandex.ru"
            msg["To"] = mail
            msg["Subject"] = "Восстановление пароля"

            msg.attach(MIMEText(text, "plain"))
            smtp_server.sendmail("Gidra1231223@yandex.ru", mail, msg.as_string())
            return Response({'ans': True})

        elif request.data.get('oper') == 'send_apply_mail':
            '''Отправляет пользователю сообщение на почту для подтверждения почты'''
            if add_oper(request.data.get('mail'), sql, db):
                return Response({'error': None})
            add_logs(sql, db, 'send_apply_mail')
            slov = request.data
            mail = slov.get('mail')
            sql.execute(f"DELETE FROM mail_accept WHERE mail='{mail}'").fetchall()
            code = ''.join(random.choice(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']) for i in range(6))
            sql.execute(f"INSERT INTO mail_accept ('mail','code') VALUES ('{mail}','{code}')")
            db.commit()
            text = f"""Для подтверждения аккаунта введите этот код:

{code}

Срок действия кода подтверждения истекает через 48 часов.

Если вы не запрашивали этот код, игнорируйте это сообщение."""

            smtp_server = smtplib.SMTP("smtp.yandex.ru", 587)
            smtp_server.starttls()
            smtp_server.login("Gidra1231223@yandex.ru", "zaharov20010974")

            # Настройка параметров сообщения
            msg = MIMEMultipart()
            msg["From"] = "Qwuorty@yandex.ru"
            msg["To"] = mail
            msg["Subject"] = "Оповещение"

            msg.attach(MIMEText(text, "plain"))
            smtp_server.sendmail("Gidra1231223@yandex.ru", mail, msg.as_string())
            return Response({'ans': True})

        elif request.data.get('oper') == 'check_correct_mail_code':
            '''Отправляет пользователю сообщение на почту для подтверждения почты'''
            if add_oper(request.data.get('mail'), sql, db):
                return Response({'error': None})
            add_logs(sql, db, 'check_correct_mail_code')
            slov = request.data
            return Response({'ans': bool(sql.execute(
                f"SELECT * FROM mail_accept WHERE mail='{slov.get('mail')}' AND code='{slov.get('code')}'").fetchone())})

        elif request.data.get('oper') == 'check_sign_in_user':
            '''Проверяет корректность пароля и почты для входа в ЛК'''
            if add_oper(request.data.get('mail'), sql, db):
                return Response({'error': None})
            add_logs(sql, db, 'check_sign_in_user')
            slov = request.data
            return Response({'ans': bool(sql.execute(
                f"SELECT * FROM users WHERE mail='{slov.get('mail')}' AND password='{slov.get('password')}'").fetchone())})

        elif request.data.get('oper') == 'get_account_info_by_mail':
            '''Обновляет пароль для пользователя с почтой mail '''
            if add_oper(request.data.get('mail'), sql, db):
                return Response({'error': None})
            add_logs(sql, db, 'get_account_info_by_mail')
            a = sql.execute(f"SELECT * FROM users WHERE mail = '{request.data.get('mail')}'").fetchone()
            arr = [0] * len(a)
            for i in range(len(a)):
                arr[i] = str(a[i])

            return Response(
                {'name': arr[3], 'surname': arr[4], 'age': arr[5], 'net': arr[6], 'phone': arr[7], 'address': arr[8],
                 'postcode': arr[9]})

        elif request.data.get('oper') == 'set_account_info_by_mail':
            '''Записывает всю информацию о аккаунте по названию почты(имя, фамилию, возраст, адрес, вк/тг?? '''
            if add_oper(request.data.get('mail'), sql, db):
                return Response({'error': None})
            add_logs(sql, db, 'set_account_info_by_mail')
            sql.execute(f"UPDATE users SET name='{request.data.get('name')}' WHERE mail='{request.data.get('mail')}'")
            sql.execute(
                f"UPDATE users SET surname='{request.data.get('surname')}' WHERE mail='{request.data.get('mail')}'")
            sql.execute(f"UPDATE users SET age='{request.data.get('age')}' WHERE mail='{request.data.get('mail')}'")
            sql.execute(f"UPDATE users SET net='{request.data.get('net')}' WHERE mail='{request.data.get('mail')}'")
            sql.execute(f"UPDATE users SET phone='{request.data.get('phone')}' WHERE mail='{request.data.get('mail')}'")
            sql.execute(
                f"UPDATE users SET address='{request.data.get('address')}' WHERE mail='{request.data.get('mail')}'")
            sql.execute(
                f"UPDATE users SET postcode='{request.data.get('postcode')}' WHERE mail='{request.data.get('mail')}'")
            db.commit()
            return Response()


        elif request.data.get('oper') == 'create_order':
            '''Отправляет все данные о пользователе и о заказе на сервер, присваивая ему номер'''
            if add_oper(request.data.get('mail'), sql, db):
                return Response({'error': None})
            add_logs(sql, db, 'create_order')
            slov = request.data
            mail = slov.get('mail')
            arr = sql.execute(f"SELECT * FROM baskets WHERE mail='{mail}'").fetchall()
            basket = []
            for i in arr:
                basket.append(':'.join((i[1], i[2])))
            basket = ';'.join(basket)
            sql.execute(f"DELETE FROM 'baskets' WHERE mail='{mail}'")
            sql.execute(
                f"INSERT INTO orders ('mail','name','surname','net','phone','address','postcode','basket','date','status') VALUES ('{slov.get('mail')}','{slov.get('name')}',"
                f"'{slov.get('surname')}','{slov.get('net')}','{slov.get('phone')}','{slov.get('address')}','{slov.get('postcode')}','{basket}','{dt.datetime.today()}','wait')")
            db.commit()
            text = f"""
ВНИМАНИЕ, НОВЫЙ ЗАКАЗ ОТ пюсильки с номером телефона {slov['phone']}

"""
            for i in admins:
                requests.post(f'https://api.telegram.org/bot{TOK}/sendMessage?chat_id={i}&text={text}')

            return Response({'num': len(sql.execute(f"SELECT * FROM orders").fetchall())})

        elif request.data.get('oper') == 'get_order_by_num':
            '''Запрашивает все данные о заказе по его номеру: массив товаров и размеров, адрес, дата'''
            add_logs(sql, db, 'get_order_by_num')
            slov = request.data
            arr = sql.execute(f"SELECT * FROM orders WHERE id='{slov.get('num')}'").fetchone()
            busket = arr[8].split(';')
            bsk = []
            for i in busket:
                bsk.append(i.split(':'))
            s = 0
            for i in bsk:
                tov_id, size = i
                sz = sql.execute(f"SELECT * FROM sizes WHERE id='{tov_id}'").fetchone()[1].split(';')
                for j in sz:
                    a, b = j.split(',')
                    if a == size:
                        s += int(get_cost(int(b), sql).replace(' ', ''))
            return Response(
                {'mail': arr[1], 'name': arr[2], 'phone': arr[5], 'address': arr[6],
                 'postcode': arr[7], 'date': arr[9], 'status': arr[10], 'busket': bsk, 'sum': s})


        elif request.data.get('oper') == 'get_order_story':
            '''Запрашивает историю заказов по почте'''
            if add_oper(request.data.get('mail'), sql, db):
                return Response({'error': None})
            add_logs(sql, db, 'get_order_story')
            slov = request.data
            arr = sql.execute(f"SELECT * FROM orders WHERE mail='{slov.get('mail')}'").fetchall()
            return Response({'nums': [i[0] for i in arr]})

    elif request.method == 'GET':
        return Response()
