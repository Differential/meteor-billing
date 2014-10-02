Package.describe({
  name: "ryw:billing",
  summary: "Various billing functionality packaged up.",
  version: "2.0.2",
  git: "https://github.com/Differential/meteor-billing"
});

Npm.depends({
  stripe: "2.8.0"
});

Package.on_use(function (api, where) {
  api.versionsFrom("METEOR@0.9.0");

  api.use([
    'templating',
    'less',
    'jquery',
    'deps',
    'natestrauser:parsleyjs@1.1.7',
    'anti:i18n@0.4.3'
  ], 'client');

  api.use([
    'accounts-password',
    'arunoda:npm@0.2.6',
    'hellogerard:reststop2@0.5.9'
  ], 'server');

  api.use([
    'coffeescript',
    'mrt:minimongoid@0.8.3'
  ], ['client', 'server']);


  api.addFiles([
    'collections/users.coffee'
  ], ['client', 'server']);

  api.addFiles([
    'client/views/creditCard/creditCard.html',
    'client/views/creditCard/creditCard.less',
    'client/views/creditCard/creditCard.coffee',
    'client/views/invoices/invoices.html',
    'client/views/invoices/invoices.coffee',
    'client/views/invoices/invoices.less',
    'client/views/charges/charges.html',
    'client/views/charges/charges.coffee',
    'client/views/charges/charges.less',
    'client/views/currentCreditCard/currentCreditCard.html',
    'client/views/currentCreditCard/currentCreditCard.coffee',
    'client/lib/parsley.css',
    'client/startup.coffee',
    'client/billing.coffee',
    'client/index.html',
    'client/styles.less',
    'public/img/credit-cards.png',
    'public/img/cvc.png',
    'client/i18n/english.coffee',
    'client/i18n/arabic.coffee',
    'client/i18n/french.coffee'
  ], 'client');

  api.addFiles([
    'server/startup.coffee',
    'server/billing.coffee',
    'server/methods.coffee',
    'server/webhooks.coffee'
  ], 'server');

  api.export('BillingUser', ['server', 'client']);
  api.export('i18n', 'client');

});
