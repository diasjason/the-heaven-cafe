import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
export const settings = sqliteTable('settings', {id:text('id').primaryKey(), data:text('data').notNull()});
export const products = sqliteTable('products', {id:text('id').primaryKey(), data:text('data').notNull()});
export const orders = sqliteTable('orders', {id:integer('id').primaryKey({autoIncrement:true}), requestKey:text('request_key').notNull().unique(), token:text('token').notNull(), data:text('data').notNull(), createdAt:text('created_at').notNull()});
export const staff = sqliteTable('staff', {id:text('id').primaryKey(), email:text('email').notNull().unique(), subject:text('subject'), role:text('role').notNull(), active:integer('active').notNull().default(1)});
export const audits = sqliteTable('audits', {id:integer('id').primaryKey({autoIncrement:true}), actor:text('actor').notNull(), action:text('action').notNull(), detail:text('detail').notNull(), createdAt:text('created_at').notNull()});
