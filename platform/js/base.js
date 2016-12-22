$(function () {
	if(!localStorage.getItem("currentUser")){
        window.location.replace("/");
    }
    
    $( document ).ajaxStart(function() {
      $(".loader").removeClass("hidden");
    }).ajaxComplete(function(){
      $(".loader").addClass("hidden");
    });
	
	$('.subnavbar').find ('li').each (function (i) {
	
		var mod = i % 3;
		
		if (mod === 2) {
			$(this).addClass ('subnavbar-open-right');
		}
		
	});
	var currentUser = JSON.parse(localStorage.getItem("currentUser"));
	var firstAndLastName = JSON.parse(localStorage.getItem("firstAndLastName"));
    var accessToken = currentUser.access_token;
	$("#nav-username").find("#second").html(firstAndLastName[0].firstName + " " + firstAndLastName[0].lastName);
    $("#nav-username").find("#first").html(firstAndLastName[0].firstName.charAt(0) +""+ firstAndLastName[0].lastName.charAt(0));
    function ajaxGetCall(url, errorCallback, successCallback){
        $.ajax({
            url: url,
            async: false,
            type: 'get',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', currentUser.token_type +' '+ currentUser.access_token);
            },
            data: {},
            dataType: 'json',
            cache: false,
            error: errorCallback,
            success: successCallback
        });
    }
    $("#signOut").on("click", function(){
        localStorage.clear();
        window.location.replace("/");
    });
    
	$(document).on("click", ".mainnav li a", function(){
        $(".mainnav li").removeClass("active");
        var page = $(this).attr("id");
        $(this).parent().addClass("active");
        $("#mainSection section").empty();
    });
    
    window.onpopstate = function(){
        $("#mainSection section").empty();
        $(".mainnav li").removeClass("active");
        if(window.location.hash == ""){
            $("#dashboard").parent().addClass("active");
        }
        else if(window.location.hash.indexOf(":") > -1){}
        else{
            $(window.location.hash).parent().addClass("active");
        }
    }
    
    
});