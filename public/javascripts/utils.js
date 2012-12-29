define('utils', [
    'jquery',
    'jqueryui'
], function ($, ui) {

	var utils = {
			
	    stringRegex: /^([a-zA-Z0-9]){0,1}([a-zA-Z0-9])+$/,
	    emailRegex: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
	
	    displayValidationErrors: function (messages) {
	        for (var key in messages) {
	            if (messages.hasOwnProperty(key)) {
	                this.addValidationError(key, messages[key]);
	            }
	        }
	        this.showAlert('Warning!', 'Validation errors please try again.', 'alert-warning');
	    },
	
	    addValidationError: function (field, message) {
	        var controlGroup = (field == 'identity' || field == 'verified') ? $('#' + field).parent().parent() : $('#' + field).parent().parent().parent();
	        controlGroup.addClass('error');
	        $('.help-block', controlGroup).html(message);
	    },
	
	    removeValidationError: function (field, message) {
	        var controlGroup = (field == 'identity' || field == 'verified') ? $('#' + field).parent().parent() : $('#' + field).parent().parent().parent();
	        controlGroup.removeClass('error');
	        $('.help-block', controlGroup).html(message ? message : 'Completed successfully.');
	    },
	
	    showAlert: function (title, text, klass) {
	        $('.alert').removeClass("alert-error alert-warning alert-success alert-info");
	        $('.alert').addClass(klass);
	        $('.alert .message').html('<strong>' + title + '</strong> ' + text);
	        $('.alert').show();
	        var fadeOut = setTimeout("$('.alert').fadeOut('slow');", 3000);
	        $(".alert").click(function () {
	            clearTimeout(fadeOut);
	            $("#message-icon").toggleClass("icon-lock");
	        });
	        /*$(".alert").bind('click hover', function () {
	        clearTimeout(fadeOut);
	        $("#message-icon").attr('class', 'icon-lock');
	        $("#message-icon").toggle('icon-lock');
	    });*/
	    },
	
	    hideAlert: function () {
	        $('.alert').hide();
	    },
	
	    gridLoader: function () {
	        $('#loader').css('display', 'inline-block');
	        var min = 50;
	        var max = 100;
	        var random = Math.floor(Math.random() * (max - min + 1)) + min;
	        $('.bar').css('width', random + '%');
	        setTimeout("$('#loader').css('display','none');", 300);
	    },
	
	    formLoader: function () {
	        setTimeout("$('#user-form-modal').modal('hide');", 300);
	        $('#loading').css('display', 'inline-block');
	        var min = 50;
	        var max = 100;
	        var random = Math.floor(Math.random() * (max - min + 1)) + min;
	        $('.bar').css('width', random + '%');
	        setTimeout("$('#loading').css('display','none');", 300);
	    }
    
	};

    return utils;

});