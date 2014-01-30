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


### Server Methods
* `createCustomer: (userId, card)`

