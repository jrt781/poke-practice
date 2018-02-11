$(document).ready(function () {

  $("#pokedexSubmit").click(function(e) {
    $("#pokedexEntries").empty();
    e.preventDefault();
    var lowerValue = $("#lowerId").val();
    var upperValue = $("#upperId").val();
    console.log(lowerValue);
    console.log(upperValue);
    var pokedexEntries = document.getElementById("pokedexEntries");
    for (var i = lowerValue; i <= upperValue; i++) {
      console.log(i);
      var myurl= "http://pokeapi.co/api/v2/pokemon/" + i;
      console.log(myurl);
      $.ajax({
        url : myurl,
        dataType : "json",
        success : function(json) {
          console.log(json);
          var entry = document.createElement("div");
          entry.className = "entry";

          var sprite = document.createElement("img");
          sprite.src = json.sprites.front_default;

          entry.appendChild(sprite);



          /*
          var questionLink = document.createElement("a");
          questionLink.href = json.items[i].link;
          questionLink.innerHTML = json.items[i].title.fontsize(5).bold();
          question.appendChild(questionLink);

          if (json.items[i].is_answered == true) {
            var answer = document.createElement("p");
            answer.innerHTML = "Answered!";
            question.appendChild(answer);
          }

          var score = document.createElement("p");
          score.innerHTML = "Score: " + json.items[i].score;
          question.appendChild(score);

          var views = document.createElement("p");
          views.innerHTML = "Views: " + json.items[i].view_count;
          question.appendChild(views);
          */

          pokedexEntries.appendChild(question);
        }
      });
    }
  });
});
