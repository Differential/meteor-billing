Package.describe({
  summary: "Various billing functionality packaged up."
});

Package.on_use(function (api, where) {
  api.use([
    'templating',
    'less',
    'jquery',
    'deps',
    'jquery-validation',
    'just-i18n'
  ], 'client');

  api.use([
    'accounts-password',
    'npm',
    'reststop2'
  ], 'server');

  api.use([
    'coffeescript',
    'minimongoid',
    'stripe-server'
  ], ['client', 'server']);


  api.add_files([
    'collections/users.coffee'
  ], ['client', 'server']);

  api.add_files([
    'client/views/creditCard/creditCard.html',
    'client/views/creditCard/creditCard.less',
    'client/views/invoices/invoices.html',
    'client/views/invoices/invoices.coffee',
    'client/views/invoices/invoices.less',
    'client/views/currentCreditCard/currentCreditCard.html',
    'client/views/currentCreditCard/currentCreditCard.coffee',
    'client/startup.coffee',
    'client/billing.coffee',
    'client/index.html',
    'client/styles.less',
    'client/validation.coffee',
    'public/img/credit-cards.png',
    'public/img/cvc.png',
    'client/i18n/english.coffee'
  ], 'client');

  api.add_files([
    'server/startup.coffee',
    'server/billing.coffee',
    'server/methods.coffee',
    'server/webhooks.coffee'
  ], 'server'); 

  api.export('BillingUser', ['server', 'client']);

});