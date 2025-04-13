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
      watch: true,
      ignore_watch: ['node_modules', 'logs'],
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
        PORT: 9990,
        VUE_APP_API_URL: 'http://localhost:9909/api',
        CLIENT_URL: 'http://localhost:9990'
      },
      watch: true,
      ignore_watch: ['node_modules', 'logs'],
      error_file: 'logs/backend-err.log',
      out_file: 'logs/backend-out.log',
      time: true
    }
  ]
}; 