import { Controller, Get } from '@nestjs/common';

@Controller('ping')
export class PingController {
    @Get()
    ping(): object {
        return ({
            success: true,
            message: 'Server is running !!!',
        });
    }
}