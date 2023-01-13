// JavaScript Document

function showFlashMessage( title, message, message_options )
{	
	var sufix = Math.round( new Date().getTime() / 1000 );
	var message_id = "flash_message_" + sufix;
	
	var html_code = '<div id="' + message_id + '" title="' + title + '">';
	html_code += '<p>';
	
	if ( typeof( message_options ) == 'object' && message_options.type != '' )
	{
		html_code += '<span class="ui-icon ui-icon-info" style="float:left; margin:0 7px 0 0;"></span>';
	}
	html_code += message;
	html_code += '</p>';
	html_code += '</div>';
	
	var width = "auto";
	var height = "auto";
	var modal = true;
	var show_title = true;
	var show_button = true;
	var auto_hide = 0;
	var z_index = 2000;
	if ( typeof( message_options ) == 'object' )
	{
		if ( typeof( message_options.width ) != "undefined" )
			width = parseInt( message_options.width );
		if ( typeof( message_options.height ) != "undefined" )
			height = parseInt( message_options.height );
		if ( typeof( message_options.modal ) != "undefined" )
			modal = message_options.modal;
		if ( typeof( message_options.show_title ) != "undefined" )
			show_title = message_options.show_title;
		if ( typeof( message_options.show_button ) != "undefined" )
			show_button = message_options.show_button;
		if ( typeof( message_options.auto_hide ) != "undefined" )
			auto_hide = parseInt( message_options.auto_hide );
		if ( typeof( message_options.z_index ) != "undefined" )
			z_index = parseInt( message_options.z_index );
	}
	
	var buttons = {
				"  OK  ": function() {
					$( this ).dialog( 'close' );
				}
			};
	if ( !show_button )
		buttons = null;
	$( "body" ).append( html_code );
	$( "#" + message_id ).dialog( 
		{
			bgiframe: true,
			modal: modal,
			width: width,
			height: height,
			buttons: buttons,
			zIndex: z_index
		}
	);
	
	if ( show_title == false )
		$( "div.ui-dialog-titlebar" ).remove();
	if ( auto_hide > 0 )
	{
		setTimeout( "hideFlashMessage( '" + message_id + "' )", auto_hide );
	}

}

function hideFlashMessage( message_id )
{
	$( "#" + message_id ).dialog( 'close' );
}

var current_header = 1;
function showNextHeader( headers_checked )
{
	$("img#header_image_" + current_header).fadeOut( 1000 );
	
	current_header++;
	if ( current_header > headers_checked )
		current_header = 1;
		
	$("img#header_image_" + current_header).fadeIn( 1000 );
}

var current_news_image = 1;
function changeNewsImage( num, cnt_images )
{
	if ( num == -1 ) // previous page
	{
		current_news_image -= 1;
		if ( current_news_image < 1 )
			current_news_image = cnt_images;
	}
	else if ( num == -2 ) // next page
	{
		current_news_image += 1;
		if ( current_news_image > cnt_images )
			current_news_image = 1;		
	}
	else
	{
		current_news_image = num;
	}
	
	$( "img.news-image" ).hide();
	$( "img#news_image_"+current_news_image ).css("display","inline-block");
	$( "a.news-link" ).removeClass( "selected" );
	$( "a#news_link_"+current_news_image ).addClass( "selected" );
}

function postGalleryComment()
{
	
	var params = $("form#comment_form").serialize();
	$.post("/gallery/ajax/post_comment", params, function(data) {
		
		data.popup_options.z_index = 9000;
		showFlashMessage( data.title, data.message, data.popup_options );
		
		$("a#refresh_code").trigger("click");
		
		if( data.popup_options.auto_hide > 0 )
		{
			var gallery_image_id = $("input[name=gallery_images_id]").val();
		//	$("a#gallery_image_" + gallery_image_id).trigger("click");
		//	$("form#comment_form input[type=text],form#comment_form textarea").val("");
		}

	}, "json");
}

function positionLogo(logo)
{
	var logo_parent_height = $(logo).parents('div.logo').height();
	var logo_height = $(logo).height();
	//alert(logo_parent_height + '-' + logo_height);
	var logo_offset = ( logo_parent_height / 2 ) - ( logo_height / 2 );
	//$(logo).parents('div.logo').css( "padding-top", logo_offset + 'px' );
	$(logo).css( "margin-top", logo_offset + 'px' );
}

function count_down_redirect(seconds, redirect)
{
	if (seconds == 0)
	{
		$("div.count-down").html("0");
		window.location = redirect;
	}
	else
	{
		setTimeout("count_down_redirect(" + (seconds - 1) + ", '" + redirect + "')", 1000);
		$("div.count-down").html(seconds);
	}
}

function count_down_submit_form(seconds, form_id)
{
	if (seconds == 0)
	{
		$("div.count-down").html("0");
		$("form#" + form_id).submit();
	}
	else
	{
		setTimeout("count_down_submit_form(" + (seconds - 1) + ", '" + form_id + "')", 1000);
		$("div.count-down").html(seconds);
	}
}

