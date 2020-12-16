const template = require('../../templates/server/locale');
const config = require('../../lib/config');
const stylesheet = require('../../lib/stylesheet');

module.exports = () => ({
  method: 'GET',
  path: '/admin/locale',
  config: {
    auth: false
  },
  handler: (req, reply) => {
    const stylesheetHelper = stylesheet(config('NODE_ENV') === 'production');

    reply(
      template({ stylesheetTag: stylesheetHelper.tag('admin'), baseURL: config('PUBLIC_WT_URL') })
    );
  }
});
