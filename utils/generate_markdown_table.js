const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const minimist = require("minimist");

// Parse command-line arguments
const args = minimist(process.argv.slice(2));
const inputFileName = args["input-file"]; // Use the --input-file argument to pass the CSV file path
if (!inputFileName) {
  console.error(
    "Please provide the name of the CSV file using the --input-file argument."
  );
  process.exit(1);
}
const inputFilePath = path.join(__dirname, inputFileName);
const readmeFilePath = path.join(__dirname, "../README.md");

// Function to pad a string with spaces to ensure proper alignment
function padString(str, length) {
  return str + " ".repeat(Math.max(length - str.length, 0));
}

const sanitizeString = (str) => {
  return str.replace(/[\n|]/g, " ");
};

const rows = [];
let rowIndex = 0;

fs.createReadStream(inputFilePath)
  .pipe(csv())
  .on("data", (row) => {
    rowIndex++;

    // Sanitize the strings to avoid issues in markdown formatting
    const sanitizedName = sanitizeString(row["Name"]);
    const sanitizedDescription = sanitizeString(row["Description"]);
    const sanitizedInstructions = sanitizeString(row["Instructions"]);
    const sanitizedStatus = sanitizeString(row["Status"]);
    const sanitizedContributor = sanitizeString(row["Contributor"] || "");

    // Padding the strings to align the table properly
    const indexCell = padString(`${rowIndex}`, 3);
    const nameCell = padString(sanitizedName, 25);
    const descriptionCell = padString(sanitizedDescription, 70); // Decreased width for earlier wrapping
    const instructionsCell = padString(sanitizedInstructions, 50);
    const statusCell = padString(sanitizedStatus, 15); // Increased width for longer statuses
    const contributorCell = padString(sanitizedContributor, 15);

    // Generate the markdown table row using the padded strings
    const tableRow = `| ${indexCell} | ${nameCell} | ${descriptionCell} | ${instructionsCell} | ${statusCell} | ${contributorCell} |`;

    // Add the formatted row to the rows array
    rows.push(tableRow);
  })
  .on("end", () => {
    // Define the markdown table header
    const header = `
|     | Name                     | Description                                                                                            | Instructions                                           | Status       | Contributor     |
| --- | ------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ | ------------ | --------------- |
        `.trim();

    // Combine the header and rows into the final markdown content
    const markdownTable = `${header}\n${rows.join("\n")}`;

    // Read the existing README file
    fs.readFile(readmeFilePath, "utf8", (err, data) => {
      if (err) {
        console.error(`Error reading README file: ${err}`);
        return;
      }

      // Replace the content between the markers with the new table
      const updatedReadme = data.replace(
        /<!-- TABLE_START -->[\s\S]*<!-- TABLE_END -->/,
        `<!-- TABLE_START -->\n${markdownTable}\n<!-- TABLE_END -->`
      );

      // Write the updated content back to the README file
      fs.writeFile(readmeFilePath, updatedReadme, "utf8", (err) => {
        if (err) {
          console.error(`Error writing updated README file: ${err}`);
        } else {
          console.log("README file successfully updated.");
        }
      });
    });
  });
