import Swal from "sweetalert2";
export const warning = (message, type, textButton = "OK") => {
  Swal.fire({
    title: message,
    icon: type,
    confirmButtonText: textButton
  });
};

export default {
  warning
};
