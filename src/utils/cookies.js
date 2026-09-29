export const cookies = {
  getOptions: () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    sameSite: 'strict',
    path: '/',
  }),

  set: (res, name, value, options = {}) => {
    const cookieOptions = { ...cookies.getOptions(), ...options };
    res.cookie(name, value, cookieOptions);
  },

  clear: (res, name, options = {}) => {
    const clearOptions = { ...cookies.getOptions(), ...options };
    delete clearOptions.maxAge;
    res.clearCookie(name, clearOptions);
  },

  get: (req, name) => {
    return req.cookies?.[name];
  },
};
