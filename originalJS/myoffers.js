    function closeCallback(){
        window.location.reload();
    }
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
        
        $(".mainnav li").removeClass("active");
        var page = window.location.hash;
        $(".mainnav a[href='"+page+"']").parent().addClass("active"); 
        $(".loading-text").addClass("hide");
        
        var currentUser = JSON.parse(localStorage.getItem("currentUser"));
        var oKey = JSON.parse(localStorage.getItem("currentKey"))[0].operationKey;
        var myRecords = {};
       
        $("#offer-page-create").on("click", function(){
            $(".loading-text").removeClass("hide");
            window.location.replace("#offer-page-create")
        });
        ajaxGetCall('https://api.backand.com/1/query/data/getMyReferOffers?parameters=%7B%22oKey%22:%22'+oKey+'%22,%22pageSize%22:%2210%22,%22startFrom%22:%220%22%7D', function(error){alert(JSON.stringify(error))}, function(data){myRecords = data});
        if(myRecords.length == 0){
            $("#myoffersList").append("<div class='span12'><div class='widget'><div class='widget-content' style='padding:20px 15px 20px 15px'><p style='text-align: center; font-style: italic; font-size:20px;'>There are no offers here :(</p></div></div></div>")
        }
        for(var i in myRecords){
            var date = new Date(myRecords[i].dateCreated);
            var corrDate = new Date(new Date(date).setHours(date.getHours+2));
            if(!myRecords[i].procent)
                var procentTag = "";
            else
                var procentTag = "<div class='tag span2 orange'>"+myRecords[i].procent+" Ron</div>";
            var dateNow = new Date();
            if(Date.parse(new Date(myRecords[i].expiresAt)) <= Date.parse(dateNow))
                var expired = "<img class='expired-ribbon' src='/platform/img/expired-ribbon.png' width='50%'>";
            else
                var expired="";
            if(!myRecords[i].companyWebsite)
                var companyWebsite = "javascript:;";
            else
                var companyWebsite = myRecords[i].companyWebsite;

            $("#myoffersList").append("<div class='span12'><div class='widget'><div class='widget-content'>"+expired+"<div class='offer-page-header-list'><span class='timeago offer-info-header'><i class='icon-time'></i>&nbsp;"+$.timeago(date)+"</span><span class='timeago offer-info-header'><i class='icon-map-marker'></i>&nbsp;"+myRecords[i].city+", "+myRecords[i].country+"</span><a href="+companyWebsite+" style='text-decoration:none; color:#666' target='_blank' class='timeago offer-info-header'><i class='icon-building'></i>&nbsp;"+myRecords[i].company+"</a></div><h3 style='margin-top:15px'>"+myRecords[i].title+"</h3><div class='job-facts-offer-list row'>"+procentTag+"<div class='tag span2'>"+myRecords[i].jobType+"</div><div class='tag span2'>"+myRecords[i].jobLevel+"</div><div class='tag span3'>"+myRecords[i].jobCategory+"</div></div><a href='#offer-page:"+myRecords[i].id+"' class='btn btn-warning offer-more-details' data-id='"+myRecords[i].id+"'>More details &nbsp; <i class='icon-chevron-right'></i></a></div></div></div>")
        }
        if($("#myoffersList .span12").length < 10){
            $(".offer-controls").hide();
        }
        $("#next-pagination").on("click", function(){
            $("#myoffersList").empty();
            ajaxGetCall('https://api.backand.com/1/query/data/getMyReferOffers?parameters=%7B%22oKey%22:%22'+oKey+'%22,%22pageSize%22:%2210%22,%22startFrom%22:%22'+parseInt($(this).attr("data-startfrom"))+'%22%7D', function(error){alert(JSON.stringify(error))}, function(data){myRecords = data});
            for(var i in myRecords){
                var date = new Date(myRecords[i].dateCreated);
                var corrDate = new Date(new Date(date).setHours(date.getHours+2));
                if(!myRecords[i].procent)
                    var procentTag = "";
                else
                    var procentTag = "<div class='tag span2 orange'>"+myRecords[i].procent+" Ron</div>";

                $("#myoffersList").append("<div class='span12'><div class='widget'><div class='widget-content'><div class='offer-page-header-list'><span class='timeago offer-info-header'><i class='icon-time'></i>&nbsp;"+$.timeago(date)+"</span><span class='timeago offer-info-header'><i class='icon-map-marker'></i>&nbsp;"+myRecords[i].city+", "+myRecords[i].country+"</span><span class='timeago offer-info-header'><i class='icon-building'></i>&nbsp;"+myRecords[i].company+"</span></div><h3 style='margin-top:15px'>"+myRecords[i].title+"</h3><div class='job-facts-offer-list row'>"+procentTag+"<div class='tag span2'>"+myRecords[i].jobType+"</div><div class='tag span2'>"+myRecords[i].jobLevel+"</div><div class='tag span3'>"+myRecords[i].jobCategory+"</div></div><a href='#offer-page:"+myRecords[i].id+"' class='btn btn-warning offer-more-details' data-id='"+myRecords[i].id+"' target='_blank'>More details &nbsp; <i class='icon-chevron-right'></i></a></div></div></div>")
            }
            $(this).attr('data-startfrom', parseInt($(this).attr('data-startfrom'))+10);
            $("#back-pagination").attr('data-startfrom', parseInt($("#back-pagination").attr('data-startfrom'))+10);
            if($("#myoffersList .span12").length < 10){
                $(this).addClass('hide');
                $("#back-pagination").removeClass('hide');
            }
            $("#back-pagination").removeClass('hide');
            $("html, body").animate({ scrollTop: 0 }, 600);
        });
        $("#back-pagination").on("click", function(){
            $("#myoffersList").empty();
            ajaxGetCall('https://api.backand.com/1/query/data/getMyReferOffers?parameters=%7B%22oKey%22:%22'+oKey+'%22,%22pageSize%22:%2210%22,%22startFrom%22:%22'+parseInt($(this).attr("data-startfrom"))+'%22%7D', function(error){alert(JSON.stringify(error))}, function(data){myRecords = data});
            for(var i in myRecords){
                var date = new Date(myRecords[i].dateCreated);
                var corrDate = new Date(new Date(date).setHours(date.getHours+2));
                if(!myRecords[i].procent)
                    var procentTag = "";
                else
                    var procentTag = "<div class='tag span2 orange'>"+myRecords[i].procent+" Ron</div>";

                $("#myoffersList").append("<div class='span12'><div class='widget'><div class='widget-content'><div class='offer-page-header-list'><span class='timeago offer-info-header'><i class='icon-time'></i>&nbsp;"+$.timeago(date)+"</span><span class='timeago offer-info-header'><i class='icon-map-marker'></i>&nbsp;"+myRecords[i].city+", "+myRecords[i].country+"</span><span class='timeago offer-info-header'><i class='icon-building'></i>&nbsp;"+myRecords[i].company+"</span></div><h3 style='margin-top:15px'>"+myRecords[i].title+"</h3><div class='job-facts-offer-list row'>"+procentTag+"<div class='tag span2'>"+myRecords[i].jobType+"</div><div class='tag span2'>"+myRecords[i].jobLevel+"</div><div class='tag span3'>"+myRecords[i].jobCategory+"</div></div><a href='#offer-page:"+myRecords[i].id+"' class='btn btn-warning offer-more-details' data-id='"+myRecords[i].id+"' target='_blank'>More details &nbsp; <i class='icon-chevron-right'></i></a></div></div></div>")
            }
            $(this).attr('data-startfrom', parseInt($(this).attr('data-startfrom'))-10);
            $("#next-pagination").attr('data-startfrom', parseInt($("#next-pagination").attr('data-startfrom'))-10);
            if($(this).attr("data-startfrom") === '-10'){
                $(this).addClass('hide');
                $("#next-pagination").removeClass('hide');
            }
            $("#next-pagination").removeClass('hide');
            $("html, body").animate({ scrollTop: 0 }, 600);
        });
    });