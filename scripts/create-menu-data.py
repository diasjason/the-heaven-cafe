import json,hashlib
from pathlib import Path
root=Path(__file__).resolve().parents[1]
products=[];addons=[];source_rows=[]
images={
'Milk Based Tea':'milk-tea','Non Milk Base Tea':'milk-tea','Stuffed Garlic Bread':'garlic-bread','Burger':'burger','Grilled Sandwich':'sandwich','Bun Maska':'bun-maska','Mojito':'mojito','Lemonade':'lemonade','Non Alcoholic':'non-alcoholic','Shake':'shake',"Heaven's Detox":'detox','Cold Coffee':'cold-coffee','Wrap':'wrap','Pasta':'pasta','Veg Pizza':'veg-pizza','Chicken Pizza':'chicken-pizza','Momos':'momos','Maggi':'maggi','French Fries':'fries','Quick Bites':'quick-bites','Combos':'combos','Extra Add Ons':'extras',"Heaven's Special Dish":'special','Smoothy':'smoothy','Dessert':'dessert'}
def add(category,page,rows,options=None):
 for line in rows.strip().split('\n'):
  parts=line.split('|');name=parts[0];prices=[None if x=='—' else int(x) for x in parts[1:]]
  source_rows.append({'page':page,'category':category,'name':name,'prices':prices,'kind':'item'})
  diet='nonveg' if ('Chicken' in name or name.startswith(('Chi.','Chic.')) or 'Chi. or' in name) else 'veg' if ('Veg' in name and 'Non Veg' not in name or category=='Veg Pizza' and 'Non Veg' not in name) else 'unspecified'
  if 'Veg or Non Veg' in name or 'Chi. or Paneer' in name:diet='unspecified'
  if len(prices)==2:variants=[{'name':'Small','price':prices[0]},{'name':'Large','price':prices[1]}]
  else:variants=[{'name':'Regular','price':prices[0]}]
  if options and name in options:variants=[{'name':v,'price':prices[0]} for v in options[name]]
  products.append({'id':'hc-menu-'+hashlib.sha256((category+'|'+name).encode()).hexdigest()[:16],'name':name,'category':category,'description':'','image':'/images/menu/'+images[category]+'.webp','diet':diet,'available':None not in prices,'pricePending':None in prices,'variants':variants,'addons':[],'sourcePage':page,'sortOrder':len(products),'source':'The_HeavenCafe_Complete_Menu.pdf','artwork':True})
def addon(category,page,name,price):
 source_rows.append({'page':page,'category':category,'name':name,'prices':[price],'kind':'addon'})
 addons.append({'category':category,'page':page,'name':name,'price':price})
 for p in products:
  if p['category']==category:p['addons'].append({'name':name,'price':price})
