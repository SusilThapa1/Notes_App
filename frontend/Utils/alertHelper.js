import Swal from "sweetalert2";

// Reusable confirm dialog
export const showConfirm = async ({
  title = "Are you sure?",
  text = "",
  icon = "warning",
  confirmText = "Yes",
  cancelText = "No",
  width = "600px",
}) => {
  return await Swal.fire({
  title,
  text,
  icon,
  showCancelButton: true,
  background: "#E2E8F0",
  confirmButtonColor: "#49bb0f",
  cancelButtonColor: "#d33",
   confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  width,
  customClass: {
    popup: "custom-swal",
    title: "custom-swal-title",
    htmlContainer: "custom-swal-text", // text/body area
  },
});
};

// Quick success popup
export const showSuccess = ({ text = "", title = "Success!" }) => {
  return Swal.fire({
    title,
    text,
    icon: "success",
    background: "#E2E8F0",
    // buttonsStyling: false,
    confirmButtonColor: "#49bb0f",
  });
};

// Quick error popup
export const showError = ({ text = "", title = "Error!" }) => {
  return Swal.fire({
    title,
    text,
    icon: "error",
    background: "#E2E8F0",
    // buttonsStyling: false,
    confirmButtonColor: "#d33",
  });
};
