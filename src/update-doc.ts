import { GoogleSpreadsheet, GoogleSpreadsheetRow } from "google-spreadsheet";
import "dotenv/config";
import { GenreCount } from "../lib/types";

/**
 * Replaces the values of the 2nd row in the google sheet with the values passed in as parameters
 * @param values
 */
export const updateValues = async (values: GenreCount, isProd: boolean) => {
  let sheetId = process.env.TEST_SHEET;
  if (isProd) {
    sheetId = process.env.REAL_SHEET;
  }

  const doc = new GoogleSpreadsheet(sheetId);

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
