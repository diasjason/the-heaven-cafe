import json,hashlib,fitz,sys
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parents[1]
src=Path(sys.argv[1]) if len(sys.argv)>1 else root/'source/The_HeavenCafe_Complete_Menu.pdf'
doc=fitz.open(src)
# Coordinates refer to reviewed 1400px-wide page renderings. No artwork is redrawn.
crops={
'logo':(2,(475,25,935,385)),
'hero-menu':(1,(20,1210,1395,1975)),
'milk-tea':(2,(1045,1180,1395,1805)),
'garlic-bread':(3,(805,338,1395,805)),
'burger':(3,(800,814,1395,1250)),
'sandwich':(3,(805,1320,1395,1800)),
'bun-maska':(4,(780,340,1395,715)),
'mojito':(4,(780,749,1395,1100)),
'lemonade':(4,(780,1115,1395,1410)),
'non-alcoholic':(4,(780,1450,1395,1850)),
'shake':(5,(850,405,1395,1030)),
'detox':(5,(850,1050,1395,1390)),
'cold-coffee':(5,(850,1410,1395,1790)),
'wrap':(6,(875,640,1395,1140)),
'pasta':(6,(860,1220,1395,1790)),
'veg-pizza':(7,(910,650,1395,1235)),
'chicken-pizza':(7,(910,1310,1395,1860)),
'momos':(8,(65,603,690,815)),
'maggi':(8,(750,645,1395,820)),
'fries':(8,(70,1140,690,1320)),
'quick-bites':(8,(775,1245,1395,1400)),
'combos':(8,(70,1730,710,1905)),
'extras':(8,(795,1755,1075,1890)),
'special':(9,(970,418,1395,820)),
'smoothy':(9,(765,1015,1395,1320)),
'dessert':(9,(735,1410,1395,1925)),
}
for name,(page,box) in crops.items():
 p=doc[page-1]; scale=p.rect.width/1400; clip=fitz.Rect(*(v*scale for v in box));pix=p.get_pixmap(matrix=fitz.Matrix(3.5,3.5),clip=clip,alpha=False)
 im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
 im.thumbnail((1500,1500))
 if name=='logo': im.save(root/'public/images/heaven-cafe-logo.png',optimize=True)
 else: im.save(root/f'public/images/menu/{name}.webp',quality=88,method=6)
# Preserve all pages and their order, while making the downloadable copy manageable.
out=fitz.open()
for page in doc:
 pix=page.get_pixmap(matrix=fitz.Matrix(1800/page.rect.width,1800/page.rect.width),alpha=False)
 im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
 import io
 b=io.BytesIO();im.save(b,format='JPEG',quality=88,optimize=True)
 p=out.new_page(width=page.rect.width,height=page.rect.height);p.insert_image(p.rect,stream=b.getvalue())
out.save(root/'public/menu/The_HeavenCafe_Complete_Menu.pdf',deflate=True)
print('Extracted',len(crops),'original artwork assets; preserved',len(out),'PDF pages')
