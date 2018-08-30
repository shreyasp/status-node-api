import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';
import fs from 'fs';

import { Font } from './TemplateFont.entity';

@Injectable()
class FontService {
    constructor(
        @InjectRepository(Font)
        private readonly FontRepository: Repository<Font>,
    ){}

    queryBuilder = this.FontRepository.createQueryBuilder('font');

    // Retrieve all the active Font
    findAllFonts() {
        return this.FontRepository.find({ common: {isActive: true } })
            .then((fonts) => fonts)
            .catch((err) => err);
    }

    // Retrieve Specific Font
    findOneFont(id: number) {
        return this.queryBuilder.where(
            'font.fontId = :fontId',
            {fontId: id},
        )
        .getOne()
        .then((font) => font)
        .catch((err) => err);
    }

    // Font creation activity would involve creating a font object in
    // DB which has reference to its path
    createFont(font: any) {
        //
    }

    // Note: We won't have 'DELETE' REST call for fonts, as we
    // would just want to activate or deactivate a font.
    toggleFontActive(id: number) {
        return this.FontRepository.update(
            {fontId: id}, {common: {isActive: false}},
        );
    }

}

export { FontService };