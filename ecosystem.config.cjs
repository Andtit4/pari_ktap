module.exports = {
  apps: [
    {
      name: 'oddsx-frontend',
      cwd: './',
      script: 'node_modules/.bin/vite',
      args: '--port 9000',
      env: {
        NODE_ENV: 'production',
        PORT: 9000
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
        PORT: 9001,
        VUE_APP_API_URL: 'http://localhost:9001/api',
        CLIENT_URL: 'http://localhost:9000'
      },
      watch: false,
      ignore_watch: ['node_modules', 'logs', '*.config.*', '*.ts'],
      error_file: 'logs/backend-err.log',
      out_file: 'logs/backend-out.log',
      time: true
    }
  ]
}; 