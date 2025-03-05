fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json").then((response) => { return response.json() }).then(main)

function main(heroes) {
  let sortedData = sortHeros(heroes)

  const select = document.getElementById("itemsPerPage");

  mainFuncSorte(sortedData);

  search(heroes);

  select.addEventListener('change', () => {
    showData(heroes, select.value);
  });

  showData(heroes, select.value);
}

function showData(heroes, count) {
  const numberOfHeroes = count === "all" ? heroes.length : Number.parseInt(count)
  const numberOfPages = Math.ceil(heroes.length / numberOfHeroes)
  const pagesContainer = document.getElementById("pages")
  pagesContainer.innerHTML = ""

  const prevButton = document.createElement("button")
  prevButton.textContent = "Previous"
  prevButton.className = "prev-page"
  prevButton.disabled = true 

  const pageInfo = document.createElement("span")
  pageInfo.textContent = `Page 1 of ${numberOfPages}`
  pageInfo.className = "page-info"

  const nextButton = document.createElement("button")
  nextButton.textContent = "Next"
  nextButton.className = "next-page"
  nextButton.disabled = numberOfPages <= 1

  pagesContainer.appendChild(prevButton)
  pagesContainer.appendChild(pageInfo)
  pagesContainer.appendChild(nextButton)

  let currentPage = 1

  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--
      updatePage()
    }
  })

  nextButton.addEventListener("click", () => {
    if (currentPage < numberOfPages) {
      currentPage++
      updatePage()
    }
  })

  const updatePage = () => {
    prevButton.disabled = currentPage === 1
    nextButton.disabled = currentPage === numberOfPages

    pageInfo.textContent = `Page ${currentPage} of ${numberOfPages}`
    const start = (currentPage - 1) * numberOfHeroes
    const end = start + numberOfHeroes >= heroes.length ? heroes.length : start + numberOfHeroes
    showHeros(heroes, start, end)
  }
  showHeros(heroes, 0, numberOfHeroes)
}

document.addEventListener("DOMContentLoaded", () => {
  const originalShowData = window.showData

  window.showData = (heroes, count) => {
    showData(heroes, count)
  }
})


function showHeros(heroes, start, end) {
  const fragment = document.createDocumentFragment()
  const board = document.getElementById('heroTableBody');
  board.innerHTML = '';

  const selectedHeroes = heroes.slice(start, end);

  selectedHeroes.forEach((hero) => {
    const row = document.createElement('tr');

    const iconCell = document.createElement('td');
    const img = document.createElement('img');
    img.src = hero.images.xs;
    img.alt = hero.name;
    img.style.width = '50px';
    img.style.height = '50px';
    iconCell.appendChild(img);

    const nameCell = createElement('td', hero.name);

    const fullNameCell = createElement('td', hero.biography.fullName);

    const intelligence = createElement('td', hero.powerstats['intelligence'])
    const strength = createElement('td', hero.powerstats['strength'])
    const speed = createElement('td', hero.powerstats['speed'])
    const durability = createElement('td', hero.powerstats['durability'])
    const power = createElement('td', hero.powerstats['power'])
    const combat = createElement('td', hero.powerstats['combat'])

    const raceCell = createElement('td', hero.appearance.race);

    const genderCell = createElement('td', hero.appearance.gender);

    const heightCell = createElement('td', hero.appearance.height.join(' / '));

    const weightCell = createElement('td', hero.appearance.weight.join(' / '));

    const birthPlaceCell = createElement('td', hero.biography.placeOfBirth);

    const alignmentCell = createElement('td', hero.biography.alignment);

    row.append(iconCell, nameCell, fullNameCell, intelligence, strength, speed, durability, power, combat, raceCell, genderCell, heightCell, weightCell, birthPlaceCell, alignmentCell)
    fragment.appendChild(row)
  });
  board.appendChild(fragment);
}

function createElement(tag, text, id = '', className = '') {
  const element = document.createElement(tag);
  element.textContent = text;
  if (id) element.id = id;
  if (className) element.className = className;
  return element;
}

