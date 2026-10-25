import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Adds the In Progress state: TODO / IN_PROGRESS / DONE.
 * Existing OPEN rows become TODO, "In Progress" rows become IN_PROGRESS, and
 * Done rows stay DONE.
 */
export class AddInProgressStatus1792896705841 implements MigrationInterface {
  name = "AddInProgressStatus1792896705841";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "todo" ALTER COLUMN "status" DROP DEFAULT
    `);
    await queryRunner.query(`
      UPDATE "todo"
      SET "status" = CASE
        WHEN lower(trim("status")) IN ('done', 'completed') THEN 'DONE'
        WHEN lower(trim("status")) IN (
          'in progress', 'in_progress', 'in-progress', 'inprogress'
        ) THEN 'IN_PROGRESS'
        ELSE 'TODO'
      END
    `);
    await queryRunner.query(`
      ALTER TABLE "todo" ALTER COLUMN "status" SET DEFAULT 'TODO'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "todo" ALTER COLUMN "status" DROP DEFAULT
    `);
    await queryRunner.query(`
      UPDATE "todo"
      SET "status" = CASE
        WHEN "status" = 'DONE' THEN 'DONE'
        ELSE 'OPEN'
      END
    `);
    await queryRunner.query(`
      ALTER TABLE "todo" ALTER COLUMN "status" SET DEFAULT 'OPEN'
    `);
  }
}