function main_menu_show_hide_children()
{
	$("div#main-menu > ul > li.has-sub").addClass("main");
	$("div#main-menu li.has-sub").hover(
		function()
		{
			var child = $(this).children("ul");
			child.show();
			var offset = child.offset();
			var window_width = $( window ).width();
			var put_right = false;
	
			if ($(this).parent().hasClass("right-menu-first-level") || $(this).parent().hasClass("right-menu-first-level"))
			{
				var parent_offset = $(this).parent().offset();
				
				if (!(parent_offset.left - child.width()) < 0)
					put_right = true;
				
			}
			
			
			if ((offset.left + child.width()) > window_width || put_right)
			{
				if ($(this).hasClass("main"))
					child.addClass("right-menu-first-level");
				else
					child.addClass("right-menu");
			}
			
		},
		function()
		{
			$(this).children("ul").hide();
			$(this).children().each(function(){
				if ($(this).hasClass("right-menu-first-level"))
					$(this).removeClass("right-menu-first-level");
				if ($(this).hasClass("right-menu"))
					$(this).removeClass("right-menu");
			});
		}
	);
}

function scrollToElement(selector, time, verticalOffset) 
{
	//scrollToElement('#content', 500); // scroll the element #content, and take 500ms to get there
	//scrollToElement('#content', 500, -150); // scroll to 150px before the element #content, and take 500ms to get there
	//scrollToElement('#content');
	
    time = typeof(time) != 'undefined' ? time : 1000;
    verticalOffset = typeof(verticalOffset) != 'undefined' ? verticalOffset : 0;
    element = $(selector);
    offset = element.offset();
    offsetTop = offset.top + verticalOffset;
    $('html, body').animate({
        scrollTop: offsetTop
    }, time);
}

