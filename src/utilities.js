const QRCode = require('qrcode');

const convertJWTToBuffer = async (jsonwebtoken) => {
    const bufferData = await QRCode.toBuffer(jsonwebtoken);
    return bufferData;
}

module.exports = {
    convertJWTToBuffer
};