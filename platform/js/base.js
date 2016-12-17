$(function () {
	if(!localStorage.getItem("currentUser")){
        window.location.replace("/index.html");
    }

    $( document ).ajaxStart(function() {
      $(".loader").removeClass("hidden");
    }).ajaxComplete(function(){
      $(".loader").addClass("hidden");
    });
    $("#mainSection").load("dashboard.html");
	
	$('.subnavbar').find ('li').each (function (i) {
	
		var mod = i % 3;
		
		if (mod === 2) {
			$(this).addClass ('subnavbar-open-right');
		}
		
	});
	var currentUser = JSON.parse(localStorage.getItem("currentUser"));
	
    var accessToken = currentUser.access_token;
	$("#nav-username").find("#second").html(currentUser.fullName);
    $("#nav-username").find("#first").html(currentUser.fullName.split(" ")[0].charAt(0) +""+ currentUser.fullName.split(" ")[1].charAt(0))
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
        localStorage.removeItem("currentUser");
        window.location.replace("/index.html");
    });
    
	$(".mainnav li a").on("click", function(){
        $(".mainnav li").removeClass("active");
        $(this).parent().addClass("active");
        $("#mainSection").load($(this).attr("id") + ".html");
    });
    
});