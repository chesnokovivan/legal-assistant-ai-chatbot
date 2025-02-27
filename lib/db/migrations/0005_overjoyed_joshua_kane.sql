CREATE TABLE IF NOT EXISTS "DocumentAnnotation" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"documentId" uuid NOT NULL,
	"documentCreatedAt" timestamp NOT NULL,
	"startIndex" integer NOT NULL,
	"endIndex" integer NOT NULL,
	"text" text NOT NULL,
	"type" varchar NOT NULL,
	"comment" text,
	"severity" varchar,
	"createdAt" timestamp NOT NULL,
	"userId" uuid NOT NULL,
	"isResolved" boolean DEFAULT false,
	CONSTRAINT "DocumentAnnotation_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "DocumentSection" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"documentId" uuid NOT NULL,
	"documentCreatedAt" timestamp NOT NULL,
	"title" text NOT NULL,
	"level" integer NOT NULL,
	"content" text NOT NULL,
	"startIndex" integer NOT NULL,
	"endIndex" integer NOT NULL,
	"parentId" uuid,
	"createdAt" timestamp NOT NULL,
	CONSTRAINT "DocumentSection_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
ALTER TABLE "Document" ADD COLUMN "kind" varchar DEFAULT 'text' NOT NULL;--> statement-breakpoint
ALTER TABLE "Document" ADD COLUMN "fileName" varchar(255);--> statement-breakpoint
ALTER TABLE "Document" ADD COLUMN "fileType" varchar;--> statement-breakpoint
ALTER TABLE "Document" ADD COLUMN "fileSize" integer;--> statement-breakpoint
ALTER TABLE "Document" ADD COLUMN "blobUrl" text;--> statement-breakpoint
ALTER TABLE "Document" ADD COLUMN "pageCount" integer;--> statement-breakpoint
ALTER TABLE "Document" ADD COLUMN "wordCount" integer;--> statement-breakpoint
ALTER TABLE "Document" ADD COLUMN "lastModified" timestamp;--> statement-breakpoint
ALTER TABLE "Document" ADD COLUMN "isAnalyzed" boolean DEFAULT false;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "DocumentAnnotation" ADD CONSTRAINT "DocumentAnnotation_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "DocumentAnnotation" ADD CONSTRAINT "DocumentAnnotation_documentId_documentCreatedAt_Document_id_createdAt_fk" FOREIGN KEY ("documentId","documentCreatedAt") REFERENCES "public"."Document"("id","createdAt") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "DocumentSection" ADD CONSTRAINT "DocumentSection_documentId_documentCreatedAt_Document_id_createdAt_fk" FOREIGN KEY ("documentId","documentCreatedAt") REFERENCES "public"."Document"("id","createdAt") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "DocumentSection" ADD CONSTRAINT "DocumentSection_parentId_DocumentSection_id_fk" FOREIGN KEY ("parentId") REFERENCES "public"."DocumentSection"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "Document" DROP COLUMN IF EXISTS "text";