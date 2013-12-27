Future = Meteor.require('fibers/future')

Meteor.methods
  createCustomer: (userId, card, callback) -> 
    Stripe = StripeAPI(Billing.settings.apiKey)
    user = BillingUser.find(_id: userId)
    console.log user
    return


    if user
      future = new Future()
      updateUser = Meteor.bindEnvironment (error, customer) =>
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
              if callback then callback(Stripe, customer)
              future.return()
      , (error) ->
        console.log error
        future.throw error

      console.log 'Creating customer...', email
      Stripe.customers.create
        email: email
        card: card.id
      , updateUser

      future.wait()

Meteor.call 'createCustomer'