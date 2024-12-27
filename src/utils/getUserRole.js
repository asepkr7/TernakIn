import Cookies from "js-cookie";

export const getUserRole = () => {
  try {
    // Ambil token dari cookies
    const token = Cookies.get("user");
    if (!token) {
      console.warn("No user token found in cookies.");
      return null; // Return null jika token tidak ditemukan
    }

    // Parse token JSON untuk mendapatkan data pengguna
    const user = JSON.parse(token);

    // Periksa apakah role tersedia
    if (user && user.role) {
      return user.role; // Return role jika tersedia
    }

    console.warn("Role not found in user token.");
    return null; // Return null jika tidak ada role
  } catch (error) {
    console.error("Error parsing user token:", error);
    return null; // Return null jika terjadi error
  }
};
