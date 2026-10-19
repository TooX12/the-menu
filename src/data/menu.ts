import type { MenuItem, OptionGroup, Restaurant } from '@/types';

/* ------------------------------------------------------------------ */
/* Reusable option groups                                              */
/* ------------------------------------------------------------------ */

const doneness: OptionGroup = {
  id: 'doneness',
  label: { es: 'Término', en: 'Cooked to', fr: 'Cuisson' },
  type: 'single',
  required: true,
  choices: [
    { id: 'rare', label: { es: 'Rojo', en: 'Rare', fr: 'Saignant' } },
    { id: 'medium-rare', label: { es: 'Medio rojo', en: 'Medium rare', fr: 'À point saignant' } },
    { id: 'medium', label: { es: 'Término medio', en: 'Medium', fr: 'À point' } },
    { id: 'medium-well', label: { es: 'Tres cuartos', en: 'Medium well', fr: 'Cuit' } },
    { id: 'well', label: { es: 'Bien cocido', en: 'Well done', fr: 'Bien cuit' } },
  ],
};

const steakExtras: OptionGroup = {
  id: 'extras',
  label: { es: 'Para acompañar', en: 'Add to the plate', fr: 'À ajouter' },
  type: 'multi',
  max: 3,
  choices: [
    {
      id: 'marrow',
      label: { es: 'Tuétano a la brasa', en: 'Grilled bone marrow', fr: 'Moelle grillée' },
      priceDelta: 60,
    },
    {
      id: 'cheese',
      label: { es: 'Queso fundido', en: 'Melted cheese', fr: 'Fromage fondu' },
      priceDelta: 45,
    },
    {
      id: 'nopales',
      label: { es: 'Nopales asados', en: 'Grilled nopales', fr: 'Nopales grillés' },
      priceDelta: 35,
    },
  ],
};

const heat: OptionGroup = {
  id: 'heat',
  label: { es: 'Nivel de picante', en: 'Heat', fr: 'Piquant' },
  type: 'single',
  required: true,
  choices: [
    { id: 'none', label: { es: 'Sin picante', en: 'None', fr: 'Sans piquant' } },
    { id: 'mild', label: { es: 'Suave', en: 'Mild', fr: 'Doux' } },
    { id: 'hot', label: { es: 'Picante', en: 'Hot', fr: 'Piquant' } },
  ],
};

const tortillas: OptionGroup = {
  id: 'tortillas',
  label: { es: 'Tortillas', en: 'Tortillas', fr: 'Tortillas' },
  type: 'single',
  required: true,
  choices: [
    { id: 'corn', label: { es: 'De maíz', en: 'Corn', fr: 'De maïs' } },
    { id: 'flour', label: { es: 'De harina', en: 'Flour', fr: 'De blé' } },
    { id: 'none', label: { es: 'Sin tortillas', en: 'None, thank you', fr: 'Sans tortillas' } },
  ],
};

const sweetness: OptionGroup = {
  id: 'sweetness',
  label: { es: 'Endulzado', en: 'Sweetness', fr: 'Sucre' },
  type: 'single',
  required: true,
  choices: [
    { id: 'none', label: { es: 'Sin azúcar', en: 'Unsweetened', fr: 'Sans sucre' } },
    { id: 'light', label: { es: 'Poca azúcar', en: 'Lightly sweet', fr: 'Peu sucré' } },
    { id: 'normal', label: { es: 'Normal', en: 'As it comes', fr: 'Normal' } },
  ],
};

const ice: OptionGroup = {
  id: 'ice',
  label: { es: 'Hielo', en: 'Ice', fr: 'Glaçons' },
  type: 'single',
  required: true,
  choices: [
    { id: 'normal', label: { es: 'Con hielo', en: 'With ice', fr: 'Avec glaçons' } },
    { id: 'little', label: { es: 'Poco hielo', en: 'Light ice', fr: 'Peu de glaçons' } },
    { id: 'none', label: { es: 'Sin hielo', en: 'No ice', fr: 'Sans glaçons' } },
  ],
};

const coffeeMilk: OptionGroup = {
  id: 'milk',
  label: { es: 'Leche', en: 'Milk', fr: 'Lait' },
  type: 'single',
  required: true,
  choices: [
    { id: 'none', label: { es: 'Solo', en: 'Black', fr: 'Noir' } },
    { id: 'whole', label: { es: 'Entera', en: 'Whole milk', fr: 'Lait entier' } },
    { id: 'oat', label: { es: 'De avena', en: 'Oat milk', fr: "Lait d'avoine" }, priceDelta: 15 },
  ],
};

/* ------------------------------------------------------------------ */
/* The menu                                                            */
/* ------------------------------------------------------------------ */

