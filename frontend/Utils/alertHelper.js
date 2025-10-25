import Swal from "sweetalert2";
import { useContext } from "react";
import { ThemeContext } from "../src/components/Context/ThemeContext";

// Small hook wrapper to use inside your components
export const useAlerts = () => {
  const { theme } = useContext(ThemeContext);
  console.log(theme)

  const getThemeColors = () => {
    return theme === "dark"
      ? {
          background: "#0d1117",
          textColor: "#d6e6e6",
          confirmButtonColor: "#4A9549", // dark green
          cancelButtonColor: "#EF4444",
        }
      : {
          background: "#E2E8F0",
          textColor: "#111",
          confirmButtonColor: "#5CAC54",
          cancelButtonColor: "#d33",
        };
  };

  const showConfirm = async ({
    title = "Are you sure?",
    text = "",
    icon = "warning",
    confirmText = "Yes",
    cancelText = "No",
    width = "600px",
  }) => {
    const colors = getThemeColors();
    return await Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      background: colors.background,
      color: colors.textColor,
      confirmButtonColor: colors.confirmButtonColor,
      cancelButtonColor: colors.cancelButtonColor,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      width,
      customClass: {
        popup: "custom-swal",
        title: "custom-swal-title",
      },
    });
  };

  const showSuccess = ({ text = "", title = "Success!" }) => {
    const colors = getThemeColors();
    return Swal.fire({
      title,
      text,
      icon: "success",
      background: colors.background,
      color: colors.textColor,
      confirmButtonColor: colors.confirmButtonColor,
    });
  };

  const showError = ({ text = "", title = "Error!" }) => {
    const colors = getThemeColors();
    return Swal.fire({
      title,
      text,
      icon: "error",
      background: colors.background,
      color: colors.textColor,
      confirmButtonColor: colors.cancelButtonColor,
    });
  };

  return { showConfirm, showSuccess, showError };
};
