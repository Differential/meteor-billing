RESTstop.add 'webhooks', ->
  console.log 'Recieving Webhook --- ', @params.type

  switch @params.type
    when 'charge.failed'
      RESTstop.call @, 'cancelSubscription', @params.data.object.customer
    when 'customer.subscription.deleted'
      RESTstop.call @, 'subscriptionDeleted', @params.data.object.customer
    when 'customer.deleted'
      BillingUser.destroyAll 'profile.customerId': @params.data.object.id
    else console.log(@params.type, 'was ignored')