Template.invoices.created = ->
  Session.set 'invoices.error', null
  Session.set 'invoices.success', null
  Session.set 'invoices.invoices.past', null
  Session.set 'invoices.invoices.upcoming', null

  Meteor.call 'getInvoices', (error, response) ->
    if error then Session.set 'invoices.error', i18n('Error getting past invoices.')
    else Session.set 'invoices.invoices.past', response.data

  Meteor.call 'getUpcomingInvoice', (error, response) ->
    if error
      Session.set 'invoices.error', i18n('Error getting upcoming invoice.')
    else
      response.id = new Meteor.Collection.ObjectID().toHexString()
      Session.set 'invoices.invoices.upcoming', response

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


Template.invoices.helpers
  billingError: ->
    Session.get 'invoices.error'

  billingSuccess: ->
    Session.get 'invoices.success'

  cancelingSubscription: ->
    Session.get 'invoices.cancelingSubscription'

  invoices: ->
    Session.get 'invoies.invoices.past'

  upcomingInvoice: ->
    Session.get 'invoices.invoices.upcoming'

  showPricingPlan: ->
    Billing.settings.showPricingPlan

  pricingPlan: ->
    upcomingInvoice = Session.get 'invoies.invoices.upcoming'
    if upcomingInvoice
      sub = _.findWhere upcomingInvoice.lines.data, type: 'subscription'
      plan = sub.plan
      "#{inDollars(plan.amount)}/#{i18n(plan.interval)}"


Template.invoices.events
  'click #cancel-subscription': (e) ->
    e.preventDefault()
    $('#confirm-cancel-subscription').modal('show')


#
#  Cancel Subscription Modal
#
Template.cancelSubscriptionModal.created = ->
  Session.set 'invoices.cancelingSubscription', false

Template.cancelSubscriptionModal.events
  'click .btn-confirm-cancel-subscription': (e) ->
    e.preventDefault()
    $('#confirm-cancel-subscription').modal('hide')
    Session.set 'invoices.cancelingSubscription', true
    Meteor.call 'cancelSubscription', Meteor.user().billing.customerId, (error, response) ->
      Session.set 'invoices.cancelingSubscription', false
      if error
        Session.set 'invoices.error', i18n('Error canceling subscription.')
      else
        Session.set 'invoices.success', i18n('Your subscription has been canceled.')


Template._invoice.helpers
  lineItemDescription: ->
    if @type is 'subscription'
      "#{i18n("Subscription to")} #{@plan.name} (#{inDollars(@plan.amount)}/#{i18n(@plan.interval)})"
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