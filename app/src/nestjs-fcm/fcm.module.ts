import { Global, Module, DynamicModule, Logger } from '@nestjs/common';
import { FcmOptions } from './fcm-options.interface';
import { FcmService } from './fcm.service';
import { FCM_OPTIONS } from './fcm.constants';
import { ValueProvider } from '@nestjs/common/interfaces/modules/provider.interface';

@Global()
@Module({})
export class FcmModule {
    static forRoot(options: FcmOptions): DynamicModule {
        const optionsProvider: ValueProvider = {
            provide: FCM_OPTIONS,
            useValue: options,
        };
        const logger = options.logger ? options.logger : new Logger('FcmService');
        return {
            module: FcmModule,
            providers: [
                { provide: Logger, useValue: logger },
                FcmService,
                optionsProvider,
            ],
            exports: [FcmService],
        };
    }
}
