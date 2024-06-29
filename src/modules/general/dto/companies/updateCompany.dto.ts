import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDTO } from './createCompany.dto';

export class UpdateCompanyDTO extends PartialType(CreateCompanyDTO) {}
