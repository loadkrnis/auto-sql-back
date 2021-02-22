const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = (req, res, next) => {
    // 인증 완료
    try {
        // 요청 헤더에 저장된 토큰(req.headers.authorization)과 비밀키를 사용하여 토큰 반환
        req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.hashedEmail = req.decoded.hashed_email;
        return next();
    }

    // 인증 실패
    catch (error) {
        // 유효기간이 초과된 경우
        if (error.name === 'TokenExpiredError') {
            return res.status(419).json({
                code: 419,
                message: '토큰이 만료되었습니다.'
            });
        }

        // 토큰의 비밀키가 일치하지 않는 경우
        return res.status(401).json({
            code: 401,
            message: '유효하지 않은 토큰입니다.'
        });
    }
}

exports.authOnlyAccessToken = (req, res, next) => {
    // 인증 완료
    try {
        // 요청 헤더에 저장된 토큰(req.headers.authorization)과 비밀키를 사용하여 토큰 반환
        req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.hashedEmail = req.decoded.hashed_email;
        if (req.decoded.type != "ACCESS") {
            throw new Error('NotRefreshTokenError');
        }
        return next();
    }
    // 인증 실패
    catch (error) {
        // 유효기간이 초과된 경우
        if (error.name === 'NotRefreshTokenError') {
            return res.status(400).json({
                code: 400,
                message: '[Refresh]토큰이 아닙니다. 현재 토큰은 [' + req.decoded.type + ']토큰입니다.',
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(419).json({
                code: 419,
                message: '토큰이 만료되었습니다.'
            });
        }

        // 토큰의 비밀키가 일치하지 않는 경우
        return res.status(401).json({
            code: 401,
            message: '유효하지 않은 토큰입니다.'
        });
    }
}