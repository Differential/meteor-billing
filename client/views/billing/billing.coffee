Template.billing.created = ->
  Session.set 'billing.error', null
  Session.set 'billing.success', null
  Session.set 'billing.invoices.past', null
  Session.set 'billing.invoices.upcoming', null

  Meteor.call 'getInvoices', (error, response) ->
    if error then Session.set 'billing.error', 'Error getting past invoices.'
    else Session.set 'billing.invoices.past', response.data

  Meteor.call 'getUpcomingInvoice', (error, response) ->
    if error
      Session.set 'billing.error', 'Error getting upcoming invoice.'
    else
      response.id = new Meteor.Collection.ObjectID().toHexString()
      Session.set 'billing.invoices.upcoming', response

inDollars = (amt) ->
  if amt >= 0
    "$#{(amt / 100).toFixed(2)}"
  else
    "-$#{Math.abs(amt / 100).toFixed(2)}"

formatDate = (timestamp) ->
  d = new Date(timestamp * 1000)
  d.getMonth()+1 + '/' + d.getDate() + '/' + d.getFullYear()


Template.billing.helpers
  billingError: ->
    Session.get 'billing.error'

  billingSuccess: ->
    Session.get 'billing.success'

  cancelingSubscription: ->
    Session.get 'billing.cancelingSubscription'

  invoices: ->
    Session.get 'billing.invoices.past'

  upcomingInvoice: ->
    Session.get 'billing.invoices.upcoming'

  showPricingPlan: ->
    Billing.settings.showPricingPlan

  pricingPlan: ->
    upcomingInvoice = Session.get 'billing.invoices.upcoming'
    if upcomingInvoice
      sub = _.findWhere upcomingInvoice.lines.data, type: 'subscription'
      plan = sub.plan
      "#{inDollars(plan.amount)}/#{plan.interval}"


Template.billing.events
  'click #cancel-subscription': (e) ->
    e.preventDefault()
    $('#confirm-cancel-subscription').modal('show')


#
#  Cancel Subscription Modal
#
Template.cancelSubscriptionModal.created = ->
  Session.set 'billing.cancelingSubscription', false

Template.cancelSubscriptionModal.events
  'click .btn-confirm-cancel-subscription': (e) ->
    e.preventDefault()
    $('#confirm-cancel-subscription').modal('hide')
    Session.set 'billing.cancelingSubscription', true
    Meteor.call 'cancelSubscription', Meteor.user().profile.customerId, (error, response) ->
      Session.set 'billing.cancelingSubscription', false
      if error
        billingError.set 'Error canceling subscription.'
      else
        Session.set 'billing.success', 'Your subscription has been canceled.'


Template._invoice.helpers
  lineItemDescription: ->
    if @type is 'subscription'
      "Subscription to #{@plan.name} (#{inDollars(@plan.amount)}/#{@plan.interval})"
    else if @type is 'invoiceitem'
      @description

  lineItemPeriod: ->
    if @period.start is @period.end then formatDate(@period.start)
    else "#{formatDate(@period.start)} - #{formatDate(@period.end)}"

  invoiceDate: (timestamp) ->
    formatDate(timestamp)

  invoiceAmt: (amt) ->
    inDollars(amt)

  showInvoicePeriod: ->
    Billing.settings.showInvoicePeriod

  invoiceExplaination: ->
    Billing.settings.invoiceExplaination