function jsSorSliderOptions(slider_type) 
{
	var _SlideshowTransitions = [
         //Collapse Random
         {$Duration: 1000, $Delay: 80, $Cols: 10, $Rows: 4, $Clip: 15, $SlideOut: true, $Easing: $JssorEasing$.$EaseOutQuad }
         //Fade in LR Chess
         , { $Duration: 1200, $Cols: 2, $During: { $Top: [0.3, 0.7] }, $FlyDirection: 4, $ChessMode: { $Column: 12 }, $Easing: { $Top: $JssorEasing$.$EaseInCubic, $Opacity: $JssorEasing$.$EaseLinear }, $ScaleVertical: 0.3, $Opacity: 2 }
         //Rotate VDouble+ out
         , { $Duration: 1000, $Rows: 2, $Zoom: 11, $Rotate: true, $SlideOut: true, $FlyDirection: 6, $Assembly: 2049, $ChessMode: { $Row: 15 }, $Easing: { $Left: $JssorEasing$.$EaseInExpo, $Top: $JssorEasing$.$EaseInExpo, $Zoom: $JssorEasing$.$EaseInExpo, $Opacity: $JssorEasing$.$EaseLinear, $Rotate: $JssorEasing$.$EaseInExpo }, $ScaleHorizontal: 1, $ScaleVertical: 2, $Opacity: 2, $Round: { $Rotate: 0.85} }
         //Swing Inside in Stairs
         , { $Duration: 1200, $Delay: 20, $Cols: 10, $Rows: 4, $Clip: 15, $During: { $Left: [0.3, 0.7], $Top: [0.3, 0.7] }, $FlyDirection: 9, $Formation: $JssorSlideshowFormations$.$FormationStraightStairs, $Assembly: 260, $Easing: { $Left: $JssorEasing$.$EaseInWave, $Top: $JssorEasing$.$EaseInWave, $Clip: $JssorEasing$.$EaseOutQuad }, $ScaleHorizontal: 0.2, $ScaleVertical: 0.1, $Round: { $Left: 1.3, $Top: 2.5} }
         //Zoom HDouble+ out
         , { $Duration: 1200, $Cols: 2, $Zoom: 11, $SlideOut: true, $FlyDirection: 1, $Assembly: 2049, $ChessMode: { $Column: 15 }, $Easing: { $Left: $JssorEasing$.$EaseInExpo, $Zoom: $JssorEasing$.$EaseInExpo, $Opacity: $JssorEasing$.$EaseLinear }, $ScaleHorizontal: 4, $Opacity: 2 }
         //Dodge Pet Inside in Stairs
         , { $Duration: 1500, $Delay: 20, $Cols: 10, $Rows: 4, $Clip: 15, $During: { $Left: [0.3, 0.7], $Top: [0.3, 0.7] }, $FlyDirection: 9, $Formation: $JssorSlideshowFormations$.$FormationStraightStairs, $Assembly: 260, $Easing: { $Left: $JssorEasing$.$EaseInWave, $Top: $JssorEasing$.$EaseInWave, $Clip: $JssorEasing$.$EaseOutQuad }, $ScaleHorizontal: 0.2, $ScaleVertical: 0.1, $Round: { $Left: 0.8, $Top: 2.5} }
         //Rotate Zoom+ out BL
         , { $Duration: 1200, $Zoom: 11, $Rotate: true, $SlideOut: true, $FlyDirection: 9, $Easing: { $Left: $JssorEasing$.$EaseInExpo, $Top: $JssorEasing$.$EaseInExpo, $Zoom: $JssorEasing$.$EaseInExpo, $Opacity: $JssorEasing$.$EaseLinear, $Rotate: $JssorEasing$.$EaseInExpo }, $ScaleHorizontal: 4, $ScaleVertical: 4, $Opacity: 2, $Round: { $Rotate: 0.8} }
         //Dodge Dance Inside in Random
         , { $Duration: 1500, $Delay: 80, $Cols: 10, $Rows: 4, $Clip: 15, $During: { $Left: [0.3, 0.7], $Top: [0.3, 0.7] }, $FlyDirection: 9, $Easing: { $Left: $JssorEasing$.$EaseInJump, $Top: $JssorEasing$.$EaseInJump, $Clip: $JssorEasing$.$EaseOutQuad }, $ScaleHorizontal: 0.3, $ScaleVertical: 0.3, $Round: { $Left: 0.8, $Top: 2.5} }
         //Rotate VFork+ out
         , { $Duration: 1200, $Rows: 2, $Zoom: 11, $Rotate: true, $SlideOut: true, $FlyDirection: 6, $Assembly: 2049, $ChessMode: { $Row: 28 }, $Easing: { $Left: $JssorEasing$.$EaseInExpo, $Top: $JssorEasing$.$EaseInExpo, $Zoom: $JssorEasing$.$EaseInExpo, $Opacity: $JssorEasing$.$EaseLinear, $Rotate: $JssorEasing$.$EaseInExpo }, $ScaleHorizontal: 3, $ScaleVertical: 1, $Opacity: 2, $Round: { $Rotate: 0.7} }
         //Clip and Chess in
         , { $Duration: 1200, $Cols: 10, $Rows: 4, $Clip: 15, $During: { $Top: [0.5, 0.5], $Clip: [0, 0.5] }, $FlyDirection: 8, $Formation: $JssorSlideshowFormations$.$FormationStraight, $ChessMode: { $Column: 12 }, $ScaleClip: 0.5 }
         //Swing Inside in Swirl
         , { $Duration: 1200, $Delay: 20, $Cols: 10, $Rows: 4, $Clip: 15, $During: { $Left: [0.3, 0.7], $Top: [0.3, 0.7] }, $FlyDirection: 9, $Formation: $JssorSlideshowFormations$.$FormationSwirl, $Assembly: 260, $Easing: { $Left: $JssorEasing$.$EaseInWave, $Top: $JssorEasing$.$EaseInWave, $Clip: $JssorEasing$.$EaseOutQuad }, $ScaleHorizontal: 0.2, $ScaleVertical: 0.1, $Round: { $Left: 1.3, $Top: 2.5} }
         //Rotate Zoom+ out
         , { $Duration: 1200, $Zoom: 11, $Rotate: true, $SlideOut: true, $Easing: { $Zoom: $JssorEasing$.$EaseInCubic, $Rotate: $JssorEasing$.$EaseInCubic }, $Opacity: 2, $Round: { $Rotate: 0.7} }
         //Dodge Pet Inside in ZigZag
         , { $Duration: 1500, $Delay: 20, $Cols: 10, $Rows: 4, $Clip: 15, $During: { $Left: [0.3, 0.7], $Top: [0.3, 0.7] }, $FlyDirection: 9, $Formation: $JssorSlideshowFormations$.$FormationZigZag, $Assembly: 260, $Easing: { $Left: $JssorEasing$.$EaseInWave, $Top: $JssorEasing$.$EaseInWave, $Clip: $JssorEasing$.$EaseOutQuad }, $ScaleHorizontal: 0.2, $ScaleVertical: 0.1, $Round: { $Left: 0.8, $Top: 2.5} }
         //Rotate Zoom- out TL
         , { $Duration: 1200, $Zoom: 1, $Rotate: true, $SlideOut: true, $FlyDirection: 5, $Easing: $JssorEasing$.$EaseLinear, $ScaleHorizontal: 0.8, $ScaleVertical: 0.8, $Opacity: 2, $Round: { $Rotate: 0.2} }
         //Rotate Zoom- in BR
         , { $Duration: 1200, $Zoom: 1, $Rotate: true, $During: { $Left: [0.2, 0.8], $Top: [0.2, 0.8], $Zoom: [0.2, 0.8], $Rotate: [0.2, 0.8] }, $FlyDirection: 10, $Easing: { $Zoom: $JssorEasing$.$EaseSwing, $Opacity: $JssorEasing$.$EaseLinear, $Rotate: $JssorEasing$.$EaseSwing }, $ScaleHorizontal: 0.6, $ScaleVertical: 0.6, $Opacity: 2, $Round: { $Rotate: 0.5} }
         // Wave out Eagle
         , { $Duration: 1500, $Delay: 60, $Cols: 24, $SlideOut: true, $FlyDirection: 8, $Formation: $JssorSlideshowFormations$.$FormationCircle, $Easing: $JssorEasing$.$EaseInWave, $ScaleVertical: 0.5, $Round: { $Top: 1.5} }
         //Expand Stairs
         , { $Duration: 1000, $Delay: 30, $Cols: 10, $Rows: 4, $Clip: 15, $Formation: $JssorSlideshowFormations$.$FormationStraightStairs, $Assembly: 2050, $Easing: $JssorEasing$.$EaseInQuad }
         //Fade Clip out H
         , { $Duration: 1200, $Delay: 20, $Clip: 3, $SlideOut: true, $Assembly: 260, $Easing: { $Clip: $JssorEasing$.$EaseOutCubic, $Opacity: $JssorEasing$.$EaseLinear }, $Opacity: 2 }
         //Dodge Pet Inside in Random Chess
         , { $Duration: 1500, $Delay: 80, $Cols: 10, $Rows: 4, $Clip: 15, $During: { $Left: [0.2, 0.8], $Top: [0.2, 0.8] }, $FlyDirection: 9, $ChessMode: { $Column: 15, $Row: 15 }, $Easing: { $Left: $JssorEasing$.$EaseInWave, $Top: $JssorEasing$.$EaseInWave, $Clip: $JssorEasing$.$EaseLinear }, $ScaleHorizontal: 0.2, $ScaleVertical: 0.1, $Round: { $Left: 0.8, $Top: 2.5} }
         ];
	
	var general_options = {
		$AutoPlay: true,                                    //[Optional] Whether to auto play, to enable slideshow, this option must be set to true, default value is false
		$AutoPlayInterval: 4000,                            //[Optional] Interval (in milliseconds) to go for next slide since the previous stopped if the slider is auto playing, default value is 3000
		
		$ArrowKeyNavigation: true,   			            //[Optional] Allows keyboard (arrow key) navigation or not, default value is false
		$DragOrientation: 0,                                //[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 either, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $DisplayPieces is greater than 1, or parking position is not 0)

		$SlideshowOptions: {                                //[Optional] Options to specify and enable slideshow or not
            $Class: $JssorSlideshowRunner$,                 //[Required] Class to create instance of slideshow
            $Transitions: _SlideshowTransitions,            //[Required] An array of slideshow transitions to play slideshow
            $TransitionsOrder: 1,                           //[Optional] The way to choose transition to play slide, 1 Sequence, 0 Random
            $ShowLink: true                                	//[Optional] Whether to bring slide link on top of the slider when slideshow is running, default value is false
        }
	};
	
	switch (slider_type)
	{
		case '1':
	    	var options = {
                 $BulletNavigatorOptions: {							//[Optional] Options to specify and enable navigator or not
                     $Class: $JssorBulletNavigator$,				//[Required] Class to create navigator instance
                     $ChanceToShow: 2,								//[Required] 0 Never, 1 Mouse Over, 2 Always
                     $AutoCenter: 1,                                //[Optional] Auto center navigator in parent container, 0 None, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
                     $SpacingX: 10,                                 //[Optional] Horizontal space between each item in pixel, default value is 0
                     $SpacingY: 10                                  //[Optional] Vertical space between each item in pixel, default value is 0
                },

                 $ArrowNavigatorOptions: {
                     $Class: $JssorArrowNavigator$,              	//[Requried] Class to create arrow navigator instance
                     $ChanceToShow: 2,                              //[Required] 0 Never, 1 Mouse Over, 2 Always
                     $AutoCenter: 2                                 //[Optional] Auto center arrows in parent container, 0 No, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
                 }
             };
	        break;
	    case '2':
	    	var options = {
	    		$ArrowNavigatorOptions: {                       	//[Optional] Options to specify and enable arrow navigator or not
                    $Class: $JssorArrowNavigator$,              	//[Requried] Class to create arrow navigator instance
                    $ChanceToShow: 1,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
                    $AutoCenter: 2                                  //[Optional] Auto center arrows in parent container, 0 No, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
                },

                $ThumbnailNavigatorOptions: {
                    $Class: $JssorThumbnailNavigator$,              //[Required] Class to create thumbnail navigator instance
                    $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
                    $AutoCenter: 0,                                 //[Optional] Auto center thumbnail items in the thumbnail navigator container, 0 None, 1 Horizontal, 2 Vertical, 3 Both, default value is 3
                    $SpacingX: 3,                                   //[Optional] Horizontal space between each thumbnail in pixel, default value is 0
                    $SpacingY: 3,                                   //[Optional] Vertical space between each thumbnail in pixel, default value is 0
                    $DisplayPieces: 9,                              //[Optional] Number of pieces to display, default value is 1
                    $ParkingPosition: 260                           //[Optional] The offset position to park thumbnail
               }
            };
	        break;
	    case '3':			
			 var options = {
			    $BulletNavigatorOptions: {							//[Optional] Options to specify and enable navigator or not
			         $Class: $JssorBulletNavigator$,				//[Required] Class to create navigator instance
			         $ChanceToShow: 2,                              //[Required] 0 Never, 1 Mouse Over, 2 Always
			         $SpacingX: 10,                                 //[Optional] Horizontal space between each item in pixel, default value is 0
			         $SpacingY: 10                                  //[Optional] Vertical space between each item in pixel, default value is 0
			     },
			
			     $ArrowNavigatorOptions: {
			         $Class: $JssorArrowNavigator$,              	//[Requried] Class to create arrow navigator instance
			         $ChanceToShow: 2                               //[Required] 0 Never, 1 Mouse Over, 2 Always
			     },
			
			     $ThumbnailNavigatorOptions: {
			         $Class: $JssorThumbnailNavigator$,              //[Required] Class to create thumbnail navigator instance
			         $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
			         $ActionMode: 0,                                 //[Optional] 0 None, 1 act by click, 2 act by mouse hover, 3 both, default value is 1
			         $DisableDrag: true                              //[Optional] Disable drag or not, default value is false
			     }
			 };
	        break;
	    case '4':
	    	var options = {
                $ThumbnailNavigatorOptions: {
                    $Class: $JssorThumbnailNavigator$,              //[Required] Class to create thumbnail navigator instance
                    $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always

                    $Loop: 2,                                       //[Optional] Enable loop(circular) of carousel or not, 0: stop, 1: loop, 2 rewind, default value is 1
                    $SpacingX: 3,                                   //[Optional] Horizontal space between each thumbnail in pixel, default value is 0
                    $SpacingY: 3,                                   //[Optional] Vertical space between each thumbnail in pixel, default value is 0
                    $DisplayPieces: 5,                              //[Optional] Number of pieces to display, default value is 1
                    $ParkingPosition: 204                           //[Optional] The offset position to park thumbnail,
                }
            };
	        break;
	    case '5':
	    	var options = {
                $SlideSpacing: 5, 					                //[Optional] Space between each slide in pixels, default value is 0
                
                $ThumbnailNavigatorOptions: {
                    $Class: $JssorThumbnailNavigator$,              //[Required] Class to create thumbnail navigator instance
                    $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always

                    $Loop: 2,                                       //[Optional] Enable loop(circular) of carousel or not, 0: stop, 1: loop, 2 rewind, default value is 1
                    $SpacingX: 4,                                   //[Optional] Horizontal space between each thumbnail in pixel, default value is 0
                    $SpacingY: 4,                                   //[Optional] Vertical space between each thumbnail in pixel, default value is 0
                    $DisplayPieces: 4,                              //[Optional] Number of pieces to display, default value is 1
                    $ParkingPosition: 0                             //[Optional] The offset position to park thumbnail
                }
            };
	        break;
	    case '6':
	    	var _CaptionTransitions = [];
             _CaptionTransitions["L"] = { $Duration: 900, $FlyDirection: 1, $Easing: { $Left: $JssorEasing$.$EaseInCubic }, $ScaleHorizontal: 0.6, $Opacity: 2 };
             _CaptionTransitions["R"] = { $Duration: 900, $FlyDirection: 2, $Easing: { $Left: $JssorEasing$.$EaseInCubic }, $ScaleHorizontal: 0.6, $Opacity: 2 };
             _CaptionTransitions["T"] = { $Duration: 900, $FlyDirection: 4, $Easing: { $Top: $JssorEasing$.$EaseInCubic }, $ScaleVertical: 0.6, $Opacity: 2 };
             _CaptionTransitions["B"] = { $Duration: 900, $FlyDirection: 8, $Easing: { $Top: $JssorEasing$.$EaseInCubic }, $ScaleVertical: 0.6, $Opacity: 2 };
             _CaptionTransitions["TR"] = { $Duration: 900, $FlyDirection: 6, $Easing: { $Left: $JssorEasing$.$EaseInCubic, $Top: $JssorEasing$.$EaseInCubic }, $ScaleHorizontal: 0.6, $ScaleVertical: 0.6, $Opacity: 2 };

             _CaptionTransitions["L|IB"] = { $Duration: 1200, $FlyDirection: 1, $Easing: { $Left: $JssorEasing$.$EaseInOutBack }, $ScaleHorizontal: 0.6, $Opacity: 2 };
             _CaptionTransitions["R|IB"] = { $Duration: 1200, $FlyDirection: 2, $Easing: { $Left: $JssorEasing$.$EaseInOutBack }, $ScaleHorizontal: 0.6, $Opacity: 2 };
             _CaptionTransitions["T|IB"] = { $Duration: 1200, $FlyDirection: 4, $Easing: { $Top: $JssorEasing$.$EaseInOutBack }, $ScaleVertical: 0.6, $Opacity: 2 };

             _CaptionTransitions["CLIP|LR"] = { $Duration: 900, $Clip: 3, $Easing: { $Clip: $JssorEasing$.$EaseInOutCubic }, $Opacity: 2 };
             _CaptionTransitions["CLIP|TB"] = { $Duration: 900, $Clip: 12, $Easing: { $Clip: $JssorEasing$.$EaseInOutCubic }, $Opacity: 2 };
             _CaptionTransitions["CLIP|L"] = { $Duration: 900, $Clip: 1, $Easing: { $Clip: $JssorEasing$.$EaseInOutCubic }, $Opacity: 2 };

             _CaptionTransitions["MCLIP|R"] = { $Duration: 900, $Clip: 2, $Move: true, $Easing: { $Clip: $JssorEasing$.$EaseInOutCubic }, $Opacity: 2 };
             _CaptionTransitions["MCLIP|T"] = { $Duration: 900, $Clip: 4, $Move: true, $Easing: { $Clip: $JssorEasing$.$EaseInOutCubic }, $Opacity: 2 };

             _CaptionTransitions["WV|B"] = { $Duration: 1200, $FlyDirection: 10, $Easing: { $Left: $JssorEasing$.$EaseInWave, $Top: $JssorEasing$.$EaseLinear }, $ScaleHorizontal: 0.2, $ScaleVertical: 0.6, $Opacity: 2, $Round: { $Left: 1.5} };

             _CaptionTransitions["TORTUOUS|VB"] = { $Duration: 1800, $Zoom: 1, $FlyDirection: 8, $Easing: { $Top: $JssorEasing$.$EaseOutWave, $Zoom: $JssorEasing$.$EaseOutCubic }, $ScaleVertical: 0.2, $Opacity: 2, $During: { $Top: [0, 0.7] }, $Round: { $Top: 1.3} };

             _CaptionTransitions["LISTH|R"] = { $Duration: 1500, $Clip: 1, $FlyDirection: 2, $Easing: $JssorEasing$.$EaseInOutCubic, $ScaleHorizontal: 0.8, $ScaleClip: 0.8, $Opacity: 2, $During: { $Left: [0.4, 0.6], $Clip: [0, 0.4], $Opacity: [0.4, 0.6]} };

             _CaptionTransitions["RTT|360"] = { $Duration: 900, $Rotate: 1, $Easing: { $Opacity: $JssorEasing$.$EaseLinear, $Rotate: $JssorEasing$.$EaseInQuad }, $Opacity: 2 };
             _CaptionTransitions["RTT|10"] = { $Duration: 900, $Zoom: 11, $Rotate: 1, $Easing: { $Zoom: $JssorEasing$.$EaseInExpo, $Opacity: $JssorEasing$.$EaseLinear, $Rotate: $JssorEasing$.$EaseInExpo }, $Opacity: 2, $Round: { $Rotate: 0.8} };

             _CaptionTransitions["RTTL|BR"] = { $Duration: 900, $Zoom: 11, $Rotate: 1, $FlyDirection: 10, $Easing: { $Left: $JssorEasing$.$EaseInCubic, $Top: $JssorEasing$.$EaseInCubic, $Zoom: $JssorEasing$.$EaseInCubic, $Opacity: $JssorEasing$.$EaseLinear, $Rotate: $JssorEasing$.$EaseInCubic }, $ScaleHorizontal: 0.6, $ScaleVertical: 0.6, $Opacity: 2, $Round: { $Rotate: 0.8} };

             _CaptionTransitions["T|IE*IE"] = { $Duration: 1800, $Zoom: 11, $Rotate: -1.5, $FlyDirection: 4, $Easing: { $Top: $JssorEasing$.$EaseInOutElastic, $Zoom: $JssorEasing$.$EaseInElastic, $Rotate: $JssorEasing$.$EaseInOutElastic }, $ScaleVertical: 0.8, $Opacity: 2, $During: { $Zoom: [0, 0.8], $Opacity: [0, 0.7] }, $Round: { $Rotate: 0.5} };

             _CaptionTransitions["RTTS|R"] = { $Duration: 900, $Zoom: 1, $Rotate: 1, $FlyDirection: 2, $Easing: { $Left: $JssorEasing$.$EaseInQuad, $Zoom: $JssorEasing$.$EaseInQuad, $Rotate: $JssorEasing$.$EaseInQuad, $Opacity: $JssorEasing$.$EaseOutQuad }, $ScaleHorizontal: 0.6, $Opacity: 2, $Round: { $Rotate: 1.2} };
             _CaptionTransitions["RTTS|T"] = { $Duration: 900, $Zoom: 1, $Rotate: 1, $FlyDirection: 4, $Easing: { $Top: $JssorEasing$.$EaseInQuad, $Zoom: $JssorEasing$.$EaseInQuad, $Rotate: $JssorEasing$.$EaseInQuad, $Opacity: $JssorEasing$.$EaseOutQuad }, $ScaleVertical: 0.6, $Opacity: 2, $Round: { $Rotate: 1.2} };

             _CaptionTransitions["DDGDANCE|RB"] = { $Duration: 1800, $Zoom: 1, $FlyDirection: 10, $Easing: { $Left: $JssorEasing$.$EaseInJump, $Top: $JssorEasing$.$EaseInJump, $Zoom: $JssorEasing$.$EaseOutQuad }, $ScaleHorizontal: 0.3, $ScaleVertical: 0.3, $Opacity: 2, $During: { $Left: [0, 0.8], $Top: [0, 0.8] }, $Round: { $Left: 0.8, $Top: 2.5} };
             _CaptionTransitions["ZMF|10"] = { $Duration: 900, $Zoom: 11, $Easing: { $Zoom: $JssorEasing$.$EaseInExpo, $Opacity: $JssorEasing$.$EaseLinear }, $Opacity: 2 };
             _CaptionTransitions["DDG|TR"] = { $Duration: 1200, $Zoom: 1, $FlyDirection: 6, $Easing: { $Left: $JssorEasing$.$EaseInJump, $Top: $JssorEasing$.$EaseInJump, $Zoom: $JssorEasing$.$ }, $ScaleHorizontal: 0.3, $ScaleVertical: 0.3, $Opacity: 2, $During: { $Left: [0, 0.8], $Top: [0, 0.8] }, $Round: { $Left: 0.8, $Top: 0.8} };

             _CaptionTransitions["FLTTR|R"] = { $Duration: 900, $FlyDirection: 10, $Easing: { $Left: $JssorEasing$.$EaseLinear, $Top: $JssorEasing$.$EaseInWave }, $ScaleHorizontal: 0.2, $ScaleVertical: 0.1, $Opacity: 2, $Round: { $Top: 1.3} };
             _CaptionTransitions["FLTTRWN|LT"] = { $Duration: 1800, $Zoom: 1, $FlyDirection: 5, $Easing: { $Left: $JssorEasing$.$EaseInOutSine, $Top: $JssorEasing$.$EaseInWave, $Zoom: $JssorEasing$.$EaseInOutQuad }, $ScaleHorizontal: 0.5, $ScaleVertical: 0.2, $Opacity: 2, $During: { $Left: [0, 0.7], $Top: [0.1, 0.7] }, $Round: { $Top: 1.3} };

             _CaptionTransitions["ATTACK|BR"] = { $Duration: 1500, $Zoom: 1, $FlyDirection: 10, $Easing: { $Left: $JssorEasing$.$EaseOutWave, $Top: $JssorEasing$.$EaseInExpo }, $ScaleHorizontal: 0.1, $ScaleVertical: 0.5, $Opacity: 2, $During: { $Left: [0.3, 0.7], $Top: [0, 0.7] }, $Round: { $Left: 1.3} };

             _CaptionTransitions["FADE"] = { $Duration: 900, $Opacity: 2 };

             var options = {
                 $SlideEasing: $JssorEasing$.$EaseOutQuint,          //[Optional] Specifies easing for right to left animation, default value is $JssorEasing$.$EaseOutQuad
                 $SlideDuration: 1200,                               //[Optional] Specifies default duration (swipe) for slide in milliseconds, default value is 500
                 
                 $CaptionSliderOptions: {                            //[Optional] Options which specifies how to animate caption
                     $Class: $JssorCaptionSlider$,                   //[Required] Class to create instance to animate caption
                     $CaptionTransitions: _CaptionTransitions,       //[Required] An array of caption transitions to play caption, see caption transition section at jssor slideshow transition builder
                     $PlayInMode: 1,                                 //[Optional] 0 None (no play), 1 Chain (goes after main slide), 3 Chain Flatten (goes after main slide and flatten all caption animations), default value is 1
                     $PlayOutMode: 3                                 //[Optional] 0 None (no play), 1 Chain (goes before main slide), 3 Chain Flatten (goes before main slide and flatten all caption animations), default value is 1
                 },

                 $ArrowNavigatorOptions: {                       	 //[Optional] Options to specify and enable arrow navigator or not
                     $Class: $JssorArrowNavigator$,              	 //[Requried] Class to create arrow navigator instance
                     $ChanceToShow: 1,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
                     $AutoCenter: 2                                  //[Optional] Auto center arrows in parent container, 0 No, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
                 },

                 $BulletNavigatorOptions: {							 //[Optional] Options to specify and enable navigator or not
                     $Class: $JssorBulletNavigator$,				 //[Required] Class to create navigator instance
                     $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
                     $AutoCenter: 1,                                 //[Optional] Auto center navigator in parent container, 0 None, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
                     $SpacingX: 4,                                   //[Optional] Horizontal space between each item in pixel, default value is 0
                     $SpacingY: 4                                    //[Optional] Vertical space between each item in pixel, default value is 0
                 }
             };
	        break;
	    default: 
	    	var options = {
                $SlideWidth: 112,                                   //[Optional] Width of every slide in pixels, default value is width of 'slides' container
                $SlideSpacing: 2, 					                //[Optional] Space between each slide in pixels, default value is 0
                $DisplayPieces: 5,                                  //[Optional] Number of pieces to display (the slideshow would be disabled if the value is set to greater than 1), the default value is 1
                $Loop: 0,
                
                $BulletNavigatorOptions: {                          //[Optional] Options to specify and enable navigator or not
                    $Class: $JssorBulletNavigator$,                 //[Required] Class to create navigator instance
                    $ChanceToShow: 2                                //[Required] 0 Never, 1 Mouse Over, 2 Always
                },

                $ArrowNavigatorOptions: {
                    $Class: $JssorArrowNavigator$,              	//[Requried] Class to create arrow navigator instance
                    $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
                    $AutoCenter: 2,                                 //[Optional] Auto center navigator in parent container, 0 None, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
                    $Steps: 5                                       //[Optional] Steps to go for each navigation request, default value is 1
                }
            };
	}
	var final_options = $.extend({}, general_options, options);
	return final_options;
}

