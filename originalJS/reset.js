$(document).ready(function(){
        var token = window.location.search.split("=")[1];
        $("#reset_button").click(function(){
            if($("#reset_password").val() === $("#repeat_reset_password").val()){
                var resetData = JSON.stringify({
                  "resetToken": token,
                  "newPassword": $('#reset_password').val()
                });
                var url = 'https://api.backand.com:8080/1/user/resetPassword';
                $.ajax({
                    url: url,
                    async: false,
                    type: 'post',
                    data: resetData,
                    success: function(data){
                        swal("Success!", "Your password was reseted. You will be redirected to login page in 3 seconds.", "success");
                        setTimeout(function() {window.location.replace('/');}, 3000);
                    },
                    error: function(err){
                        var errorString = err.responseText;
                        if(typeof err.responseJSON === 'object')
                            errorString = error.responseJSON.error_description;
                        swal({
                          title: "Error!",
                          text: errorString,
                          type: "error",
                          confirmButtonText: "Close",
                          allowOutsideClick: true,
                          allowEscapeKey: true
                        });
                    }
                });
            }
            else{
                swal({
                  title: "Error!",
                  text: "The passwords do not match",
                  type: "error",
                  confirmButtonText: "Close",
                  allowOutsideClick: true,
                  allowEscapeKey: true
                });
            }
        });
    });