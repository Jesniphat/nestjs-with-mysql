import { Injectable } from '@nestjs/common';
import { DbService } from './db.service';

@Injectable()
export class AppService {
  constructor(private readonly db: DbService) { }
  getHello(): string {
    return 'Hello World!';
  }

  public async getDbData(): Promise<any> {
    try {
      await this.db.connect();
      const res = await this.db.select('select * from product');
      console.log('query1 done');
      const res2 = await this.db.select('select * from detail');
      console.log('query2 done');
      await this.db.release();
      return {
        status: true,
        product: res,
        detail: res2
      };
    } catch (errs) {
      await this.db.release();
      throw errs;
    }
  }

  public async addData(): Promise<any> {
    try {
      await this.db.connect();
      await this.db.beginTransaction();

      const insertId = await this.db.insert('INSERT INTO product SET ?', { name: 'a', description: 'data1' });
      console.log(insertId);
      const insertId2 = await this.db.insert('INSERT INTO detail SET ?', { 'detail_name': 'a1', 'detail_description': 'data ddd1'});
      console.log(insertId2);

      await this.db.commit();

      return {
        status: true,
        product: insertId,
        detail: insertId2
      };
    } catch (err) {
      console.log('Error -> ', err.message);
      await this.db.rollback();
      throw err;
    } finally {
      await this.db.release();
    }
  }

  public async addDataError(): Promise<any> {
    try {
      await this.db.connect();
      await this.db.beginTransaction();

      const insertId = await this.db.insert('INSERT INTO product SET ?', { name: 'a', description: 'data1' });
      console.log(insertId);
      const insertId2 = await this.db.insert('INSERT INTO detail SET ?', { 'detail_name': 'a1xxxxxx', 'detail_description': 'data ddd1'});
      console.log(insertId2);

      await this.db.commit();

      return {
        status: true,
        product: insertId,
        detail: insertId2
      };
    } catch (err) {
      console.log('Error -> ', err.message);
      await this.db.rollback();
      throw err;
    } finally {
      await this.db.release();
    }
  }

  public async updateData(): Promise<any> {
    try {
      await this.db.connect();
      await this.db.beginTransaction();

      const effected = await this.db.update('UPDATE product SET name = ? where id = ?', ['xxx', 2]);
      console.log(effected);
      await this.db.commit();

      return {
        status: true,
        effected
      }
    } catch (err) {
      console.log('Error -> ', err.message);
      await this.db.rollback();
      throw err;
    } finally {
      await this.db.release();
    }
  }

  public async getPagingData(page: number) {
    try {
      await this.db.connect();
      const sql = `
        SELECT id, name, description 
        FROM products ORDER BY id LIMIT 10 OFFSET ${page * 10}
      `;
      const data = await this.db.select(sql);
      await this.db.release();
      return data;
    } catch (err) {
      await this.db.release();
      throw err;
    }
  }
}
