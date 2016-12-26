$(document).ready(function() {
  
  $(document).on("click", ".app__logout", function(e) {
    if (animating) return;
    $(".ripple").remove();
    animating = true;
    var that = this;
    $(that).addClass("clicked");
    setTimeout(function() {
      $app.removeClass("active");
      $login.show();
      $login.css("top");
      $login.removeClass("inactive");
    }, logoutPhase1 - 120);
    setTimeout(function() {
      $app.hide();
      animating = false;
      $(that).removeClass("clicked");
    }, logoutPhase1);
  });
    
  $("#signup").on("click", function(){
      $( ".demo" ).animate({
        opacity: 0
      }, 100, function() {
        $(".login__form").addClass("hide");
        $(".reset_password_form").addClass("hide");
        $( ".demo" ).animate({
            opacity: 1
          }, 100, function() {
              $(".demo").addClass("extend");
              $(".signup_form").removeClass("hide");
          });
      });
  });
  $("#login").on("click", function(){      
      $( ".demo" ).animate({
        opacity: 0
      }, 100, function() {
        $(".signup_form").addClass("hide");
        $(".reset_password_form").addClass("hide");
        $( ".demo" ).animate({
            opacity: 1
          }, 100, function() {
                $(".demo").removeClass("extend").removeClass("reduce");
                $(".login__form").removeClass("hide");
          });
      });
  });
  $("#reset").on("click", function(){      
      $( ".demo" ).animate({
        opacity: 0
      }, 100, function() {
        $(".login__form").addClass("hide");
        $(".signup_form").addClass("hide");
        $( ".demo" ).animate({
            opacity: 1
          }, 100, function() {
                $(".demo").removeClass("extend").addClass("reduce");
                $(".reset_password_form").removeClass("hide");
          });
      });
  });
  
});