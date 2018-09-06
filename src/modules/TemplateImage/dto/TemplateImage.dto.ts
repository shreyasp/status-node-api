import { ApiModelProperty } from '@nestjs/swagger';

/*

    TemplateImage Data Transfer object (DTO)
*/
class TemplateImageDTO {

    @ApiModelProperty()
    readonly imageName: string;
}

export { TemplateImageDTO };