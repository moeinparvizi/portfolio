// Use Nest's compiled output so the deployment traces its runtime dependencies
// and preserves the decorator metadata emitted by the TypeScript compiler.
const { createApp } = require('./dist/src/main.js');

// Reuse the initialized application on warm invocations.
let application;
module.exports = async function handler(req, res) {
  application ??= createApp().catch(error => {
    application = undefined;
    throw error;
  });
  const app = await application;
  return app.getHttpAdapter().getInstance()(req, res);
};
