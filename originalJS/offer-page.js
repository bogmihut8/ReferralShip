    if(window.location.href.indexOf("index.html#") == -1) {
       window.location.replace('/platform/index.html');
    }
    
    $(document).ready(function(){
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
        
        var currentUser = JSON.parse(localStorage.getItem("currentUser"));
        var oKey = JSON.parse(localStorage.getItem("currentKey"))[0].operationKey;
        tinymce.remove();
        tinymce.init({  
          selector: '#comment',
          height: 300,
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table contextmenu paste code'
          ],
          toolbar: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link',
          init_instance_callback : function(editor) {
            $('#comment').addClass("show")
          }
        });
        
        var expireDate = "";
        window.app.page("offer-page", function(){
            return function(params) {
                $(".loading-text").addClass("hide");
                $('.fb-share').attr("href", 'https://www.facebook.com/sharer/sharer.php?u=http%3A//development.referralship.net/platform/public.html%23offer%3A'+parseInt(params))
                ajaxGetCall('https://api.backand.com/1/query/data/getReferOffer?parameters=%7B%22id%22:%22'+parseInt(params)+'%22%7D', function(error){alert(JSON.stringify(error))}, 
                function(data){
                    myRecord = data;
                    $(".fb-share").attr("href", $(".fb-share").attr("href")+"&picture=http://development.referralship.net/images/fbpic.jpg&title="+myRecord[0].title+"&caption="+myRecord[0].company+" - "+myRecord[0].city+", "+myRecord[0].country)
                    expireDate = myRecord[0].expiresAt;
                    if(typeof myRecord[0] == 'undefined'){
                        window.location.replace('/404');
                    }
                    
                    if(myRecord[0].deletedAt){
                        window.location.replace('/404');
                    }
                    else{
                        var date = new Date(myRecord[0].dateCreated);
                        if(!myRecord[0].procent)
                            var procentTag = "";
                        else
                            var procentTag = "<span class='tag orange'>"+myRecord[0].procent+" Ron</span>";
                        if(!myRecord[0].companyWebsite)
                            var companyWebsite = "javascript:;";
                        else
                            var companyWebsite = myRecord[0].companyWebsite;
                        
                        $("#offer").append("<div class='span12'><div class='offer-page-header'><span class='timeago offer-info-header'><i class='icon-time'></i>&nbsp;"+$.timeago(date)+"</span><span class='timeago offer-info-header'><i class='icon-map-marker'></i>&nbsp;"+myRecord[0].city+", "+myRecord[0].country+"</span><a href="+companyWebsite+" style='text-decoration:none; color:#666' target='_blank' class='timeago offer-info-header'><i class='icon-building'></i>&nbsp;"+myRecord[0].company+"</a></div><h1 style='margin-top:15px; text-align:center'>"+myRecord[0].title+"</h1><div class='job-facts'>"+procentTag+"<span class='tag'>"+myRecord[0].jobType+"</span><span class='tag'>"+myRecord[0].jobLevel+"</span><span class='tag'>"+myRecord[0].jobCategory+"</span></div><p>"+myRecord[0].content+"</p></div>");
                        
                        var dateNow = new Date();
                        if(Date.parse(new Date(myRecord[0].expiresAt)) <= Date.parse(dateNow)){
                            $(".interested-message").empty();
                            $(".offer-share").empty();
                            $("#offer").append("<div class='span12 offer-expired-warning'>This offer is expired!</div>");
                        }
                        
                    }
                });
                ajaxGetCall('https://api.backand.com/1/objects/action/ReferOffer/'+parseInt(params)+'?name=allowEdit&parameters=%7B%22operationKey%22:%22'+oKey+'%22%7D',
                function(error){alert(JSON.stringify(error))}, 
                function(data){
                    if(data){
                        $(".offer-page-control").html('<button type="button" class="btn btn-warning edit-offer">Edit&nbsp;&nbsp;<i class="icon-edit"></i></button>&nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-danger delete-offer">Delete&nbsp;&nbsp;<i class="icon-ban-circle"></i></button><br>');
                        var dateNow = new Date();
                        if(Date.parse(new Date(expireDate)) <= Date.parse(dateNow)){
                            $(".offer-page-control").append('<button type="button" class="btn btn-warning reactivate-offer">Re-activate offer&nbsp;&nbsp;<i class="icon-refresh"></i></button>');    
                        }
                        $(".interested-message").hide();
                        $(".edit-offer").on("click", function(){
                            window.location.replace('/platform/index.html#offer-page-edit:'+parseInt(params));
                        });
                        $(".delete-offer").on("click", function(){
                            var date = new Date();
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
                                $.ajax({
                                    url: 'https://api.backand.com:443/1/objects/ReferOffer/' + parseInt(params),
                                    async: false,
                                    type: 'put',
                                    beforeSend: function (xhr) {
                                        xhr.setRequestHeader('Authorization', currentUser.token_type +' '+ currentUser.access_token);
                                    },
                                    data: JSON.stringify({
                                        "deletedAt": date
                                    }),
                                    dataType: 'json',
                                    cache: false,
                                    error: function(error){
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
                                    success: function(data){
                                        var errorString = "The offer has been deleted"
                                        swal({
                                          title: "Success!",
                                          text: errorString,
                                          type: "success",
                                          confirmButtonText: "Close",
                                          allowOutsideClick: true,
                                          allowEscapeKey: true
                                        });
                                        window.location.replace("/platform/index.html#myoffers")
                                    }
                                });
                              }
                            });
                        });
                        $(".reactivate-offer").on("click", function(){
                            var date = new Date();
                            swal({
                              title: "Are you sure you want to reactivate this offer?",
                              type: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#DD6B55",
                              confirmButtonText: "Yes, reactivate it!",
                              cancelButtonText: "No, cancel!",
                              closeOnConfirm: false,
                              closeOnCancel: true,
                              allowOutsideClick: true,
                              allowEscapeKey: true
                            },
                            function(isConfirm){
                              if (isConfirm) {
                                $.ajax({
                                    url: 'https://api.backand.com:443/1/objects/ReferOffer/' + parseInt(params),
                                    async: false,
                                    type: 'put',
                                    beforeSend: function (xhr) {
                                        xhr.setRequestHeader('Authorization', currentUser.token_type +' '+ currentUser.access_token);
                                    },
                                    data: JSON.stringify({
                                        "expiresAt": new Date(new Date(date).setMonth(date.getMonth()+1))
                                    }),
                                    dataType: 'json',
                                    cache: false,
                                    error: function(error){
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
                                    success: function(data){
                                        var errorString = "The offer has been reactivated"
                                        swal({
                                          title: "Success!",
                                          text: errorString,
                                          type: "success",
                                          confirmButtonText: "Close",
                                          allowOutsideClick: true,
                                          allowEscapeKey: true
                                        });
                                        window.location.replace("/platform/index.html#myoffers")
                                    }
                                });
                              }
                            });
                        });
                        
                    }
                }
                )
                var messageResume = "";
                ajaxGetCall("https://api.backand.com/1/query/data/getFIlesByOkey?parameters=%7B%22okey%22:%22"+oKey+"%22%7D",
                function(error){},
                function(data){
                    if(data.length > 0){
                        messageResume = "<p>Link to my resume:</p><a href='https://files.backand.io/referralship/"+data[0].url+"' target='_blank'>https://files.backand.io/referralship/"+data[0].url+"</a>";
                    }
                });
                
                $(".send-message").on("click", function(){
                    var email = "<div style='max-width:600px'><table border='0' cellpadding='0' cellspacing='0' class='body' style='width:100%'><tr style='font-family:sans-serif'><td style='font-size:14px'></td><td class='container' style='font-size:14px'><div class='content'><span class='preheader' style='display:none'></span><table class='main' style='width:100%'><tbody style='background:#fff'><tr style='background-color: #ec9400'><td> <p style='text-align:center'><span style='font-size:30px'><span style='color: white'>ReferralShip</span></span></p></td></tr><tr><td class='wrapper' style='padding:20px'><table border='0' cellpadding='0' cellspacing='0' style='width:100%'><tr><td style='font-size:14px'><p>"+tinymce.activeEditor.getContent()+"</p><p>"+messageResume+"</p></td></tr></table></td></tr></tbody></table> <div style='height:10px'> </div><div class='footer' style='text-align:center'><table border='0' cellpadding='0' cellspacing='0' style='width:100%'><tr style=''><td class='content-block' style='color:#999999'><span class='apple-link' style='text-align:center'><a href='http://referralship.net' style='color:#999'>Login to your account</a></span><br></td></tr><tr><td class='content-block powered-by' style='font-size:14px'>Powered by <span style='color:#999999'>Referralship</span>.</td></tr></table></div></div></td><td style='font-size:14px'></td></tr></table></div>";
                    email = email.replace(/&nbsp;/g, "");
                    var mailData = JSON.stringify({
                      "to": myRecord[0].author,
                      "message": email
                    });
                    
                    $.ajax({
                        url: 'https://api.backand.com/1/objects/action/ReferOffer/'+parseInt(params)+'?name=SendEmailMandrill',
                        async: false,
                        type: 'post',
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Authorization', currentUser.token_type +' '+ currentUser.access_token);
                        },
                        data: mailData,
                        dataType: 'json',
                        cache: false,
                        success: function(data){
                            var errorString = "The message has been sent"
                            swal({
                              title: "Success!",
                              text: errorString,
                              type: "success",
                              confirmButtonText: "Close",
                              allowOutsideClick: true,
                              allowEscapeKey: true
                            });
                            //setTimeout(function() {window.location.reload();}, 3000);
                        }
                    });
                });
            }
        });
    });