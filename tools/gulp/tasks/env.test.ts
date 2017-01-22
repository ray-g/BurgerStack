export = () => {
  process.env.NODE_ENV = 'test';
  process.env.CHROME_BIN = '/usr/bin/chromium-browser';
};
