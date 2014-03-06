$.validator.setDefaults
  errorClass: 'error-msg'
  errorPlacement: (error, element) ->
    error.appendTo(element.parents('.form-group'))
  highlight: (element, errorClass) ->
    $(element).parents('.form-group').addClass('has-error')
  unhighlight: (element, errorClass) ->
    $(element).parents('.form-group').removeClass('has-error')

$.validator.addMethod "exactlength", (value, element, param) ->
  @optional(element) || value.length is param
, $.validator.format "Must be {0} digits."

@ccValidation = 
  'cc-num':
    required: true
    creditcard: true
  'cc-exp-month':
    required: true
    digits: true
    exactlength: 2
    range: [1, 12]
  'cc-exp-year':
    required: true
    digits: true
    exactlength: 4
  'cc-cvc':
    required: true
    digits: true
    rangelength: [3, 4]
  'cc-address-line-1':
    required: true
  'cc-address-city':
    required: true
  'cc-address-state':
    required: true
  'cc-address-zip':
    required: true