module.exports = {
  apps: [
    {
      name: 'oddsx-frontend',
      cwd: './',
      script: 'node_modules/.bin/vite',
      args: '--port 9990',
      env: {
        NODE_ENV: 'production',
        PORT: 9990
      },
      watch: false,
      ignore_watch: ['node_modules', 'logs', '*.config.*', '*.ts'],
      error_file: 'logs/frontend-err.log',
      out_file: 'logs/frontend-out.log',
      time: true
    },
    {
      name: 'oddsx-backend',
      cwd: './',
      script: 'server/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 9991,
        VUE_APP_API_URL: 'http://localhost:9991/api',
        CLIENT_URL: 'http://localhost:9991'
      },
      watch: false,
      ignore_watch: ['node_modules', 'logs', '*.config.*', '*.ts'],
      error_file: 'logs/backend-err.log',
      out_file: 'logs/backend-out.log',
      time: true
    }
  ]
}; 