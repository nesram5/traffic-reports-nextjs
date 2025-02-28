import mysql from 'mysql2/promise';
import logger from '@/config/logger';

export default class DatabaseManager {
    public pool: mysql.Pool;
    public connection: mysql.PoolConnection | null = null;

    constructor(
        private username: string,
        private password: string,
        private host: string,
        private database_name: string
    ) {
        this.pool = mysql.createPool({
            host: this.host,
            user: this.username,
            password: this.password,
            database: this.database_name,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            
        });
        this.connect();   
    }
    // Connect to the database
    public async connect(): Promise<void> {
        try {
            this.connection = await this.pool.getConnection();
            console.log('Connected to the database');
        } catch (error) {
            logger.error('Error connecting to the database:', error);
            throw error;
        }
    }

    // Disconnect from the database
    public async disconnect(): Promise<void> {
        try {
            await this.pool.end();
            console.log('Disconnected from the database');
        } catch (error) {
            logger.error('Error disconnecting from the database:', error);
            throw error;
        }
    }

    // Release the connection back to the pool
    private async releaseConnection(): Promise<void> {
        if (this.connection) {
            this.connection.release();
            this.connection = null;
            console.log('Connection released back to the pool');
        }
    }

    // Insert data into a table
    public async insert(table: string, data: Record<string, any>): Promise<mysql.OkPacket> {
        try {
            const [result] = await this.pool.query(`INSERT INTO ${table} SET ?`, [data]);
            return result as mysql.OkPacket;
        } catch (error) {
            logger.error(`Error inserting into table ${table}:`, error);
            throw error;
        }
    }

    public async execute<T>(sql: string, values?: any[]): Promise<T> {
        try {
            const [results] = await this.pool.query(sql, values);
            return results as T;
        } catch (error) {
            logger.error('Query failed:', error);
            throw error;
        }
    }

    // Execute a custom query
    public async query<T>(sql: string, values?: any[]): Promise<T> {
        try {
            const [results] = await this.pool.query(sql, values);
            return results as T;
        } catch (error) {
            logger.error('Query failed:', error);
            throw error;
        }
    }

    // Update data in a table
    public async update(table: string, data: Record<string, any>, condition: string): Promise<mysql.OkPacket> {
        try {
            const [result] = await this.pool.query(`UPDATE ${table} SET ? WHERE ${condition}`, [data]);
            return result as mysql.OkPacket;
        } catch (error) {
            logger.error(`Error updating table ${table}:`, error);
            throw error;
        }
    }

    // Delete data from a table
    public async delete(table: string, condition: string): Promise<mysql.OkPacket> {
        try {
            const [result] = await this.pool.query(`DELETE FROM ${table} WHERE ${condition}`);
            return result as mysql.OkPacket;
        } catch (error) {
            logger.error(`Error deleting from table ${table}:`, error);
            throw error;
        }
    }

    // Begin a transaction
    public async beginTransaction(): Promise<void> {
        try {
            if (!this.connection) {
                throw new Error('No database connection available');
            }
            await this.connection.beginTransaction();
            console.log('Transaction started.');
        } catch (error) {
            logger.error('Error starting transaction:', error);
            throw error;
        }
    }

    // Commit a transaction
    public async commit(): Promise<void> {
        try {
            if (!this.connection) {
                throw new Error('No database connection available');
            }
            await this.connection.commit();
            console.log('Transaction committed.');
        } catch (error) {
            logger.error('Error committing transaction:', error);
            throw error;
        } finally {
            await this.releaseConnection();
        }
    }

    // Rollback a transaction
    public async rollback(): Promise<void> {
        try {
            if (!this.connection) {
                throw new Error('No database connection available');
            }
            await this.connection.rollback();
            console.log('Transaction rolled back.');
        } catch (error) {
            logger.error('Error rolling back transaction:', error);
            throw error;
        } finally {
            await this.releaseConnection();
        }
    }

    // Select data from a table
    public async select<T>(table: string, condition?: string): Promise<T[]> {
        try {
            const sql = condition ? `SELECT * FROM ${table} WHERE ${condition}` : `SELECT * FROM ${table}`;
            return await this.query<T[]>(sql);
        } catch (error) {
            logger.error(`Error selecting from table ${table}:`, error);
            throw error;
        }
    }

    // Join multiple tables
    public async joinTables<T>(
        baseTable: string,
        joins: { table: string; on: string }[],
        selectFields: string[] = ['*']
    ): Promise<T[]> {
        try {
            const joinClauses = joins.map((join) => `JOIN ${join.table} ON ${join.on}`).join(' ');
            const selectClause = selectFields.join(', ');
            const querySql = `SELECT ${selectClause} FROM ${baseTable} ${joinClauses}`;
            return await this.query<T[]>(querySql);
        } catch (error) {
            logger.error('Error joining tables:', error);
            throw error;
        }
    }

    // Execute a direct query
    public async directQuery<T>(sql: string): Promise<T[]> {
        try {
            return await this.query<T[]>(sql);
        } catch (error) {
            logger.error('Error querying:', error);
            throw error;
        }
    }
}