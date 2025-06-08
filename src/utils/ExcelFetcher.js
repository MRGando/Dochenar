import * as XLSX from "xlsx";

const fetchExcelFile = async (url) => {
    try {
        const res = await fetch(`/data/${url}`);
        const arrayBuffer = await res.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        return jsonData; // Return the parsed data
    } catch (error) {
        console.error("Error fetching Excel file:", error);
        throw error;
    }
};

export default fetchExcelFile;