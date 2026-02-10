CREATE TABLE "document_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"documentId" uuid NOT NULL,
	"content" jsonb NOT NULL,
	"versionName" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"createdBy" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "currentContent" jsonb;--> statement-breakpoint
ALTER TABLE "document_versions" ADD CONSTRAINT "document_versions_documentId_documents_id_fk" FOREIGN KEY ("documentId") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_versions" ADD CONSTRAINT "document_versions_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;