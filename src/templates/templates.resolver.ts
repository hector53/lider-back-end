import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TemplatesService } from './templates.service';
import { Template } from './entities/template.entity';
import { CreateTemplateInput } from './dto/create-template.input';
import { UpdateTemplateInput } from './dto/update-template.input';

@Resolver(() => Template)
export class TemplatesResolver {
  constructor(private readonly templatesService: TemplatesService) {}

  @Mutation(() => Template)
  createTemplate(
    @Args('createTemplateInput') createTemplateInput: CreateTemplateInput,
  ) {
    return this.templatesService.create(createTemplateInput);
  }

  @Query(() => [Template], { name: 'templates' })
  findAll() {
    return this.templatesService.findAll();
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

  @Mutation(() => Template)
  updateTemplate(
    @Args('updateTemplateInput') updateTemplateInput: UpdateTemplateInput,
  ) {
    return this.templatesService.update(
      updateTemplateInput.id,
      updateTemplateInput,
    );
  }

  @Mutation(() => Template)
  removeTemplate(@Args('id', { type: () => Int }) id: number) {
    return this.templatesService.remove(id);
  }
}
