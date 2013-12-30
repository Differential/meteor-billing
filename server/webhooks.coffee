RESTstop.add 'webhooks', ->
  console.log 'Recieving Webhook --- ', @params.type

  switch @params.type
    when 'charge.failed'
      RESTstop.call @, 'cancelSubscription', @params.data.object.customer
    when 'customer.subscription.deleted'
      RESTstop.call @, 'disableCustomer', @params.data.object.customer
    when 'customer.deleted'
      User.destroyAll 'profile.customerId': @params.data.object.id
    else console.log(@params.type, 'was ignored')