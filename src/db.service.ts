import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql';

@Injectable()
export class DbService {
  public connection = {
    connectionLimit : 90,
    host            : '127.0.0.1',
    port            : '3308',
    user            : 'dev',
    password        : 'devp@ssw0rd',
    database        : 'main-sql-check'
  };

  private conn: any;
  private pool: any;

  public async connect(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.pool = mysql.createPool(this.connection);

      this.pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
        } else {
          this.conn = connection;
          resolve(true);
        }
      });
    });
  }

  public async beginTransaction(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.conn.beginTransaction(err => {
        if (err) { reject(err); } else { resolve(true); }
      });
    });
  }

  public async commit(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.conn.commit(err => {
        console.log('commit');
        if (err) { reject(err); } else { resolve(true); }
      });
    });
  }

  public async rollback(): Promise<any> {
    console.log('rollback');
    this.conn.rollback();
  }

  public async select(sql: string, param: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.conn.query(sql, param, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  public async insert(sql: string, param: object): Promise<any> {
    return new Promise((resolve, reject) => {
      this.conn.query(sql, param, (error, results) => {
        if (error) { 
          reject(error); 
        } else {
          resolve(results.insertId);
        }
      });
    });
  }

  public async update(sql: string, param: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.conn.query(sql, param, (error, results) => {
        if (error) { 
          reject(error); 
        } else {
          resolve(results.affectedRows);
        }
      });
    });
  }

  public async release(): Promise<any> {
    return new Promise((resolve) => {
      if (this.conn) {
        this.conn.release();
        this.conn.destroy();
      }
      // console.log('release done');
      resolve(true);
    });
  }

  public async disconnect(): Promise<any> {
    this.pool.end(function (err) {
      // all connections in the pool have ended
      if (err) {
        console.log(err);
      }
    });
  }

}
