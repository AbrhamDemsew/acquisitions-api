export const formatValidationErrors = (errors) => {
    if (!errors || !errors.issues) return 'validation failed';

    return errors.issues.map((error) => {
        const { path, message } = error;
        return {
            field: path.join('.'),
            message,
        };
    });
};