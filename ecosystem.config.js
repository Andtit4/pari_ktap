module.exports = {
  apps: [{
    name: 'oddsx',
    script: 'npm',
    args: 'run dev:full',
    env: {
      NODE_ENV: 'production',
      PORT: 9990,
      VUE_APP_API_URL: 'http://localhost:9990/api',
      CLIENT_URL: 'http://localhost:9990'
    },
    watch: true,
    ignore_watch: ['node_modules', 'logs'],
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_file: 'logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    instances: 1,
    exec_mode: 'fork'
  }]
}; 