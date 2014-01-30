---
layout: default
username: BeDifferential
repo: meteor-billing
version: 0.0.8
desc: A meteorite package for various billing functions using stripe
---
# meteor-billing

This package is currently a container for a lot of reusable components related to subscription billing using stripe.


### Client
Configure the package:

{% highlight coffeescript %}
Billing.config
  publishableKey: your_publishable_key
{% endhighlight %}

{% assign cc = '{{> creditCard}}' %}
`{{ cc }}` - Renders a simple form to collect credit card information.

Client side example:
{% highlight coffeescript %}
  Template.signUp.rendered = ->
    $('form').validate
      rules: ccValidation
      submitHandler: (form) ->
        Billing.createToken form, (status, response) ->
          unless response.error
            Meteor.call 'createCustomer', Meteor.userId(), response, true, (error, response) ->
              unless error
                Meteor.call 'startSubscription', (error, response) ->
                  doWhatever()
{% endhighlight %}

jQuery validate is already included and an object named `ccValidation` should be available to use for validation rules as shown above.  In this example, `startSubscription` is a server method that creates some params to pass to the provided `updateSubscription` method, shown below.

### Server
* `createCustomer: (userId, card)` where userId is Meteor's user collection id and card is the token returned from Billing.createCustomer(form) on the client.  This sets `profile.customerId` and `profile.cardId` on the associated user.
* `updateSubscription: (userId, params)` where params is a hash of options for stripe.  ex: `params = plan: 'standard', quantity: 0, prorate: false, trial_end: someDate`.  This sets `profile.subscriptionId` to the subscription id returned from stripe.

