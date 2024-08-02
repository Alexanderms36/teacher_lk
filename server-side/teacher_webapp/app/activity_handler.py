import json
import random
import math
from django.conf import settings


def handle(activity_name):
    with open(f'{settings.MEDIA_ROOT}/activity_bg_pic/dict.json', 'r', encoding='utf-8') as file:

        try:
            pic_list = json.load(file)
            return pic_list[activity_name]
        
        except:
            return f"{13 + math.floor(random.random() * 9)}.jpg"
    