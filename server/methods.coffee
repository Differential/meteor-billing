Meteor.methods

  #
  # Creates stripe customer then updates the user document with the stripe customerId and cardId
  #
  createCustomer: (userId, card) ->
    console.log 'Creating customer for', userId
    user = BillingUser.first(_id: userId)
    unless user then throw new Meteor.Error 404, "User not found.  Customer cannot be created."

    Stripe = StripeAPI(Billing.settings.secretKey)
    create = Async.wrap Stripe.customers, 'create'
    try
      customer = create email: user.emails[0].address, card: card.id
      Meteor.users.update _id: user._id,
        $set: 'profile.customerId': customer.id, 'profile.cardId': customer.default_card
    catch e
      console.error e
      throw new Meteor.Error 500, e.message

  #
  # Update stripe subscription for user with provided plan and quantitiy
  #
  updateSubscription: (userId, plan, quantity) ->
    console.log 'Updating subscription for', userId
    user = BillingUser.first(_id: userId)
    if user then customerId = user.profile.customerId
    unless user and customerId then new Meteor.Error 404, "User not found.  Subscription cannot be updated."
    if user.profile.waiveFees or user.profile.admin then return

    Stripe = StripeAPI(Billing.settings.secretKey)
    updateSubscription = Async.wrap Stripe.customers, 'updateSubscription'
    try
      subscription = updateSubscription customerId, plan: plan, prorate: false, quantity: quantity
      Meteor.users.update _id: userId,
        $set: 'profile.subscriptionId': subscription.id
    catch e
      console.error e
      throw new Meteor.Error 500, e.message

  #
  # Manually cancels the stripe subscription for the provided customerId
  #
  cancelSubscription: (customerId) ->
    console.log 'Canceling subscription for', customerId
    user = BillingUser.first('profile.customerId': customerId)
    unless user then new Meteor.Error 404, "User not found.  Subscription cannot be canceled."

    Stripe = StripeAPI(Billing.settings.secretKey)
    cancelSubscription = Async.wrap Stripe.customers, 'cancelSubscription'
    try
      cancelSubscription customerId
    catch e
      console.error e
      throw new Meteor.Error 500, e.message


  #
  # A subscription was deleted from Stripe, remove subscriptionId and card from user.
  #
  subscriptionDeleted: (customerId) ->
    console.log 'Subscription deleted for', customerId
    user = BillingUser.first('profile.customerId': customerId)
    unless user then new Meteor.Error 404, "User not found.  Subscription cannot be deleted."
    
    user.update('profile.subscriptionId': null)

    Stripe = StripeAPI(Billing.settings.secretKey)
    deleteCard = Async.wrap Stripe.customers, 'deleteCard'
    try
      deleteCard user.profile.customerId, user.profile.cardId
      user.update('profile.cardId': null)
    catch e
      console.error e
      throw new Meteor.Error 500, e.message


  #
  # Restart a subscription that was previously canceled
  #
  restartSubscription: (userId, card) ->
    console.log 'Restarting subscription for', userId
    user = BillingUser.first(_id: userId)
    if user then customerId = user.profile.customerId
    unless user and customerId then new Meteor.Error 404, "User not found.  Subscription cannot be restarted."

    Stripe = StripeAPI(Billing.settings.secretKey)
    createCard = Async.wrap Stripe.customers 'createCard'
    try
      newCard = createCard customerId, card: card.id
      user.update('profile.cardId': newCard.id)
    catch e
      console.error e
      throw new Meteor.Error 500, e.message

  #
  # Get past invoices
  #
  getInvoices: ->
    console.log 'Getting past invoices for', Meteor.userId()
    Stripe = StripeAPI(Billing.settings.secretKey)
    customerId = Meteor.user().profile.customerId
    try
      invoices = Async.wrap(Stripe.invoices, 'list')(customer: customerId)
    catch e
      console.error e
      throw new Meteor.Error 500, e.message
    invoices
    

  #
  # Get next invoice
  #
  getUpcomingInvoice: ->    
    console.log 'Getting upcoming invoice for', Meteor.userId()    
    Stripe = StripeAPI(Billing.settings.secretKey)
    customerId = Meteor.user().profile.customerId
    try
      invoice = Async.wrap(Stripe.invoices, 'retrieveUpcoming')(customerId)
    catch e
      console.error e
      throw new Meteor.Error 500, e.message
    invoice