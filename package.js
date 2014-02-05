Package.describe({
  summary: "Various billing functionality packaged up."
});

Package.on_use(function (api, where) {
  api.use([
    'templating',
    'less',
    'jquery',
    'jquery-validation'
  ], 'client');

  api.use([
    'npm'
  ], 'server');

  api.use([
    'coffeescript',
    'minimongoid',
    'stripe'
  ], ['client', 'server']);



  api.add_files([
    'collections/users.coffee'
  ], ['client', 'server']);

  api.add_files([
    'client/views/creditCard/creditCard.html',
    'client/views/creditCard/creditCard.less',
    'client/views/billing/billing.html',
    'client/views/billing/billing.coffee',
    'client/views/billing/billing.less',
    'client/billing.coffee',
    'client/index.html',
    'client/styles.less',
    'client/validation.coffee',
    'public/img/credit-cards.png',
    'public/img/cvc.png'
  ], 'client');

  api.add_files([
    'server/billing.coffee',
    'server/methods.coffee'
  ], 'server');

  api.add_files([
  'client/i18n/english.coffee'
  ], 'client');
  
  api.use('just-i18n', 'client')

  api.export('BillingUser', 'server');

});