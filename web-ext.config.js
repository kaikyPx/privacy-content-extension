module.exports = {
  // Configuração do web-ext
  sourceDir: '.',
  artifactsDir: 'dist',
  ignoreFiles: [
    'node_modules/**',
    'dist/**',
    '.git/**',
    '*.md',
    '*.txt',
    'test-*.html',
    '.github/**'
  ],
  build: {
    overwriteDest: true
  },
  run: {
    startUrl: 'https://privacy.com.br',
    firefox: false,
    chromiumBinary: 'google-chrome'
  }
};