add('Milk Based Tea',2,'''Local Tea|30|50
GTC Signature Tea|45|60
Ginger Tea|45|60
Kadak Tea|45|60
Burj Khalifa|45|60
Paan Tea|45|60
Bombay Tea|45|60
Chocolate Tea|45|60
Rajwada Tea|45|60
Elaichi Tea|45|60
Kesar Elaichi Tea|45|60
Gur Tea|45|60
Rose Tea|45|60
Strawberry Tea|45|60
Masala Tea|45|60''')
add('Non Milk Base Tea',2,'''Green Tea|50
Ginger Honey Tea|60
Black Tea (Lemon)|49''')
add('Stuffed Garlic Bread',3,'''Butter Stuffed Garlic Bread|170
Jalapeno and Corn|185
Chicken Stuffed Garlic Bread|195
BBQ Chicken Stuffed Garlic|220''')
add('Burger',3,'''Aloo Tikki Burger|99
Spicy Veg Burger|120
Crispy Veg Burger|159
Tandoori Paneer Burger|179
Grilled Chicken Burger|190
Spicy Chicken Burger|170''')
addon('Burger',3,'Add Cheese Slice / Peri Peri',40)
add('Grilled Sandwich',3,'''Veg Grilled Sandwich|150
Tandoori Paneer Grilled Sandwich|179
Spicy Veg Grilled Sandwich|199
Chicken Grilled Sandwich|199
Cheese Corn Sandwich|179
Masala Cheese Toast Sand.|165
Spicy Chicken Grilled Sandwich|249
Makhni Chi. or Paneer|299''',{'Makhni Chi. or Paneer':['Chicken','Paneer']})
addon('Grilled Sandwich',3,'Add Cheese Slice',40)
add('Bun Maska',4,'''Butter Bun (Grilled Option)|35
Masala Bun|40
Chocolate Bun|49
Jam Bun|49
Croutons|—''')
add('Mojito',4,'''Classic Mojito|150
Peach Mojito|199
Green Apple Mojito|209
Strawberry Mojito|219
Kiwi Mojito|219
Orange Mojito|199''')
add('Lemonade',4,'''Lime Lemonade|—
Peach Lemonade|—
Green Apple Lemonade|—
Orange Lemonade|—''')
add('Non Alcoholic',4,'''Non Alcoholic Beer|—
Non Alcoholic Vodka|—
Non Alcoholic Whisky|—
Non Alcoholic Jack Daniels|—
Non Alcoholic Red Wine|—
Non Alcoholic LIIT|—''')
add('Shake',5,'''Strawberry Shake|190
Banana Shake|120
Vanilla Shake|110
Mango Shake|170
Butterscotch Shake|180
Brownie Shake|190
Choco Oreo Shake|165
Dubai Shake|180''')
addon('Shake',5,'Add Ice Cream',40)
add("Heaven's Detox",5,'''Pink Detox|259
Purple|239
Green Detox|249
Pink Cooler|249''')
add('Cold Coffee',5,'''Classic Cold Coffee|159
Choco Strong Coffee|239
Hazelnut Cold Coffee|270
Caramel Cold Coffee|249
Irish Cold Coffee|249''')
addon('Cold Coffee',5,'Add Ice Cream',40)
add('Wrap',6,'''Veg Wrap (Noodle)|120
Tandoori Paneer Wrap|149
Spicy Veg Wrap|130
Grilled Chicken Wrap|159
Tandoori Chicken Wrap|170
BBQ Chicken Wrap|180''')
add('Pasta',6,'''Red Sauce Pasta|259
White Sauce Pasta|279
Mushroom Pasta|269
Pesto Souse Pasta|289
Mac. & Cheese Pasta|289
Mix Sauce Pasta|279''')
addon('Pasta',6,'Add Chicken',50)
add('Veg Pizza',7,'''Single Topping Pizza|210
Classic Margherita Pizza|149
Farm House|299
Tandoori Paneer Pizza|279
Makhni Pizza (Veg or Non Veg)|309
Chilli Paneer Pizza|249
BBQ Veg Pizza|299''',{'Single Topping Pizza':['Corn','Capsicum','Mushroom','Paneer','Tomato','Jalapeno','Paprika','Onion'],'Makhni Pizza (Veg or Non Veg)':['Veg','Non Veg']})
next(p for p in products if p['name']=='Single Topping Pizza')['description']='Choose any topping: corn, capsicum, mushroom, paneer, tomato, jalapeno, paprika, onion'
next(p for p in products if p['name']=='Single Topping Pizza')['variantLabel']='Choose your topping'
next(p for p in products if p['name']=='Makhni Pizza (Veg or Non Veg)')['variantLabel']='Choose your preparation'
next(p for p in products if p['name']=='Makhni Chi. or Paneer')['variantLabel']='Choose your preparation'
addon('Veg Pizza',7,'Add Extra Cheese',40)
add('Chicken Pizza',7,'''Tandoori Chicken Pizza|299
Smoky Chicken Pizza|320
Peri Peri Chi. Pizza|330
Chi. Supreme|349
Chi. Sausage|349
Chic. Pepperoni|359''')
add('Momos',8,'''Veg Steam Momo|149
Paneer Steam Momo|170
Chicken Steam Momo|190
Kurkure Coating|199''')
# Keep this row and its printed price exactly; clarify its preparation before opening orders.
next(p for p in products if p['name']=='Kurkure Coating')['clarification']='Confirm whether ₹199 is a complete dish price or an additional coating charge.'
add('Maggi',8,'''Plain Maggi|65
Veg Maggi|99
Tandoori Paneer Maggi|149
Sezwan Maggi|129''')
addon('Maggi',8,'Add Chicken',60)
add('French Fries',8,'''Salted French Fries|199
Masala Fries|249
Peri Peri Fries|249
Cheese Loaded|299''')
add('Quick Bites',8,'''Hara Bhara Kabab (6 PCS)|179
Veg Spring Roll|149
Chi. Popcorn|199
Potato Shots|149
Chic. Kabab (Cheese 6 pcs)|249
Potato Cheese Ball|179
Corn Cheese Ball (6 balls)|199''')
add('Combos',8,'''Sandwich + Fries + Soft Drink|210
Any Burger + Fries + Soft Drink|199
Any Small Pizza + Garlic Bread + Soft Drink|289
Momo + Fries + Mojito / Soft Drink|249
Pasta + Garlic Bread + Iced Tea / Soft Drink|299
Wrap + Fries + Iced Tea / Soft Drink / Cold Coffee|199''')
add('Extra Add Ons',8,'''Dip|40
Vegetable|40
Water Bottle|—
Soft Drink|—
Energy Drink|—''')
add("Heaven's Special Dish",9,'''Quesadilla (Mexican Dish)|349
Chicken Balls|249
Chicken Breast|375
Chicken Cremy Pesto|399
Mashroom Cremy Pesto|449
Chicken Thigh Roasted Salad|499
Falafal Hummus|299
Mushroom Roasted Salad|249''')
next(p for p in products if p['name']=='Quesadilla (Mexican Dish)')['description']='red hot souce, paneer, chicken, veg.'
add('Smoothy',9,'''Pink Bowl|350
Yellow Bowl|350''')
add('Dessert',9,'''Custurd Caramel|70
Brownie with Icecream|299
Hazelnut Choco Muse|199
Oreo Fudge|329
Apple Scrumbal|350''')
categories=list(images)
data={'version':'heaven-menu-2026-11-16-v1','source':'The_HeavenCafe_Complete_Menu.pdf','pageCount':9,'products':products,'categories':categories,'addons':addons,'sourceRows':source_rows,'pricePending':[p['name'] for p in products if p['pricePending']],'notes':['Fourteen original rows have no price; no amounts were inferred.','Original names and spelling are preserved.','Menu artwork represents categories and may differ from individual servings.','Kurkure Coating pricing basis needs owner confirmation.','Combo component choices and pizza sizes require owner confirmation before ordering opens.'],'branding':{'logo':'/images/heaven-cafe-logo.png','hero':'/images/menu/hero-menu.webp','aboutImage':'/images/menu/sandwich.webp','menuPdf':'/menu/The_HeavenCafe_Complete_Menu.pdf'}}
photo_file=root/'data/product-photos.json'
if photo_file.exists():
 photo_data=json.loads(photo_file.read_text());by_id={p['id']:p for p in photo_data['photos']}
 for p in products:
  d=by_id.get(p['id'])
  if d:
   p.update(image=d['image'],artwork=False,photoSource=d['source_url'],photoMatch=d['match_note'],photoPosition=d.get('object_position','50% 50%'))
   if d.get('supplement'):p['photoSupplement']=d['supplement']
 data['branding']['logo']='/images/heaven-cafe-logo-transparent.webp'
(root/'data/heaven-menu.json').write_text(json.dumps(data,indent=2,ensure_ascii=False)+'\n')
print(json.dumps({'products':len(products),'categories':len(categories),'source_rows':len(source_rows),'addon_rows':len(addons),'missing_prices':len(data['pricePending']),'by_category':{c:sum(p['category']==c for p in products) for c in categories}},indent=2))
