import { SubstrateBatchProcessor } from "@subsquid/substrate-processor";
import { lookupArchive } from "@subsquid/archive-registry";
import { TypeormDatabase } from "@subsquid/typeorm-store";
import { TreasuryDeposit } from "./model";
import { TreasuryDepositEvent } from "./types/events";

const processor = new SubstrateBatchProcessor()
  .setBatchSize(500)
  .setDataSource({
    archive: lookupArchive("moonbeam", { release: "FireSquid" }),
  })
  .setBlockRange({ from: 1144562, to: 1557182 })
  .addEvent("Treasury.Deposit");

processor.run(new TypeormDatabase(), async (ctx) => {
  const deposits: TreasuryDeposit[] = [];
  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.name === "Treasury.Deposit") {
        const event = new TreasuryDepositEvent(ctx, item.event);
        let deposit: { value: bigint };
        if (event.isV900) {
          const value = event.asV900;
          deposit = { value };
        } else {
          deposit = event.asV1300;
        }

        const blockDate = new Date(
          Number(block.header.timestamp)
        ).toUTCString();

        if (blockDate.includes("Jun") || blockDate.includes("Jul")) {
          deposits.push(
            new TreasuryDeposit({
              id: item.event.id,
              balance: deposit.value,
              timestamp: blockDate,
            })
          );
        }
      }
    }
  }
  await ctx.store.insert(deposits);
});
