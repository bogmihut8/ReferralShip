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
        var currentUser = JSON.parse(localStorage.getItem("currentUser"));
        var oKey = JSON.parse(localStorage.getItem("currentKey"))[0].operationKey;
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
        window.app.page("offer-page-edit", function(){
            return function(params) {
                ajaxGetCall('https://api.backand.com/1/objects/action/ReferOffer/'+parseInt(params)+'?name=allowEdit&parameters=%7B%22operationKey%22:%22'+oKey+'%22%7D', 'get', {},
                function(error){alert(JSON.stringify(error))}, 
                function(data){
                    if(!data){
                        window.location.replace("/401")
                    }
                    ajaxGetCall('https://api.backand.com/1/query/data/getReferOffer?parameters=%7B%22id%22:%22'+parseInt(params)+'%22%7D', 'get', {}, function(error){alert(JSON.stringify(error))}, 
                    function(data){
                        myRecord = data;

                        if(typeof myRecord[0] == 'undefined'){
                            window.location.replace('/404');
                        }

                        if(myRecord[0].deletedAt){
                            window.location.replace('/404');
                        }
                        else{
                            var date = new Date(myRecord[0].dateCreated);
                            $("#titleField").val(myRecord[0].title);
                            tinymce.activeEditor.setContent(myRecord[0].content);
                            $("#company").val(myRecord[0].company);
                            $("#company-website").val(myRecord[0].companyWebsite);
                            $("#percent").val(myRecord[0].procent);
                            $("#city").val(myRecord[0].city);
                            $("#country").val(myRecord[0].country);
                            $("#jobType").val(myRecord[0].jobType)
                            $("#jobLevel").val(myRecord[0].jobLevel)
                            $("#jobCategory").val(myRecord[0].jobCategory);
                        }
                    });
                    $(".edit-offer-submit").on("click", function(){
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
                            "jobCategory": $("#jobCategory").val()
                        });
                        ajaxGetCall('https://api.backand.com:443/1/objects/ReferOffer/'+parseInt(params), 'put', newItem,
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
                            var dataString = "Object was updated!"
                            swal({
                              title: "Success!",
                              text: dataString,
                              type: "success",
                              confirmButtonText: "Close",
                              allowOutsideClick: true,
                              allowEscapeKey: true
                            });
                            setTimeout(function() {window.location.replace("/platform/index.html#offer-page:"+parseInt(params));}, 3000);
                        })     
                    })
                })
            }
        });
        
    });