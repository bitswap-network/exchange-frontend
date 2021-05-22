export const api =
    process.env.NODE_ENV === 'development'
        ? 'https://bitswap-core-api-staging.herokuapp.com/'
        : 'https://bitwap-core-api.herokuapp.com/'
export const identityURL = 'https://identity.bitclout.com'
