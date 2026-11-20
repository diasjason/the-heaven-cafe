// One official destination shared by every WhatsApp entry point.
export const OFFICIAL_CONTACT={
 phone:'+917219487686',whatsapp:'+918767846783',email:'theheavencafe31@gmail.com',
 address:'Shop No. 04, 05, 06 and 07, Kauls Heritage City, Bhabola, Vasai West, Maharashtra – 401202, India.',
 hours:'Monday to Sunday: 11:00 AM – 11:00 PM',
 maps:'https://www.google.com/maps/dir/?api=1&destination=Shop%20No.%2004%2C%2005%2C%2006%20and%2007%2C%20Kauls%20Heritage%20City%2C%20Bhabola%2C%20Vasai%20West%2C%20Maharashtra%20401202',
 instagram:'https://www.instagram.com/theheavencafevasai/',facebook:'https://www.facebook.com/profile.php?id=61596136732219'
};
export const WHATSAPP_BASE='https://wa.me/918767846783';
export const DEFAULT_MESSAGE='Hello The Heaven Cafe! I would like to know more about your menu and place an order.';
export const WHATSAPP_URL=WHATSAPP_BASE+'?text='+encodeURIComponent(DEFAULT_MESSAGE);
export const CONTACT_VERSION='official-contact-2026-11-16-v1';
export const phoneLabel=(value)=>{const digits=String(value||'').replace(/\D/g,'');return digits.length===12&&digits.startsWith('91')?'+91 '+digits.slice(2):value};
export const phoneURL=(value)=>'tel:+'+String(value||'').replace(/\D/g,'');
export const mapEmbedURL=(address)=>'https://maps.google.com/maps?q='+encodeURIComponent(String(address||OFFICIAL_CONTACT.address).replace(' – ',' ').replace(/\.$/,''))+'&z=17&output=embed';
const amount=(value)=>'₹'+(Number(value||0)/100).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});
export function orderWhatsAppURL(o){
 if(!o?.id||!o.code||!o.token||!Array.isArray(o.items)||!o.items.length)throw new Error('Save your order before sharing it on WhatsApp.');
 const message=['Hello The Heaven Cafe! Here are my saved order details.',`Order ID: ${o.code}`,`Customer name: ${o.name}`,`Mobile number: ${o.phone}`,`Order type: ${o.type}`,'Food items:',...o.items.map(i=>`${i.quantity} × ${i.name}${i.variant?' ('+i.variant+')':''}\n  Add-ons: ${i.addons?.length?i.addons.map(a=>a.name).join(', '):'None'} — ${amount(i.line)}`),`Subtotal: ${amount(o.subtotal)}`,`Tax: ${amount(o.tax)}`,`Delivery fee: ${amount(o.deliveryFee)}`,`Discount: ${amount(o.discount)}`,`Total amount: ${amount(o.total)}`,`Payment method: ${o.method}`,`Payment status: ${o.payment}`,o.address?`Delivery address: ${o.address}${o.pincode?', '+o.pincode:''}`:'',o.landmark?`Landmark: ${o.landmark}`:'',o.table?`Table number: ${o.table}`:'',o.instructions?`Special instructions: ${o.instructions}`:''].filter(Boolean).join('\n');
 return WHATSAPP_BASE+'?text='+encodeURIComponent(message);
}
// Patch only contact keys, in an atomic batch. Repeated visits never reset later owner edits.
export async function applyContactDetails(db){
 if(await db.prepare('SELECT data FROM settings WHERE id=?').bind(CONTACT_VERSION).first())return;
 const update=db.prepare("INSERT INTO settings(id,data) SELECT 'main',? WHERE NOT EXISTS(SELECT 1 FROM settings WHERE id=?) ON CONFLICT(id) DO UPDATE SET data=json_patch(settings.data,excluded.data)").bind(JSON.stringify(OFFICIAL_CONTACT),CONTACT_VERSION);
 const marker=db.prepare('INSERT INTO settings(id,data) VALUES(?,?) ON CONFLICT(id) DO NOTHING').bind(CONTACT_VERSION,JSON.stringify({appliedAt:new Date().toISOString()}));
 await db.batch([update,marker]);
}

// The owner-supplied map pin is deliberately scoped to the map section only.
export const MAP_LOCATION={url:'https://maps.app.goo.gl/CXNyxCeYYCMv8xKR8',embed:'https://maps.google.com/maps?q=19.3691707,72.8135818&z=18&output=embed'};
