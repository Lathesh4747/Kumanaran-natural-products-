"use client";

import Swal from "sweetalert2";

// Single styled instance — visuals live in the .knp-swal-* rules in globals.css
// (buttonsStyling off) so dialogs match the Liquid Glass theme and use tokens only.
const swal = Swal.mixin({
  buttonsStyling: false,
  reverseButtons: true,
  customClass: {
    popup: "knp-swal-popup",
    title: "knp-swal-title",
    htmlContainer: "knp-swal-text",
    actions: "knp-swal-actions",
    cancelButton: "knp-swal-cancel",
  },
});

export async function confirmDelete(
  text = "This action cannot be undone.",
  confirmButtonText = "Delete",
): Promise<boolean> {
  const result = await swal.fire({
    title: "Are you sure?",
    text,
    icon: "warning",
    showCancelButton: true,
    focusCancel: true,
    confirmButtonText,
    cancelButtonText: "Cancel",
    customClass: {
      popup: "knp-swal-popup",
      title: "knp-swal-title",
      htmlContainer: "knp-swal-text",
      actions: "knp-swal-actions",
      confirmButton: "knp-swal-confirm-danger",
      cancelButton: "knp-swal-cancel",
    },
  });
  return result.isConfirmed;
}

export async function alertSuccess(text: string, title = "Done"): Promise<void> {
  await swal.fire({
    title,
    text,
    icon: "success",
    timer: 1800,
    showConfirmButton: false,
  });
}

export async function alertError(text: string, title = "Something went wrong"): Promise<void> {
  await swal.fire({
    title,
    text,
    icon: "error",
    confirmButtonText: "OK",
    customClass: {
      popup: "knp-swal-popup",
      title: "knp-swal-title",
      htmlContainer: "knp-swal-text",
      actions: "knp-swal-actions",
      confirmButton: "knp-swal-confirm",
    },
  });
}
