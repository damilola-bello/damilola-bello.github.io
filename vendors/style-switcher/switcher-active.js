/* =================================
===  EXPAND COLLAPSE            ====
=================================== */

$(document).ready(function(){
 $('#toggle-switcher').click(function(){
        if($(this).hasClass('open')){
            $(this).removeClass('open');
            $('#switch-style').animate({'left':'-200px'});
        }else{
            $(this).addClass('open');
            $('#switch-style').animate({'left':'0'});
        }
    });
	$('#toggle-switcher').hover(function(){
		if($(this).hasClass('open')) {
			$(this).attr('title', 'Close Colour Picker Tray');
		} else {
			$(this).attr('title', 'Open Colour Picker Tray');
		}
	});
});