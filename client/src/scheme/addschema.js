import * as yup from "yup";

export const AddSchema = yup.object({
  title: yup
    .string()
    .min(3,"Title must be of min 3 letters")
    .required("Add Title"),

  description: yup
    .string()
    .min(5,"description must be of min 5 letters")
    .required("Add description"),
});
