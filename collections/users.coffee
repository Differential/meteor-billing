class BillingUser extends Minimongoid
  @_collection: Meteor.users

  @current: ->
    @first _id: Meteor.userId()