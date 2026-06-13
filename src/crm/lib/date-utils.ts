export const formatExcelDate = (val: any) => {
  if (!val) return "N/A";
  // Attempt to parse as number in case it's an Excel serial string
  const num = Number(val);
  if (!isNaN(num) && num > 10000 && num < 60000) {
    // Excel date serial to JS Date
    const date = new Date(Math.round((num - 25569) * 86400 * 1000));
    return date.toLocaleDateString('en-GB').replace(/\//g, '-');
  }
  return String(val);
};

export const calculateAge = (dobStr: string) => {
  if (!dobStr || dobStr === "N/A") return 0;
  
  let birthDate: Date;
  
  // Handle DD-MM-YYYY (which is what formatExcelDate returns) or YYYY-MM-DD
  if (dobStr.includes('-')) {
    const parts = dobStr.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        birthDate = new Date(dobStr);
      } else {
        // DD-MM-YYYY
        birthDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      }
    } else {
      birthDate = new Date(dobStr);
    }
  } else {
    birthDate = new Date(dobStr);
  }

  if (isNaN(birthDate.getTime())) return 0;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
