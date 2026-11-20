import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {applyVisualAssets} from '../lib/visual-assets.js';
const photos=JSON.parse(readFileSync('data/product-photos.json')).photos;
const sql=new DatabaseSync(':memory:');sql.exec(readFileSync('drizzle/0000_sleepy_korath.sql','utf8').replaceAll('--> statement-breakpoint',''));
class Stmt{constructor(s,args=[]){this.s=s;this.args=args}bind(...a){return new Stmt(this.s,a)}async first(){return sql.prepare(this.s).get(...this.args)||null}async run(){const r=sql.prepare(this.s).run(...this.args);return {meta:{changes:Number(r.changes)}}}}
const db={prepare:s=>new Stmt(s),async batch(statements){sql.exec('BEGIN');try{for(const s of statements)sql.prepare(s.s).run(...s.args);sql.exec('COMMIT')}catch(e){sql.exec('ROLLBACK');throw e}}};
const first={id:photos[0].id,name:photos[0].name,image:'/images/menu/milk-tea.webp',variants:[{name:'Owner size',price:123}],available:false,addons:[{name:'Owner extra',price:17}]};
const second={id:photos[1].id,name:photos[1].name,image:'/api/media/owner-original-photo',variants:[{name:'Owner size',price:99}]};
for(const p of [first,second])sql.prepare('INSERT INTO products(id,data) VALUES(?,?)').run(p.id,JSON.stringify(p));
const c={logo:'/images/heaven-cafe-logo.png',phone:'9000000000',ordering:false,gallery:[{url:'/api/media/owner-gallery',caption:'Owner original'}]};sql.prepare('INSERT INTO settings(id,data) VALUES(?,?)').run('main',JSON.stringify(c));
await applyVisualAssets(db);let a=JSON.parse(sql.prepare('SELECT data FROM products WHERE id=?').get(first.id).data);assert.equal(a.image,photos[0].image);assert.deepEqual(a.variants,first.variants);assert.deepEqual(a.addons,first.addons);assert.equal(a.available,false);assert.equal(a.photoSource,photos[0].source_url);assert.equal(a.artwork,false);
let b=JSON.parse(sql.prepare('SELECT data FROM products WHERE id=?').get(second.id).data);assert.equal(b.image,second.image);const settings=JSON.parse(sql.prepare('SELECT data FROM settings WHERE id=?').get('main').data);assert.equal(settings.phone,c.phone);assert.equal(settings.ordering,false);assert.deepEqual(settings.gallery,c.gallery);assert.equal(settings.logo,'/images/heaven-cafe-logo-transparent.webp');
a.image='/api/media/owner-later';sql.prepare('UPDATE products SET data=? WHERE id=?').run(JSON.stringify(a),a.id);await applyVisualAssets(db);a=JSON.parse(sql.prepare('SELECT data FROM products WHERE id=?').get(a.id).data);assert.equal(a.image,'/api/media/owner-later');
assert.equal(photos.length,144);assert.equal(new Set(photos.map(p=>p.image)).size,144);assert.equal(new Set(photos.map(p=>p.sha256)).size,144);console.log('PASS: photo migration preserves menu prices, add-ons, sold-out status, owner uploads, contacts, gallery and ordering settings; repeat visits preserve later edits; 144 unique photo mappings.');
