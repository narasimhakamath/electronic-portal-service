const QRCode = require('qrcode');
const redis = require('redis');

const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
});

const convertJWTToBuffer = async (jsonwebtoken) => {
    const bufferData = await QRCode.toBuffer(jsonwebtoken);
    return bufferData;
}

const setAuthenticationTokenCache = async (companyID, warehouseID, authenticationToken) => {
    await redisClient.connect();
    await redisClient.setEx(`${companyID}_${warehouseID}`, process.env.MASTERGST_TOKEN_EXPIRY, authenticationToken);
}

const getAuthenticationTokenCache = async (companyID, warehouseID) => {
    const token = await redisClient.connect();
    return await redisClient.get(`${companyID}_${warehouseID}`);
}

getAuthTokenCache(1, 2);

module.exports = {
    convertJWTToBuffer,
    setAuthenticationTokenCache,
    getAuthenticationTokenCache
};