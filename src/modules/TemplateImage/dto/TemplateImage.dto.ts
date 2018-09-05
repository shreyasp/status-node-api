import { ApiModelProperty } from '@nestjs/swagger';

/*

    TemplateImage Data Transfer object (DTO)
*/
class TemplateImageDTO {
    @ApiModelProperty()
    readonly background: Buffer;

    @ApiModelProperty()
    readonly template: Buffer;

    @ApiModelProperty()
    readonly imageName: string;
}

export { TemplateImageDTO };