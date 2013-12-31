Future = Meteor.require('fibers/future')

Meteor.methods

  #
  # Creates stripe customer then updates the user document with the stripe customerId and cardId
  #
  createCustomer: (userId, card) ->
    console.log 'Creating customer for', userId    
    user = BillingUser.first(_id: userId)
    unless user then throw new Meteor.Error 404, "User not found.  Customer cannot be created."

    future = new Future()
    Stripe = StripeAPI(Billing.settings.secretKey)
    Stripe.customers.create
      email: user.emails[0].address
      card: card.id
    , Meteor.bindEnvironment (error, customer) =>
        if error then throw new Meteor.Error 500, "Error creating customer."
        else
          Meteor.users.update
            _id: user._id
          , $set:
            'profile.customerId': customer.id
            'profile.cardId': customer.default_card
          , (error) ->
            if error then throw new Meteor.Error 500, 'Error updating customer information.'
            else future.return()
      , (error) ->        
        future.throw new Meteor.Error error.error, error.message
    future.wait()

  updateSubscription: (userId, plan, quantity) ->
    console.log 'Updating subscription for', userId    
    user = BillingUser.first(_id: userId)
    if user then customerId = user.profile.customerId
    unless user and customerId then new Meteor.Error 404, "User not found.  Subscription cannot be updated."
    if user.profile.waiveFees or user.profile.admin then return

    future = new Future()
    Stripe = StripeAPI(Billing.settings.secretKey)
    Stripe.customers.updateSubscription customerId, 
      plan: plan
      prorate: true
      quantity: quantity
    , Meteor.bindEnvironment (error, subscription) =>
        if error
          console.log error 
          throw new Meteor.Error 500, "Error updating subscription."
        Meteor.users.update
          _id: userId
        , $set:
          'profile.subscriptionId': subscription.id
        , (error) ->
          if error then throw new Meteor.Error 500, "Error updating customer information."
          else future.return()
      , (error) ->
        future.throw error
    future.wait()


  #
  # Manually cancels the stripe subscription for the provided customerId
  #
  cancelSubscription: (customerId) ->
    user = BillingUser.first('profile.customerId': customerId)
    unless user then new Meteor.Error 404, "User not found.  Subscription cannot be canceled."
    
    future = new Future()
    console.log 'Canceling subscription for', user.emails[0].address
    Stripe = StripeAPI(Billing.settings.secretKey)
    Stripe.customers.cancelSubscription customerId, 
      Meteor.bindEnvironment (error, confirmation) =>
        if error then throw new Meteor.Error 500, error.message
        else future.return()
      , (error) ->
        future.throw error
    future.wait()

  #
  # Remove subscriptionId, 
  #
  subscriptionDeleted: (customerId) ->
    user = BillingUser.first('profile.customerId': customerId)
    unless user then new Meteor.Error 404, "User not found.  Subscription cannot be deleted."

    future = new Future()
    Stripe = StripeAPI(Billing.settings.secretKey)
    console.log 'Disabling account for ', user.emails[0].address
    # Mark the profile as disabled and delete the default card
    user.update('profile.subscriptionId': null)
    Stripe.customers.deleteCard user.profile.customerId, 
      user.profile.cardId, 
      Meteor.bindEnvironment (error, confirmation) =>
        if error
          console.log error
          throw new Meteor.Error 500, error.message
        else
          user.update('profile.cardId': null)
          future.return([200])
      , (error) ->
        future.throw error
    future.wait()

  #
  # Restart a subscription that was previously canceled
  #
  restartSubscription: (userId, card) ->
    user = BillingUser.first(_id: userId)
    if user then customerId = user.profile.customerId
    unless user and customerId then new Meteor.Error 404, "User not found.  Subscription cannot be restarted."

    future = new Future()
    Stripe = StripeAPI(Billing.settings.secretKey)
    Stripe.customers.createCard customerId, card: card.id, 
      Meteor.bindEnvironment (error, card) =>
        if error
          console.log error
          throw new Meteor.Error 500, error.message
        else
          user = User.first('profile.customerId': customerId)
          if user
            user.update('profile.cardId': card.id)
            updateSubscription()
            future.return([200])
      , (error) ->
        future.throw error
    future.wait()


  #
  # Get past invoices
  #
  getInvoices: ->
    future = new Future()
    Stripe = StripeAPI(Billing.settings.secretKey)
    Stripe.invoices.list customer: Meteor.user().profile.customerId, (error, invoices) ->
      if error then future.throw error
      else future.return invoices
    future.wait()


  #
  # Get next invoice
  #
  getUpcomingInvoice: ->
    future = new Future()
    Stripe = StripeAPI(Billing.settings.secretKey)
    Stripe.invoices.retrieveUpcoming customer: Meteor.user().profile.customerId, (error, upcoming) ->
      if error then future.throw error
      else future.return upcoming
    future.wait()