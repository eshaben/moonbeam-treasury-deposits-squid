module.exports = class Data1661334018904 {
  name = 'Data1661334018904'

  async up(db) {
    await db.query(`CREATE TABLE "treasury_deposit" ("id" character varying NOT NULL, "balance" numeric NOT NULL, "timestamp" text NOT NULL, CONSTRAINT "PK_bb0b858d6d7f00be291469da01e" PRIMARY KEY ("id"))`)
  }

  async down(db) {
    await db.query(`DROP TABLE "treasury_deposit"`)
  }
}
