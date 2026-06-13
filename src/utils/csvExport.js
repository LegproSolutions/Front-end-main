// Lightweight CSV export using SheetJS (xlsx) already present in the project
// Usage: exportToCSV({ data, filename, columns })
// - data: Array of objects
// - filename: string without extension (defaults to 'export')
// - columns: optional array of { header: string, accessor: (row) => any }
//   If omitted, all enumerable keys of the first item will be used.

import * as XLSX from "xlsx";

function toRows(data, columns) {
  if (!Array.isArray(data) || data.length === 0) return [];
  if (!columns || columns.length === 0) {
    // Auto columns from union of keys
    const keys = Array.from(
      data.reduce((set, row) => {
        Object.keys(row || {}).forEach((k) => set.add(k));
        return set;
      }, new Set())
    );
    return data.map((row) => {
      const obj = {};
      keys.forEach((k) => {
        const v = row?.[k];
        obj[k] = v == null ? "" : v;
      });
      return obj;
    });
  }
  // Build rows using accessors
  return data.map((row) => {
    const obj = {};
    columns.forEach(({ header, accessor }) => {
      const value = typeof accessor === "function" ? accessor(row) : row?.[accessor];
      obj[header] = value == null ? "" : value;
    });
    return obj;
  });
}

export function exportToCSV({ data, filename = "export", columns }) {
  try {
    const rows = toRows(data, columns);
    if (rows.length === 0) {
      console.warn("exportToCSV: no data to export");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(rows);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Failed to export CSV:", err);
  }
}
