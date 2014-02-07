@Billing =
  settings: {}
  config: (opts) ->
    defaults =
      secretKey: ''
    @settings = _.extend defaults, opts


Meteor.publish 'currentUser', ->
  Meteor.users.find _id: @userId, 
    fields: billing: 1