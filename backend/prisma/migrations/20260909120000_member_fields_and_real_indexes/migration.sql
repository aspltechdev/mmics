-- =====================================================================
-- Member membership fields + the indexes the dashboard actually needs.
--
-- Note: the earlier migration folder was named
-- "add_performance_indexes" but only contained the initial CREATE TABLE
-- statements. No non-unique index was ever created, so every dashboard
-- count and every filtered list was doing a sequential scan.
-- =====================================================================

-- ---------------------------------------------------------------------
-- MEMBERS: extra membership information used by the member dashboard
-- ---------------------------------------------------------------------

ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "membershipType" TEXT DEFAULT 'Regular';
ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- ---------------------------------------------------------------------
-- PRODUCT IMAGES: cascade delete so removing a product cleans up rows
-- ---------------------------------------------------------------------

ALTER TABLE "product_images" DROP CONSTRAINT IF EXISTS "product_images_productId_fkey";
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ---------------------------------------------------------------------
-- USERS
-- ---------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS "users_isActive_idx" ON "users"("isActive");

-- ---------------------------------------------------------------------
-- CATEGORIES
-- ---------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS "categories_isActive_sortOrder_idx" ON "categories"("isActive", "sortOrder");
CREATE INDEX IF NOT EXISTS "categories_sortOrder_idx" ON "categories"("sortOrder");

-- ---------------------------------------------------------------------
-- PRODUCTS
-- ---------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS "products_categoryId_idx" ON "products"("categoryId");
CREATE INDEX IF NOT EXISTS "products_isActive_createdAt_idx" ON "products"("isActive", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "products_isActive_isFeatured_idx" ON "products"("isActive", "isFeatured");
CREATE INDEX IF NOT EXISTS "products_categoryId_isActive_sortOrder_idx" ON "products"("categoryId", "isActive", "sortOrder");
CREATE INDEX IF NOT EXISTS "products_createdAt_idx" ON "products"("createdAt" DESC);

-- Case-insensitive product search (the `contains` + `mode: insensitive`
-- filter in getProducts compiles to ILIKE, which cannot use a plain
-- B-tree index).
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS "products_name_trgm_idx" ON "products" USING gin ("name" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "products_shortDescription_trgm_idx" ON "products" USING gin ("shortDescription" gin_trgm_ops);

-- ---------------------------------------------------------------------
-- PRODUCT IMAGES
-- ---------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS "product_images_productId_sortOrder_idx" ON "product_images"("productId", "sortOrder");
CREATE INDEX IF NOT EXISTS "product_images_productId_isPrimary_idx" ON "product_images"("productId", "isPrimary");

-- ---------------------------------------------------------------------
-- ENQUIRIES
-- ---------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS "enquiries_status_createdAt_idx" ON "enquiries"("status", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "enquiries_createdAt_idx" ON "enquiries"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "enquiries_productId_idx" ON "enquiries"("productId");
CREATE INDEX IF NOT EXISTS "enquiries_assignedToId_idx" ON "enquiries"("assignedToId");

-- ---------------------------------------------------------------------
-- CONTACT MESSAGES
-- ---------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS "contact_messages_status_createdAt_idx" ON "contact_messages"("status", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "contact_messages_createdAt_idx" ON "contact_messages"("createdAt" DESC);

-- ---------------------------------------------------------------------
-- DIRECTORS
-- ---------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS "directors_isActive_displayOrder_idx" ON "directors"("isActive", "displayOrder");

-- ---------------------------------------------------------------------
-- GALLERY
-- ---------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS "gallery_images_category_sortOrder_idx" ON "gallery_images"("category", "sortOrder");
CREATE INDEX IF NOT EXISTS "gallery_images_isFeatured_sortOrder_idx" ON "gallery_images"("isFeatured", "sortOrder");

-- ---------------------------------------------------------------------
-- NEWS
-- ---------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS "news_isPublished_publishedAt_idx" ON "news"("isPublished", "publishedAt" DESC);
CREATE INDEX IF NOT EXISTS "news_authorId_idx" ON "news"("authorId");

-- ---------------------------------------------------------------------
-- TESTIMONIALS
-- ---------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS "testimonials_isActive_sortOrder_idx" ON "testimonials"("isActive", "sortOrder");
CREATE INDEX IF NOT EXISTS "testimonials_isFeatured_sortOrder_idx" ON "testimonials"("isFeatured", "sortOrder");

-- ---------------------------------------------------------------------
-- MEMBERS
-- ---------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS "members_isActive_createdAt_idx" ON "members"("isActive", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "members_name_idx" ON "members"("name");
CREATE INDEX IF NOT EXISTS "members_createdAt_idx" ON "members"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "members_name_trgm_idx" ON "members" USING gin ("name" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "members_email_trgm_idx" ON "members" USING gin ("email" gin_trgm_ops);
