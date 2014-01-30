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
{% assign cc = '{{> creditCard}}' %}
`{{ cc }}` - Renders a simple form to collect credit card information.

jQuery validate is already included and an object named `ccValidation` should be available to use for validation rules.
Example:
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

### Server
* `createCustomer: (userId, card)` where userId is Meteor's user collection id and card is the token returned from Billing.createCustomer(form) on the client.

