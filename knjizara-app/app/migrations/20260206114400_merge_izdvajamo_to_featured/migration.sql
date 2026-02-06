-- Copy izdvajamo data to featured field (OR logic: if either is true, set featured to true)
UPDATE "Book" SET "featured" = true WHERE "izdvajamo" = true OR "featured" = true;

-- Drop the izdvajamo column
ALTER TABLE "Book" DROP COLUMN "izdvajamo";
