import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, or, and } from 'drizzle-orm';
import { DB_CONNECTION } from '../drizzle/drizzle.module';
import * as schema from '../drizzle/schema';

@Injectable()
export class DocumentsService {
    constructor(
        @Inject(DB_CONNECTION) private db: NodePgDatabase<typeof schema>,
    ) { }

    async create(userId: string) {
        const [document] = await this.db.insert(schema.documents)
            .values({
                title: 'Untitled Document',
                ownerId: userId,
            })
            .returning();
        return document;
    }

    async findAll(userId: string) {
        // Find documents owned by user OR where user has access in document_access table
        return this.db.query.documents.findMany({
            where: or(
                eq(schema.documents.ownerId, userId),
                // Using an exists subquery or join for shared docs
                // For simplicity with drizzle's query API, let's use a simpler approach or raw sql if needed
                // But drizzle relations allow us to do this cleanly if we have correctly defined relations
            ),
            with: {
                accessList: {
                    where: eq(schema.documentAccess.userId, userId),
                }
            }
        });

        // Alternative implementation to strictly match "Return all rows where ownerId equals userId OR shared"
        /*
        return this.db
            .select()
            .from(schema.documents)
            .leftJoin(schema.documentAccess, eq(schema.documents.id, schema.documentAccess.documentId))
            .where(
                or(
                    eq(schema.documents.ownerId, userId),
                    eq(schema.documentAccess.userId, userId)
                )
            );
        */
    }

    // Let's go with the join version for more control over the output
    async findAllJoin(userId: string) {
        const results = await this.db
            .select({
                document: schema.documents
            })
            .from(schema.documents)
            .leftJoin(schema.documentAccess, eq(schema.documents.id, schema.documentAccess.documentId))
            .where(
                or(
                    eq(schema.documents.ownerId, userId),
                    eq(schema.documentAccess.userId, userId)
                )
            );

        // Deduplicate and return documents
        const uniqueDocs = Array.from(new Map(results.map(r => [r.document.id, r.document])).values());
        return uniqueDocs;
    }

    async findOne(id: string, userId: string) {
        const doc = await this.db.query.documents.findFirst({
            where: eq(schema.documents.id, id),
            with: {
                accessList: {
                    where: eq(schema.documentAccess.userId, userId),
                }
            }
        });

        if (!doc) {
            throw new NotFoundException('Document not found');
        }

        const isOwner = doc.ownerId === userId;
        const hasAccess = doc.accessList && doc.accessList.length > 0;

        if (!isOwner && !hasAccess) {
            throw new ForbiddenException('You do not have access to this document');
        }

        return doc;
    }

    async saveVersion(documentId: string, content: any, versionName: string | undefined, userId: string) {
        // 1. Verify access
        await this.findOne(documentId, userId);

        // 2. Update currentContent in documents table
        await this.db.update(schema.documents)
            .set({
                currentContent: content,
                updatedAt: new Date(),
            })
            .where(eq(schema.documents.id, documentId));

        // 3. Insert into document_versions table
        const [version] = await this.db.insert(schema.documentVersions)
            .values({
                documentId,
                content,
                versionName,
                createdBy: userId,
            })
            .returning();

        return version;
    }
}
