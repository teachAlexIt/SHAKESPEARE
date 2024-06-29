import dishesList from './dataBase.js';
console.log(dishesList);

// Получение текущего языка страницы
const lang = document.documentElement.lang;

// Получение элемента, в который будут добавляться кнопки категорий
const categoriesDiv = document.getElementById('categoriesList');
const dishesListDiv = document.querySelector('.dishes-list');

// Массив для хранения данных выбранных порций
let changedCart = [];
// Объект для хранения состояния категорий
const categoryState = {};

// Функция для создания кнопок категорий
function createCategoryButtons() {
  dishesList.forEach((categoryObj, index) => {
    const button = document.createElement('button');
    button.textContent = categoryObj.category[lang];

    // Добавление класса _active первой кнопке
    if (index === 0) {
      button.classList.add('_active');
      renderDishes(categoryObj.dishes, categoryObj.category[lang]); // Рендерим блюда первой категории по умолчанию
    }

    button.addEventListener('click', (event) => {
      handleCategoryButtonClick(event, categoryObj.dishes, categoryObj.category[lang]);
    });

    categoriesDiv.appendChild(button);
  });
}

// Функция для обработки клика по кнопке категории
function handleCategoryButtonClick(event, dishes, categoryName) {
  // Удаление класса _active у всех кнопок
  document.querySelectorAll('#categoriesList button').forEach(button => {
    button.classList.remove('_active');
  });

  // Добавление класса _active только на нажатую кнопку
  event.currentTarget.classList.add('_active');

  // Рендеринг блюд выбранной категории
  renderDishes(dishes, categoryName);
}

// Функция для рендеринга блюд
function renderDishes(dishes, categoryName) {
  dishesListDiv.classList.add('_hide');
  setTimeout(() => {
    // Очистка текущих блюд
    dishesListDiv.innerHTML = '';

    dishes.forEach(dish => {
      const dishCard = document.createElement('div');
      dishCard.classList.add('dishes-card');

      dishCard.innerHTML = `
            <img src="./img/categories/${dish.img}.jpg" alt="">
            <div class="dishes-card__info">
              <div class="dishes-card__description">
                <h2>${dish.name[lang]}</h2>
                <p>${dish.description[lang]}</p>  
              </div>
              <div class="dishes-card__management">
                ${dish.portionList.map(portion => `
                  <div class="portion-name">
                    <p><span>Порция <span class="portion-name">${portion.name}</span> - </span><span>$ <span class="portion-cost">${portion.cost}</span></span></p>
                    <div>
                      <button class="portion-minus"><i class="fa-solid fa-minus"></i></button>
                      <span class="portion-number">0</span>
                      <button class="portion-plus"><i class="fa-solid fa-plus"></i></button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;

      // Восстановление состояния порций
      if (categoryState[categoryName] && categoryState[categoryName][dish.name[lang]]) {
        const savedPortions = categoryState[categoryName][dish.name[lang]];
        dishCard.classList.add('change');
        dishCard.querySelectorAll('.portion-name').forEach(portionElement => {
          const portionNameElement = portionElement.querySelector('.portion-name');
          const portionNumberElement = portionElement.querySelector('.portion-number');
          if (portionNameElement && portionNumberElement) {
            const portionName = portionNameElement.textContent;
            if (savedPortions[portionName]) {
              portionNumberElement.textContent = savedPortions[portionName].quantity;
            }
          }
        });
      }

      // Добавляем обработчики событий на кнопки + и -
      dishCard.querySelectorAll('.portion-plus').forEach(button => {
        button.addEventListener('click', () => updatePortion(button, 'plus', dish, categoryName));
      });
      dishCard.querySelectorAll('.portion-minus').forEach(button => {
        button.addEventListener('click', () => updatePortion(button, 'minus', dish, categoryName));
      });

      dishesListDiv.appendChild(dishCard);
    });

    dishesListDiv.scrollLeft = 0;
    dishesListDiv.classList.remove('_hide');
  }, 500);
}

// Функция для обновления количества порций
function updatePortion(button, action, dish, categoryName) {
  const portionElement = button.closest('.portion-name');
  const portionNameElement = portionElement.querySelector('.portion-name');
  const portionCostElement = portionElement.querySelector('.portion-cost');
  const portionNumberElement = portionElement.querySelector('.portion-number');

  if (portionNameElement && portionCostElement && portionNumberElement) {
    const portionName = portionNameElement.textContent;
    const portionCost = parseInt(portionCostElement.textContent);
    let portionNumber = parseInt(portionNumberElement.textContent);

    if (action === 'plus') {
      portionNumber += 1;
    } else if (action === 'minus' && portionNumber > 0) {
      portionNumber -= 1;
    }

    portionNumberElement.textContent = portionNumber;

    // Обновление стиля карточки и массива changedCart
    const dishCard = button.closest('.dishes-card');
    if (portionNumber > 0) {
      dishCard.classList.add('change');
      // Обновление состояния категории
      if (!categoryState[categoryName]) {
        categoryState[categoryName] = {};
      }
      if (!categoryState[categoryName][dish.name[lang]]) {
        categoryState[categoryName][dish.name[lang]] = {};
      }
      categoryState[categoryName][dish.name[lang]][portionName] = {
        quantity: portionNumber,
        cost: portionCost,
        totalCost: portionNumber * portionCost
      };

      // Добавление порции в changedCart, если не добавлено
      const portionData = {
        name: dish.name[lang],
        portion: portionName,
        cost: portionCost,
        quantity: portionNumber,
        totalCost: portionNumber * portionCost
      };
      const existingPortion = changedCart.find(item => item.name === portionData.name && item.portion === portionData.portion);
      if (existingPortion) {
        existingPortion.quantity = portionNumber;
        existingPortion.totalCost = portionData.totalCost;
      } else {
        changedCart.push(portionData);
      }
    } else {
      // Удаление порции из categoryState и changedCart, если количество равно 0
      if (categoryState[categoryName] && categoryState[categoryName][dish.name[lang]]) {
        delete categoryState[categoryName][dish.name[lang]][portionName];
        if (Object.keys(categoryState[categoryName][dish.name[lang]]).length === 0) {
          delete categoryState[categoryName][dish.name[lang]];
        }
      }
      changedCart = changedCart.filter(item => !(item.name === dish.name[lang] && item.portion === portionName));
      // Удаление класса 'change', если все порции равны 0
      if (Array.from(dishCard.querySelectorAll('.portion-number')).every(element => parseInt(element.textContent) === 0)) {
        dishCard.classList.remove('change');
      }
    }

    console.log(changedCart);
    console.log(categoryState);
  }
}

// Создание кнопок категорий при загрузке страницы
createCategoryButtons();