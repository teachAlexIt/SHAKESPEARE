const dishesList = [
  // Начало категории "Основные блюда"
  {
    category: {
      ru: 'основные блюда',
      es: 'platos principales',
      en: 'main dishes',
    },
    dishes: [
      // Начало блюда 1
      {
        img: '',
        name: {
          ru: 'Грибная вырезка',
          es: 'Lomo con setas',
          en: 'Mushroom Tenderloin',
        },
        description: {
          ru: 'Говяжья вырезка на гриле с грибным соусом и овощным гарниром',
          es: 'Solomillo de ternera a la plancha con salsa de champiñones y guarnición de verduras',
          en: 'Grilled beef tenderloin with mushroom sauce and vegetable garnish',
        },
        portionList: [
          { name: '1', cost: '6000' },
        ],
      },
      // Конец блюда 1
      // Начало блюда 2
      {
        img: '',
        name: {
          ru: 'Кафе де Пари',
          es: 'Café de París',
          en: 'Café de Paris',
        },
        description: {
          ru: 'Нарезанная ломтиками говяжья вырезка на гриле с соусом "Кафе де Пари", жареным картофелем и салатом "Цезарь',
          es: 'Solomillo de ternera a la plancha cortado en juliana con salsa Café de París, patatas asadas y ensalada César',
          en: 'Julienne sliced grilled beef tenderloin with Café de Paris sauce, roast potatoes and Caesar salad',
        },
        portionList: [
          { name: '1', cost: '7000' },
          { name: '1.5', cost: '9000' },
        ],
      },
      // Конец блюда 2
    ],
  },
  // Конец категории "Основные блюда"

  // Начало категории "Закуски"
  {
    category: {
      ru: 'закуски',
      es: 'aperitivos',
      en: 'snacks',
    },
    dishes: [
      // Начало закуски 1
      {
        img: '',
        name: {
          ru: 'Сырная тарелка',
          es: '',
          en: 'Cheese Platter',
        },
        description: {
          ru: 'Импортные и местные сорта сыра, сушеные абрикосы, грецкие орехи, оливки и гризи',
          es: '',
          en: 'Imported and local cheese varieties, dried apricots, walnuts, olives and grisi',
        },
        portionList: [
          { name: '1', cost: '2700' },
        ],
      },
      // Конец закуски 1
      // Начало закуски 2
      {
        img: '',
        name: {
          ru: 'Тартанка с креветками из авокадо',
          es: 'aperitivo 2',
          en: 'Avocado Prawn Tartine',
        },
        description: {
          ru: 'На ломтике хлеба из закваски, паштет из свежего авокадо и соте из креветок в кресс-масле, с маринованными арбузными каперсами',
          es: '',
          en: 'On a slice of sourdough bread, fresh avocado pate, and sautéed shrimp in cress oil, with pickled watermelon capers',
        },
        portionList: [
          { name: '1', cost: '3200' },
        ],
      },
      // Конец закуски 2
    ],
  },
  // Конец категории "Закуски"

  // Начало категории "Напитки"
  {
    category: {
      ru: 'напитки',
      es: 'bebidas',
      en: 'drinks',
    },
    dishes: [
      // Начало напитка 1
      {
        img: '',
        name: {
          ru: 'Аффогато',
          es: 'Affogato',
          en: 'Affogato',
        },
        description: {
          ru: 'С ванильным мороженым и эспрессо',
          es: 'Con helado de vainilla y café expreso.',
          en: 'With vanilla ice cream and espresso',
        },
        portionList: [
          { name: '1', cost: '2000' },
        ],
      },
      // Конец напитка 1
      // Начало напитка 2
      {
        img: '',
        name: {
          ru: 'Кафе Мокко',
          es: 'bebida 2',
          en: 'Cafe Mocha',
        },
        description: {
          ru: 'Эспрессо, молоко, шоколад',
          es: '',
          en: 'Espresso, Milk, Chocolate',
        },
        portionList: [
          { name: '1', cost: '1800' },
        ],
      },
      // Конец напитка 2
    ],
  },
  // Конец категории "Напитки"

  // Начало категории "Алкогольные напитки"
  {
    category: {
      ru: 'алкогольные напитки',
      es: 'bebidas alcohólicas',
      en: 'alcoholic drinks',
    },
    dishes: [
      // Начало алкогольного напитка 1
      {
        img: '',
        name: {
          ru: 'Carlsberg 33 cl',
          es: 'Carlsberg 33 cl',
          en: 'Carlsberg 33 cl',
        },
        description: {
          ru: '',
          es: '',
          en: '',
        },
        portionList: [
          { name: '33ml', cost: '1200' },
        ],
      },
      // Конец алкогольного напитка 1
      // Начало алкогольного напитка 2
      {
        img: '',
        name: {
          ru: 'Tuborg Unfiltered 50 cl',
          es: 'Tuborg Unfiltered 50 cl',
          en: 'Tuborg Unfiltered 50 cl',
        },
        description: {
          ru: '',
          es: '',
          en: '',
        },
        portionList: [
          { name: '50ml', cost: '1600' },
        ],
      },
      // Конец алкогольного напитка 2
    ],
  },
  // Конец категории "Алкогольные напитки"
];

// Функция для обновления img поля
function updateDishesWithImage() {
  dishesList.forEach(categoryObj => {
    const categoryNameEn = categoryObj.category.en.toLowerCase().replace(/\s+/g, '-');
    categoryObj.dishes.forEach(dish => {
      const dishNameEn = dish.name.en.toLowerCase().replace(/\s+/g, '-');
      dish.img = `${categoryNameEn}/${dishNameEn}`; // Заполнение поля img в формате 'category[en]/name[en]'
    });
  });
}

// Обновляем данные
updateDishesWithImage();

export default dishesList;

