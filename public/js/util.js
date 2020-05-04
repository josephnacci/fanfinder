$( document ).ready(function() {
   	$('.nav-button').on('click', function(e){
   		let dis = e.target
   		let displayPage = '#' + dis.id + '-page'

   		$('.nav-button').removeClass('clicked')
   		$('.page-container').removeClass('clicked')
   		$(displayPage).addClass('clicked')
   		$(dis).addClass('clicked')
	})
	inputTextChange();
	$(window).on('resize', function(){
		inputTextChange()
	})
});

function inputTextChange() {
   	if ($(window).width() < 420) {
   		$('.form-control').attr('placeholder', 'Enter a movie title')
   		// $('.form-control').placeholder 
   	} else {
   		$('.form-control').attr('placeholder', 'Enter a movie title to search')
   	}
}