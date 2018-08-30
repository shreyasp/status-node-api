import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FontService } from './TemplateFont.service';
import { FontController } from './TemplateFont.controller';
import { Font } from './TemplateFont.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Font,
        ]),
    ],
    controllers: [
        FontController,
    ],
    providers: [
        FontService,
    ],
})

class TemplateFontModule {}

export { TemplateFontModule };