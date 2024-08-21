# Utility Scripts

These scripts are only to be used by maintainers of this repository in order to automatically update files and tables.

- **generate_formatted_csv.js**: creates CSV from exported table in Coda.
  - example usage:
  ```
  node generate_formatted_csv --input-file input.csv
  ```
- **generate_markdown_table.js**: replaces table in README with updated values supplied from formatted CSV input
  - example usage:
  ```
  node generate_markdown_table --input-file input.csv
  ```
- **generate_readme_files.js**: generates markdown files for each application in the input CSV, if not yet created.
- example usage:
  ```
  node generate_readme_files --input-file input.csv
  ```
