const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { stringify } = require("csv-stringify/sync");
const minimist = require("minimist");

// Parse command-line arguments
const args = minimist(process.argv.slice(2));
const inputFileName = args["input-file"]; // Use the --input-file argument to pass the CSV file name

if (!inputFileName) {
  console.error(
    "Please provide the name of the CSV file using the --input-file argument."
  );
  process.exit(1);
}

// Construct the file path using path.join
const inputFilePath = path.join(__dirname, inputFileName);
const outputFilePath = path.join(__dirname, "formatted.csv");

const rows = [];
let rowIndex = 0;
const sanitizeRow = function (row) {
  Object.keys(row).map((key) => {
    row[key] = row[key].replace(/[\n|]/g, " ");
  });

  return row;
};

fs.createReadStream(inputFilePath)
  .pipe(csv())
  .on("data", (row, i) => {
    row = sanitizeRow(row);
    // Create a new object with only the desired columns
    const newRow = {
      "": rowIndex + 1,
      Name: `[${row["Name"]}](${row["GitHub"]})`,
      Description: row["Description"],
      Instructions: `[Run on YugabyteDB](apps/${row["Name"].replaceAll(
        /[/\n ]/g,
        "-"
      )}.md)`,
      Status: row["Migration Status"] || "         ",
      Contributor:
        (row["Owner GitHub Handle"] &&
          `[@${row["Owner GitHub Handle"]}](https://github.com/${row["Owner GitHub Handle"]})`) ||
        "        ",
    };

    // Add the updated row to the array
    rows.push(newRow);

    rowIndex++;
  })
  .on("end", () => {
    // Convert the updated rows back to CSV
    const csvOutput = stringify(rows, { header: true });

    // Write the updated CSV to a new file
    fs.writeFileSync(outputFilePath, csvOutput, "utf8");

    console.log(`Updated CSV file created at ${outputFilePath}`);
  });
