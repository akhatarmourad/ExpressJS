export const createProjectValidationSchema = {
    title: {
        isLength: {
            options: {
                min: 8,
                max: 20,
            },
            errorMessage: "Title must be between 8 and 20 characters",
        },
        notEmpty: {
            errorMessage: "Title is required",
        },
        isString: true,
    },
    category: {},
};