export default {
  port: 1337,
  host: "localhost",
  dbUri: "mongodb://localhost:27017/production-ticketing",
  saltWorkFactor: 10,
  accessTokenTtl: "15m",
  refreshTokenTtl: "1y",
  resetTokenTtl:"15m",
  apiRateLimit : 500,
  loginRateLimit : 20,
  privateKey: `MIICWwIBAAKBgQCQNBc4IP`,
};
