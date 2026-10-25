import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Brings the dev database in line with the current entities:
 * - users gets a uuid id and the role enum
 * - todo gets an ownerId FK, OPEN/DONE statuses, and an OPEN default
 * - refresh_tokens is created for the rotating-cookie auth flow
 *
 * Existing rows are preserved: user ids are regenerated as uuids, existing
 * todos are assigned to the first user (the old schema had no owner column),
 * and legacy statuses are normalised (Done -> DONE, anything else -> OPEN).
 *
 * The down migration is best-effort: reversing uuid -> serial changes user ids
 * and cannot restore the previous status labels exactly.
 */
export class AlignSchema1792895992952 implements MigrationInterface {
  name = "AlignSchema1792895992952";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        CREATE TYPE "users_role_enum" AS ENUM ('user', 'admin');
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END
      $$;
    `);

    // Some environments lost the migration that created this table; create it
    // in its target shape when it is absent.
    await queryRunner.query(`
      DO $$
      BEGIN
        IF to_regclass('public.users') IS NULL THEN
          CREATE TABLE "users" (
            "id" uuid NOT NULL DEFAULT gen_random_uuid(),
            "email" character varying NOT NULL,
            "passwordHash" character varying NOT NULL,
            "role" "users_role_enum" NOT NULL DEFAULT 'user',
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_users" PRIMARY KEY ("id"),
            CONSTRAINT "UQ_users_email" UNIQUE ("email")
          );
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "role" "users_role_enum" NOT NULL DEFAULT 'user'
    `);
    await queryRunner.query(`
      UPDATE "users" SET "role" = 'user' WHERE "role" IS NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user'
    `);

    // The old table used an integer serial id; the entity expects a uuid.
    await queryRunner.query(`
      DO $$
      DECLARE
        id_type text;
      BEGIN
        SELECT data_type INTO id_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'users'
          AND column_name = 'id';

        IF id_type IS DISTINCT FROM 'uuid' THEN
          ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "PK_a3ffb1c0c8416b9fc6f907b7433";
          ALTER TABLE "users" ADD COLUMN "id_uuid" uuid NOT NULL DEFAULT gen_random_uuid();
          ALTER TABLE "users" DROP COLUMN "id";
          ALTER TABLE "users" RENAME COLUMN "id_uuid" TO "id";
          ALTER TABLE "users" ADD CONSTRAINT "PK_users" PRIMARY KEY ("id");
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint c
          JOIN pg_attribute a
            ON a.attrelid = c.conrelid
           AND a.attnum = ANY (c.conkey)
          WHERE c.conrelid = 'public.users'::regclass
            AND c.contype = 'u'
            AND a.attname = 'email'
        ) THEN
          ALTER TABLE "users" ADD CONSTRAINT "UQ_users_email" UNIQUE ("email");
        END IF;
      END
      $$;
    `);

    // The API only knows OPEN and DONE.
    await queryRunner.query(`
      UPDATE "todo"
      SET "status" = CASE
        WHEN lower("status") IN ('done', 'completed') THEN 'DONE'
        ELSE 'OPEN'
      END
    `);
    await queryRunner.query(`
      ALTER TABLE "todo" ALTER COLUMN "status" SET DEFAULT 'OPEN'
    `);

    await queryRunner.query(`
      ALTER TABLE "todo" ADD COLUMN IF NOT EXISTS "ownerId" uuid
    `);
    await queryRunner.query(`
      DO $$
      DECLARE
        fallback uuid;
      BEGIN
        SELECT "id" INTO fallback FROM "users" ORDER BY "email" LIMIT 1;

        IF fallback IS NOT NULL THEN
          UPDATE "todo" SET "ownerId" = fallback WHERE "ownerId" IS NULL;
        END IF;
      END
      $$;
    `);
    await queryRunner.query(`
      ALTER TABLE "todo" ALTER COLUMN "ownerId" SET NOT NULL
    `);
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint
          WHERE conname = 'FK_todo_owner'
            AND conrelid = 'public.todo'::regclass
        ) THEN
          ALTER TABLE "todo"
          ADD CONSTRAINT "FK_todo_owner"
          FOREIGN KEY ("ownerId") REFERENCES "users"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION;
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "refresh_tokens" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "tokenHash" character varying NOT NULL,
        "userId" uuid NOT NULL,
        "revoked" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_refresh_tokens" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_refresh_tokens_tokenHash" UNIQUE ("tokenHash"),
        CONSTRAINT "FK_refresh_tokens_user"
          FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "refresh_tokens"`);
    await queryRunner.query(`
      ALTER TABLE "todo" DROP CONSTRAINT IF EXISTS "FK_todo_owner"
    `);
    await queryRunner.query(`
      ALTER TABLE "todo" DROP COLUMN IF EXISTS "ownerId"
    `);
    await queryRunner.query(`
      ALTER TABLE "todo" ALTER COLUMN "status" SET DEFAULT 'To Do'
    `);
    await queryRunner.query(`
      UPDATE "todo"
      SET "status" = CASE WHEN "status" = 'DONE' THEN 'Done' ELSE 'To Do' END
    `);

    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN IF EXISTS "role"
    `);
    await queryRunner.query(`DROP TYPE IF EXISTS "users_role_enum"`);

    await queryRunner.query(`
      DO $$
      DECLARE
        id_type text;
      BEGIN
        SELECT data_type INTO id_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'users'
          AND column_name = 'id';

        IF id_type = 'uuid' THEN
          ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "PK_users";
          ALTER TABLE "users" ADD COLUMN "id_int" serial;
          ALTER TABLE "users" DROP COLUMN "id";
          ALTER TABLE "users" RENAME COLUMN "id_int" TO "id";
          ALTER TABLE "users"
          ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id");
        END IF;
      END
      $$;
    `);
  }
}
