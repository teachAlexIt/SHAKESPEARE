import dishesList from './dataBase.js';

// Получение текущего языка страницы
const lang = document.documentElement.lang;

// Получение элемента, в который будут добавляться кнопки категорий
const categoriesDiv = document.getElementById('categoriesList');
const dishesListDiv = document.querySelector('.dishes-list');
const basketListDiv = document.querySelector('.basket-list'); // Получение элемента для корзины

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
let activeDishes = dishesList[0].dishes;
let activecategoryName = 'основные блюда';
// Функция для обработки клика по кнопке категории
function handleCategoryButtonClick(event, dishes, categoryName) {
  // Удаление класса _active у всех кнопок
  document.querySelectorAll('#categoriesList button').forEach(button => {
    button.classList.remove('_active');
  });

  // Добавление класса _active только на нажатую кнопку
  event.currentTarget.classList.add('_active');

  // Рендеринг блюд выбранной категории
  activeDishes = dishes;
  activecategoryName = categoryName
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
  if (!portionElement) {
    console.error("portionElement is null");
    return;
  }
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
        categoryName: categoryName,
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

    // Обновление корзины
    updateBasket();
  }
}

// Функция для обновления корзины
function updateBasket() {
  basketListDiv.innerHTML = '';

  if (changedCart.length === 0) {
    basketListDiv.textContent = 'пока пусто';
  } else {
    changedCart.forEach(item => {
      const dishObj = findDishByName(item.name, item.categoryName);
      const basketCard = document.createElement('div');
      basketCard.classList.add('basket-list__item', 'basket-card');
      basketCard.innerHTML = `
        <div class="basket-card__info">
          <img src="./img/categories/${dishObj.img}.jpg" alt="">
          <div class="dishes-card__description">
            <h2>${item.name}</h2>
            <h2><i>'${dishObj.name.en}'</i></h2>
            <p><span>${item.portion}</span> portion $ ${item.cost}</p>  
          </div>
        </div>
        <div class="basket-card__management">
          <button class="portion-minus"><i class="fa-solid fa-minus"></i></button>
          <span class="portion-number">${item.quantity}</span>
          <button class="portion-plus"><i class="fa-solid fa-plus"></i></button>
        </div>
        <p class="basket-card__cost" >
          Стоимость <span>${item.totalCost}$</span>
        </p>
      `;

      // Добавляем обработчики событий на кнопки + и -
      basketCard.querySelector('.portion-plus').addEventListener('click', () => basketPortionPlus(item.name, item.portion, item.categoryName));
      basketCard.querySelector('.portion-minus').addEventListener('click', () => basketPortionMinus(item.name, item.portion, item.categoryName));

      basketListDiv.appendChild(basketCard);
    });
  }
  calculTotalPrice()
}


function basketPortionPlus(name, portion, categoryName) {
  for (const cart of changedCart) {
    if (cart.name === name && cart.portion === portion) {
      cart.quantity++
      cart.totalCost = cart.quantity * cart.cost
    }
  }
  categoryState[categoryName][name][portion].quantity++
  categoryState[categoryName][name][portion].totalCost = categoryState[categoryName][name][portion].quantity * categoryState[categoryName][name][portion].cost
  updateBasket()
  renderDishes(activeDishes, activecategoryName)
}

function basketPortionMinus(name, portion, categoryName) {
  for (const cart of changedCart) {
    if (cart.name === name && cart.portion === portion) {
      cart.quantity = cart.quantity - 1
      if (cart.quantity == 0) {
        changedCart = changedCart.filter(item => !(item.name === name && item.portion === portion));

        delete categoryState[categoryName][name][portion];
        if (Object.keys(categoryState[categoryName][name]).length === 0) {
          delete categoryState[categoryName][name];
        }
        console.log(changedCart, categoryState);
      } else {
        cart.totalCost = cart.quantity * cart.cost
        categoryState[categoryName][name][portion].quantity = categoryState[categoryName][name][portion].quantity - 1
        categoryState[categoryName][name][portion].totalCost = categoryState[categoryName][name][portion].quantity * categoryState[categoryName][name][portion].cost

      }
      updateBasket()
      renderDishes(activeDishes, activecategoryName)

    }
  }

}

// Функция для поиска блюда по имени и категории
function findDishByName(name, categoryName) {
  for (const category of dishesList) {
    if (category.category[lang] === categoryName) {
      for (const dish of category.dishes) {
        if (dish.name[lang] === name) {
          return dish;
        }
      }
    }
  }
  return null;
}

// Функция для обработки нажатия кнопки + в корзине
// function handlePortionPlus(dish, button) {
//   updatePortion(button, 'plus', dish, dish.categoryName);
// }

// // Функция для обработки нажатия кнопки - в корзине
// function handlePortionMinus(dish, button) {
//   updatePortion(button, 'minus', dish, dish.categoryName);
// }

// Создание кнопок категорий при загрузке страницы
createCategoryButtons();








const totalPriceSpan = document.querySelector('#total-price');
function calculTotalPrice(){
  let totalPrice = 0;
  for (const cart of changedCart){
    totalPrice += cart.totalCost
  }
  totalPriceSpan.innerText = totalPrice;
}

function basketBoxOpenClouse() {
  basketButtonOpen.classList.toggle('button_moveLeft');
  basketButtonClouse.classList.toggle('basket-clouse_active');
  basketBox.classList.toggle('basket-box_open');
}
const basketButtonOpen = document.querySelector('.basket');
const basketButtonClouse = document.querySelector('.basket-clouse');
const basketBox = document.querySelector('.basket-box');

basketButtonOpen.onclick = function () {
  basketBoxOpenClouse()
}
basketButtonClouse.onclick = function () {
  basketBoxOpenClouse()
}