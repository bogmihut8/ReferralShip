    if(window.location.href.indexOf("index.html#") == -1) {
       window.location.replace('/platform/index.html');
    }
    
    $(document).ready(function(){
        $(".loading-text").addClass("hide");
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
        
        var currentUser = JSON.parse(localStorage.getItem("currentUser"));
        tinymce.init({  
            selector: 'textarea',
              height: 500,
              menubar: false,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table contextmenu paste code'
              ],
              toolbar: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link'
        });
        // console.log(tinymce.activeEditor.getContent())
        var date = new Date();
        var expDate = new Date(new Date(date).setMonth(date.getMonth()+1));
        $(".create-offer-submit").on("click", function(){
            var newItem = JSON.stringify(
            {
                "title": $("#titleField").val(),
                "content": tinymce.activeEditor.getContent(),
                "Procent": parseInt($("#percent").val()),
                "company": $("#company").val(),
                "companyWebsite": $("#company-website").val(),
                "city": $("#city").val(),
                "country": $("#country").val(),
                "jobType": $("#jobType").val(),
                "jobLevel": $("#jobLevel").val(),
                "jobCategory": $("#jobCategory").val(),
                "operationKey": JSON.parse(localStorage.getItem("currentKey"))[0].operationKey,
                "author": currentUser.username,
                "dateCreated": date,
                "expiresAt": expDate
            });
            ajaxGetCall('https://api.backand.com:443/1/objects/ReferOffer', 'post', newItem,
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
            function(data){
                var dataString = "Object was created! You will be redirected to your offers."
                swal({
                  title: "Success!",
                  text: dataString,
                  type: "success",
                  confirmButtonText: "Close",
                  allowOutsideClick: true,
                  allowEscapeKey: true
                });
                setTimeout(function() {window.opener.closeCallback(); window.close();}, 3000);
            })     
        })
        
    });