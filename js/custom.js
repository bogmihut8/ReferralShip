/***********************************************
 * backand JavaScript Library
 * Authors: backand
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 * Compiled At: 07/21/2015
 ***********************************************/
$(function () {
    //localStorage.removeItem("currentUser");
    if(localStorage.getItem("currentUser")){
        window.location.replace("/platform/index.html");
    }
      var animating = false,
      submitPhase1 = 1100,
      submitPhase2 = 400,
      logoutPhase1 = 800,
      $login = $(".login"),
      $app = $(".app");
      
    
    function validateInput(input){
        if(input.val() == ''){
            $(input).addClass("inputWarning");
        }
    }
    function validateEmailInput(){
        var re = /\S+@\S+\.\S+/;
        if(input.val() == "" || re.test(input.val())){
            $(input).addClass("inputWarning");
        }
    }

    function ripple(elem, e) {
        $(".ripple").remove();
        var elTop = elem.offset().top,
            elLeft = elem.offset().left,
            x = e.pageX - elLeft,
            y = e.pageY - elTop;
        var $ripple = $("<div class='ripple'></div>");
        $ripple.css({top: y, left: x});
        elem.append($ripple);
      };

    // init backand url
    backand.options.url = "https://api.backand.com:8080";
    var appname = "referralship";   
    var outputElement = null;

    var lastCreatedId = null;

    // LOGIN
    $('#login_button').click(function (e) {        
        var button = this;
        var username = $('#login_username').val();
        var password = $('#login_password').val();
        backand.security.authentication.login(username, password, appname, 
        function(data){
            $(button).addClass("processing");
            localStorage.setItem("currentUser", JSON.stringify(data));
            var url = 'https://api.backand.com/1/query/data/getUserFirstAndLastName?parameters=%7B%22id%22:%22'+data.userId+'%22%7D';
            $.ajax({
                url: url,
                async: false,
                type: 'get',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', data.token_type +' '+ data.access_token);
                },
                data: data,
                dataType: 'json',
                success: function(data){
                    localStorage.setItem("firstAndLastName", JSON.stringify(data));
                }
            });
            
            var url = 'https://api.backand.com/1/query/data/getSecretOperationKey?parameters=%7B%22email%22:%22'+username+'%22%7D'
            $.ajax({
                url: url,
                async: false,
                type: 'post',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', data.token_type +' '+ data.access_token);
                },
                data: data,
                dataType: 'json',
                success: function(data){
                    localStorage.setItem("currentKey", JSON.stringify(data));
                }
            });
            
            setTimeout(function() {window.location.replace("/platform/index.html");}, 2000);
        },
        function(error){
            for (var key in error.responseJSON) {
                if(key === "error_description")
                    var errorString = error.responseJSON[key];
            }
            swal({
              title: "Error!",
              text: errorString,
              type: "error",
              confirmButtonText: "Close",
              allowOutsideClick: true,
              allowEscapeKey: true
            });
        });
    });
    
    function makeKey()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 10; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        
        var k = text+Date.parse(new Date());
        return k;
    }

    $('#submit_button').click(function (e) {
        var button = this;
        var backandUser = JSON.stringify({
          "firstName": $('#signup_firstname').val(),
          "lastName": $('#signup_lastname').val(),
          "email": $('#signup_email').val(),
          "password": $('#signup_password').val(),
          "confirmPassword": $('#signup_repeatpass').val(),
          "operationKey": makeKey()
        });
        
        var urlSignup = backand.options.url + "/1/user/signup";
        
        backand.options.ajax.json(urlSignup, backandUser, backand.options.verbs.post, function(data){
            var key = makeKey();
            var url = 'https://api.backand.com/1/query/data/setKey?parameters=%7B%22name%22:%22'+$('#signup_email').val()+'%22,%22key%22:%22'+key+'%22%7D';
            
            $.ajax({
                url: url,
                async: false,
                type: 'post',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'bearer ' + data.token);
                },
                data: data,
                dataType: 'json',
                success: function(){
                    localStorage.setItem("currentKey", key);
                }
            });
            backand.security.authentication.login($('#signup_email').val(), $('#signup_password').val(), appname,
            function(data){
                $(button).addClass("processing");
                localStorage.setItem("currentUser", JSON.stringify(data));
                setTimeout(function() {window.location.replace("/platform/index.html");}, 2000);
            },
            function(error){
            })
        }, function(error){
            var errorString = error.responseJSON;
            if(typeof error.responseJSON === 'object')
                errorString = error.responseJSON.error_description;
            swal({
              title: "Error!",
              text: errorString,
              type: "error",
              confirmButtonText: "Close",
              allowOutsideClick: true,
              allowEscapeKey: true
            });
        }, true, true);
    });

});