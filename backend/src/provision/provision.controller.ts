import { Body, Controller, Post } from '@nestjs/common';
import { ProvisionDto } from './dto/provision.dto';
import { ProvisionService } from './provision.service';

@Controller('provision')
export class ProvisionController {
  constructor(private readonly service: ProvisionService) {}

  @Post()
  provision(@Body() dto: ProvisionDto) {
    return this.service.provision(dto);
  }
}
