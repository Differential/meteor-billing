Template.charges.created = ->
  Session.set 'charges.error', null
  Session.set 'charges.success', null
  Session.set 'charges.charges', null

Template.charges.rendered = ->
  usr = BillingUser.current()

  unless usr then return

  if not Session.get 'charges.charges'
    Session.set 'charges.working', true
    Meteor.call 'listCharges', (error, response) ->
      Session.set 'charges.working', false
      if error
        if error.error is 404
          Session.set 'charges.charges', null
        else
          Session.set 'charges.error', t9n('Error getting charges')
      else
        Session.set 'charges.charges', response.data

inDollars = (amt) ->
  currency = Billing.settings.currency
  if amt >= 0
    "#{currency}#{(amt / 100).toFixed(2)}"
  else
    "-#{currency}#{Math.abs(amt / 100).toFixed(2)}"

formatDate = (timestamp) ->
  d = new Date(timestamp * 1000)
  monthOrDay = [d.getMonth()+1, d.getDate()]
  if Billing.settings.ddBeforeMm
    monthOrDay.reverse()
  monthOrDay.join('/') + '/' + d.getFullYear()


Template.charges.helpers
  billingError: ->
    Session.get 'charges.error'

  billingSuccess: ->
    Session.get 'charges.success'

  charges: ->
    Session.get 'charges.charges'

  chargesWorking: ->
    Session.get 'charges.working'


Template._charge.helpers
  chargeDate: (timestamp) ->
    formatDate(timestamp)

  chargeAmt: (amt) ->
    inDollars(amt)
