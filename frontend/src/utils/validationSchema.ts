import * as Yup from "yup";

const loginSchema = Yup.object({
    email: Yup.string().email("Email is invalid!")
        .required("Email is Required."),
    password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required.")
});

const postSchema = Yup.object().shape({
    title: Yup.string()
        .required('Title is required')
        .max(255, 'Title must be less than 255 characters'),
    content: Yup.string()
        .required('Content is required'),
    status: Yup.string()
        .required('Status is required')
        .oneOf(['published', 'draft'], 'Invalid status')
});

export { loginSchema, postSchema }