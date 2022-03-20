const QRCode = require('qrcode');
const redis = require('redis');

const signupDB = require('./database/bizomsignup');

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

const getTenantDBNameByID = async (companyID) => {
    const data = await signupDB.query(`SELECT dbname FROM companies WHERE id=${companyID}`);
    if(!data || !data[0]['dbname'])
        throw new Error('Tenant not found.');

    return data[0]['dbname'];
}

module.exports = {
    convertJWTToBuffer,
    setAuthenticationTokenCache,
    getAuthenticationTokenCache,
    getTenantDBNameByID
};