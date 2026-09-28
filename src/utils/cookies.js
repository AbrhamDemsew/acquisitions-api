export const cookies = {
    getOptions: () => ({
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60, // 24 hours
        sameSite: 'strict'
    }),

    set: (res, name, value, options = {}) => {
        const cookieOptions = { ...cookies.getOptions(), ...options };
        res.cookie(name, value, cookieOptions);
    },

    clear: (res, name) => {
        res.clearCookie(name, cookies.getOptions());
    },

    get: (req, name) => {
        return req.cookies[name];
    }
}