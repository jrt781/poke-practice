$(document).ready(function () {

  $("#pokedexSubmit").click(function(e) {
    $("#pokedexEntries").empty();
    e.preventDefault();
    var pokemonName = $("#pokemonName").val();
    var lowerValue = $("#lowerId").val();
    var upperValue = $("#upperId").val();
    document.getElementById("pokedexEntries").style.display = "none";
    if (pokemonName != "") {
      document.getElementById("ajax-loader").style.display = "block";
      getPokemonEntryByName(pokemonName);
    } else if (lowerValue != "" && upperValue != "") {
      document.getElementById("progressBar").style.display = "block";
      document.getElementById("loadedBar").style.width = "1%";
      getPokemonEntryById(lowerValue, 0, upperValue-lowerValue+1);
    } else {
      alert("NO");
    }
  });
});

function getPokemonEntryByName(name) {
  var pokedexEntries = document.getElementById("pokedexEntries");
  var myurl= "https://pokeapi.co/api/v2/pokemon/" + name;
  $.ajax({
    url : myurl,
    dataType : "json",
    success : function(json) {
      console.log(json);
      var entry = document.createElement("div");
      entry.className = "entry";

      var sprite = document.createElement("img");
      sprite.src = json.sprites.front_default;

      var idNum = document.createElement("p");
      idNum.innerHTML = json.id;

      entry.appendChild(sprite);
      entry.appendChild(idNum);

      pokedexEntries.appendChild(entry);

      pokedexEntries.style.display = "block";
      document.getElementById("ajax-loader").style.display = "none";
    }
  });
}

function getPokemonEntryById(id, howManySoFar, howManyTotal) {
  var pokedexEntries = document.getElementById("pokedexEntries");
  var pokemonUrl = "https://pokeapi.co/api/v2/pokemon/" + id;
  var speciesUrl = "https://pokeapi.co/api/v2/pokemon-species/" + id;
  $.ajax({
    url : pokemonUrl,
    dataType : "json",
    success : function(pokemonJson) {
      console.log(pokemonJson);
      $.ajax({
        url : pokemonUrl,
        dataType : "json",
        success : function(speciesJson) {
          var entry = document.createElement("div");
          entry.className = "entry";

          var sprite = document.createElement("img");
          sprite.src = pokemonJson.sprites.front_default;

          var idNum = document.createElement("p");
          idNum.innerHTML = id;

          entry.appendChild(sprite);
          entry.appendChild(idNum);

          pokedexEntries.appendChild(entry);

          ++howManySoFar;
          if (howManySoFar < howManyTotal) {
            var percent = 100*howManySoFar/(howManyTotal-1);
            document.getElementById("myBar").style.width = percent + '%';
            getPokemonEntryById(++id, howManySoFar, howManyTotal);
          } else {
            pokedexEntries.style.display = "block";
            document.getElementById("myProgress").style.display = "none";
          }  
        }
      });
    }
  });
}

/*function move() {
  document.getElementById("myBar").style.width = width + '%';
  var width = 1;
  var id = setInterval(frame, 10);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
    } else {
      width++;

    }
  }
}*/
