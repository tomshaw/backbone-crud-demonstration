var utils = utils || {};

utils.stringRegex = /^([a-zA-Z0-9]){0,1}([a-zA-Z0-9])+$/;
utils.emailRegex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

utils.displayValidationErrors = function (messages) {
    for (var key in messages) {
        if (messages.hasOwnProperty(key)) {
            this.addValidationError(key, messages[key]);
        }
    }
    this.showAlert('Warning!', 'Validation errors please try again.', 'alert-warning');
};

utils.addValidationError = function (field, message) {
    var controlGroup = (field == 'identity' || field == 'verified') ? $('#' + field).parent().parent(): $('#' + field).parent().parent().parent();
    controlGroup.addClass('error');
    $('.help-block', controlGroup).html(message);
};

utils.removeValidationError = function (field, message) {
	var controlGroup = (field == 'identity' || field == 'verified') ? $('#' + field).parent().parent(): $('#' + field).parent().parent().parent();
    controlGroup.removeClass('error');
    $('.help-block', controlGroup).html(message ? message : 'Completed successfully.');
};

utils.showAlert = function (title, text, klass) {
    $('.alert').removeClass("alert-error alert-warning alert-success alert-info");
    $('.alert').addClass(klass);
    $('.alert .message').html('<strong>' + title + '</strong> ' + text);
    $('.alert').show();
};

utils.hideAlert = function () {
    $('.alert').hide();
};