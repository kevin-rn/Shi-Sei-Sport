import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('nl', 'en');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_agenda_category" AS ENUM('vacation', 'holiday', 'exam', 'competition', 'other');
  CREATE TYPE "public"."enum_agenda_status" AS ENUM('draft', 'published', 'cancelled');
  CREATE TYPE "public"."enum_albums_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_media_category" AS ENUM('general', 'instructor', 'news', 'album', 'location', 'document', 'embed');
  CREATE TYPE "public"."enum_training_schedule_day" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TYPE "public"."enum_grades_grade_type" AS ENUM('kyu', 'dan');
  CREATE TYPE "public"."enum_grades_belt_level" AS ENUM('yellow-5kyu', 'orange-4kyu', 'green-3kyu', 'blue-2kyu', 'brown-1kyu');
  CREATE TYPE "public"."enum_grades_status" AS ENUM('draft', 'published', 'archived');
  CREATE TYPE "public"."enum_documents_category" AS ENUM('regulation', 'enrollment');
  CREATE TYPE "public"."enum_prices_price_type" AS ENUM('plan', 'settings');
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"album_id" integer,
  	"cover_image_id" integer,
  	"published_date" timestamp(3) with time zone NOT NULL,
  	"status" "enum_news_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "news_locales" (
  	"title" varchar NOT NULL,
  	"content" jsonb NOT NULL,
  	"excerpt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "agenda" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"category" "enum_agenda_category" DEFAULT 'other' NOT NULL,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone,
  	"all_day" boolean DEFAULT true,
  	"start_time" varchar,
  	"end_time" varchar,
  	"location_id" integer,
  	"cover_image_id" integer,
  	"status" "enum_agenda_status" DEFAULT 'draft' NOT NULL,
  	"registration_required" boolean DEFAULT false,
  	"registration_deadline" timestamp(3) with time zone,
  	"max_participants" numeric,
  	"external_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "agenda_locales" (
  	"title" varchar NOT NULL,
  	"description" jsonb,
  	"custom_location" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "albums" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"date" timestamp(3) with time zone NOT NULL,
  	"status" "enum_albums_status" DEFAULT 'published' NOT NULL,
  	"is_hero_carousel" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "albums_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"video_embeds_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"category" "enum_media_category" DEFAULT 'general',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_placeholder_url" varchar,
  	"sizes_placeholder_width" numeric,
  	"sizes_placeholder_height" numeric,
  	"sizes_placeholder_mime_type" varchar,
  	"sizes_placeholder_filesize" numeric,
  	"sizes_placeholder_filename" varchar,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "video_embeds" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"embed_url" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "video_embeds_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "training_schedule" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" "enum_training_schedule_day" NOT NULL,
  	"start_time" varchar NOT NULL,
  	"end_time" varchar NOT NULL,
  	"location_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "training_schedule_locales" (
  	"group_name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "training_schedule_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"instructors_id" integer
  );
  
  CREATE TABLE "instructors_qualifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "instructors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"profile_image_id" integer,
  	"order" numeric DEFAULT 10,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "instructors_locales" (
  	"role" varchar NOT NULL,
  	"rank" varchar NOT NULL,
  	"bio" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "instructors_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "locations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"address" varchar NOT NULL,
  	"google_maps_url" varchar,
  	"map_embed_url" varchar,
  	"coordinates_latitude" numeric,
  	"coordinates_longitude" numeric,
  	"location_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "locations_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "grades_supplementary_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"document_id" integer,
  	"description" varchar
  );
  
  CREATE TABLE "grades" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"grade_type" "enum_grades_grade_type" DEFAULT 'kyu' NOT NULL,
  	"belt_level" "enum_grades_belt_level",
  	"kyu_rank" numeric,
  	"exam_document_id" integer,
  	"minimum_age" varchar,
  	"external_url" varchar,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"status" "enum_grades_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "grades_locales" (
  	"title" varchar NOT NULL,
  	"description" jsonb NOT NULL,
  	"external_url_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"category" "enum_documents_category" DEFAULT 'regulation' NOT NULL,
  	"attachment_id" integer,
  	"order" numeric DEFAULT 10,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "documents_locales" (
  	"title" varchar NOT NULL,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "prices_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar
  );
  
  CREATE TABLE "prices" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"price_type" "enum_prices_price_type" DEFAULT 'plan' NOT NULL,
  	"monthly_price" varchar,
  	"yearly_price" varchar,
  	"popular" boolean DEFAULT false,
  	"registration_fee" varchar,
  	"display_order" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "prices_locales" (
  	"plan_name" varchar,
  	"ooievaarspas_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"news_id" integer,
  	"agenda_id" integer,
  	"albums_id" integer,
  	"media_id" integer,
  	"video_embeds_id" integer,
  	"training_schedule_id" integer,
  	"instructors_id" integer,
  	"locations_id" integer,
  	"grades_id" integer,
  	"documents_id" integer,
  	"prices_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contact_info_phones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL
  );
  
  CREATE TABLE "contact_info_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL
  );
  
  CREATE TABLE "contact_info" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"postal_address" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "vcp_info" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"vcp_name" varchar NOT NULL,
  	"vcp_email" varchar NOT NULL,
  	"vcp_since" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "vcp_info_locales" (
  	"introduction" jsonb NOT NULL,
  	"what_does_vcp_do" jsonb NOT NULL,
  	"for_whom" jsonb NOT NULL,
  	"why_contact" jsonb NOT NULL,
  	"vcp_bio" jsonb,
  	"preventive_policy" jsonb,
  	"crossing_behavior" jsonb,
  	"vcp_tasks" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "news" ADD CONSTRAINT "news_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_locales" ADD CONSTRAINT "news_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "agenda" ADD CONSTRAINT "agenda_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "agenda" ADD CONSTRAINT "agenda_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "agenda_locales" ADD CONSTRAINT "agenda_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."agenda"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "albums_rels" ADD CONSTRAINT "albums_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "albums_rels" ADD CONSTRAINT "albums_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "albums_rels" ADD CONSTRAINT "albums_rels_video_embeds_fk" FOREIGN KEY ("video_embeds_id") REFERENCES "public"."video_embeds"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "video_embeds_locales" ADD CONSTRAINT "video_embeds_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."video_embeds"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "training_schedule" ADD CONSTRAINT "training_schedule_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "training_schedule_locales" ADD CONSTRAINT "training_schedule_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."training_schedule"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "training_schedule_rels" ADD CONSTRAINT "training_schedule_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."training_schedule"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "training_schedule_rels" ADD CONSTRAINT "training_schedule_rels_instructors_fk" FOREIGN KEY ("instructors_id") REFERENCES "public"."instructors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "instructors_qualifications" ADD CONSTRAINT "instructors_qualifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."instructors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "instructors" ADD CONSTRAINT "instructors_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "instructors_locales" ADD CONSTRAINT "instructors_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."instructors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "instructors_rels" ADD CONSTRAINT "instructors_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."instructors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "instructors_rels" ADD CONSTRAINT "instructors_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations" ADD CONSTRAINT "locations_location_image_id_media_id_fk" FOREIGN KEY ("location_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "locations_rels" ADD CONSTRAINT "locations_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations_rels" ADD CONSTRAINT "locations_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "grades_supplementary_documents" ADD CONSTRAINT "grades_supplementary_documents_document_id_media_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "grades_supplementary_documents" ADD CONSTRAINT "grades_supplementary_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."grades"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "grades" ADD CONSTRAINT "grades_exam_document_id_media_id_fk" FOREIGN KEY ("exam_document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "grades_locales" ADD CONSTRAINT "grades_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."grades"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "documents" ADD CONSTRAINT "documents_attachment_id_media_id_fk" FOREIGN KEY ("attachment_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "documents_locales" ADD CONSTRAINT "documents_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prices_features" ADD CONSTRAINT "prices_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."prices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prices_locales" ADD CONSTRAINT "prices_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."prices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_agenda_fk" FOREIGN KEY ("agenda_id") REFERENCES "public"."agenda"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_albums_fk" FOREIGN KEY ("albums_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_video_embeds_fk" FOREIGN KEY ("video_embeds_id") REFERENCES "public"."video_embeds"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_training_schedule_fk" FOREIGN KEY ("training_schedule_id") REFERENCES "public"."training_schedule"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_instructors_fk" FOREIGN KEY ("instructors_id") REFERENCES "public"."instructors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_grades_fk" FOREIGN KEY ("grades_id") REFERENCES "public"."grades"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_prices_fk" FOREIGN KEY ("prices_id") REFERENCES "public"."prices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_info_phones" ADD CONSTRAINT "contact_info_phones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_info"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_info_emails" ADD CONSTRAINT "contact_info_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_info"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vcp_info_locales" ADD CONSTRAINT "vcp_info_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vcp_info"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_album_idx" ON "news" USING btree ("album_id");
  CREATE INDEX "news_cover_image_idx" ON "news" USING btree ("cover_image_id");
  CREATE INDEX "news_published_date_idx" ON "news" USING btree ("published_date");
  CREATE INDEX "news_status_idx" ON "news" USING btree ("status");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE UNIQUE INDEX "news_locales_locale_parent_id_unique" ON "news_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "agenda_slug_idx" ON "agenda" USING btree ("slug");
  CREATE INDEX "agenda_category_idx" ON "agenda" USING btree ("category");
  CREATE INDEX "agenda_start_date_idx" ON "agenda" USING btree ("start_date");
  CREATE INDEX "agenda_location_idx" ON "agenda" USING btree ("location_id");
  CREATE INDEX "agenda_cover_image_idx" ON "agenda" USING btree ("cover_image_id");
  CREATE INDEX "agenda_status_idx" ON "agenda" USING btree ("status");
  CREATE INDEX "agenda_updated_at_idx" ON "agenda" USING btree ("updated_at");
  CREATE INDEX "agenda_created_at_idx" ON "agenda" USING btree ("created_at");
  CREATE UNIQUE INDEX "agenda_locales_locale_parent_id_unique" ON "agenda_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "albums_status_idx" ON "albums" USING btree ("status");
  CREATE INDEX "albums_updated_at_idx" ON "albums" USING btree ("updated_at");
  CREATE INDEX "albums_created_at_idx" ON "albums" USING btree ("created_at");
  CREATE INDEX "albums_rels_order_idx" ON "albums_rels" USING btree ("order");
  CREATE INDEX "albums_rels_parent_idx" ON "albums_rels" USING btree ("parent_id");
  CREATE INDEX "albums_rels_path_idx" ON "albums_rels" USING btree ("path");
  CREATE INDEX "albums_rels_media_id_idx" ON "albums_rels" USING btree ("media_id");
  CREATE INDEX "albums_rels_video_embeds_id_idx" ON "albums_rels" USING btree ("video_embeds_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_placeholder_sizes_placeholder_filename_idx" ON "media" USING btree ("sizes_placeholder_filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "video_embeds_updated_at_idx" ON "video_embeds" USING btree ("updated_at");
  CREATE INDEX "video_embeds_created_at_idx" ON "video_embeds" USING btree ("created_at");
  CREATE UNIQUE INDEX "video_embeds_locales_locale_parent_id_unique" ON "video_embeds_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "training_schedule_location_idx" ON "training_schedule" USING btree ("location_id");
  CREATE INDEX "training_schedule_updated_at_idx" ON "training_schedule" USING btree ("updated_at");
  CREATE INDEX "training_schedule_created_at_idx" ON "training_schedule" USING btree ("created_at");
  CREATE UNIQUE INDEX "training_schedule_locales_locale_parent_id_unique" ON "training_schedule_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "training_schedule_rels_order_idx" ON "training_schedule_rels" USING btree ("order");
  CREATE INDEX "training_schedule_rels_parent_idx" ON "training_schedule_rels" USING btree ("parent_id");
  CREATE INDEX "training_schedule_rels_path_idx" ON "training_schedule_rels" USING btree ("path");
  CREATE INDEX "training_schedule_rels_instructors_id_idx" ON "training_schedule_rels" USING btree ("instructors_id");
  CREATE INDEX "instructors_qualifications_order_idx" ON "instructors_qualifications" USING btree ("_order");
  CREATE INDEX "instructors_qualifications_parent_id_idx" ON "instructors_qualifications" USING btree ("_parent_id");
  CREATE INDEX "instructors_profile_image_idx" ON "instructors" USING btree ("profile_image_id");
  CREATE INDEX "instructors_updated_at_idx" ON "instructors" USING btree ("updated_at");
  CREATE INDEX "instructors_created_at_idx" ON "instructors" USING btree ("created_at");
  CREATE UNIQUE INDEX "instructors_locales_locale_parent_id_unique" ON "instructors_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "instructors_rels_order_idx" ON "instructors_rels" USING btree ("order");
  CREATE INDEX "instructors_rels_parent_idx" ON "instructors_rels" USING btree ("parent_id");
  CREATE INDEX "instructors_rels_path_idx" ON "instructors_rels" USING btree ("path");
  CREATE INDEX "instructors_rels_media_id_idx" ON "instructors_rels" USING btree ("media_id");
  CREATE INDEX "locations_location_image_idx" ON "locations" USING btree ("location_image_id");
  CREATE INDEX "locations_updated_at_idx" ON "locations" USING btree ("updated_at");
  CREATE INDEX "locations_created_at_idx" ON "locations" USING btree ("created_at");
  CREATE INDEX "locations_rels_order_idx" ON "locations_rels" USING btree ("order");
  CREATE INDEX "locations_rels_parent_idx" ON "locations_rels" USING btree ("parent_id");
  CREATE INDEX "locations_rels_path_idx" ON "locations_rels" USING btree ("path");
  CREATE INDEX "locations_rels_media_id_idx" ON "locations_rels" USING btree ("media_id");
  CREATE INDEX "grades_supplementary_documents_order_idx" ON "grades_supplementary_documents" USING btree ("_order");
  CREATE INDEX "grades_supplementary_documents_parent_id_idx" ON "grades_supplementary_documents" USING btree ("_parent_id");
  CREATE INDEX "grades_supplementary_documents_document_idx" ON "grades_supplementary_documents" USING btree ("document_id");
  CREATE INDEX "grades_exam_document_idx" ON "grades" USING btree ("exam_document_id");
  CREATE INDEX "grades_status_idx" ON "grades" USING btree ("status");
  CREATE INDEX "grades_updated_at_idx" ON "grades" USING btree ("updated_at");
  CREATE INDEX "grades_created_at_idx" ON "grades" USING btree ("created_at");
  CREATE UNIQUE INDEX "grades_locales_locale_parent_id_unique" ON "grades_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "documents_attachment_idx" ON "documents" USING btree ("attachment_id");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "documents_locales_locale_parent_id_unique" ON "documents_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "prices_features_order_idx" ON "prices_features" USING btree ("_order");
  CREATE INDEX "prices_features_parent_id_idx" ON "prices_features" USING btree ("_parent_id");
  CREATE INDEX "prices_features_locale_idx" ON "prices_features" USING btree ("_locale");
  CREATE INDEX "prices_updated_at_idx" ON "prices" USING btree ("updated_at");
  CREATE INDEX "prices_created_at_idx" ON "prices" USING btree ("created_at");
  CREATE UNIQUE INDEX "prices_locales_locale_parent_id_unique" ON "prices_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_agenda_id_idx" ON "payload_locked_documents_rels" USING btree ("agenda_id");
  CREATE INDEX "payload_locked_documents_rels_albums_id_idx" ON "payload_locked_documents_rels" USING btree ("albums_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_video_embeds_id_idx" ON "payload_locked_documents_rels" USING btree ("video_embeds_id");
  CREATE INDEX "payload_locked_documents_rels_training_schedule_id_idx" ON "payload_locked_documents_rels" USING btree ("training_schedule_id");
  CREATE INDEX "payload_locked_documents_rels_instructors_id_idx" ON "payload_locked_documents_rels" USING btree ("instructors_id");
  CREATE INDEX "payload_locked_documents_rels_locations_id_idx" ON "payload_locked_documents_rels" USING btree ("locations_id");
  CREATE INDEX "payload_locked_documents_rels_grades_id_idx" ON "payload_locked_documents_rels" USING btree ("grades_id");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_prices_id_idx" ON "payload_locked_documents_rels" USING btree ("prices_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "contact_info_phones_order_idx" ON "contact_info_phones" USING btree ("_order");
  CREATE INDEX "contact_info_phones_parent_id_idx" ON "contact_info_phones" USING btree ("_parent_id");
  CREATE INDEX "contact_info_emails_order_idx" ON "contact_info_emails" USING btree ("_order");
  CREATE INDEX "contact_info_emails_parent_id_idx" ON "contact_info_emails" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "vcp_info_locales_locale_parent_id_unique" ON "vcp_info_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "news" CASCADE;
  DROP TABLE "news_locales" CASCADE;
  DROP TABLE "agenda" CASCADE;
  DROP TABLE "agenda_locales" CASCADE;
  DROP TABLE "albums" CASCADE;
  DROP TABLE "albums_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "video_embeds" CASCADE;
  DROP TABLE "video_embeds_locales" CASCADE;
  DROP TABLE "training_schedule" CASCADE;
  DROP TABLE "training_schedule_locales" CASCADE;
  DROP TABLE "training_schedule_rels" CASCADE;
  DROP TABLE "instructors_qualifications" CASCADE;
  DROP TABLE "instructors" CASCADE;
  DROP TABLE "instructors_locales" CASCADE;
  DROP TABLE "instructors_rels" CASCADE;
  DROP TABLE "locations" CASCADE;
  DROP TABLE "locations_rels" CASCADE;
  DROP TABLE "grades_supplementary_documents" CASCADE;
  DROP TABLE "grades" CASCADE;
  DROP TABLE "grades_locales" CASCADE;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "documents_locales" CASCADE;
  DROP TABLE "prices_features" CASCADE;
  DROP TABLE "prices" CASCADE;
  DROP TABLE "prices_locales" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "contact_info_phones" CASCADE;
  DROP TABLE "contact_info_emails" CASCADE;
  DROP TABLE "contact_info" CASCADE;
  DROP TABLE "vcp_info" CASCADE;
  DROP TABLE "vcp_info_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum_agenda_category";
  DROP TYPE "public"."enum_agenda_status";
  DROP TYPE "public"."enum_albums_status";
  DROP TYPE "public"."enum_media_category";
  DROP TYPE "public"."enum_training_schedule_day";
  DROP TYPE "public"."enum_grades_grade_type";
  DROP TYPE "public"."enum_grades_belt_level";
  DROP TYPE "public"."enum_grades_status";
  DROP TYPE "public"."enum_documents_category";
  DROP TYPE "public"."enum_prices_price_type";`)
}
