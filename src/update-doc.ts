import { GoogleSpreadsheet, GoogleSpreadsheetRow } from "google-spreadsheet";
import "dotenv/config";
import { GenreCount } from "../lib/types";

export const updateValues = async (values: GenreCount) => {
  const doc = new GoogleSpreadsheet(process.env.TEST_SHEET);

  if (typeof process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL !== "string") {
    throw "Missing GOOGLE_SERVICE_ACCOUNT_EMAIL from environment variable";
  }

  if (typeof process.env.GOOGLE_PRIVATE_KEY !== "string") {
    throw "Missing GOOGLE_PRIVATE_KEY from environment variable";
  }

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  });

  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  await sheet.getRows();
  const newRow = new GoogleSpreadsheetRow(sheet, 2, [
    " ",
    ...Object.values(values),
  ]);
  newRow.save();
};
