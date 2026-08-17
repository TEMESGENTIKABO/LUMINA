ALTER TABLE "Article" ADD COLUMN "searchVector" tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce("title_en", '')), 'A') ||
    setweight(to_tsvector('english', coalesce("dek_en", '')), 'B') ||
    setweight(to_tsvector('simple', coalesce("title_am", '')), 'A') ||
    setweight(to_tsvector('simple', coalesce("dek_am", '')), 'B')
  ) STORED;

CREATE INDEX "Article_searchVector_idx" ON "Article" USING GIN ("searchVector");
