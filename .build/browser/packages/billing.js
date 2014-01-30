(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/billing/collections/users.coffee.js                                                            //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var BillingUser, _ref,
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/billing/client/views/creditCard/template.creditCard.js                                         //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
Template.__define__("creditCard",Package.handlebars.Handlebars.json_ast_to_func(["<div class=\"credit-card\">\n    <h2>Billing Info <img src=\"/packages/billing/public/img/credit-cards.png\"></h2>\n    <div class=\"form-section\">\n      <div class=\"form-group\">\n        <label>Card Number</label>\n        <input type=\"number\" name=\"cc-num\" class=\"form-control\" placeholder=\"••••••••••••••••\"/>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-md-7\">\n          <div class=\"expiration\">\n            <label>Expiration</label>\n            <div class=\"row\">\n              <div class=\"col-xs-6\">\n                <div class=\"form-group\">\n                  <input type=\"number\" name=\"cc-exp-month\" class=\"form-control\" placeholder=\"MM\"/>\n                </div>\n              </div>\n              <span> / </span>\n              <div class=\"col-xs-6\">\n                <div class=\"form-group\">\n                  <input type=\"number\" name=\"cc-exp-year\" class=\"form-control\" placeholder=\"YYYY\"/>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n        <div class=\"col-md-5\">\n          <div class=\"form-group\">\n            <label>Card Code <img src=\"/packages/billing/public/img/cvc.png\"></label>\n            <input type=\"number\" name=\"cc-cvc\" class=\"form-control\" placeholder=\"CVC\"/>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>"]));
                                                                                                           // 2
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/billing/client/views/billing/template.billing.js                                               //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
Template.__define__("billing",Package.handlebars.Handlebars.json_ast_to_func(["<div class=\"container billing\">\n    ",["#",[[0,"if"],[0,"billingError"]],["\n      <div class=\"row alert alert-danger\">\n        <div class=\"col-xs-12\">\n          ",["{",[[0,"billingError"]]],"\n        </div>\n      </div>\n    "]],"\n    ",["#",[[0,"if"],[0,"billingSuccess"]],["\n      <div class=\"row alert alert-success\">\n        <div class=\"col-xs-12\">\n          ",["{",[[0,"billingSuccess"]]],"\n        </div>\n      </div>\n    "]],"\n    <div class=\"row\">\n      \n      <div class=\"col-xs-6\">\n        <h2>Past Invoices</h2>\n        <div class=\"panel-group\" id=\"past-invoice-accordion\">\n          ",["#",[[0,"each"],[0,"invoices"]],["\n            ",[">","_invoice"],"\n          "],["\n            <i class=\"fa fa-spinner fa-3x fa-spin billing-loader\"></i>\n          "]],"\n        </div>\n      </div>\n\n      <div class=\"col-xs-6\">\n        <h2>Upcoming Invoice</h2>\n        <div class=\"panel-group\" id=\"upcoming-invoice-accordion\">\n          ",["#",[[0,"with"],[0,"upcomingInvoice"]],["\n            ",[">","_invoice"],"\n          "],["\n            <i class=\"fa fa-spinner fa-3x fa-spin billing-loader\"></i>\n          "]],"\n          </div>\n      </div>    \n    \n    </div>\n    <div class=\"row billing-footer\">\n      <div class=\"col-md-12\">\n        <div class=\"pull-right\">\n          ",["#",[[0,"if"],[0,"showPricingPlan"]],["\n          <div class=\"price\">\n            ",["{",[[0,"pricingPlan"]]],"\n          </div>\n          "]],"\n          <button id=\"cancel-subscription\" class=\"btn btn-danger pull-right\">\n            <i class=\"fa fa-times\"></i>\n            Cancel Subscription\n            ",["#",[[0,"if"],[0,"cancelingSubscription"]],["\n              <i class=\"fa fa-spinner fa-spin\"></i>\n            "]],"\n          </button>\n        </div>\n      </div>\n    </div>\n  </div>\n  ",[">","cancelSubscriptionModal"]]));
Template.__define__("cancelSubscriptionModal",Package.handlebars.Handlebars.json_ast_to_func(["<div class=\"modal fade\" id=\"confirm-cancel-subscription\" tabindex=\"-1\">\n    <div class=\"modal-dialog\">\n      <div class=\"modal-content\">\n        <div class=\"modal-header\">\n          <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n          <h4 class=\"modal-title\" id=\"myModalLabel\">Confirm Cancelling Subscription</h4>\n        </div>\n        <div class=\"modal-body\">\n          Are you sure you want to cancel your subscription?  Your data will be saved, so you can re-enable your account at any time.\n        </div>\n        <div class=\"modal-footer\">\n          <button type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\"><i class=\"fa fa-times\"></i> Cancel</button>\n          <button type=\"button\" class=\"btn btn-blue btn-confirm-cancel-subscription\">\n            <i class=\"fa fa-check\"></i> \n            Yes, cancel my subscription\n          </button>\n        </div>\n      </div>\n    </div>\n  </div>"]));
Template.__define__("_invoice",Package.handlebars.Handlebars.json_ast_to_func(["<div class=\"panel panel-default invoice\">\n    <div class=\"panel-heading\">\n      <h4 class=\"panel-title\">\n        <a data-toggle=\"collapse\" href=\"#",["{",[[0,"id"]]],"\">\n          <span class=\"text-primary\">\n            <strong>\n              ",["{",[[0,"invoiceAmt"],[0,"amount_due"]]]," on ",["{",[[0,"invoiceDate"],[0,"","date"]]],"\n            </strong>\n          </span>\n          ",["#",[[0,"if"],[0,"showInvoicePeriod"]],["\n          <span class=\"text-muted pull-right\"><small>",["{",[[0,"invoiceDate"],[0,"period_start"]]]," - ",["{",[[0,"invoiceDate"],[0,"period_end"]]],"<small></span>\n          "]],"\n        </a>\n      </h4>\n    </div>\n    <div id=\"",["{",[[0,"id"]]],"\" class=\"panel-collapse collapse\">\n      <div class=\"panel-body\">\n        <div class=\"clearfix\">\n          <span class=\"pull-left\"><h5>Line Items</h5></span>\n          ",["#",[[0,"if"],[0,"paid"]],["\n          <span class=\"label label-success pull-right\">Paid</span>\n          "]],"\n        </div>\n        ",["#",[[0,"each"],[0,"lines","data"]],["\n          <div class=\"row\">\n            <div class=\"col-md-6\">\n              ",["{",[[0,"lineItemDescription"]]],"\n            </div>\n            <div class=\"col-md-4\">\n              <span class=\"line-item-period pull-right\">",["{",[[0,"lineItemPeriod"]]],"</span>\n            </div>\n            <div class=\"col-md-2\">\n              <span class=\"pull-right\">",["{",[[0,"invoiceAmt"],[0,"amount"]]],"</span>\n            </div>\n          </div>\n        "]],"\n        ",["#",[[0,"unless"],[0,"paid"]],["\n        <div class=\"row billing-disclaimer\">\n          <div class=\"col-md-12\">\n            <em>\n            * ",["{",[[0,"invoiceExplaination"]]],"\n            </em>\n          </div>\n        </div>\n        "]],"\n      </div>\n    </div>\n  </div>"]));
                                                                                                           // 4
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/billing/client/views/billing/billing.coffee.js                                                 //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var formatDate, inDollars;

Template.billing.created = function() {
  Session.set('billing.error', null);
  Session.set('billing.success', null);
  Session.set('billing.invoices.past', null);
  Session.set('billing.invoices.upcoming', null);
  Meteor.call('getInvoices', function(error, response) {
    if (error) {
      return Session.set('billing.error', 'Error getting past invoices.');
    } else {
      return Session.set('billing.invoices.past', response.data);
    }
  });
  return Meteor.call('getUpcomingInvoice', function(error, response) {
    if (error) {
      return Session.set('billing.error', 'Error getting upcoming invoice.');
    } else {
      response.id = new Meteor.Collection.ObjectID().toHexString();
      return Session.set('billing.invoices.upcoming', response);
    }
  });
};

inDollars = function(amt) {
  if (amt >= 0) {
    return "$" + ((amt / 100).toFixed(2));
  } else {
    return "-$" + (Math.abs(amt / 100).toFixed(2));
  }
};

formatDate = function(timestamp) {
  var d;
  d = new Date(timestamp * 1000);
  return d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();
};

Template.billing.helpers({
  billingError: function() {
    return Session.get('billing.error');
  },
  billingSuccess: function() {
    return Session.get('billing.success');
  },
  cancelingSubscription: function() {
    return Session.get('billing.cancelingSubscription');
  },
  invoices: function() {
    return Session.get('billing.invoices.past');
  },
  upcomingInvoice: function() {
    return Session.get('billing.invoices.upcoming');
  },
  showPricingPlan: function() {
    return Billing.settings.showPricingPlan;
  },
  pricingPlan: function() {
    var plan, sub, upcomingInvoice;
    upcomingInvoice = Session.get('billing.invoices.upcoming');
    if (upcomingInvoice) {
      sub = _.findWhere(upcomingInvoice.lines.data, {
        type: 'subscription'
      });
      plan = sub.plan;
      return "" + (inDollars(plan.amount)) + "/" + plan.interval;
    }
  }
});

Template.billing.events({
  'click #cancel-subscription': function(e) {
    e.preventDefault();
    return $('#confirm-cancel-subscription').modal('show');
  }
});

Template.cancelSubscriptionModal.created = function() {
  return Session.set('billing.cancelingSubscription', false);
};

Template.cancelSubscriptionModal.events({
  'click .btn-confirm-cancel-subscription': function(e) {
    e.preventDefault();
    $('#confirm-cancel-subscription').modal('hide');
    Session.set('billing.cancelingSubscription', true);
    return Meteor.call('cancelSubscription', Meteor.user().profile.customerId, function(error, response) {
      Session.set('billing.cancelingSubscription', false);
      if (error) {
        return billingError.set('Error canceling subscription.');
      } else {
        return Session.set('billing.success', 'Your subscription has been canceled.');
      }
    });
  }
});

Template._invoice.helpers({
  lineItemDescription: function() {
    if (this.type === 'subscription') {
      return "Subscription to " + this.plan.name + " (" + (inDollars(this.plan.amount)) + "/" + this.plan.interval + ")";
    } else if (this.type === 'invoiceitem') {
      return this.description;
    }
  },
  lineItemPeriod: function() {
    if (this.period.start === this.period.end) {
      return formatDate(this.period.start);
    } else {
      return "" + (formatDate(this.period.start)) + " - " + (formatDate(this.period.end));
    }
  },
  invoiceDate: function(timestamp) {
    return formatDate(timestamp);
  },
  invoiceAmt: function(amt) {
    return inDollars(amt);
  },
  showInvoicePeriod: function() {
    return Billing.settings.showInvoicePeriod;
  },
  invoiceExplaination: function() {
    return Billing.settings.invoiceExplaination;
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/billing/client/billing.coffee.js                                                               //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
this.Billing = {
  settings: {},
  config: function(opts) {
    var defaults;
    defaults = {
      publishableKey: '',
      showInvoicePeriod: true,
      showPricingPlan: true,
      invoiceExplaination: ''
    };
    return this.settings = _.extend(defaults, opts);
  },
  createToken: function(form, callback) {
    var $form;
    Stripe.setPublishableKey(this.settings.publishableKey);
    $form = $(form);
    return Stripe.card.createToken({
      number: $form.find('[name=cc-num]').val(),
      exp_month: $form.find('[name=cc-exp-month]').val(),
      exp_year: $form.find('[name=cc-exp-year]').val(),
      cvc: $form.find('[name=cc-cvc]').val()
    }, callback);
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/billing/client/validation.coffee.js                                                            //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
$.validator.setDefaults({
  errorClass: 'error-msg',
  errorPlacement: function(error, element) {
    return error.appendTo(element.parents('.form-group'));
  },
  highlight: function(element, errorClass) {
    return $(element).parents('.form-group').addClass('has-error');
  },
  unhighlight: function(element, errorClass) {
    return $(element).parents('.form-group').removeClass('has-error');
  }
});

$.validator.addMethod("exactlength", function(value, element, param) {
  return this.optional(element) || value.length === param;
}, $.validator.format("Must be {0} digits."));

this.ccValidation = {
  'cc-num': {
    required: true,
    creditcard: true
  },
  'cc-exp-month': {
    required: true,
    digits: true,
    exactlength: 2,
    range: [1, 12]
  },
  'cc-exp-year': {
    required: true,
    digits: true,
    exactlength: 4
  },
  'cc-cvc': {
    required: true,
    digits: true,
    rangelength: [3, 4]
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);