function search(superheroes) {
  let searchText = []
  const searchBox = document.getElementById('search')
  searchBox.addEventListener('input', (e) => {
    const query = document.getElementById('search').value.toLowerCase();

    const filteredHeroes = superheroes.filter(hero => hero.name.toLowerCase().includes(query)); searchText.push(e.data)

    const select = document.getElementById("itemsPerPage");
    const herosSorted = sortHeros(filteredHeroes)

    select.addEventListener('change', () => {
      mainFuncSorte(herosSorted)
      showData(filteredHeroes, select.value);
    });
    mainFuncSorte(herosSorted)
    showData(filteredHeroes, select.value)
  });
}

function mainFuncSorte(sortedData) {
  const sortebtn = document.getElementById('sorte')
  let ascending = true
  let lastCol = ""
  sortebtn.addEventListener('click', (e) => {
    if (e.target.id != "") {
      ascending = lastCol === e.target.id ? !ascending : true;
      lastCol = e.target.id
      const filteredHeroes = sorteHelper(sortedData[e.target.id], ascending)

      const select = document.getElementById("itemsPerPage");

      select.addEventListener('change', () => {
        showData(filteredHeroes, select.value);
      });

      showData(filteredHeroes, select.value);
    }
  });
}

function isEmpti(value) {
  return !(value === '' || value === '-' || value == "0");
}

function sorteHelper(sortedData, ascending) {
  const filteredHeroes = [];
  const emptis = [];
  const start = ascending ? 0 : sortedData.length - 1;
  const end = ascending ? sortedData.length : -1;
  const step = ascending ? 1 : -1;

  for (let index = start; index !== end; index += step) {
    (isEmpti(sortedData[index][0]) ? filteredHeroes : emptis).push(sortedData[index][1]);
  }

  return filteredHeroes.concat(emptis);
}

function sortHeros(heros) {
  let SortedHerosafter = {
    Name: [], FullName: [],
    Intelligence: [], Strength: [], Speed: [], Durability: [], Power: [], Combat: [],
    Race: [],
    Gender: [],
    Height: [],
    Weight: [],
    PlaceOfBirth: [],
    Alignment: []
  };

  heros.forEach((hero) => {
    SortedHerosafter.Name.push([hero.name, hero]);
    SortedHerosafter.FullName.push([hero.biography.fullName, hero]);
    SortedHerosafter.Intelligence.push([parseInt(hero.powerstats.intelligence) || 0, hero]);
    SortedHerosafter.Strength.push([parseInt(hero.powerstats.strength) || 0, hero]);
    SortedHerosafter.Speed.push([parseInt(hero.powerstats.speed) || 0, hero]);
    SortedHerosafter.Durability.push([parseInt(hero.powerstats.durability) || 0, hero]);
    SortedHerosafter.Power.push([parseInt(hero.powerstats.power) || 0, hero]);
    SortedHerosafter.Combat.push([parseInt(hero.powerstats.combat) || 0, hero]);
    SortedHerosafter.Race.push([hero.appearance.race || "", hero]);
    SortedHerosafter.Gender.push([hero.appearance.gender || "", hero]);
    SortedHerosafter.Height.push([cmTometers(hero.appearance.height[1]) || 0, hero]);
    SortedHerosafter.Weight.push([klg(hero.appearance.weight[1]) || 0, hero]);
    SortedHerosafter.PlaceOfBirth.push([hero.biography.placeOfBirth || "", hero]);
    SortedHerosafter.Alignment.push([hero.biography.alignment || "", hero]);
  });

  const sortNumbers = (arr) => arr.sort((a, b) => a[0] - b[0]);

  const sortStrings = (arr) => arr.sort((a, b) => a[0].localeCompare(b[0]));

  SortedHerosafter.Name = sortStrings(SortedHerosafter.Name);
  SortedHerosafter.FullName = sortStrings(SortedHerosafter.FullName);
  SortedHerosafter.Race = sortStrings(SortedHerosafter.Race);
  SortedHerosafter.Gender = sortStrings(SortedHerosafter.Gender);
  SortedHerosafter.PlaceOfBirth = sortStrings(SortedHerosafter.PlaceOfBirth);
  SortedHerosafter.Alignment = sortStrings(SortedHerosafter.Alignment);

  SortedHerosafter.Height = sortNumbers(SortedHerosafter.Height);
  SortedHerosafter.Weight = sortNumbers(SortedHerosafter.Weight);
  SortedHerosafter.Intelligence = sortNumbers(SortedHerosafter.Intelligence);
  SortedHerosafter.Strength = sortNumbers(SortedHerosafter.Strength);
  SortedHerosafter.Speed = sortNumbers(SortedHerosafter.Speed);
  SortedHerosafter.Durability = sortNumbers(SortedHerosafter.Durability);
  SortedHerosafter.Power = sortNumbers(SortedHerosafter.Power);
  SortedHerosafter.Combat = sortNumbers(SortedHerosafter.Combat);

  return SortedHerosafter;
}

