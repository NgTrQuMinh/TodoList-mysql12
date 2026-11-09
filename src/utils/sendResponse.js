export const sendResponse = (res, status, data) =>
    res.status(status).json({ success: true, data });