module.exports = {
  apps: [
    {
      name: 'SEIDOR-B1CENTER-SERVER-PROD',
      script: 'dist/main.js',
      instances: 4,
      exec_mode: 'cluster',
      autorestart: true,
      out_file: './logs/production/outputs/output.log',
      error_file: './logs/production/errors/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      log_type: 'json',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'SEIDOR-B1CENTER-SERVER-TEST',
      script: 'dist/main.js',
      autorestart: true,
      out_file: './logs/test/outputs/output.log',
      error_file: './logs/test/errors/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      log_type: 'json',
      env: {
        NODE_ENV: 'test',
      },
    },
  ],
};
