@Billing =
  settings: {}
  config: (opts) ->
    defaults = 
      publishableKey: ''
      showInvoicePeriod: true
    @settings = _.extend defaults, opts
  createToken: (form, callback) ->
    Stripe.setPublishableKey(@settings.publishableKey);
    $form = $(form)
    Stripe.card.createToken(
      number: $form.find('[name=cc-num]').val()
      exp_month: $form.find('[name=cc-exp-month]').val()
      exp_year: $form.find('[name=cc-exp-year]').val()
      cvc: $form.find('[name=cc-cvc]').val()
    , callback) # callback(status, response)