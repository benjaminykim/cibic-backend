import {MigrationInterface, QueryRunner} from "typeorm";

export class initialMigration1589241019094 implements MigrationInterface {
    name = 'initialMigration1589241019094'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cabildo" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "location" character varying NOT NULL, "desc" character varying NOT NULL, "adminId" integer, CONSTRAINT "PK_7a33d0f0345701901cc1c73c836" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3228793e4c6b067467914ff89b" ON "cabildo" ("name") `, undefined);
        await queryRunner.query(`CREATE TABLE "base_vote" ("id" SERIAL NOT NULL, "value" integer NOT NULL, CONSTRAINT "CHK_d71a76e3f1c004786f694ef23d" CHECK ("value" > -2 AND "value" < 2), CONSTRAINT "PK_06c6ef9db2e36d0d8aca4514304" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "activity_vote" ("id" SERIAL NOT NULL, "value" integer NOT NULL, "userId" integer NOT NULL, "activityId" integer NOT NULL, CONSTRAINT "CHK_ae2c47c52e28b0815bd872f5fc" CHECK ("value" > -2 AND "value" < 2), CONSTRAINT "PK_8c10d8d13dd90e33ce03a7c6d08" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "comment_vote" ("id" SERIAL NOT NULL, "value" integer NOT NULL, "userId" integer NOT NULL, "commentId" integer NOT NULL, CONSTRAINT "CHK_2a18c198c27fcdcd5e3982a42d" CHECK ("value" > -2 AND "value" < 2), CONSTRAINT "PK_4b5d08afceeb89bd5da77cfd71f" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "reply_vote" ("id" SERIAL NOT NULL, "value" integer NOT NULL, "userId" integer NOT NULL, "replyId" integer NOT NULL, CONSTRAINT "CHK_908984d4bda384a2c2000e47ec" CHECK ("value" > -2 AND "value" < 2), CONSTRAINT "PK_6cf753edfe9b7fd007c0a025a5c" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "reply" ("id" SERIAL NOT NULL, "publishDate" TIMESTAMP NOT NULL DEFAULT now(), "content" character varying NOT NULL, "score" integer NOT NULL, "userId" integer, "commentId" integer, CONSTRAINT "PK_94fa9017051b40a71e000a2aff9" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_cd9becc3b3f49d0c388a7fb581" ON "reply" ("score") `, undefined);
        await queryRunner.query(`CREATE TABLE "comment" ("id" SERIAL NOT NULL, "publishDate" TIMESTAMP NOT NULL DEFAULT now(), "content" character varying NOT NULL, "score" integer NOT NULL DEFAULT 0, "userId" integer, "activityId" integer, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_98eea41a884b8d610c263728d7" ON "comment" ("score") `, undefined);
        await queryRunner.query(`CREATE TABLE "reaction" ("id" SERIAL NOT NULL, "value" integer NOT NULL, "userId" integer, "activityId" integer, CONSTRAINT "CHK_982ca8611ef269776cd40d6be4" CHECK ("value" > -3 AND "value" < 3), CONSTRAINT "PK_41fbb346da22da4df129f14b11e" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying NOT NULL, "middleName" character varying NOT NULL, "lastName" character varying NOT NULL, "maidenName" character varying NOT NULL, "phone" character varying NOT NULL, "rut" character varying NOT NULL, "desc" character varying NOT NULL, "citizenPoints" integer NOT NULL DEFAULT 0, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_638bac731294171648258260ff" ON "user" ("password") `, undefined);
        await queryRunner.query(`CREATE TYPE "activity_activitytype_enum" AS ENUM('0', '1', '2')`, undefined);
        await queryRunner.query(`CREATE TABLE "activity" ("id" SERIAL NOT NULL, "activityType" "activity_activitytype_enum" NOT NULL, "score" integer NOT NULL DEFAULT 0, "ping" integer NOT NULL DEFAULT 0, "commentNumber" integer NOT NULL DEFAULT 0, "publishDate" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "text" character varying NOT NULL, "userId" integer, "cabildoId" integer, CONSTRAINT "PK_24625a1d6b1b089c8ae206fe467" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_d9bec24168b866748a6b5b691b" ON "activity" ("score") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_c06cbb49453114746ac0f3f419" ON "activity" ("ping") `, undefined);
        await queryRunner.query(`CREATE TABLE "user_cabildos_cabildo" ("userId" integer NOT NULL, "cabildoId" integer NOT NULL, CONSTRAINT "PK_b0cec44bb0e143745b89b4b2121" PRIMARY KEY ("userId", "cabildoId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_8ed163f3cd9d57d2efcf2e66be" ON "user_cabildos_cabildo" ("userId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_30aee64694caf30f1531f8b6a3" ON "user_cabildos_cabildo" ("cabildoId") `, undefined);
        await queryRunner.query(`CREATE TABLE "user_moder_cabildos_cabildo" ("userId" integer NOT NULL, "cabildoId" integer NOT NULL, CONSTRAINT "PK_83be2529a8a0b7cabef3cb0bbbe" PRIMARY KEY ("userId", "cabildoId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_530edd59f081cb69abf271f783" ON "user_moder_cabildos_cabildo" ("userId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_56964febc40cf2af6e7e0e3e44" ON "user_moder_cabildos_cabildo" ("cabildoId") `, undefined);
        await queryRunner.query(`CREATE TABLE "user_following_user" ("userId_1" integer NOT NULL, "userId_2" integer NOT NULL, CONSTRAINT "PK_2c183a6c043a59133b516d5daa9" PRIMARY KEY ("userId_1", "userId_2"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_9691163a986dfb589a90dea3d5" ON "user_following_user" ("userId_1") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_a89f5a432c1edcd03a3b655532" ON "user_following_user" ("userId_2") `, undefined);
        await queryRunner.query(`ALTER TABLE "cabildo" ADD CONSTRAINT "FK_2ba6e907adadf15699f54f99404" FOREIGN KEY ("adminId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "activity_vote" ADD CONSTRAINT "FK_aae0eca6be6b4c68eb33250d369" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "activity_vote" ADD CONSTRAINT "FK_ac454fc390b93dabe8313bb9f91" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "comment_vote" ADD CONSTRAINT "FK_ade7498b89296b9fb63bcd8dbdd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "comment_vote" ADD CONSTRAINT "FK_5d77d92a6925ae3fc8da14e1257" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "reply_vote" ADD CONSTRAINT "FK_d7e305441b008953132f7973573" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "reply_vote" ADD CONSTRAINT "FK_0d8c3bfd780e82c145df5ffaf14" FOREIGN KEY ("replyId") REFERENCES "reply"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "reply" ADD CONSTRAINT "FK_e9886d6d04a19413a2f0aac5d7b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "reply" ADD CONSTRAINT "FK_b63950f2876403407137a257a9a" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_43edbd83eb91401b157f9895ea5" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "reaction" ADD CONSTRAINT "FK_e58a09ab17e3ce4c47a1a330ae1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "reaction" ADD CONSTRAINT "FK_6ad70b20cc578785f299b7c6590" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "activity" ADD CONSTRAINT "FK_3571467bcbe021f66e2bdce96ea" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "activity" ADD CONSTRAINT "FK_24e284b675e03efef75b9dc98e3" FOREIGN KEY ("cabildoId") REFERENCES "cabildo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user_cabildos_cabildo" ADD CONSTRAINT "FK_8ed163f3cd9d57d2efcf2e66beb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user_cabildos_cabildo" ADD CONSTRAINT "FK_30aee64694caf30f1531f8b6a3b" FOREIGN KEY ("cabildoId") REFERENCES "cabildo"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user_moder_cabildos_cabildo" ADD CONSTRAINT "FK_530edd59f081cb69abf271f7830" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user_moder_cabildos_cabildo" ADD CONSTRAINT "FK_56964febc40cf2af6e7e0e3e446" FOREIGN KEY ("cabildoId") REFERENCES "cabildo"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user_following_user" ADD CONSTRAINT "FK_9691163a986dfb589a90dea3d5f" FOREIGN KEY ("userId_1") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user_following_user" ADD CONSTRAINT "FK_a89f5a432c1edcd03a3b6555321" FOREIGN KEY ("userId_2") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_following_user" DROP CONSTRAINT "FK_a89f5a432c1edcd03a3b6555321"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_following_user" DROP CONSTRAINT "FK_9691163a986dfb589a90dea3d5f"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_moder_cabildos_cabildo" DROP CONSTRAINT "FK_56964febc40cf2af6e7e0e3e446"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_moder_cabildos_cabildo" DROP CONSTRAINT "FK_530edd59f081cb69abf271f7830"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_cabildos_cabildo" DROP CONSTRAINT "FK_30aee64694caf30f1531f8b6a3b"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_cabildos_cabildo" DROP CONSTRAINT "FK_8ed163f3cd9d57d2efcf2e66beb"`, undefined);
        await queryRunner.query(`ALTER TABLE "activity" DROP CONSTRAINT "FK_24e284b675e03efef75b9dc98e3"`, undefined);
        await queryRunner.query(`ALTER TABLE "activity" DROP CONSTRAINT "FK_3571467bcbe021f66e2bdce96ea"`, undefined);
        await queryRunner.query(`ALTER TABLE "reaction" DROP CONSTRAINT "FK_6ad70b20cc578785f299b7c6590"`, undefined);
        await queryRunner.query(`ALTER TABLE "reaction" DROP CONSTRAINT "FK_e58a09ab17e3ce4c47a1a330ae1"`, undefined);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_43edbd83eb91401b157f9895ea5"`, undefined);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`, undefined);
        await queryRunner.query(`ALTER TABLE "reply" DROP CONSTRAINT "FK_b63950f2876403407137a257a9a"`, undefined);
        await queryRunner.query(`ALTER TABLE "reply" DROP CONSTRAINT "FK_e9886d6d04a19413a2f0aac5d7b"`, undefined);
        await queryRunner.query(`ALTER TABLE "reply_vote" DROP CONSTRAINT "FK_0d8c3bfd780e82c145df5ffaf14"`, undefined);
        await queryRunner.query(`ALTER TABLE "reply_vote" DROP CONSTRAINT "FK_d7e305441b008953132f7973573"`, undefined);
        await queryRunner.query(`ALTER TABLE "comment_vote" DROP CONSTRAINT "FK_5d77d92a6925ae3fc8da14e1257"`, undefined);
        await queryRunner.query(`ALTER TABLE "comment_vote" DROP CONSTRAINT "FK_ade7498b89296b9fb63bcd8dbdd"`, undefined);
        await queryRunner.query(`ALTER TABLE "activity_vote" DROP CONSTRAINT "FK_ac454fc390b93dabe8313bb9f91"`, undefined);
        await queryRunner.query(`ALTER TABLE "activity_vote" DROP CONSTRAINT "FK_aae0eca6be6b4c68eb33250d369"`, undefined);
        await queryRunner.query(`ALTER TABLE "cabildo" DROP CONSTRAINT "FK_2ba6e907adadf15699f54f99404"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_a89f5a432c1edcd03a3b655532"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_9691163a986dfb589a90dea3d5"`, undefined);
        await queryRunner.query(`DROP TABLE "user_following_user"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_56964febc40cf2af6e7e0e3e44"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_530edd59f081cb69abf271f783"`, undefined);
        await queryRunner.query(`DROP TABLE "user_moder_cabildos_cabildo"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_30aee64694caf30f1531f8b6a3"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_8ed163f3cd9d57d2efcf2e66be"`, undefined);
        await queryRunner.query(`DROP TABLE "user_cabildos_cabildo"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_c06cbb49453114746ac0f3f419"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_d9bec24168b866748a6b5b691b"`, undefined);
        await queryRunner.query(`DROP TABLE "activity"`, undefined);
        await queryRunner.query(`DROP TYPE "activity_activitytype_enum"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_638bac731294171648258260ff"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
        await queryRunner.query(`DROP TABLE "reaction"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_98eea41a884b8d610c263728d7"`, undefined);
        await queryRunner.query(`DROP TABLE "comment"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_cd9becc3b3f49d0c388a7fb581"`, undefined);
        await queryRunner.query(`DROP TABLE "reply"`, undefined);
        await queryRunner.query(`DROP TABLE "reply_vote"`, undefined);
        await queryRunner.query(`DROP TABLE "comment_vote"`, undefined);
        await queryRunner.query(`DROP TABLE "activity_vote"`, undefined);
        await queryRunner.query(`DROP TABLE "base_vote"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_3228793e4c6b067467914ff89b"`, undefined);
        await queryRunner.query(`DROP TABLE "cabildo"`, undefined);
    }

}
