import { Controller, Get, Post, Param, UseGuards, Request, Body } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    @Post()
    async create(@Request() req) {
        return this.documentsService.create(req.user.userId);
    }

    @Get()
    async findAll(@Request() req) {
        // Using the join version for more accurate "all shared" results
        return this.documentsService.findAllJoin(req.user.userId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req) {
        return this.documentsService.findOne(id, req.user.userId);
    }

    @Post(':id/versions')
    async saveVersion(
        @Param('id') id: string,
        @Request() req,
        @Body() body: { content: any; name?: string },
    ) {
        return this.documentsService.saveVersion(
            id,
            body.content,
            body.name,
            req.user.userId,
        );
    }
}
