import PHOTOS from '../data/product-photos.json' with {type:'json'};
export async function applyVisualAssets(db){
 const marker='visual-assets-'+PHOTOS.version;
 if(await db.prepare('SELECT data FROM settings WHERE id=?').bind(marker).first())return;
 const current=await db.prepare('SELECT data FROM settings WHERE id=?').bind('main').first();const c=current?JSON.parse(current.data):{};
 const update=db.prepare("UPDATE products SET data=json_set(products.data,'$.image',json_extract(p.value,'$.image'),'$.artwork',json('false'),'$.photoSource',json_extract(p.value,'$.source_url'),'$.photoMatch',json_extract(p.value,'$.match_note'),'$.photoSupplement',json_extract(p.value,'$.supplement'),'$.photoPosition',COALESCE(json_extract(p.value,'$.object_position'),'50% 50%')) FROM json_each(?) p WHERE products.id=json_extract(p.value,'$.id') AND (json_extract(products.data,'$.image') LIKE '/images/menu/%' OR json_extract(products.data,'$.image') LIKE '/images/items/%') AND NOT EXISTS(SELECT 1 FROM settings WHERE id=?)").bind(JSON.stringify(PHOTOS.photos),marker);
 const next={...c};if(!next.logo||next.logo==='/images/heaven-cafe-logo.png')next.logo='/images/heaven-cafe-logo-transparent.webp';
 if(next.gallery?.length&&next.gallery.every(g=>g.url.startsWith('/images/menu/'))){const sample=['Aloo Tikki Burger','Classic Cold Coffee','Classic Margherita Pizza','Veg Grilled Sandwich','Classic Mojito','Brownie with Icecream'];next.gallery=sample.map(name=>{const p=PHOTOS.photos.find(p=>p.name===name);return {url:p.image,caption:name+' · representative photograph'}})}
 next.photoVersion=PHOTOS.version;
 const settings=db.prepare('UPDATE settings SET data=? WHERE id=? AND data=?').bind(JSON.stringify(next),'main',current?.data||'');
 const stamp=db.prepare('INSERT INTO settings(id,data) VALUES(?,?) ON CONFLICT(id) DO NOTHING').bind(marker,JSON.stringify({version:PHOTOS.version,updatedAt:new Date().toISOString(),count:PHOTOS.photos.length}));
 await db.batch([update,settings,stamp]);
}
