const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
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
const outputDir = path.join(__dirname, "../apps"); // Directory for the output
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

fs.createReadStream(inputFilePath)
  .pipe(csv())
  .on("data", (row) => {
    const fileName = `${row["Name"].replaceAll(/[/\n ]/g, "-")}.md`;

    const filePath = path.join(outputDir, fileName);
    const content = `# ${row["Name"]}\n\n${row["Description"]}\n\n[GitHub](${row["GitHub"]})`;

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`Created ${fileName}`);
    }
  })
  .on("end", () => {
    console.log("CSV file successfully processed");
  });
