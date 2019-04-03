const date = new Date();

module.exports = {
    accessToken: 'accessToken',
    accessTokenExpiresAt: date.setSeconds(date.getSeconds() + 60 * 60),
    refreshToken: 'refreshToken',
    refreshTokenExpiresAt: date.setSeconds(date.getSeconds() + 60 * 60 * 24 * 24),
    client: {
        id: 'yourClientApplicationId',
        grants: [
            'authorization_code',
            'refresh_token'
        ]
    }
};
