import { DatabaseSync } from 'node:sqlite';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {importOriginalMenu,handleAPI} from '../lib/backend.js';
const sql=new DatabaseSync(':memory:');sql.exec(readFileSync('drizzle/0000_sleepy_korath.sql','utf8').replaceAll('--> statement-breakpoint',''));
class Stmt{constructor(s,args=[]){this.s=s;this.args=args}bind(...a){return new Stmt(this.s,a)}async first(){return sql.prepare(this.s).get(...this.args)||null}async all(){return {results:sql.prepare(this.s).all(...this.args)}}async run(){const r=sql.prepare(this.s).run(...this.args);return {meta:{changes:Number(r.changes),last_row_id:Number(r.lastInsertRowid)}}}}
const DB={prepare:s=>new Stmt(s),async batch(stmts){sql.exec('BEGIN');try{const out=[];for(const s of stmts){const r=sql.prepare(s.s).run(...s.args);out.push({meta:{changes:Number(r.changes),last_row_id:Number(r.lastInsertRowid)}})}sql.exec('COMMIT');return out}catch(e){sql.exec('ROLLBACK');throw e}}};
const fixture=JSON.parse(readFileSync('data/heaven-menu.json','utf8'));
const originalConfig={phone:'9000000000',logo:'/api/media/owner-original',hero:'/api/media/owner-hero',ordering:false,takeaway:true,dinein:false};sql.prepare('INSERT INTO settings(id,data) VALUES(?,?)').run('main',JSON.stringify(originalConfig));
await Promise.all([importOriginalMenu(DB),importOriginalMenu(DB)]);
assert.equal(JSON.parse(sql.prepare('SELECT data FROM settings WHERE id=?').get('main').data).phone,originalConfig.phone);
const catalog=await (await handleAPI(new Request('https://cafe.test/api/catalog'),{DB})).json();
assert.equal(catalog.products.length,144);assert.equal(catalog.config.categories.length,25);assert.equal(fixture.sourceRows.length,151);assert.equal(fixture.addons.length,7);
assert.equal(catalog.config.logo,originalConfig.logo);assert.equal(catalog.config.hero,originalConfig.hero);assert.equal(catalog.config.phone,'+917219487686');assert.equal(catalog.config.ordering,false);
const expectedCounts=[15,3,4,6,8,5,6,4,6,8,4,5,6,6,7,6,4,4,4,7,6,5,8,2,5];catalog.config.categories.forEach((c,i)=>assert.equal(catalog.products.filter(p=>p.category===c).length,expectedCounts[i],c));
const pending=catalog.products.filter(p=>p.pricePending);assert.equal(pending.length,14);assert.ok(pending.every(p=>p.available===false&&p.variants[0].price===null));
const local=catalog.products.find(p=>p.name==='Local Tea');assert.deepEqual(local.variants,[{name:'Small',price:30},{name:'Large',price:50}]);
assert.equal(catalog.products.find(p=>p.name==='Irish Cold Coffee').variants[0].price,249);
assert.equal(catalog.products.find(p=>p.name==='Pesto Souse Pasta').variants[0].price,289);
assert.equal(catalog.products.find(p=>p.name==='Makhni Chi. or Paneer').variants.length,2);
assert.equal(catalog.products.find(p=>p.name==='Single Topping Pizza').variants.length,8);
assert.ok(catalog.products.find(p=>p.name==='Classic Cold Coffee').addons.some(a=>a.name==='Add Ice Cream'&&a.price===40));
for(const row of fixture.sourceRows){if(row.kind==='item'){const p=catalog.products.find(p=>p.category===row.category&&p.name===row.name);assert.ok(p,row.name);if(row.prices.length===2)assert.deepEqual(p.variants.map(v=>v.price),row.prices);else assert.ok(p.variants.every(v=>v.price===row.prices[0]),row.name)}else{assert.ok(catalog.products.filter(p=>p.category===row.category).every(p=>p.addons.some(a=>a.name===row.name&&a.price===row.prices[0])),row.name)}}
const first=catalog.products[0];const edited={...first,variants:[{name:'Owner edited size',price:77}]};sql.prepare('UPDATE products SET data=? WHERE id=?').run(JSON.stringify(edited),first.id);const deleted=catalog.products[1];sql.prepare('DELETE FROM products WHERE id=?').run(deleted.id);
await importOriginalMenu(DB);assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM products').get().n,143);assert.equal(JSON.parse(sql.prepare('SELECT data FROM products WHERE id=?').get(first.id).data).variants[0].price,77);assert.equal(sql.prepare('SELECT data FROM products WHERE id=?').get(deleted.id),undefined);
const headers={'Content-Type':'application/json','oai-authenticated-user-id':'test-subject','oai-authenticated-user-email':'test-owner@example.test'};
await handleAPI(new Request('https://cafe.test/api/setup',{method:'POST',headers,body:JSON.stringify({token:'test'})}),{DB,OWNER_SETUP_TOKEN:'test'});
const deny=await handleAPI(new Request('https://cafe.test/api/admin/availability',{method:'POST',headers,body:JSON.stringify({id:pending[0].id,available:true})}),{DB});assert.equal(deny.status,400);
console.log('PASS: all 151 original menu rows represented; 144 products, 25 categories, 7 add-on rows, 14 unavailable unpriced products; owner data and subsequent edits preserved; repeat import is idempotent.');
