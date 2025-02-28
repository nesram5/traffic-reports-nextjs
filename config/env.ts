import '@/envConfig';

export const port: number = Number(process.env.PORT) || 443;
export const httpPort: number = Number(process.env.HTTP_PORT) || 5001;
export const address: string = process.env.SERVER || 'localhost';
export const apiUrl = process.env.ZABBIX_API_URL || 'http://default-api-url';
export const token = process.env.ZABBIX_TOKEN || 'default-token';
export const dbPassword = process.env.DB_PASSWORD || 'default-password';
export const dbUsername = process.env.DB_USERNAME || 'default-username';
export const dbHost = process.env.DB_HOST || 'default-host';
export const dbName = process.env.DB_NAME || 'default-db-name';
