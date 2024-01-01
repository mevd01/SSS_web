from django.shortcuts import render
import random
import sqlite3
import os
import string
import smtplib
from email.header import Header
from email.mime.text import MIMEText
from PIL import Image, ImageDraw, ImageFont
from rest_framework.decorators import api_view
import datetime as dt
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_200_OK
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import re

# from .models import User
# from .serializers import UserSerializer
TOK = "6829204293:AAH1WWHLUaTtwHyZ8oFnyZNkYHxzQGnvNyo"
admins = []



def home(request):
    return render(request, 'home.html')


@api_view(['GET', 'POST'])
def users_list(request):
    if request.method == 'POST':  # если это запрос к api от фронта

        db = sqlite3.connect('local_db.db', check_same_thread=False)
        sql = db.cursor()

        if request.data.get('oper') == 'user_exist':
            '''проверяем, зарегестрирован ли пользователь  ('mail':'x') ->{'exist':true/false}'''
            return Response(
                {'exist': bool(sql.execute(f"SELECT * FROM users WHERE mail='{request.data.get('mail')}'").fetchone())})

        elif request.data.get('oper') == 'reg_user':
            '''регистрируем пользователя, ('mail':x,'password':x) -> None'''
            mail = request.data.get('mail')
            pwrd = request.data.get('password')
            sql.execute(
                f"INSERT INTO users ('mail','password','date') VALUES ('{mail}','{pwrd}','{dt.datetime.now()}')")
            db.commit()
            return Response()

        elif request.data.get('oper') == 'update_password':
            '''Обновляет пароль для пользователя с почтой mail '''
            sql.execute(
                f"UPDATE users SET password='{request.data.get('new_pswrd')}' WHERE mail='{request.data.get('mail')}'")
            return Response({'ok': 1})

        elif request.data.get('oper') == 'get_cost_by_id_and_size':
            '''регистрируем пользователя, ('mail':x,'password':x) -> None'''
            id = request.data.get('id')
            size = request.data.get('size')
            sizes = sql.execute(f"SELECT * FROM sizes WHERE id = '{id}'").fetchone()
            for i in sizes[1].split(';'):
                sz, cost = i.split(',')
                if (str(sz) == str(size)):
                    return Response({'cost': cost})
            return Response()

        elif request.data.get('oper') == 'check_correct_mail':
            ''' проверям корректность введённой почты, ('mail':x) -> 1/2/3'''
            mail = request.data.get('mail')
            pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if re.match(pattern, mail) and len(mail) != '':
                if bool(sql.execute(f"SELECT * FROM users WHERE mail='{request.data.get('mail')}'").fetchone()):
                    return Response({'answer': '2', 'msg': 'already_in'})
                return Response({'answer': '3', 'msg': "ok"})
            else:
                return Response({'answer': '1', 'msg': 'incorrect text'})

        elif request.data.get('oper') == 'create_captcha':
            '''создаём капчу ('mail':x) -> 1/2/3'''
            # путь к папке с изображениями
            img_folder = "media/img"

            # путь к папке для сохранения измененных изображений
            output_folder = "../frontend/public/img/captcha"

            # выбираем случайное слово из списка

            # получаем список файлов в папке с изображениями
            img_files = os.listdir(img_folder)

            # выбираем случайное изображение
            random_img = random.choice(img_files)

            # открываем выбранное изображение
            img = Image.open(os.path.join(img_folder, random_img))

            draw = ImageDraw.Draw(img)

            # Загружаем шрифт
            font = ImageFont.truetype('arial_bold.ttf', 70)


            w,h = 350,100
            rand_x = random.randint(50,200)
            rand_y = random.randint(50,420)

            # Добавляем текст на изображение
            symbols = 'qwertyuiopasdfghjklzxcvbnm1234567890'
            text = ''.join([random.choice(symbols).upper() for _ in range(5)])
            random_word = text
            colors = [(255, 192, 203),(255, 187, 153),(192, 255, 193),(173, 216, 230),(221, 160, 221),(152, 251, 152)]
            draw.text((rand_x, rand_y), text, fill=random.choice(colors), font=font)
            for _ in range(2):
                draw.line([(rand_x+5,rand_y+random.randint(0,65) + 15),(rand_x+240+5,rand_y+random.randint(0,65) + 15)],(255,255,255),6)

            # сохраняем измененное изображение в другую папку
            def generate_random_string(length):
                letters = string.ascii_lowercase
                return ''.join(random.choice(letters) for _ in range(length))


            # путь к папке, где будем проверять наличие файла
            folder_path = '../frontend/public/img/captcha'

            # генерируем случайную строку длиной 30 символов
            random_string = generate_random_string(30)

            # проверяем, существует ли файл с таким именем в папке
            while os.path.exists(os.path.join(folder_path, random_string)):
                random_string = generate_random_string(30)
            random_string += '.jpg'
            output_path = folder_path + '/' + random_string
            img.save(output_path)
            sql.execute("INSERT INTO 'captcha' ('direct','key') VALUES (?,?)", (random_string, random_word.lower()))
            db.commit()
            return Response({'name': random_string})


        elif request.data.get('oper') == 'check_captcha':
            '''   Проверяем капчу ('user_input':'x','photo':x) -> 'ans':true/false   '''
            user_input = request.data.get('user_input')
            photo = request.data.get('photo')
            return Response({'ans': bool(
                sql.execute(f"SELECT * FROM 'captcha' WHERE direct='{photo}' AND key='{user_input.lower()}'").fetchall())})

        elif request.data.get('oper') == 'get_all_photos_by_id':
            '''   возвращаем список фоток ('id':'x') -> 'photos':[x,x,x,x]     '''
            photo = sql.execute(f"SELECT * FROM items WHERE id='{request.data.get('id')}'").fetchone()[6]
            arr = []
            for filename in os.listdir(f"../frontend/public/img/item_photos/{photo}"):
                if os.path.isfile(os.path.join(f"../frontend/public/img/item_photos/{photo}", filename)):
                    arr.append(photo + '/' + filename)
            return Response({'photos': arr})

        elif request.data.get('oper') == 'delete_captcha':
            '''   Удаляем капчу по названию фотки   '''
            photo = request.data.get('photo')
            sql.execute(f"DELETE FROM 'captcha' WHERE direct='{photo}'")
            db.commit()
            os.remove(f"../frontend/public/img/captcha/{photo}")
            return Response()

        elif request.data.get('oper') == 'get_sizes_by_id':
            '''   Возвращаем двумерный массив размеров-цен по id товара ('id':'x') -> {'sizes':'x'}   '''
            idd = request.data.get('id')
            arr = sql.execute(f"SELECT * FROM sizes WHERE id='{idd}'").fetchone()[1].split(';')
            for i in range(len(arr)):
                arr[i] = arr[i].split(',')
            return Response({'sizes': arr})

        elif request.data.get('oper') == 'get_item_info_by_id':
            '''возвращаем инфу о товаре по его id ('id':x) -> ('description':x 'brand':x,'price':x,'photo_id':x,'name':x  '''
            arr = sql.execute(f"SELECT * FROM items WHERE id='{request.data.get('id')}'").fetchone()
            if not (arr):
                return Response({'answer': 0})
            slov = {'answer': 1, 'description': arr[-2], 'name': arr[1], 'brand': arr[3],
                    'price': arr[4]}
            folder_path = f'../frontend/public/img/item_photos/{arr[6]}'
            files = os.listdir(folder_path)
            first_file = f"/img/item_photos/{arr[6]}/" + files[0]
            slov['photo_id'] = first_file
            return Response(slov)

        elif request.data.get('oper') == 'clicked_tov_with_id':
            '''Добавляет в базу данных количество к популярности товара '''
            sql.execute(f"UPDATE items SET popular+1 WHERE id='{request.data.get('id')}'")
            article = sql.execute(f"SELECT * FROM items WHERE id='{request.data.get('id')}'").fetchone()
            sql.execute(f"INSERT INTO update ('article','date_time_ask') VALUES ('{article}','{dt.datetime.now()}')")
            db.commit()
            return Response()

        elif request.data.get('oper') == 'add_in_busket':
            '''По Id товара, размеру и почте добавляем в локальную БД заказ к пользователю'''
            slov = request.data
            tov_id = slov.get('id')
            size_of = slov.get('size')
            mail = slov.get('mail')
            sql.execute(f"INSERT INTO baskets ('mail','tov_id','size') VALUES ('{mail}','{tov_id}','{size_of}')")
            db.commit()
            return Response()

        elif request.data.get('oper') == 'delete_from_busket':
            '''По Id товара, размеру и почте удаляет из локальной БД заказ у пользователя           '''
            slov = request.data
            tov_id = slov.get('id')
            size_of = slov.get('size')
            mail = slov.get('mail')
            sql.execute(f"DELETE FROM baskets WHERE mail='{mail}' AND size='{size_of}' AND tov_id='{tov_id}'")
            db.commit()
            return Response()

        elif request.data.get('oper') == 'get_busket':
            ''' По почте возвращает список id и размера добавленного в корзину товара'''
            mail = request.data.get('mail')
            ans = {'ans': []}
            for info in sql.execute(f"SELECT * FROM baskets WHERE mail='{mail}'").fetchall():
                ans['ans'].append([info[1], info[2]])
            return Response(ans)

        elif request.data.get('oper') == 'get_cost_by_id_and_size':
            ''' Возвращаем цену товара по его id и size '''
            tov_id = request.data.get('id')
            size_of = request.data.get('size')
            sizes = sql.execute(f"SELECT * FROM sizes WHERE id='{tov_id}'").fetchone()
            for size, cost in sizes.split(';'):
                if size == size_of:
                    return Response({'cost': cost})

        elif request.data.get('oper') == 'add_like':
            '''Добавляет товар в избранное'''
            slov = request.data
            tov_id = slov.get('id')
            mail = slov.get('mail')
            sql.execute(
                f"INSERT INTO likes ('mail','tov_id','date') VALUES ('{mail}','{tov_id}','{dt.datetime.now()}')")
            db.commit()
            return Response()

        elif request.data.get('oper') == 'is_liked':
            '''добавлен ли товар с таким id в избранное'''
            slov = request.data
            tov_id = slov.get('id')
            mail = slov.get('mail')
            return Response(
                {'ans': bool(sql.execute(f"SELECT * FROM likes WHERE tov_id='{tov_id}' AND mail='{mail}'").fetchone())})

        elif request.data.get('oper') == 'liked_list':
            '''добавлен ли товар с таким id в избранное'''
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
            slov = request.data
            tov_id = int(slov.get('id'))
            mail = slov.get('mail')
            sql.execute(f"DELETE FROM likes WHERE mail='{mail}' AND tov_id='{tov_id}'")
            db.commit()
            return Response()

        elif request.data.get('oper') == 'send_apply_mail':
            '''Отправляет пользователю сообщение на почту для подтверждения почты'''
            slov = request.data
            mail = slov.get('mail')
            sql.execute(f"DELETE FROM mail_accept WHERE mail='{mail}'").fetchall()
            letters = string.ascii_letters
            code = ''.join(random.choice(letters) for i in range(15))
            sql.execute(f"INSERT INTO mail_accept ('mail','code') VALUES ('{mail}','{code}')")
            db.commit()
            text = f"Привет! твой код - {code}"

            smtp_server = smtplib.SMTP("smtp.yandex.ru", 587)
            smtp_server.starttls()
            smtp_server.login("Qwuorty@yandex.ru", "Pinkhjpf8642.!.")

            # Настройка параметров сообщения
            msg = MIMEMultipart()
            msg["From"] = "Qwuorty@yandex.ru"
            msg["To"] = mail
            msg["Subject"] = "Оповещение"

            msg.attach(MIMEText(text, "plain"))
            smtp_server.sendmail("Qwuorty@yandex.ru", mail, msg.as_string())
            return Response({'ans': True})

        elif request.data.get('oper') == 'check_correct_mail_code':
            '''Отправляет пользователю сообщение на почту для подтверждения почты'''
            slov = request.data
            return Response({'ans': bool(sql.execute(
                f"SELECT * FROM mail_accept WHERE mail='{slov.get('mail')}' AND code='{slov.get('code')}'").fetchone())})

        elif request.data.get('oper') == 'check_sign_in_user':
            '''Проверяет корректность пароля и почты для входа в ЛК'''
            slov = request.data
            return Response({'ans': bool(sql.execute(
                f"SELECT * FROM users WHERE mail='{slov.get('mail')}' AND password='{slov.get('password')}'").fetchone())})

        elif request.data.get('oper') == 'get_account_info_by_mail':
            '''Обновляет пароль для пользователя с почтой mail '''
            a = sql.execute(f"SELECT * FROM users WHERE mail = '{request.data.get('mail')}'").fetchone()
            print(a)
            arr = [0] * len(a)
            for i in range(len(a)):
                arr[i] = str(a[i])

            return Response(
                {'name': arr[3], 'surname': arr[4], 'age': arr[5], 'net': arr[6], 'phone': arr[7], 'address': arr[8],
                 'postcode': arr[9]})

        elif request.data.get('oper') == 'set_account_info_by_mail':
            '''Записывает всю информацию о аккаунте по названию почты(имя, фамилию, возраст, адрес, вк/тг?? '''
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
            slov = request.data
            sql.execute(
                f"INSERT INTO orders ('mail','name','surname','net','phone','address','postcode') VALUES ('{slov.get('mail')}','{slov.get('name')}',"
                f"'{slov.get('surname')}','{slov.get('net')}','{slov.get('phone')}','{slov.get('address')}','{slov.get('postcode')}')")
            db.commit()
            text = f"""
ВНИМАНИЕ, НОВЫЙ ЗАКАЗ ОТ пюсильки с номером телефона {slov['phone']}

"""
            for i in admins:
                requests.post(f'https://api.telegram.org/bot{TOK}/sendMessage?chat_id={i}&text={text}')

            return Response({'num': len(sql.execute(f"SELECT * FROM orders").fetchall())})

        elif request.data.get('oper') == 'get_order_by_num':
            '''Запрашивает все данные о заказе по его номеру: массив товаров и размеров, адрес, дата'''
            slov = request.data
            arr = sql.execute(f"SELECT * FROM orders WHERE id='{slov.get('num')}'").fetchone()
            return Response(
                {'mail': arr[1], 'name': arr[2], 'phone': arr[5], 'address': arr[6],
                 'postcode': arr[7]})


        elif request.data.get('oper') == 'get_order_story':
            '''Запрашивает историю заказов по почте'''
            slov = request.data
            arr = sql.execute(f"SELECT * FROM orders WHERE mail='{slov.get('mail')}'").fetchall()
            print([i[0] for i in arr], slov.get('mail'))
            return Response({'nums': [i[0] for i in arr]})


        # if request.method == 'GET':
        #     serializer = UserSerializer(User.objects.all(), many=True)
        #     return Response(serializer.data)