function cmTometers(height) {
  if (!height) return 0;
  return height.includes("cm") ? parseFloat(height) : parseFloat(height) * 100;
}

function klg(weight) {
  return weight.includes("kg") ? parseFloat(weight) : parseFloat(weight) * 1000;
}


// ----------------- ZYADA --------------------------- 


let heroDetail
let closeButton
let floatingHeroes
let heroesGrouped = false

const initHeroDetailAndAnimations = () => {
  heroDetail = document.getElementById("hero-detail")
  closeButton = document.querySelector(".close-button")
  floatingHeroes = document.querySelectorAll(".floating-hero")

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      heroDetail.classList.remove("active")
    })
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && heroDetail.classList.contains("active")) {
      heroDetail.classList.remove("active")
    }
  })


  const heroTableBody = document.getElementById("heroTableBody")
  if (heroTableBody) {
    heroTableBody.addEventListener("click", (e) => {
      const row = e.target.closest("tr")
      if (row) {
        const heroName = row.cells[1].textContent

        fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json")
          .then((response) => response.json())
          .then((heroes) => {
            const hero = heroes.find((h) => h.name === heroName)
            if (hero) {
              showHeroDetail(hero)
            }
          })
      }
    })
  }

  const sortButtons = document.querySelectorAll("#heroTable th button")
  sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      animateHeroesFighting()
    })
  })
}

const animateHeroesFighting = () => {
  const headerElement = document.querySelector("header")

  if (!heroesGrouped) {
    headerElement.classList.add("hero-grouped")
    heroesGrouped = true
  } else {
    headerElement.classList.remove("hero-grouped")
    heroesGrouped = false
  }
}

const showHeroDetail = (hero) => {
  document.getElementById("detail-hero-name").textContent = hero.name
  document.getElementById("detail-full-name").textContent = hero.biography.fullName || "Unknown"
  document.getElementById("detail-image").src = hero.images.md

  const stats = ["intelligence", "strength", "speed", "durability", "power", "combat"]
  stats.forEach((stat) => {
    const value = hero.powerstats[stat] || 0
    document.getElementById(`stat-${stat}`).style.width = `${value}%`
    document.getElementById(`value-${stat}`).textContent = value
  })

  document.getElementById("detail-race").textContent = hero.appearance.race || "Unknown"
  document.getElementById("detail-gender").textContent = hero.appearance.gender || "Unknown"
  document.getElementById("detail-height").textContent = hero.appearance.height.join(" / ") || "Unknown"
  document.getElementById("detail-weight").textContent = hero.appearance.weight.join(" / ") || "Unknown"
  document.getElementById("detail-eye-color").textContent = hero.appearance.eyeColor || "Unknown"
  document.getElementById("detail-hair-color").textContent = hero.appearance.hairColor || "Unknown"

  document.getElementById("detail-place-of-birth").textContent = hero.biography.placeOfBirth || "Unknown"
  document.getElementById("detail-alignment").textContent = hero.biography.alignment || "Unknown"
  document.getElementById("detail-publisher").textContent = hero.biography.publisher || "Unknown"
  document.getElementById("detail-first-appearance").textContent = hero.biography.firstAppearance || "Unknown"
  document.getElementById("detail-alter-egos").textContent = hero.biography.alterEgos || "None"
  document.getElementById("detail-aliases").textContent = hero.biography.aliases.join(", ") || "None"

  heroDetail.classList.add("active")

  setTimeout(() => {
    stats.forEach((stat) => {
      const value = hero.powerstats[stat] || 0
      document.getElementById(`stat-${stat}`).style.width = `${value}%`
    })
  }, 100)
}

document.addEventListener("DOMContentLoaded", () => {
  initHeroDetailAndAnimations()
})

