Result = ->
  _dep: new Deps.Dependency
  _val: null
  _hasRun: false

  _get: ->
    @_dep.depend()
    @_val
  
  _set: (val) ->
    unless EJSON.equals @_val, val
      @_val = val
      @_dep.changed()


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

  _results: {}

  getResults: (methodName) ->
    unless @_results[methodName]
      @_results[methodName] = new Result

    res = @_results[methodName]._get()
    if res then @_results[methodName] = null
    res

  call: (methodName, params) ->
    results = @_results
    
    unless results[methodName]
      results[methodName] = new Result
    
    unless results[methodName]._hasRun
      results[methodName]._hasRun = true
      args = Array.prototype.splice.call arguments, 1
      Meteor.apply methodName, args, (err, res) ->
        results[methodName]._set res

    ready: ->
      res = results[methodName]._get()
      if res then true else false