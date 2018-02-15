$(document).ready(function () {

  $("#startQuizButton").css("display", "none");
  $("#progressBar").css("display", "block");
  $("#questionAnswers").empty();
  makeNameToImageQuestion();
  
  var isChrome = !!window.chrome && !!window.chrome.webstore;
  console.log(isChrome);
  
  $("#nextQuestionButton").click(function(e) {
    e.preventDefault();
    $("#quiz").css("display", "none");
    $("#questionAnswers").empty();
    $("#progressBar").css("display", "block");
    $("#questionNumber").html(parseInt($("#questionNumber").html()) + 1);
    makeNameToImageQuestion();
  });
});

function makeNameToImageQuestion() {
  var randomPokemonId = Math.floor((Math.random() * 802) + 1);
  var pokemonUrl = "https://pokeapi.co/api/v2/pokemon/" + randomPokemonId + "/";
  var pokemonImageUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + randomPokemonId + ".png";
  $.ajax({
    url : pokemonUrl,
    dataType : "json",
    success : function(pokemonJson) {
      console.log(pokemonJson);
      $("#questionText").html("Which of the following Pokémon is " + titleCase(pokemonJson.name) + "?");
      $("#questionAnswers").append("<div class='four-column correct' onclick='checkAnswer(this, true)'><img src='" + pokemonImageUrl + "' /></div>");
      var numberAnswersSoFar = $("#questionAnswers").children().length;
      var percent = 100*numberAnswersSoFar/(4-1);
      $("#loadedBar").css("width", percent + '%');
      makeNameToImageIncorrectAnswer();
    }
  });
}

function makeNameToImageIncorrectAnswer() {
  if ($("#questionAnswers").children().length < 4) {
    var randomPokemonId = Math.floor((Math.random() * 802) + 1);
    var pokemonUrl = "https://pokeapi.co/api/v2/pokemon/" + randomPokemonId + "/";
    var pokemonImageUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + randomPokemonId + ".png";
    $.ajax({
      url : pokemonUrl,
      dataType : "json",
      success : function(pokemonJson) {
        console.log(pokemonJson);
        var answerHTML = "<div class='four-column incorrect' onclick='checkAnswer(this, false)'><img src='" + pokemonImageUrl + "' /></div>"
        $("#questionAnswers").append(answerHTML);
        var numberAnswersSoFar = $("#questionAnswers").children().length;
        var percent = 100*numberAnswersSoFar/(4-1);
        $("#loadedBar").css("width", percent + '%');
        makeNameToImageIncorrectAnswer();
      }
    });
  } else {
    var n = Math.floor(Math.random() * 4);
    while (n > 0) {
      $('.correct').each(function() { $(this).insertAfter($(this).next()); });
      n--;
    }
    $("#progressBar").css("display", "none"); 
    $("#loadedBar").css("width", "1%");
    $(".four-column").css("border", "5px solid #EEEEEE")
    if (!!window.chrome && !!window.chrome.webstore) {
      $(".four-column").hover(
        function(){
          if (parseInt($("#complete").html()) < parseInt($("#questionNumber").html()) || $("#complete").html() == "--") {
            $(this).css("border", "5px solid #999999");
          }
        },
        function(){
          if (parseInt($("#complete").html()) < parseInt($("#questionNumber").html()) || $("#complete").html() == "--") {
            $(this).css("border", "5px solid #EEEEEE");
          }
        }
      );
    } else {
      $(".four-column").hover(
        function(){
          if (parseInt($("#complete").html()) < parseInt($("#questionNumber").html()) || $("#complete").html() == "--") {
            $(this).css("box-shadow", "0px 0px 18px 5px #999999");
          }
        },
        function(){
          if (parseInt($("#complete").html()) < parseInt($("#questionNumber").html()) || $("#complete").html() == "--") {
            $(this).css("box-shadow", "none");
          }
        }
      );
    }
    $("#quiz").css("display", "block");
    $("#nextQuestionButton").css("display", "none");
  }
}

function checkAnswer(element, correct) {
  if ($("#complete").html() == "--") {
    $("#score").html("0");
    $("#complete").html("0");      
  }
  if (parseInt($("#complete").html()) < parseInt($("#questionNumber").html())) {
    $(".four-column").css("box-shadow", "0px 0px black");
    if (!!window.chrome && !!window.chrome.webstore) {
      element.style.border = "5px solid #EEEEEE";
    }
    $(".correct").css("box-shadow", "0px 0px 18px 5px green");
    if (correct) {
      $("#score").html(parseInt($("#score").html()) + 1);
    } else {
      element.style.boxShadow = "0px 0px 18px 5px red";
    }
    $("#complete").html(parseInt($("#complete").html()) + 1);
    $("#nextQuestionButton").css("display", "inline");
  }
}

function titleCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}