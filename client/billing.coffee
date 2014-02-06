@Billing =
  settings: {}
  config: (opts) ->
    defaults = 
      publishableKey: ''
      showInvoicePeriod: true
      showPricingPlan: true
      invoiceExplaination: ''
      currency: '$'
      language: 'en'
      ddBeforeMm: false #for countries with date format dd/mm/yyyy
    i18n.setLanguage opts and opts.language or defaults.language

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