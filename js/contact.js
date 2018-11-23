$(document).ready(function(){
    
    (function($) {
        "use strict";

    
    jQuery.validator.addMethod('answercheck', function (value, element) {
        return this.optional(element) || /^\bcat\b$/.test(value)
    }, "type the correct answer -_-");

		
	var processingSubmit = false;
	var submitDone = false;
	
    // validate contactForm form
    $(function() {
        $('#contactForm').validate({
            rules: {
                name: {
                    required: true,
                    minlength: 2
                },
                subject: {
                    required: true,
                    minlength: 4
                },
                email: {
                    required: true,
                    email: true
                },
                message: {
                    required: true,
                    minlength: 6
                }
            },
            messages: {
                name: {
                    required: "Please enter your name",
                    minlength: "Your name must consist of at least 2 characters"
                },
                subject: {
                    required: "Please fill in the subject for this mail",
                    minlength: "Mail Subject must consist of at least 4 characters"
                },
                email: {
                    required: "No email, no message"
                },
                message: {
                    required: "Please fill in the body to send this mail.",
                    minlength: "Message must be at least 6 characters."
                }
            },
            submitHandler: function(form) {
				if(processingSubmit == true || submitDone == true) {
					return;
				}
				processingSubmit = true;
				disableSubmit();
				var data = {};
				
                $(form).ajaxSubmit(
					{
                    type:"POST",
                    data: JSON.stringify(ConvertFormToJSON(form)),
					url: '/',
					dataType: 'json',
                    success: function(response) {
						$('#error').fadeOut();
                        $('#contactForm :input').attr('disabled', 'disabled');
                        $('#contactForm').fadeTo( "slow", 0.15, function() {
                            $(this).find(':input').attr('disabled', 'disabled');
                            $(this).find('label').css('cursor','default');
							$('#success p').text(response.message);
							$('#captchaBox').css('visibility', 'hidden');//Hide the captcha
                            $('#success').fadeIn();
							
							submitDone = true;
                        })
                    },
                    error: function(err) {
						$('#success').fadeOut();
						$('#error p').text('Sorry! Message not sent. '+err.responseJSON.message);
                        $('#error').fadeIn();
						
						processingSubmit = false;
						enableSubmit();
                    }
                })
            }
        })
    })
        
 })(jQuery)
});

function ConvertFormToJSON(form) {
    var array = jQuery(form).serializeArray();
    var json = {};
    
    jQuery.each(array, function() {
        json[this.name] = this.value || '';
    });
    return json;
}

function disableSubmit(){
	$('#submitForm').css('cursor', 'not-allowed');
	$('#submitForm').css('opacit', '.4');
}

function enableSubmit(){
	$('#submitForm').removeAttr('style');
}