function getLangFromURL()
{
	var lang = '';
	var urlArray = window.location.pathname.split( '/' );
	if( urlArray[1].length <= 2 && urlArray[1] != "" )
	{
		lang += urlArray[1] + '/';
	}
	return lang;
}

function checkForDynamicTemplate()
{
	var lang = getLangFromURL();
	var ajax_url = '/' + lang + 'system/dynamictemplates'
	
	$('div[id^="dynamic_template_"]').each(function(){
		
		var template_id = $(this).prop("id");
		template_id = template_id.replace("dynamic_template_", "");
		
		$(this).html('<div class="dynamic-template-loader"></div>');
		
		$.post( 
			ajax_url,
			{template_id: template_id}, 
			function(data) {
				$('div#dynamic_template_' + template_id).html(data);
			}
		);
		
	});
}

function price_format(a, b, c, d)
{
	 a = Math.round(a * Math.pow(10, b)) / Math.pow(10, b);
	 e = a + '';
	 f = e.split('.');
	 if (!f[0]) {
	  f[0] = '0';
	 }
	 if (!f[1]) {
	  f[1] = '';
	 }
	 if (f[1].length < b) {
	  g = f[1];
	  for (i=f[1].length + 1; i <= b; i++) {
	   g += '0';
	  }
	  f[1] = g;
	 }
	 if(d != '' && f[0].length > 3) {
	  h = f[0];
	  f[0] = '';
	  for(j = 3; j < h.length; j+=3) {
	   i = h.slice(h.length - j, h.length - j + 3);
	   f[0] = d + i +  f[0] + '';
	  }
	  j = h.substr(0, (h.length % 3 == 0) ? 3 : (h.length % 3));
	  f[0] = j + f[0];
	 }
	 c = (b <= 0) ? '' : c;
	 return f[0] + c + f[1];
}

