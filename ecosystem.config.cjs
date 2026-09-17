module.exports = {
  apps: [
    {
      name: 'api',
      cwd: './apps/api',
      script: 'bun',
      args: 'run dev',
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
    },
    {
      name: 'web',
      cwd: './apps/web',
      script: 'bun',
      args: 'run dev',
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
    },
    {
      name: 'worker',
      cwd: './apps/worker',
      script: 'bun',
      args: 'run dev',
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
    },
    {
      name: 'bot',
      cwd: './apps/bot',
      script: 'bun',
      args: 'run dev',
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
