import { configService } from './src/config/config.service';
import fs = require('fs');

fs.writeFileSync(
    'ormconfig.json',
    JSON.stringify(configService.getTypeOrmConfig(), null, 4),
);
