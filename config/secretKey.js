module.exports = {
    cookieOptions: {
        secret: 'cookieSecret',
            // expires: 설정하지 않을 때는 브라우저 창 닫을 때 삭제 
            // maxAge: expires 보다 우선 되는 쿠키 만료 시간
            // path: "/", // 어떤 path에서 가능한지 > / 는 전부 가능
        domain: "hufspace.com", 
        httpOnly: true, // Javascript로 쿠키 접근 x
        secure: true, // https인 경우만 접속
        sameSite: 'none',
        // store: sessionStore,
        // resave: true, // 세션을 언제나 저장할지 정하는 값
        // saveUninitialized: true // 세션이 저장되기 전에 unitialized 상태로 미리 만들어서 저장
    },
    jwtSecretKey: 'jwtSecret',
    jwtOptions: {
        algorithm: "HS256",
        // expiresIn: "30m", 설정 안 하면 영구 지속
        issuer: "HUFSpace"
    }
};