function sendContactMessage()
{
	var name = $('input[name="name"]').val();
	var email = $('input[name="email"]').val();
	var phone = $('input[name="phone"]').val();
	var subject = $('input[name="subject"]').val();
	var message = $('textarea[name="message"]').val();
	var error = false;
	
	if(name.length == "")
	{
		error = true;
		$('input[name="name"]').addClass("red-border");
	}
	else
		$('input[name="name"]').removeClass("red-border");
	
	if(email.length == "")
	{
		error = true;
		$('input[name="email"]').addClass("red-border");
	}
	else
		$('input[name="email"]').removeClass("red-border");	
	
	if(subject.length == "")
	{
		error = true;
		$('input[name="subject"]').addClass("red-border");
	}
	else
		$('input[name="subject"]').removeClass("red-border");
	
	if(message.length == "")
	{
		error = true;
		$('textarea[name="message"]').addClass("red-border");
	}
	else
		$('textarea[name="message"]').removeClass("red-border");

	if (error == false)
	{
		var params = {action:"send_message", name: name, email: email, phone: phone, subject: subject, message: message, simple_form:true};
		$.post("/contacts/ajax", params, function(data) {
			if (data.status == "success")
			{
				$('input[name="name"]').removeClass("red-border");
				$('input[name="email"]').removeClass("red-border");
				$('input[name="subject"]').removeClass("red-border");
				$('textarea[name="message"]').removeClass("red-border");
				
				$('input[name="name"]').val("");
				$('input[name="email"]').val("");
				$('input[name="phone"]').val("");
				$('input[name="subject"]').val("");
				$('textarea[name="message"]').val("");
			}
			
			alert(data.response);

		}, "json");
	}
}
