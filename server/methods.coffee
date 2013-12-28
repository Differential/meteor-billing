Future = Meteor.require('fibers/future')

Meteor.methods

  #
  #  Creates stripe customer then updates the user document with the stripe customerId and cardId
  #
  createCustomer: (userId, card) -> 
    Stripe = StripeAPI(Billing.settings.secretKey)
    user = BillingUser.first(_id: userId)
    unless user then throw new Meteor.Error 404, "User not found."

    future = new Future()
    Stripe.customers.create
      email: user.emails[0].address
      card: card.id
    , Meteor.bindEnvironment (error, customer) =>
        if error
          throw new Meteor.Error 500, "Error creating customer."
        else
          Meteor.users.update
            _id: user._id
          , $set:
            'profile.customerId': customer.id
            'profile.cardId': customer.default_card
          , (error) ->
            if error
              throw new Meteor.Error 500, 'Error updating customer information.'
            else
              future.return()
      , (error) ->
        console.log error
        future.throw error
    future.wait()