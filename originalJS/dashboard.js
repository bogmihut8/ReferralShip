   $(document).ready(function(){
        $(".mainnav li").removeClass("active");
        $(".mainnav a[href='#dashboard']").parent().addClass("active");
        $(".loading-text").addClass("hide");
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
        ajaxGetCall('https://api.backand.com/1/query/data/getAllReferOffers?parameters=%7B%22pageSize%22:%225%22,%22startFrom%22:%220%22,%22cityParam%22:%22%22,%22keyword%22:%22%22%7D', function(error){alert(JSON.stringify(error))}, function(data){myRecords = data});
        if(myRecords.length == 0){
            $("#allOffers").append("<div class='span12'><div class='widget'><div class='widget-content' style='padding:20px 15px 20px 15px'><p style='text-align: center; font-style: italic; font-size:20px;'>There are no offers here :(</p></div></div></div>")
            $(".filters").hide();
        }
        for(var i in myRecords){
            var date = new Date(myRecords[i].dateCreated);
            var corrDate = new Date(new Date(date).setHours(date.getHours+2));
            var offerUrl = '/platform/index.html#offer-page:'+myRecords[i].id;
            if(!myRecords[i].procent)
                var procentTag = "<td><a href='"+offerUrl+"'>-</a></td>";
            else
                var procentTag = "<td><b><a href='"+offerUrl+"'>"+myRecords[i].procent+" Ron</a></b></td>";
            
            $(".latest-offers tbody").append("<tr><td class='hide-td-smaller'><a href='"+offerUrl+"'><i class='icon-time'></i>&nbsp;"+$.timeago(date)+"</a></td><td><a href='"+offerUrl+"'>"+myRecords[i].title+"</a></td><td class='hide-td'><a href='"+offerUrl+"'>"+myRecords[i].jobType+"</a></td>"+procentTag+"<td><a href='"+offerUrl+"'><i class='icon-chevron-right'></i></a></td></tr>")
        }
    });