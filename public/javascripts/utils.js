var utils = utils || {};

utils.displayValidationErrors = function (messages) {
    for (var key in messages) {
        if (messages.hasOwnProperty(key)) {
            this.addValidationError(key, messages[key]);
        }
    }
    this.showAlert('Warning!', 'Validation errors please try again.', 'alert-warning');
};

utils.addValidationError = function (field, message) {
    var controlGroup = $('#' + field).parent().parent().parent();
    controlGroup.addClass('error');
    $('.help-block', controlGroup).html(message);
};

utils.removeValidationError = function (field) {
    var controlGroup = $('#' + field).parent().parent().parent();
    controlGroup.removeClass('error');
    $('.help-inline', controlGroup).html('');
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