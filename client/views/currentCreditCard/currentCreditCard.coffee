currentCardComputation = Deps.autorun ->
  billing = Meteor.user().billing
  console.log 'autoruning'
  if billing and billing.customerId and billing.cardId
    Meteor.call 'retrieveCard', billing.customerId, billing.cardId, (err, response) ->
      unless err then Session.set 'currentCreditCard.card', response

Template.currentCreditCard.helpers
  card: ->
    Session.get 'currentCreditCard.card'
