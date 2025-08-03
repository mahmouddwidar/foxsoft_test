import * as Yup from "yup";

const loginSchema = Yup.object({
    email: Yup.string().email("Email is invalid!")
        .required("Email is Required."),
    password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required.")
});

export { loginSchema }