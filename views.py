from django.shortcuts import render
import random
import sqlite3
import os
import string
from PIL import Image, ImageDraw, ImageFont
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_200_OK
import re
from .models import User
from .serializers import UserSerializer


def home(request):
    return render(request, 'home.html')


@api_view(['GET', 'POST'])
def users_list(request):
    if request.method == 'POST':  # если это запрос к api от фронта

        db = sqlite3.connect('local_db.db', check_same_thread=False)
        sql = db.cursor()


        if request.data.get('oper') == 'user_exist':  # проверяем, зарегестрирован ли пользователь  ('mail':'x') ->{'exist':true/false}
            arr = User.objects.all()
            ans = 0
            m = request.data.get('mail')
            for i in arr:
                if i.mail == m:
                    ans = 1
                    break
            return Response({'exist': ans})


        elif request.data.get('oper') == 'get_cost_by_id_and_size':  # регистрируем пользователя, ('mail':x,'password':x) -> None
            id = request.data.get('id')
            size = request.data.get('size')
            sizes = sql.execute(f"SELECT * FROM sizes WHERE id = '{id}'").fetchone()
            for i in sizes[1].split(';'):
                sz,cost = i.split(',')
                if(str(sz) == str(size)):
                    return Response({'cost':cost})
            return Response()


        elif request.data.get('oper') == 'reg_user':  # регистрируем пользователя, ('mail':x,'password':x) -> None
            mail = request.data.get('mail')
            pwrd = request.data.get('password')
            todo = User.objects.create(mail=mail, password=pwrd)
            serializer = UserSerializer(todo, many=False)
            return Response(serializer.data)

        elif request.data.get('oper') == 'check_correct_mail':  # проверям корректность введённой почты, ('mail':x) -> 1/2/3
            mail = request.data.get('mail')
            arr = User.objects.all()
            pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if re.match(pattern, mail) and len(mail) != '':
                for i in arr:
                    if i.mail == mail:
                        return Response({'answer': '2', 'msg': 'already_in'})
                return Response({'answer': '3', 'msg': "ok"})
            else:
                return Response({'answer': '1', 'msg': 'incorrect text'})
            return Response({'answer': '3', 'msg': "ok"})

        elif request.data.get('oper') == 'create_captcha':  # создаём капчу ('mail':x) -> 1/2/3
            words = ["шузы", "ньюрок", "джазик", "бебра", "трэвис", 'боты', 'пися', 'попа']

            # путь к папке с изображениями
            img_folder = "media/img"

            # путь к папке для сохранения измененных изображений
            output_folder = "../frontend/public/img/captcha"

            # выбираем случайное слово из списка
            random_word = random.choice(words)

            # получаем список файлов в папке с изображениями
            img_files = os.listdir(img_folder)

            # выбираем случайное изображение
            random_img = random.choice(img_files)

            # открываем выбранное изображение
            img = Image.open(os.path.join(img_folder, random_img))

            # добавляем текст на изображение в случайном месте и с углом
            draw = ImageDraw.Draw(img)
            font_size = 50
            font = ImageFont.truetype("arial.ttf", font_size)  # замените на путь к файлу шрифта и размер шрифта

            # Получаем размер текста
            text_width, text_height = font_size + 10, font_size * len(random_word) + 10

            # определяем размеры изображения
            image_width, image_height = img.size

            # выбираем случайные координаты для размещения текста
            x = random.randint(0, image_width - text_width)
            y = random.randint(0, image_height - text_height)

            # выбираем случайный угол поворота текста (в пределах читаемости)
            # angle = random.randint(-30, 30)
            angle = -20
            # добавляем текст на изображение
            draw.text((x, y), random_word, (255, 0, 0), font=font,
                      angle=-45)  # координаты, цвет текста и угол поворота

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
            sql.execute("INSERT INTO 'captcha' ('direct','key') VALUES (?,?)", (random_string, random_word))
            db.commit()
            return Response({'name': random_string})

        elif request.data.get('oper') == 'check_captcha':
            '''   Проверяем капчу ('user_input':'x','photo':x) -> 'ans':true/false   '''
            user_input = request.data.get('user_input')
            photo = request.data.get('photo')
            print(user_input, photo)
            return Response({'ans': bool(
                sql.execute(f"SELECT * FROM 'captcha' WHERE direct='{photo}' AND key='{user_input}'").fetchall())})

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
            slov = {'answer': 1, 'description': arr[1].split(';')[1], 'name': arr[1].split(';')[0], 'brand': arr[3],
                    'price': arr[4]}
            folder_path = f'../frontend/public/img/item_photos/{arr[6]}'
            files = os.listdir(folder_path)
            first_file = f"/img/item_photos/{arr[6]}/" + files[0]
            slov['photo_id'] = first_file
            return Response(slov)

        elif request.data.get('oper') == 'clicked_tov_with_id':
            '''Добавляет в базу данных количество к популярности товара '''
            sql.execute(f"UPDATE items SET popular+1 WHERE id='{request.data.get('id')}'")
            return Response()


        if request.method == 'GET':
            serializer = UserSerializer(User.objects.all(), many=True)
            return Response(serializer.data)
