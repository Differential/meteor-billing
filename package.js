Package.describe({
  summary: "Various billing functionality packaged up"
});

Package.on_use(function (api, where) {
  api.use([
    'templating',
    'handlebars',
    'less'
  ], 'client');

  api.add_files([
    'client/creditCard/creditCard.html',
    'client/creditCard/creditCard.less'
  ], 'client');

  api.add_files([
    'public/img/credit-cards.png',
    'public/img/cvc.png'
  ], 'client')
});