ans = 0
s = 3
f = 25
arr = [s]
d = set()
while len(arr) != 0:
    frst = arr.pop(0)
    if frst%2 ==0 and frst<25:
        d.add(frst)
    if frst<f+10:
        arr.append(frst+3)
        arr.append(frst*3)
for i in d:
    print(i)


# import time
# import uiautomator2 as u
# import re
#
# keys = [('nike',4)]
# cnt = 0
#
# '''Подключаемся к устроуству'''
# d = u.connect('5203c5ceec46a38f')
#
#
# '''Нажимаем кнопку поиска'''
# d.xpath('//*[@resource-id="com.shizhuang.duapp:id/collapseSearchArea"]').click_exists(timeout=0.1)
#
#
# d.send_keys(keys[cnt][0])
# d.xpath('//*[@resource-id="com.shizhuang.duapp:id/tvComplete"]').click_exists(timeout=0.1) #нажимаем enter
# time.sleep(2)
# j = 1
#
# def get_name():
#     '''Получаем имя товара'''
#     tmp = d.dump_hierarchy().split('\n')
#     arr = []
#     for i in tmp:
#         if keys[cnt][0].lower() in i.lower():
#             arr.append(i)
#     name = None
#     for i in arr[0].split("'"):
#         if keys[cnt][0].lower() in i.lower():
#             name = i
#             break
#     return name
#
# def swipe_if_need():
#     '''Пропускаем первый товар, если он - это 3д модель товара'''
#     if (d.xpath('//*[@resource-id="com.shizhuang.duapp:id/threeDBtn"]').exists): #если первая картина с 3d
#         d.swipe_ext('left')
#
# def download_images():
#     '''Скачивает все картинки, начиная с той, на которой сейчас находимся'''
#     tmp = (d.xpath('//*[@resource-id="com.shizhuang.duapp:id/itemIndicator"]').get_text()).split('/')
#     d.xpath('//*[@resource-id="com.shizhuang.duapp:id/itemPullLayout"]').click_exists(timeout=0.1)  # открываем картинку
#     time.sleep(1)
#     d.screenshot(f'{keys[cnt][0]}_{j}_{0}.png')
#     for i in range(int(tmp[1]) - int(tmp[0])):
#         d.swipe_ext('left')
#         d.screenshot(f'photos/{keys[cnt][0]}_{j}_{i + 1}.png')  # делаем скрин
#         time.sleep(0.2)
#     d.swipe_ext('down')
#
#
# def get_sizes():
#     d.xpath('//*[@resource-id="com.shizhuang.duapp:id/buyButtonContainer"]').click_exists(timeout=0.1)
#     sizes = []
#     add = 1
#     swip = 1
#     while (add != 0):
#         time.sleep(1)
#         add = 0
#         text = d.dump_hierarchy()
#         matches = re.findall(r'text="(.*?)"', text)
#         for i in range(len(matches)):
#             if '¥' in matches[i] and matches[i - 1] != '' and (matches[i - 1], matches[i]) not in sizes:
#                 sizes.append((matches[i - 1], matches[i]))
#                 add += 1
#         d.swipe_ext('up')
#         swip += 1
#     return sizes
#
# for l in range(keys[cnt][1]):
#     d.xpath(f'//*[@resource-id="com.shizhuang.duapp:id/recyclerView"]/android.view.ViewGroup[{j}]').click_exists(timeout=0.1) #нажимаем первый товар
#     name = get_name()
#     time.sleep(0.3)
#     swipe_if_need()
#     download_images()
#     time.sleep(1)
#     sizes = get_sizes()
#
#
#
#     d.xpath('//*[@resource-id="com.shizhuang.duapp:id/closeIcon"]').click_exists(timeout=0.1)
#     time.sleep(0.5)
#     d.xpath('//*[@resource-id="com.shizhuang.duapp:id/homeAsUpBtn"]').click_exists(timeout=0.1)
#     print(sizes)
#     j+=1
