const LogService = require('../services/log.service');
const jwt = require('jsonwebtoken');
const getIp = require('../utils/getIp');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

async function logMiddleware(req, res, next) {
    if (req.originalUrl.startsWith('/api/auth/login') || req.originalUrl.startsWith('/api/auth/register')) {
        return next();
    }

    const actions = ['POST', 'PUT', 'PATCH', 'DELETE'];
    if (!actions.includes(req.method)) {
        return next();
    }

    let userId = null;
    try {
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            userId = decoded.id;
        }
    } catch (err) {
        console.warn('Không decode được token để log:', err.message);
    }

    // Override res.json để lấy dữ liệu trả về từ controller
    const oldJson = res.json;
    res.json = function (body) {
        res.locals.responseBody = body; // lưu response body để log
        return oldJson.apply(this, arguments);
    }

    res.on('finish', async () => {
        try {
            const data = res.locals.responseBody?.data;

            // Suy ra targetType từ URL (bỏ /api, lấy segment thứ 2)
            const urlParts = req.originalUrl.split('/').filter(Boolean);
            const targetType = urlParts[1]?.toLowerCase().replace(/s$/, '') || null;


            // targetId lấy từ response nếu có
            const targetId = data?.id || null;

            await LogService.create({
                userId,
                action: req.method,
                targetId,
                targetType,
                ip: getIp(req)
            });


        } catch (error) {
            console.error('Ghi log thất bại:', error.message);
        }
    });

    next();
}

module.exports = logMiddleware;