export const restaurant: Restaurant = {
  name: 'La Buena Mesa',
  tagline: {
    es: 'Cocina de casa · desde 1974',
    en: 'Home cooking · since 1974',
    fr: 'Cuisine de maison · depuis 1974',
  },
  address: {
    es: 'Calle Amsterdam 212, Condesa, Ciudad de México',
    en: 'Calle Amsterdam 212, Condesa, Mexico City',
    fr: 'Calle Amsterdam 212, Condesa, Mexico',
  },
  currency: 'MXN',
  locale: { es: 'es-MX', en: 'en-US', fr: 'fr-FR' },
  sections: [
    {
      id: 'starters',
      title: { es: 'Para empezar', en: 'To begin', fr: 'Pour commencer' },
      note: {
        es: 'Todo se prepara al momento, con lo que llegó del mercado esta mañana.',
        en: 'Everything is made to order, from whatever the market sent us this morning.',
        fr: 'Tout est préparé à la minute, avec ce que le marché nous a envoyé ce matin.',
      },
      items: [
        {
          id: 'sopa-tortilla',
          name: { es: 'Sopa de tortilla', en: 'Tortilla soup', fr: 'Soupe de tortilla' },
          description: {
            es: 'Caldo de jitomate asado, pasilla, aguacate, crema y queso fresco.',
            en: 'Roasted tomato broth, pasilla chile, avocado, cream and fresh cheese.',
            fr: 'Bouillon de tomate rôtie, piment pasilla, avocat, crème et fromage frais.',
          },
          price: 135,
          tags: ['signature'],
          options: [heat],
        },
        {
          id: 'guacamole',
          name: { es: 'Guacamole de la casa', en: 'House guacamole', fr: 'Guacamole de la maison' },
          description: {
            es: 'Molcajeteado a la mesa con chile serrano, cilantro y limón.',
            en: 'Ground at your table with serrano chile, coriander and lime.',
            fr: 'Écrasé à votre table avec piment serrano, coriandre et citron vert.',
          },
          price: 165,
          tags: ['vegetarian', 'glutenFree'],
          options: [heat, tortillas],
        },
        {
          id: 'esquites',
          name: { es: 'Esquites con epazote', en: 'Street corn cup', fr: 'Maïs à la mexicaine' },
          description: {
            es: 'Granos de maíz salteados con epazote, mayonesa de chipotle y queso añejo.',
            en: 'Corn sautéed with epazote, chipotle mayonnaise and aged cheese.',
            fr: 'Maïs sauté à l’épazote, mayonnaise au chipotle et fromage affiné.',
          },
          price: 95,
          tags: ['vegetarian'],
        },
        {
          id: 'ensalada-betabel',
          name: {
            es: 'Ensalada de betabel y queso de cabra',
            en: 'Beetroot and goat cheese salad',
            fr: 'Salade de betterave et chèvre',
          },
          description: {
            es: 'Betabel rostizado, arúgula, nuez caramelizada y vinagreta de naranja.',
            en: 'Roasted beetroot, rocket, candied walnuts and orange vinaigrette.',
            fr: 'Betterave rôtie, roquette, noix caramélisées et vinaigrette à l’orange.',
          },
          price: 150,
          tags: ['vegetarian', 'glutenFree'],
        },
      ],
    },
    {
      id: 'mains',
      title: { es: 'Platos fuertes', en: 'Main courses', fr: 'Plats principaux' },
      note: {
        es: 'Se sirven con tortillas hechas a mano.',
        en: 'Served with hand-pressed tortillas.',
        fr: 'Servis avec des tortillas faites à la main.',
      },
      items: [
        {
          id: 'arrachera',
          name: { es: 'Arrachera al carbón', en: 'Charcoal-grilled skirt steak', fr: 'Bavette au charbon' },
          description: {
            es: '280 g marinados en cerveza oscura, cebollitas de cambray y salsa borracha.',
            en: '280 g marinated in dark beer, spring onions and salsa borracha.',
            fr: '280 g marinés à la bière brune, petits oignons et salsa borracha.',
          },
          price: 320,
          tags: ['signature'],
          options: [doneness, steakExtras, tortillas],
        },
        {
          id: 'pescado-talla',
          name: { es: 'Pescado a la talla', en: 'Fish a la talla', fr: 'Poisson a la talla' },
          description: {
            es: 'Filete abierto a las brasas con adobo de guajillo, arroz blanco y limón.',
            en: 'Butterflied fillet over coals with guajillo adobo, white rice and lime.',
            fr: 'Filet ouvert aux braises, adobo de guajillo, riz blanc et citron vert.',
          },
          price: 285,
          tags: ['glutenFree'],
          options: [heat],
        },
        {
          id: 'mole-poblano',
          name: { es: 'Mole poblano con pollo', en: 'Chicken in mole poblano', fr: 'Poulet au mole poblano' },
          description: {
            es: 'Receta de la abuela: treinta ingredientes, tres días de cocción.',
            en: "Grandmother's recipe: thirty ingredients, three days on the stove.",
            fr: 'Recette de la grand-mère : trente ingrédients, trois jours de cuisson.',
          },
          price: 265,
          tags: ['signature'],
          options: [tortillas],
        },
        {
          id: 'enchiladas-verdes',
          name: {
            es: 'Enchiladas de mole verde',
            en: 'Green mole enchiladas',
            fr: 'Enchiladas au mole vert',
          },
          description: {
            es: 'Rellenas de pollo o de queso, con crema, cebolla morada y ajonjolí.',
            en: 'Filled with chicken or cheese, with cream, red onion and sesame.',
            fr: 'Garnies de poulet ou de fromage, crème, oignon rouge et sésame.',
          },
          price: 215,
          options: [
            {
              id: 'filling',
              label: { es: 'Relleno', en: 'Filling', fr: 'Garniture' },
              type: 'single',
              required: true,
              choices: [
                { id: 'chicken', label: { es: 'Pollo', en: 'Chicken', fr: 'Poulet' } },
                { id: 'cheese', label: { es: 'Queso', en: 'Cheese', fr: 'Fromage' } },
              ],
            },
            heat,
          ],
        },
        {
          id: 'risotto-huitlacoche',
          name: {
            es: 'Risotto de huitlacoche',
            en: 'Huitlacoche risotto',
            fr: 'Risotto au huitlacoche',
          },
          description: {
            es: 'Arroz arborio, huitlacoche, flor de calabaza y queso de rancho.',
            en: 'Arborio rice, huitlacoche, squash blossom and farmhouse cheese.',
            fr: 'Riz arborio, huitlacoche, fleur de courge et fromage fermier.',
          },
          price: 245,
          tags: ['vegetarian'],
        },
      ],
    },
    {
      id: 'sides',
      title: { es: 'Guarniciones', en: 'Sides', fr: 'Accompagnements' },
      items: [
        {
          id: 'frijoles-charros',
          name: { es: 'Frijoles charros', en: 'Charro beans', fr: 'Haricots charros' },
          description: {
            es: 'Caldosos, con tocino, chorizo y cilantro.',
            en: 'Brothy, with bacon, chorizo and coriander.',
            fr: 'En bouillon, avec lard, chorizo et coriandre.',
          },
          price: 75,
        },
        {
          id: 'arroz',
          name: { es: 'Arroz a la mantequilla', en: 'Buttered rice', fr: 'Riz au beurre' },
          description: {
            es: 'Con elote tierno y perejil.',
            en: 'With sweetcorn and parsley.',
            fr: 'Avec maïs doux et persil.',
          },
          price: 60,
          tags: ['vegetarian', 'glutenFree'],
        },
        {
          id: 'verduras-grill',
          name: { es: 'Verduras al grill', en: 'Grilled vegetables', fr: 'Légumes grillés' },
          description: {
            es: 'Calabaza, espárrago y pimiento con aceite de oliva y sal de gusano.',
            en: 'Courgette, asparagus and pepper with olive oil and sal de gusano.',
            fr: 'Courgette, asperge et poivron, huile d’olive et sal de gusano.',
          },
          price: 95,
          tags: ['vegan', 'glutenFree'],
        },
      ],
    },
    {
      id: 'desserts',
      title: { es: 'Postres', en: 'Desserts', fr: 'Desserts' },
      items: [
        {
          id: 'flan-cajeta',
          name: { es: 'Flan de cajeta', en: 'Cajeta flan', fr: 'Flan à la cajeta' },
          description: {
            es: 'Cremoso, con caramelo de leche de cabra y nuez pecana.',
            en: 'Creamy, with goat-milk caramel and pecan.',
            fr: 'Crémeux, caramel au lait de chèvre et noix de pécan.',
          },
          price: 110,
          tags: ['vegetarian', 'signature'],
        },
        {
          id: 'pastel-elote',
          name: { es: 'Pastel de elote tibio', en: 'Warm corn cake', fr: 'Gâteau de maïs tiède' },
          description: {
            es: 'Con crema batida y canela.',
            en: 'With whipped cream and cinnamon.',
            fr: 'Avec crème fouettée et cannelle.',
          },
          price: 95,
          tags: ['vegetarian'],
        },
        {
          id: 'helado-cafe',
          name: {
            es: 'Helado de vainilla con café de olla',
            en: 'Vanilla ice cream with café de olla',
            fr: 'Glace vanille au café de olla',
          },
          description: {
            es: 'Un affogato de aquí: café con piloncillo y canela sobre helado.',
            en: 'An affogato from here: piloncillo-and-cinnamon coffee over ice cream.',
            fr: 'Un affogato d’ici : café au piloncillo et cannelle sur la glace.',
          },
          price: 105,
          tags: ['vegetarian', 'glutenFree'],
        },
      ],
    },
    {
      id: 'drinks',
      title: { es: 'Bebidas', en: 'Drinks', fr: 'Boissons' },
      note: {
        es: 'Aguas frescas hechas cada mañana.',
        en: 'Fruit waters made fresh every morning.',
        fr: 'Eaux fruitées préparées chaque matin.',
      },
      items: [
        {
          id: 'agua-jamaica',
          name: { es: 'Agua de jamaica', en: 'Hibiscus water', fr: 'Eau d’hibiscus' },
          description: {
            es: 'Jarra de un litro o vaso individual.',
            en: 'One-litre jug or a single glass.',
            fr: 'Pichet d’un litre ou verre individuel.',
          },
          price: 60,
          tags: ['vegan'],
          options: [
            {
              id: 'size',
              label: { es: 'Tamaño', en: 'Size', fr: 'Taille' },
              type: 'single',
              required: true,
              choices: [
                { id: 'glass', label: { es: 'Vaso', en: 'Glass', fr: 'Verre' } },
                { id: 'jug', label: { es: 'Jarra 1 L', en: 'Jug, 1 L', fr: 'Pichet 1 L' }, priceDelta: 95 },
              ],
            },
            sweetness,
            ice,
          ],
        },
        {
          id: 'limonada',
          name: { es: 'Limonada mineral', en: 'Sparkling limeade', fr: 'Limonade pétillante' },
          description: {
            es: 'Limón recién exprimido y agua mineral.',
            en: 'Freshly squeezed lime and sparkling water.',
            fr: 'Citron vert pressé et eau gazeuse.',
          },
          price: 70,
          tags: ['vegan'],
          options: [sweetness, ice],
        },
        {
          id: 'cafe-olla',
          name: { es: 'Café de olla', en: 'Café de olla', fr: 'Café de olla' },
          description: {
            es: 'Café de Veracruz con piloncillo y canela, en jarrito de barro.',
            en: 'Veracruz coffee with piloncillo and cinnamon, in a clay cup.',
            fr: 'Café de Veracruz au piloncillo et cannelle, en tasse d’argile.',
          },
          price: 65,
          tags: ['vegetarian'],
          options: [coffeeMilk],
        },
        {
          id: 'margarita',
          name: { es: 'Margarita de la casa', en: 'House margarita', fr: 'Margarita de la maison' },
          description: {
            es: 'Tequila blanco, limón y naranja; escarchada o sin escarchar.',
            en: 'Blanco tequila, lime and orange; salted rim optional.',
            fr: 'Tequila blanco, citron vert et orange ; bord salé en option.',
          },
          price: 185,
          options: [
            {
              id: 'rim',
              label: { es: 'Escarchado', en: 'Rim', fr: 'Bord du verre' },
              type: 'single',
              required: true,
              choices: [
                { id: 'salt', label: { es: 'Con sal', en: 'Salt', fr: 'Sel' } },
                { id: 'chile', label: { es: 'Con sal de gusano', en: 'Sal de gusano', fr: 'Sal de gusano' } },
                { id: 'none', label: { es: 'Sin escarchar', en: 'No rim', fr: 'Sans bord' } },
              ],
            },
            ice,
          ],
        },
        {
          id: 'cerveza',
          name: { es: 'Cerveza artesanal', en: 'Craft beer', fr: 'Bière artisanale' },
          description: {
            es: 'Pregunte por las tres de barril de esta semana.',
            en: 'Ask for this week’s three on tap.',
            fr: 'Demandez les trois pressions de la semaine.',
          },
          price: 110,
        },
        {
          id: 'vino-copa',
          name: {
            es: 'Vino tinto de la casa, copa',
            en: 'House red, by the glass',
            fr: 'Rouge de la maison, au verre',
          },
          description: {
            es: 'Nebbiolo del Valle de Guadalupe.',
            en: 'Nebbiolo from Valle de Guadalupe.',
            fr: 'Nebbiolo de la Valle de Guadalupe.',
          },
          price: 145,
        },
      ],
    },
  ],
};

/** Flat lookup, built once — order lines store ids, not whole items. */
export const itemsById: ReadonlyMap<string, MenuItem> = new Map(
  restaurant.sections.flatMap((section) => section.items.map((item) => [item.id, item] as const)),
);
