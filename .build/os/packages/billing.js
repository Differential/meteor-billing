(function () {

/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
// packages/billing/collections/users.coffee.js                                    //
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var _ref,             
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BillingUser = (function(_super) {
  __extends(BillingUser, _super);

  function BillingUser() {
    _ref = BillingUser.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  BillingUser._collection = Meteor.users;

  return BillingUser;

})(Minimongoid);
/////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
// packages/billing/server/billing.coffee.js                                       //
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
this.Billing = {
  settings: {},
  config: function(opts) {
    var defaults;
    defaults = {
      secretKey: ''
    };
    return this.settings = _.extend(defaults, opts);
  }
};
/////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
// packages/billing/server/methods.coffee.js                                       //
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  createCustomer: function(userId, card) {
    var Stripe, create, customer, e, user;
    console.log('Creating customer for', userId);
    user = BillingUser.first({
      _id: userId
    });
    if (!user) {
      throw new Meteor.Error(404, "User not found.  Customer cannot be created.");
    }
    Stripe = StripeAPI(Billing.settings.secretKey);
    create = Async.wrap(Stripe.customers, 'create');
    try {
      customer = create({
        email: user.emails[0].address,
        card: card.id
      });
      return Meteor.users.update({
        _id: user._id
      }, {
        $set: {
          'profile.customerId': customer.id,
          'profile.cardId': customer.default_card
        }
      });
    } catch (_error) {
      e = _error;
      console.error(e);
      throw new Meteor.Error(500, e.message);
    }
  },
  updateSubscription: function(userId, params) {
    var Stripe, customerId, e, subscription, updateSubscription, user;
    console.log('Updating subscription for', userId);
    user = BillingUser.first({
      _id: userId
    });
    if (user) {
      customerId = user.profile.customerId;
    }
    if (!(user && customerId)) {
      new Meteor.Error(404, "User not found.  Subscription cannot be updated.");
    }
    if (user.profile.waiveFees || user.profile.admin) {
      return;
    }
    Stripe = StripeAPI(Billing.settings.secretKey);
    updateSubscription = Async.wrap(Stripe.customers, 'updateSubscription');
    try {
      subscription = updateSubscription(customerId, params);
      return Meteor.users.update({
        _id: userId
      }, {
        $set: {
          'profile.subscriptionId': subscription.id
        }
      });
    } catch (_error) {
      e = _error;
      console.error(e);
      throw new Meteor.Error(500, e.message);
    }
  },
  cancelSubscription: function(customerId) {
    var Stripe, cancelSubscription, e, user;
    console.log('Canceling subscription for', customerId);
    user = BillingUser.first({
      'profile.customerId': customerId
    });
    if (!user) {
      new Meteor.Error(404, "User not found.  Subscription cannot be canceled.");
    }
    Stripe = StripeAPI(Billing.settings.secretKey);
    cancelSubscription = Async.wrap(Stripe.customers, 'cancelSubscription');
    try {
      return cancelSubscription(customerId);
    } catch (_error) {
      e = _error;
      console.error(e);
      throw new Meteor.Error(500, e.message);
    }
  },
  subscriptionDeleted: function(customerId) {
    var Stripe, deleteCard, e, user;
    console.log('Subscription deleted for', customerId);
    user = BillingUser.first({
      'profile.customerId': customerId
    });
    if (!user) {
      new Meteor.Error(404, "User not found.  Subscription cannot be deleted.");
    }
    user.update({
      'profile.subscriptionId': null
    });
    Stripe = StripeAPI(Billing.settings.secretKey);
    deleteCard = Async.wrap(Stripe.customers, 'deleteCard');
    try {
      deleteCard(user.profile.customerId, user.profile.cardId);
      return user.update({
        'profile.cardId': null
      });
    } catch (_error) {
      e = _error;
      console.error(e);
      throw new Meteor.Error(500, e.message);
    }
  },
  restartSubscription: function(userId, card) {
    var Stripe, createCard, customerId, e, newCard, user;
    console.log('Restarting subscription for', userId);
    user = BillingUser.first({
      _id: userId
    });
    if (user) {
      customerId = user.profile.customerId;
    }
    if (!(user && customerId)) {
      new Meteor.Error(404, "User not found.  Subscription cannot be restarted.");
    }
    Stripe = StripeAPI(Billing.settings.secretKey);
    createCard = Async.wrap(Stripe.customers('createCard'));
    try {
      newCard = createCard(customerId, {
        card: card.id
      });
      return user.update({
        'profile.cardId': newCard.id
      });
    } catch (_error) {
      e = _error;
      console.error(e);
      throw new Meteor.Error(500, e.message);
    }
  },
  getInvoices: function() {
    var Stripe, customerId, e, invoices;
    console.log('Getting past invoices for', Meteor.userId());
    Stripe = StripeAPI(Billing.settings.secretKey);
    customerId = Meteor.user().profile.customerId;
    try {
      invoices = Async.wrap(Stripe.invoices, 'list')({
        customer: customerId
      });
    } catch (_error) {
      e = _error;
      console.error(e);
      throw new Meteor.Error(500, e.message);
    }
    return invoices;
  },
  getUpcomingInvoice: function() {
    var Stripe, customerId, e, invoice;
    console.log('Getting upcoming invoice for', Meteor.userId());
    Stripe = StripeAPI(Billing.settings.secretKey);
    customerId = Meteor.user().profile.customerId;
    try {
      invoice = Async.wrap(Stripe.invoices, 'retrieveUpcoming')(customerId);
    } catch (_error) {
      e = _error;
      console.error(e);
      throw new Meteor.Error(500, e.message);
    }
    return invoice;
  }
});
/////////////////////////////////////////////////////////////////////////////////////

}).call(this);
