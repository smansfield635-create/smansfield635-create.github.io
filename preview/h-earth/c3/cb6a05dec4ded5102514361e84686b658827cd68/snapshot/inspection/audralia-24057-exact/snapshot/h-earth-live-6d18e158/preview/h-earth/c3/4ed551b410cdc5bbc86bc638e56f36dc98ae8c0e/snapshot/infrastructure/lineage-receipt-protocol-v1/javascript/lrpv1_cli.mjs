import fs from "node:fs";
import {
  canonicalizeText,
  createReceipt,
  verifyReceipt,
} from "./lineage_receipt_protocol_v1.mjs";

const operation = process.argv[2];
const raw = fs.readFileSync(0, "utf8");
const input = JSON.parse(raw);

if (operation === "canonicalize") {
  process.stdout.write(canonicalizeText(input));
} else if (operation === "create") {
  process.stdout.write(JSON.stringify(await createReceipt(input)));
} else if (operation === "verify") {
  process.stdout.write(JSON.stringify(await verifyReceipt(input)));
} else {
  console.error("usage: node lrpv1_cli.mjs canonicalize|create|verify");
  process.exit(2);
}
