---
layout: default
username: Differential
repo: meteor-billing
version: 0.2.9
desc: A meteorite package for various billing functions using stripe
---
# meteor-billing

This package is currently a container for a lot of reusable components related to subscription billing using stripe.


## Client
#### Configure
{% highlight coffeescript %}
Billing.config
  publishableKey: your_publishable_key
{% endhighlight %}

#### Usage
{% assign cc = '{{> creditCard}}' %}
`{{ cc }}` - Renders a simple form to collect credit card information. This form will use parsley.js to validate in the client and show errors.

{% assign inv = '{{> invoices}}' %}
`{{ inv }}` - Renders a list of past and upcoming invoices for the logged in customer.


## Server
#### Configure
{% highlight coffeescript %}
Billing.config
  secretKey: your_secret_key
{% endhighlight %}


#### Usage
* `createCustomer: (userId, card)` where userId is Meteor's user collection _id and card is the token returned from `Billing.createToken(form)` on the client.  This sets `billing.customerId` and `billing.cardId` on the associated user.
* `createCard: (userId, card)` where card is the token returned from `Billing.createToken(form)` on the client.  This sets `billing.cardId` on the associated user.
* `retrieveCard: (userId, cardId)`
* `deleteCard: (userId)`
* `createCharge: (params)` where params is a hash of options for stripe. ex: `params = amount: amount, currency: 'usd', customer: user.billing.customerId, description: "Something here", statement_description: "WHATEVER"`
* `listCharges: (params)`
* `updateSubscription: (userId, params)` where params is a hash of options for stripe.  ex: `params = plan: 'standard', quantity: quantity, prorate: false, trial_end: someDate`.  This sets `billing.subscriptionId` to the subscription id returned from stripe.
* `cancelSubscription: (customerId)` where customerId is the stripe customer id (`user.billing.customerId`).
* `getInvoices`: Gets a list of past invoices for current user.
* `getUpcomingInvoice`: Gets the next invoice for current user.

## Stripe Configuration
The package provides a basic handler for a few events:
* `charge.failed`: Cancels the associated user's subscription.
* `customer.subscription.deleted`: Deletes the subscriptionId and planId from the associated user's `billing` object.
* `customer.deleted`: Deletes the associated user from the database

To use these default handlers, use your stripe dashboard to set the webhooks url to `your_url/api/webhooks`.
You can of course, provide your own handlers instead of using these by pointing the webhooks url to your own implementation.


## Example:
{% highlight html %}
<form novalidate>
  {{ cc }}
  <button type="submit" class="btn btn-primary btn-block upgrade" disabled="{{working}}">
    Upgrade Today
    {{#if working}}
      <i class="fa fa-spinner fa-spin"></i>
    {{/if}}
  </button>
</form>
{% endhighlight %}

{% highlight coffeescript %}
"click button": (e) ->
    e.preventDefault()
    Session.set 'working', true

    Billing.createToken $("form"), (status, response) ->
      if response.error
        Session.set 'error', response.error.message
        Session.set 'working', false
      else
        Meteor.call 'createCustomer', Meteor.userId(), response, (error, response) ->
          Session.set 'working', false
          if error
            Session.set 'error', error.reason
{% endhighlight %}
