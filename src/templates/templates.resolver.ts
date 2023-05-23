import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TemplatesService } from './templates.service';
import { Template, TemplatePagination } from './entities/template.entity';
import { CreateTemplateInput } from './dto/create-template.input';
import { UpdateTemplateInput } from './dto/update-template.input';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuardHql } from 'src/auth/jwt-guardhql.guard';

@Resolver(() => Template)
export class TemplatesResolver {
  constructor(private readonly templatesService: TemplatesService) {}

  @Mutation(() => Template)
  createTemplate(
    @Args('createTemplateInput') createTemplateInput: CreateTemplateInput,
  ) {
    return this.templatesService.create(createTemplateInput);
  }

  @Query(() => TemplatePagination, { name: 'templates' })
  @UseGuards(JWTAuthGuardHql)
  findAll(
    @Args('page') page: number,
    @Args('limit') limit: number,
    @Args('search') search: string,
  ) {
    return this.templatesService.findAll(page, limit, search);
  }

  @Query(() => [Template], { name: 'templatesIndividual' })
  findIndividual() {
    return this.templatesService.findIndividual();
  }

  @Query(() => [Template], { name: 'templatesMultiple' })
  findMultiple() {
    return this.templatesService.findMultiple();
  }

  @Query(() => Template, { name: 'template' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.templatesService.findOne(id);
  }

  @Mutation(() => Template, { name: 'templateUpdate' })
  async updateTemplate(
    @Args('updateTemplateInput') updateTemplateInput: UpdateTemplateInput,
  ) {
    // Guarda la instancia de la entidad en la base de datos
    return this.templatesService.update(updateTemplateInput);
  }

  @Mutation(() => Template)
  removeTemplate(@Args('id') id: string) {
    return this.templatesService.remove(id);
  }
}
