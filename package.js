Package.describe({
  summary: "Various billing functionality packaged up"
});

Package.on_use(function (api, where) {
  api.use([
    'templating',
    'less'
  ], 'client');

  api.use([
    'coffeescript',
    'minimongoid',
    'stripe'
  ], ['client', 'server'])



  api.add_files([
    'collections/users.coffee'
  ], ['client', 'server']);

  api.add_files([
    'client/creditCard/creditCard.html',
    'client/creditCard/creditCard.less',
    'public/img/credit-cards.png',
    'public/img/cvc.png'
  ], 'client');

  api.add_files([
    'server/billing.coffee',
    'server/methods.coffee'
  ], 'server');

  api.export('BillingUser', 'server')
});