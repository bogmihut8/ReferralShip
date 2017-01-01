   $(document).ready(function(){
        function ajaxGetCall(url, errorCallback, successCallback){
            $.ajax({
                url: url,
                async: false,
                type: 'get',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('AnonymousToken', '005b72b3-9f1f-452e-8a61-3b9666c33caf');
                },
                data: {},
                dataType: 'json',
                cache: false,
                error: errorCallback,
                success: successCallback
            });
        }
        ajaxGetCall('https://api.backand.com/1/query/data/getReferOffer?parameters=%7B%22id%22:%22'+window.location.hash.split(':')[1]+'%22%7D', function(error){alert(JSON.stringify(error))}, 
                function(data){
                    myRecord = data;
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
                        
                        $("#offer").append("<div class='span12'><div class='offer-page-header'><span class='timeago offer-info-header'><i class='icon-time'></i>&nbsp;"+$.timeago(date)+"</span><span class='timeago offer-info-header'><i class='icon-map-marker'></i>&nbsp;"+myRecord[0].city+", "+myRecord[0].country+"</span><span class='timeago offer-info-header'><i class='icon-building'></i>&nbsp;"+myRecord[0].company+"</span></div><h1 style='margin-top:15px; text-align:center'>"+myRecord[0].title+"</h1><div class='job-facts'>"+procentTag+"<span class='tag'>"+myRecord[0].jobType+"</span><span class='tag'>"+myRecord[0].jobLevel+"</span><span class='tag'>"+myRecord[0].jobCategory+"</span></div><p>"+myRecord[0].content+"</p></div><br>Interested in this offer or you want to look for other?&nbsp;&nbsp;&nbsp;<a href='/' class='btn btn-warning'>Create account or login</a>");
                    }
                });
    });