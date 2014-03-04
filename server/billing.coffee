@Billing =
  settings: {}
  config: (opts) ->
    defaults =
      secretKey: ''
    @settings = _.extend defaults, opts