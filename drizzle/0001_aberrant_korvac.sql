CREATE TABLE "contract" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"prospect_id" uuid NOT NULL,
	"agent_id" text NOT NULL,
	"type" text NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"pdf_url" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"address" text NOT NULL,
	"type" text NOT NULL,
	"surface_area" integer NOT NULL,
	"rooms" integer NOT NULL,
	"agent_id" text NOT NULL,
	"status" text DEFAULT 'available' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"original_url" text NOT NULL,
	"enhanced_url" text,
	"is_enhanced" boolean DEFAULT false NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prospect" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"status" text DEFAULT 'new' NOT NULL,
	"notes" text,
	"agent_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "visit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"prospect_id" uuid NOT NULL,
	"agent_id" text NOT NULL,
	"scheduled_date" timestamp NOT NULL,
	"status" text DEFAULT 'scheduled' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text DEFAULT 'visitor' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "contract" ADD CONSTRAINT "contract_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contract" ADD CONSTRAINT "contract_prospect_id_prospect_id_fk" FOREIGN KEY ("prospect_id") REFERENCES "public"."prospect"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contract" ADD CONSTRAINT "contract_agent_id_user_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property" ADD CONSTRAINT "property_agent_id_user_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_image" ADD CONSTRAINT "property_image_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prospect" ADD CONSTRAINT "prospect_agent_id_user_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visit" ADD CONSTRAINT "visit_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visit" ADD CONSTRAINT "visit_prospect_id_prospect_id_fk" FOREIGN KEY ("prospect_id") REFERENCES "public"."prospect"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visit" ADD CONSTRAINT "visit_agent_id_user_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;