module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  cron:{enabled:true},
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', '2dd2cd40162bcf5a565c82269cc54e99'),
    },
  },
});
