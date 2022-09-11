$(async function () {
  //Função pra salvar favoritos
  const saveData = () => {
    localStorage.setItem("favorites", JSON.stringify(favIds));
  };
  //Função pra carregar lista de favoritos
  const favorite = (e, id, first = false) => {
    const favExiste = $(`[persId=${id}]`);
    if (favExiste.length > 0) {
      favs = favs.filter((fav) => {
        return !fav.includes(`persId="${id}"`);
      });
      favIds = favIds.filter((favId) => {
        return favId !== id;
      });
      $(`[favid=${id}]`).removeClass("selected");

      saveData();
    } else {
      favs.push(
        `<li persId="${id}"><span>${persons[id].name}</span><a favId="${id}" class="remove-fav"> <i class="material-symbols-outlined">delete</i></a></li>`
      );
      if (first) {
      } else {
        favIds.push(id);
      }
      saveData();
    }

    renderFav();
  };
  const renderFav = () => {
    const favorites = $(".favorites-list");
    favorites.html(favs.map((fav) => fav));
    favIds.forEach((favid) => {
      $(`[favid=${favid}]`).addClass("selected");

      $(`[favId=${favid}]`).click((e) => {
        const thisId = e.target.parentNode.getAttribute("favid");
        favs = favs.filter((fav) => {
          return !fav.includes(`persId="${thisId}"`);
        });

        favIds = favIds.filter((favId) => {
          return favId !== thisId;
        });
        saveData();
        renderFav(thisId);
        $(`[favid=${thisId}]`).removeClass("selected");
      });
    });
  };
  //Gerar cores aleatórias para os gráficos
  function gerar_cor(opacidade = 1) {
    let r = parseInt(Math.random() * 255);

    let g = parseInt(Math.random() * 255);

    let b = parseInt(Math.random() * 255);

    return `rgba(${r}, ${g}, ${b}, ${opacidade})`;
  }

  //Arrays de idade, cor de pele, favoritos e id dos favoritos pra serem salvos
  const ages = [];
  const skin = [];
  let persons = [];
  let favs = [];
  let favIds = [];
  //Função pra obter dados da API
  async function obterDados() {
    await $.ajax({
      url: "https://swapi.dev/api/people",
      method: "GET",
      dataType: "json",
      error(e) {
        console.log(e);
      },
    }).then((data) => {
      persons = data.results;
      $(".img-loads").remove();
    });
    favIds = localStorage.getItem("favorites")
      ? JSON.parse(localStorage.getItem("favorites"))
      : [];
    if (favIds.length > 0) {
      favIds.forEach((id) => {
        favorite("null", id, true);
      });
    }
  }
  await obterDados();

  //Pega cor da pele e a ano de nascimento e adiciona a cada respectivo array
  persons.forEach((person) => {
    ages.push(person.birth_year);
    skin.push(person.skin_color);
  });

  //Conta anos de nascimento repetidos
  const newtAge = {};
  ages.forEach(function (x, i) {
    newtAge[x] = (newtAge[x] || 0) + 1;
  });
  const ageCount = [];
  const ageName = [];
  //Salva o nome e a quantidade em diferentes arrays pra uso especifico dos gráficos
  for (xAge in newtAge) {
    ageName.push(xAge);
    ageCount.push(newtAge[xAge]);
  }

  //O mesmo processo anterior, mas com a cor de pele
  const newtSkin = {};
  skin.forEach(function (skinType, i) {
    newtSkin[skinType] = (newtSkin[skinType] || 0) + 1;
  });
  const skinCount = [];
  const skinName = [];
  for (xSkin in newtSkin) {
    skinName.push(xSkin);
    skinCount.push(newtSkin[xSkin]);
  }

  //Criação dos dados gráficos, idade
  let dadosIdade = {
    datasets: [
      {
        data: ageCount,
        backgroundColor: ageCount.map((age) => {
          return gerar_cor(Math.random() * (1 - 0.5) + 0.5);
        }),
      },
    ],
    labels: ageName,
  };

  //Criação dos dados gráficos, cor pele
  let dadosPele = {
    datasets: [
      {
        data: skinCount,
        backgroundColor: skinCount.map((skin) => {
          return gerar_cor(Math.random() * (1 - 0.5) + 0.5);
        }),
      },
    ],
    labels: skinName,
  };
  //variáveis do gráfico
  const ctxAge = $("#chartAge");
  const ctxSkin = $("#chartSkin");
  let opcoes = {
    cutoutPercentage: 40,
    responsive: true,
    maintainAspectRatio: true,
  };

  //Cria o gráfico de ano de nascimento
  let chartAge = new Chart(ctxAge, {
    type: "doughnut",
    data: dadosIdade,
    options: opcoes,
  });

  //Cria o gráfico de cor de pele
  let chartSkin = new Chart(ctxSkin, {
    type: "doughnut",
    data: dadosPele,
    options: opcoes,
  });

  //Array das pessoas a serem inseridas na tabela
  const personTable = [];
  //Função pra criar linhas pra tabela
  const createTd = (data, additional) => {
    return `<td>${data}${additional}</td>`;
  };
  //Cria as linhas da tabela com os dados da pessoa
  persons.map((person, i) => {
    const btnInfo = `<button class="btn-info" id="${i}"><i class="material-symbols-outlined">info</i></button>`;
    const name = createTd(person.name, btnInfo);
    personTable.push(`<tr>${name}${btnInfo}</tr>`);
  });
  //Gera os dados do array de pessoas na tela
  $(".table-body").html(
    personTable.map((person) => {
      return person;
    })
  );

  //Função  pra exibir o card dos dados da pessoa
  $(".btn-info").click((e) => {
    onFullInfo(e);
  });

  const onFullInfo = (e) => {
    const fullInfo = $(".full-info");
    if (fullInfo.length > 0) {
      fullInfo.remove();
    }
    const id = e.target.parentNode.id;
    const divInfo = $(".fool-info");
    divInfo.append(`<div class="full-info">
    <button class="btn-close-info"><span>X</span></button>
    <p><span>Nome:</span><span>${persons[id].name}</span></p>
    <p><span>Peso:</span><span>${persons[id].height}</span></p>
    <p><span>Massa:</span><span>${persons[id].mass}</span></p>
    <p><span>Cor de Cabelo:</span><span>${persons[id].hair_color}</span></p>
    <p><span>Cor da Pele:</span><span>${persons[id].skin_color}</span></p>
    <p><span>Cor dos Olhos:</span><span>${persons[id].eye_color}</span></p>
    <p><span>Ano de Nascimento:</span><span>${persons[id].birth_year}</span></p>
    <p><span>Gênero:</span><span>${persons[id].gender}</span></p>
    <button class="btn-favorite"><i class="material-symbols-outlined" favid=${id}>star</i></button>
    </div>`);
    const favExiste = $(`[persId=${id}]`);
    if (favExiste.length > 0) {
      $(`[favid=${id}]`).addClass("selected");
    }
    $(".btn-close-info").click((e) => {
      $(".full-info").remove();
    });
    $(".btn-favorite").click((e) => {
      favorite(e, id);
    });
  };
});
