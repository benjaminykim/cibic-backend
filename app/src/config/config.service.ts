import { TypeOrmModuleOptions } from '@nestjs/typeorm';

require('dotenv').config();

class ConfigService {

    constructor(private env: { [k: string]: string | undefined }) { }

    private getValue(key: string, throwOnMissing = true): string {
        const value = this.env[key];
        if (!value && throwOnMissing) {
            throw new Error(`config error - missing env.${key}`);
        }

        return value;
    }

    public ensureValues(keys: string[]) {
        keys.forEach(k => this.getValue(k, true));
        return this;
    }

    public getJwtSecret() {
        return this.getValue('JWT_SECRET');
    }

    public getDbPort() {
        return this.getValue('POSTGRES_PORT');
    }

    public getApiPort() {
        return this.getValue('API_PORT');
    }

    public getFeedLimit() {
        return 20;
    }

    public isProduction() {
        const mode = this.getValue('DEPLOY_ENV', false);
        return mode != 'development';
    }

    public getTypeOrmConfig(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: this.getValue('POSTGRES_HOST'),
            port: parseInt(this.getValue('POSTGRES_PORT')),
            username: this.getValue('POSTGRES_USER'),
            password: this.getValue('POSTGRES_PASSWORD'),
            database: this.getValue('POSTGRES_DB'),
            autoLoadEntities: true,
            entities: ['dist/**/*.entity.js'],
            migrationsTableName: 'migration',
            migrations: ['dist/src/migration/*.{t,j}s'],
            cli: {
                migrationsDir: 'src/migration',
            },
            migrationsRun: this.isProduction(),
            ssl: false,
            synchronize: !this.isProduction(),
        };
    }
}

const configService = new ConfigService(process.env)
    .ensureValues([
        'POSTGRES_HOST',
        'POSTGRES_PORT',
        'POSTGRES_USER',
        'POSTGRES_PASSWORD',
        'POSTGRES_DB',
        'API_PORT',
        'JWT_SECRET',
    ]);

export { configService };
