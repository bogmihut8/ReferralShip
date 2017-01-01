if(window.location.href.indexOf("index.html#") == -1) {
       window.location.replace('/platform/index.html');
    }
    $(document).ready(function(){
        function ajaxGetCall(url, type, data, errorCallback, successCallback){
            $.ajax({
                url: url,
                async: false,
                type: type,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', currentUser.token_type +' '+ currentUser.access_token);
                },
                data: data,
                dataType: 'json',
                cache: false,
                error: errorCallback,
                success: successCallback
            });
        }
        
        $(".mainnav li").removeClass("active");
        var page = window.location.hash;
        $(".mainnav a[href='"+page+"']").parent().addClass("active");
        $(".loading-text").addClass("hide");
        
        var currentUser = JSON.parse(localStorage.getItem("currentUser"));
        var nameObj = JSON.parse(localStorage.getItem("firstAndLastName"));
        $("#email").val(currentUser.username);
        $("#firstname").val(nameObj[0].firstName);
        $("#lastname").val(nameObj[0].lastName);
        var oKey = JSON.parse(localStorage.getItem("currentKey"))[0].operationKey;
       
        ajaxGetCall("https://api.backand.com/1/query/data/getFIlesByOkey?parameters=%7B%22okey%22:%22"+oKey+"%22%7D", 'get', {},
        function(error){},
        function(data){
            if(data.length > 0){
                $(".cv-section").empty().html('<p>Uploaded CV: </p><a href="https://files.backand.io/referralship/'+data[0].url+'" class="btn btn-warning currCV" target="_blank" data-id="'+data[0].id+'">'+data[0].url+'</a><a class="delete-cv" href="javascript:;" style="font-size:22px;margin-left:12px;text-decoration:none; position: relative; top:5px;"><i class="icon-remove-circle"></i></a>')
            }
        });
        
        $(".update-profile").on("click", function(){
            var firstName = $('#firstname').val();
            var lastName = $('#lastname').val();
            var updateUserData = JSON.stringify({
              "id" : currentUser.userId,
              "firstName": firstName,
              "lastName": lastName,
              "email": currentUser.username,
              "operationKey": oKey
            });
            ajaxGetCall('https://api.backand.com/1/query/data/updateUserDetails', 'post', updateUserData, 
            function(){
                var errorString = error.responseJSON;

                swal({
                  title: "Error!",
                  text: errorString,
                  type: "error",
                  confirmButtonText: "Close",
                  allowOutsideClick: true,
                  allowEscapeKey: true
                });
            }, 
            function(){
                var errorString = "Details were updated"
                swal({
                  title: "Success!",
                  text: errorString,
                  type: "success",
                  confirmButtonText: "Close",
                  allowOutsideClick: true,
                  allowEscapeKey: true
                });
                var newSetter = {};
                newSetter[0] = {
                        'firstName': firstName,
                        'lastName': lastName
                }
                localStorage.setItem("firstAndLastName", JSON.stringify(newSetter));
                var firstAndLastName = JSON.parse(localStorage.getItem("firstAndLastName"));
                $("#nav-username").find("#first").html(firstAndLastName[0].firstName.charAt(0) +""+ firstAndLastName[0].lastName.charAt(0));
                $("#nav-username").find("#second").html(firstName + " " + lastName);
                $('#firstname').val(firstName);
                $('#lastname').val(lastName)
            })
        });
        
        $(".change-password").on("click", function(){
            var changePasswordData = JSON.stringify({
              "oldPassword": $('#password1').val(),
              "newPassword": $('#password2').val()
            });
            if($('#password2').val() !== $('#password3').val()){
                var errorString = "Passwords do not match";
                swal({
                  title: "Error!",
                  text: errorString,
                  type: "error",
                  confirmButtonText: "Close",
                  allowOutsideClick: true,
                  allowEscapeKey: true
                });
            }
            else if($('#password2').val() === $('#password3').val() && $('#password2').val().length < 6){
                var errorString = "Password must have at least 6 characters";
                swal({
                  title: "Error!",
                  text: errorString,
                  type: "error",
                  confirmButtonText: "Close",
                  allowOutsideClick: true,
                  allowEscapeKey: true
                });
            }
            else{
                
                ajaxGetCall('https://api.backand.com/1/user/changePassword', 'post', changePasswordData, 
                function(error){
                    var errorString = error.responseText;

                    swal({
                      title: "Error!",
                      text: errorString,
                      type: "error",
                      confirmButtonText: "Close",
                      allowOutsideClick: true,
                      allowEscapeKey: true
                    });
                }, 
                function(){
                    var errorString = "Password was changed"
                    swal({
                      title: "Success!",
                      text: errorString,
                      type: "success",
                      confirmButtonText: "Close",
                      allowOutsideClick: true,
                      allowEscapeKey: true
                    });
                    $('#password1').val("");$('#password2').val("");$('#password3').val("");
                })
                
            }
        });
        
        $('#fileUpload').on('change', function (e) {
            e.preventDefault();

            var reader = new FileReader(),
                file = $(this)[0];
            if(file.files[0].size > 1048576){
                var errorString = "The file you selected is bigger than 1MB";
                swal({
                  title: "Error!",
                  text: errorString,
                  type: "error",
                  confirmButtonText: "Close",
                  allowOutsideClick: true,
                  allowEscapeKey: true
                });

            }
            else if(file.files[0].type !== 'image/jpeg'){
                var errorString = "The file you selected is not a JPG";
                swal({
                  title: "Error!",
                  text: errorString,
                  type: "error",
                  confirmButtonText: "Close",
                  allowOutsideClick: true,
                  allowEscapeKey: true
                });
            }
            else{
                var filename = nameObj[0].firstName + nameObj[0].lastName + Math.floor(Date.now() / 1000);
                reader.onload = function () {
                    var data = reader.result,
                        base64 = data.replace(/^[^,]*,/, '');

                    $.ajax({
                        url: "https://api.backand.com/1/objects/action/users/1?name=files",
                        type: "POST",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Authorization', currentUser.token_type +' '+ currentUser.access_token);
                        },
                        dataType: "JSON",
                        data: JSON.stringify({
                            "filename": filename,
                            "filedata": base64//need to remove the file prefix type
                      }),
                        success: function (response) {
                            $.ajax({
                                url: "https://api.backand.com:443/1/objects/uploadedFile",
                                type: "POST",
                                beforeSend: function (xhr) {
                                    xhr.setRequestHeader('Authorization', currentUser.token_type +' '+ currentUser.access_token);
                                },
                                dataType: "JSON",
                                data: JSON.stringify({
                                    "url": filename,
                                    "okey": oKey
                              }),
                                success: function (response) {
                                    var errorString = "Your CV was uploaded"
                                    swal({
                                      title: "Success!",
                                      text: errorString,
                                      type: "success",
                                      confirmButtonText: "Close",
                                      allowOutsideClick: true,
                                      allowEscapeKey: true
                                    });
                                    setTimeout(function() {window.location.reload();}, 2000);
                                }
                            });
                        }
                    });
                };

                reader.readAsDataURL(file.files[0]);
                }
            });

            $(".delete-cv").on("click", function(){
                swal({
                  title: "Are you sure?",
                  type: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "Yes, delete it!",
                  cancelButtonText: "No, cancel!",
                  closeOnConfirm: false,
                  closeOnCancel: true,
                  allowOutsideClick: true,
                  allowEscapeKey: true
                },
                function(isConfirm){
                  if (isConfirm) {
                      var filename = $(".currCV").text();
                      var fileid = $(".currCV").attr("data-id")
                      $.ajax({
                        url: "https://api.backand.com/1/objects/action/users/1?name=files",
                        type: "DELETE",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Authorization', currentUser.token_type +' '+ currentUser.access_token);
                        },
                        dataType: "JSON",
                        data: JSON.stringify({
                            "filename": filename
                      }),
                        success: function (response) {
                            $.ajax({
                                url: "https://api.backand.com:443/1/objects/uploadedFile/"+fileid,
                                type: "DELETE",
                                beforeSend: function (xhr) {
                                    xhr.setRequestHeader('Authorization', currentUser.token_type +' '+ currentUser.access_token);
                                },
                                dataType: "JSON",
                                success: function (response) {
                                    var errorString = "Your CV was deleted"
                                    swal({
                                      title: "Success!",
                                      text: errorString,
                                      type: "success",
                                      confirmButtonText: "Close",
                                      allowOutsideClick: true,
                                      allowEscapeKey: true
                                    });
                                    setTimeout(function() {window.location.reload();}, 2000);
                                }
                            });
                        }
                    });
                  }
                });
            });
    });