$(document).ready(function () {

  $("#pokemonNameSubmit").click(function(e) {
    $("#pokedexEntries").empty();
    e.preventDefault();
    var pokemonName = $("#pokemonName").val();
    document.getElementById("pokedexEntries").style.display = "none";
    if (pokemonName != "") {
      document.getElementById("ajax-loader").style.display = "inline";
      getPokemonEntry(pokemonName);
    } else {
      alert("Please enter a name.");
    }
  });

  $("#pokemonIdSubmit").click(function(e) {
    $("#pokedexEntries").empty();
    e.preventDefault();
    var pokemonId = $("#onlyId").val();
    document.getElementById("pokedexEntries").style.display = "none";
    if (pokemonId == "") {
      alert("Please enter an ID.");
    } else if (!$.isNumeric(pokemonId)) {
      alert("The input must be numeric.")
    } else {
      document.getElementById("ajax-loader").style.display = "inline";
      getPokemonEntry(pokemonId);
    }
  });

  $("#pokemonGroupSubmit").click(function(e) {
    $("#pokedexEntries").empty();
    e.preventDefault();
    var lowerValue = $("#lowerId").val();
    var upperValue = $("#upperId").val();
    document.getElementById("pokedexEntries").style.display = "none";
    if (lowerValue == "" || upperValue == "") {
      alert("Please enter two IDs.");
    } else if (!$.isNumeric(lowerValue) || !$.isNumeric(upperValue)) {
      alert("The input must be numeric.")
    } else if (upperValue < lowerValue) {
      alert("The range must go from one ID to an ID that is equal or higher.")
    } else {
      document.getElementById("progressBar").style.display = "block";
      document.getElementById("loadedBar").style.width = "1%";
      getPokemonEntries(lowerValue, 0, upperValue-lowerValue+1);
    }
  });
});

function getPokemonEntry(name) {
  var pokedexEntries = document.getElementById("pokedexEntries");
  var pokemonUrl = "https://pokeapi.co/api/v2/pokemon/" + name + "/";
  var speciesUrl = "https://pokeapi.co/api/v2/pokemon-species/" + name + "/";
  $.ajax({
    url : pokemonUrl,
    dataType : "json",
    success : function(pokemonJson) {
      console.log(pokemonJson);
      $.ajax({
        url : speciesUrl,
        dataType : "json",
        success : function(speciesJson) {
          console.log(speciesJson);

          createEntry(pokemonJson, speciesJson);

          pokedexEntries.style.display = "block";
          document.getElementById("ajax-loader").style.display = "none";
        }
      });
    }
  }).fail(function (jqXHR, textStatus, errorThrown) {
    pokedexEntries.innerHTML = "<em>No Pokémon found.</em>"
    pokedexEntries.style.display = "block";
    document.getElementById("ajax-loader").style.display = "none";
  });
}

function getPokemonEntries(id, howManySoFar, howManyTotal) {
  var pokedexEntries = document.getElementById("pokedexEntries");
  var pokemonUrl = "https://pokeapi.co/api/v2/pokemon/" + id + "/";
  var speciesUrl = "https://pokeapi.co/api/v2/pokemon-species/" + id + "/";
  $.ajax({
    url : pokemonUrl,
    dataType : "json",
    success : function(pokemonJson) {
      console.log(pokemonJson);
      var percent = 100*(2*howManySoFar+1)/(2*howManyTotal-1);
      document.getElementById("loadedBar").style.width = percent + '%';
      $.ajax({
        url : speciesUrl,
        dataType : "json",
        success : function(speciesJson) {
          console.log(speciesJson);

          createEntry(pokemonJson, speciesJson);

          ++howManySoFar;
          if (howManySoFar < howManyTotal) {
            var percent = 100*2*howManySoFar/(2*howManyTotal-1);
            // var percent = 100*howManySoFar/(howManyTotal-1);
            document.getElementById("loadedBar").style.width = percent + '%';
            getPokemonEntries(++id, howManySoFar, howManyTotal);
          } else {
            pokedexEntries.style.display = "block";
            document.getElementById("progressBar").style.display = "none";
          }
        }
      });
    }
  }).fail(function (jqXHR, textStatus, errorThrown) {
    pokedexEntries.innerHTML = "<em>No Pokémon found.</em>"
    pokedexEntries.style.display = "block";
    document.getElementById("progressBar").style.display = "none";
  });
}

function createEntry(pokemonJson, speciesJson) {
  var entry = document.createElement("div");
  entry.className = "entry";

  var imageDiv = document.createElement("div");
  imageDiv.className = "pokemonImage";
  var verticalMiddleAlignPokedexImageHelperSpan = document.createElement("span");
  verticalMiddleAlignPokedexImageHelperSpan.className = "verticalMiddleAlignPokedexImageHelper";
  imageDiv.appendChild(verticalMiddleAlignPokedexImageHelperSpan);
  var sprite = document.createElement("img");
  sprite.src = pokemonJson.sprites.front_default;
  imageDiv.appendChild(sprite);
  entry.appendChild(imageDiv);

  var dataDiv = document.createElement("div");
  dataDiv.className = "pokemonData";
  var dataHeader = document.createElement("h3");
  dataHeader.innerHTML = titleCase(speciesJson.name) + " - #" + speciesJson.id;
  dataDiv.appendChild(dataHeader);

  var genera = speciesJson.genera;
  var genus;
  var i = 0;
  while (true) {
    if (genera[i].language.name == "en") {
      genus = genera[i].genus;
      break;
    }
    i++;
  }
  var genusElement = document.createElement("h4");
  genusElement.innerHTML = genus;
  dataDiv.appendChild(genusElement);
    
  var typesElement = document.createElement("div");
  if (pokemonJson.types.length == 1) {
    var imageElement1 = document.createElement("img");
    imageElement1.src = "images/types/" + pokemonJson.types[0].type.name + ".png";
    imageElement1.className = "type";
    typesElement.appendChild(imageElement1);
  } else {
    var imageElement1 = document.createElement("img");
    imageElement1.src = "images/types/" + pokemonJson.types[0].type.name + ".png";
    imageElement1.className = "type";
    typesElement.appendChild(imageElement1);
    
    var imageElement2 = document.createElement("img");
    imageElement2.src = "images/types/" + pokemonJson.types[1].type.name + ".png";
    imageElement2.className = "type";
    typesElement.appendChild(imageElement2);
  }
  dataDiv.appendChild(typesElement);
  
  /*

  CODE TO PUT TEXT REPRESENTING TYPES IN
  
  var typesElement = document.createElement("h4");
  if (pokemonJson.types.length == 1) {
    typesElement.innerHTML = titleCase(pokemonJson.types[0].type.name);
  } else {
    typesElement.innerHTML = titleCase(pokemonJson.types[0].type.name)+ " & "
                           + titleCase(pokemonJson.types[1].type.name);
  }
  dataDiv.appendChild(typesElement);
  */
  
  var flavors = speciesJson.flavor_text_entries;
  var flavor;
  i = 0;
  while (true) {
    if (flavors[i].language.name == "en") {
      flavor = flavors[i].flavor_text;
      break;
    }
    i++;
  }
  var flavorElement = document.createElement("p");
  flavorElement.innerHTML = flavor;
  dataDiv.appendChild(flavorElement);

  entry.appendChild(dataDiv);

  pokedexEntries.appendChild(entry);
}

function titleCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function enterRange(lower, upper) {
  document.getElementById("lowerId").value = lower;
  document.getElementById("upperId").value = upper;
}