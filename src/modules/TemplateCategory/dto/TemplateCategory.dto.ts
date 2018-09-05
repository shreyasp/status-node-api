import { ApiModelProperty } from '@nestjs/swagger';

/*
    TemplateCategory Data Transfer object (DTO)
*/

class TemplateCategoryDTO {

    @ApiModelProperty()
    readonly name: string;

    @ApiModelProperty()
    readonly displayName: string;
}

export { TemplateCategoryDTO };