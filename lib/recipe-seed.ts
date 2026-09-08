import type { Recipe } from "./db";

// AZURE / AZURA kitchen technical sheets supplied by the chef, transcribed into
// the recipe book. Quantities are batch quantities for the stated yield.
// Seeded once into the DB (see migrate + seededRecipesV1).
type SeedRecipe = Omit<Recipe, "id" | "createdAt">;

export const RECIPE_SEED: SeedRecipe[] = [
  {
    name: "Rib-eye Café de Paris — Seasonal Vegetables & Pommes Dauphine",
    category: "Main",
    yield: "10 portions (250 g rib-eye each)",
    ingredients: [
      { name: "Rib-eye (entrecôte), trimmed", qty: "2.5", unit: "kg" },
      { name: "Neutral oil", qty: "50", unit: "ml" },
      { name: "Butter (for searing)", qty: "100", unit: "g" },
      { name: "Garlic, crushed", qty: "30", unit: "g" },
      { name: "Fresh thyme", qty: "15", unit: "g" },
      { name: "Salt", qty: "25", unit: "g" },
      { name: "Cracked black pepper", qty: "10", unit: "g" },
      { name: "Café de Paris butter — soft unsalted butter", qty: "700", unit: "g" },
      { name: "Café de Paris — shallot", qty: "50", unit: "g" },
      { name: "Café de Paris — garlic", qty: "20", unit: "g" },
      { name: "Café de Paris — parsley", qty: "40", unit: "g" },
      { name: "Café de Paris — chives", qty: "20", unit: "g" },
      { name: "Café de Paris — tarragon", qty: "15", unit: "g" },
      { name: "Café de Paris — chervil", qty: "15", unit: "g" },
      { name: "Café de Paris — anchovies", qty: "35", unit: "g" },
      { name: "Café de Paris — capers", qty: "30", unit: "g" },
      { name: "Café de Paris — Dijon mustard", qty: "35", unit: "g" },
      { name: "Café de Paris — Worcestershire sauce", qty: "20", unit: "ml" },
      { name: "Café de Paris — cognac", qty: "30", unit: "ml" },
      { name: "Café de Paris — lemon juice", qty: "30", unit: "ml" },
      { name: "Café de Paris — paprika", qty: "8", unit: "g" },
      { name: "Café de Paris — curry powder", qty: "5", unit: "g" },
      { name: "Café de Paris — lemon zest", qty: "5", unit: "g" },
      { name: "Pommes dauphine — floury potatoes", qty: "1", unit: "kg" },
      { name: "Pommes dauphine — butter", qty: "80", unit: "g" },
      { name: "Choux — water", qty: "250", unit: "ml" },
      { name: "Choux — butter", qty: "100", unit: "g" },
      { name: "Choux — flour", qty: "150", unit: "g" },
      { name: "Choux — eggs", qty: "250", unit: "g" },
      { name: "Choux — nutmeg", qty: "1", unit: "g" },
      { name: "Seasonal vegetables (asparagus, green beans, carrots, courgettes)", qty: "1.5", unit: "kg" },
    ],
    method:
      "RIB-EYE: Temper 20–30 min, dry, season, sear over very high heat. Add butter, garlic and thyme and baste. Rest 5–7 min. AZURA standard: medium rare, 52–55°C core.\n\n" +
      "CAFÉ DE PARIS BUTTER (yield 1 kg): Blend herbs, shallot, garlic, anchovy and capers. Add remaining seasonings then fold into soft butter. Roll and chill. Portion 45 g per steak.\n\n" +
      "POMMES DAUPHINE: Cook and dry potatoes into a fine purée (+80 g butter, 15 g salt). Make choux pastry; combine purée and choux. Shape 25–30 g balls. Fry 170–175°C until golden; drain and season.\n\n" +
      "VEGETABLES (150 g/portion): Cook separately to keep colour and slight crunch. Glaze/sauté in butter, season, finish with lemon.\n\n" +
      "PLATING: Pommes dauphine in a fan, vegetables at 10 o'clock, rib-eye centre, 45 g Café de Paris butter on the steak, 30 ml beef jus around. Sea salt and fresh herbs. Serve immediately.",
    notes:
      "Allergens: milk, eggs, wheat/gluten, mustard, fish (anchovy), possible sulphites. Est. food cost ≈ ZMW 74/portion; recommended price ≈ ZMW 590. ~1,250–1,400 kcal.",
  },
  {
    name: "Mixed Salad Trolley (Chariot de Salades Mêlées)",
    category: "Starter / Salad",
    yield: "1 portion (composed at trolley) + dressings in batch",
    ingredients: [
      { name: "Green lettuce, washed & dried", qty: "50", unit: "g" },
      { name: "Tomato, wedges or dice", qty: "60", unit: "g" },
      { name: "Celery, finely sliced", qty: "20", unit: "g" },
      { name: "Cucumber, half-moons", qty: "40", unit: "g" },
      { name: "Carrot, julienne", qty: "30", unit: "g" },
      { name: "Avocado, diced & lemoned", qty: "40", unit: "g" },
      { name: "Tuna, drained & flaked", qty: "45", unit: "g" },
      { name: "Hard-boiled egg, quartered", qty: "1", unit: "egg" },
      { name: "Grilled chicken, strips", qty: "70", unit: "g" },
      { name: "French dressing", qty: "25", unit: "ml" },
      { name: "Italian dressing", qty: "25", unit: "ml" },
      { name: "French vinaigrette — oil", qty: "600", unit: "ml" },
      { name: "French vinaigrette — wine vinegar", qty: "200", unit: "ml" },
      { name: "French vinaigrette — Dijon mustard", qty: "80", unit: "g" },
      { name: "French vinaigrette — shallot", qty: "50", unit: "g" },
      { name: "Italian dressing — olive oil", qty: "650", unit: "ml" },
      { name: "Italian dressing — red wine vinegar", qty: "180", unit: "ml" },
      { name: "Italian dressing — garlic, minced", qty: "15", unit: "g" },
      { name: "Italian dressing — dried oregano", qty: "8", unit: "g" },
      { name: "Italian dressing — dried basil", qty: "5", unit: "g" },
    ],
    method:
      "MISE EN PLACE: Wash, sanitize (HACCP), rinse and dry vegetables; cut uniformly; hold +2 to +4°C. Lemon and cut avocado close to service. Boil eggs 9–10 min, chill, peel, quarter. Grill chicken fully, rest 3–5 min, slice. Drain tuna well.\n\n" +
      "FRENCH VINAIGRETTE: Whisk vinegar, water (100 ml), mustard, salt, pepper and sugar; slowly whisk in oil to emulsify; add shallot (~3 parts oil : 1 vinegar).\n\n" +
      "ITALIAN DRESSING: Mix vinegar, water (100 ml), mustard, garlic and herbs; whisk in oil; adjust seasoning.\n\n" +
      "SERVICE: Display ingredients separately in clean chilled containers; guest chooses the composition. Plate neatly on a cold plate; dressing separate or tossed just before service. Finish with fresh pepper, herbs and lemon.",
    notes:
      "Allergens: fish (tuna), egg, mustard. Cold ingredients ≤ +4°C, dedicated utensils, FIFO. Est. food cost 63–93 ZMW; price ~260 ZMW at 30%. 500–600 kcal.",
  },
  {
    name: "Avocado & Shrimp Cocktail",
    category: "Starter",
    yield: "10 portions (≈300 g each)",
    ingredients: [
      { name: "Peeled shrimp", qty: "1200", unit: "g" },
      { name: "Ripe avocado (net)", qty: "1500", unit: "g" },
      { name: "Crisp lettuce", qty: "300", unit: "g" },
      { name: "Cucumber", qty: "300", unit: "g" },
      { name: "Lime juice", qty: "120", unit: "g" },
      { name: "Mayonnaise", qty: "450", unit: "g" },
      { name: "Ketchup", qty: "180", unit: "g" },
      { name: "Sour cream", qty: "120", unit: "g" },
      { name: "Worcestershire sauce", qty: "20", unit: "g" },
      { name: "Sweet paprika", qty: "8", unit: "g" },
      { name: "Tabasco", qty: "8", unit: "g" },
      { name: "Salt", qty: "12", unit: "g" },
      { name: "White pepper", qty: "5", unit: "g" },
      { name: "Chives", qty: "40", unit: "g" },
    ],
    method:
      "1. Simmer shrimp in lightly salted water 2–3 min by size; chill immediately; drain well.\n" +
      "2. Dice avocado evenly; toss gently with part of the lime juice to reduce oxidation.\n" +
      "3. Cocktail sauce: mix mayonnaise, ketchup, sour cream, Worcestershire, paprika and Tabasco; adjust salt, pepper and lime.\n" +
      "4. Dice cucumber and shred lettuce. Fold shrimp with 70% of the sauce.\n" +
      "5. Build in a chilled glass: lettuce, cucumber, avocado, shrimp. Spoon a light layer of sauce on top. Finish with chives and paprika.\n" +
      "Portion control: 120 g shrimp + 150 g avocado + 30 g lettuce + 30 g cucumber + ≈45 g sauce.",
    notes:
      "Serve 4–8°C in a chilled glass; assemble close to service. Allergens: crustaceans, eggs (mayo), milk (sour cream). Est. cost ≈ 35 ZMW/portion; price ZMW 120–125. 430–470 kcal.",
  },
  {
    name: "Chicken Cordon Bleu — Seasonal Vegetables & Pommes Dauphine",
    category: "Main",
    yield: "10 portions",
    ingredients: [
      { name: "Chicken breast, boneless", qty: "1800", unit: "g" },
      { name: "Cooked ham", qty: "500", unit: "g" },
      { name: "Emmental or Gruyère", qty: "400", unit: "g" },
      { name: "Flour", qty: "300", unit: "g" },
      { name: "Eggs", qty: "8", unit: "pcs" },
      { name: "Breadcrumbs", qty: "600", unit: "g" },
      { name: "Frying oil (load)", qty: "1000", unit: "ml" },
      { name: "Seasonal vegetables", qty: "1500", unit: "g" },
      { name: "Potatoes (for dauphine)", qty: "1500", unit: "g" },
      { name: "Butter", qty: "120", unit: "g" },
      { name: "Choux flour", qty: "120", unit: "g" },
      { name: "Dauphine eggs", qty: "4", unit: "pcs" },
      { name: "Milk/water", qty: "250", unit: "ml" },
      { name: "Salt, pepper, nutmeg", qty: "QS", unit: "" },
    ],
    method:
      "CORDON BLEU: Butterfly breasts, flatten to 8–10 mm, season. Place ham and cheese in centre; fold/roll tightly. Bread flour → beaten egg → breadcrumbs. Refrigerate 20–30 min. Fry 165–170°C until golden, finish in oven at 170°C if needed. Core temp min 74°C; rest 2–3 min.\n\n" +
      "POMMES DAUPHINE: Cook and dry potatoes to a smooth purée; make choux pastry (butter + milk/water + flour), add eggs, combine with purée; shape 25–30 g pieces; fry 170–175°C until puffed and golden; drain.\n\n" +
      "VEGETABLES: 2–3 seasonal veg, cut uniformly, blanch if needed, finish in butter, keep firm.\n\n" +
      "PLATING: Slice cordon bleu on the bias; 150 g vegetables + 4–5 pommes dauphine; light poultry jus or mustard cream. Hot plate, serve immediately.",
    notes:
      "Keep raw poultry refrigerated; avoid cross-contamination; verify 74°C core. Allergens: gluten (flour, breadcrumbs), egg, milk (cheese, butter); mustard if mustard sauce used. ~850–1,050 kcal. Price ~267 ZMW at 30% (adjust to Azure supplier prices).",
  },
  {
    name: "Crêpes Suzette — Vanilla Ice Cream & Chantilly",
    category: "Dessert",
    yield: "10 portions (2 crêpes each)",
    ingredients: [
      { name: "Crêpe batter — plain flour T55", qty: "250", unit: "g" },
      { name: "Crêpe batter — whole eggs", qty: "150", unit: "g" },
      { name: "Crêpe batter — whole milk", qty: "500", unit: "ml" },
      { name: "Crêpe batter — sugar", qty: "30", unit: "g" },
      { name: "Crêpe batter — melted butter", qty: "40", unit: "g" },
      { name: "Crêpe batter — vanilla", qty: "5", unit: "ml" },
      { name: "Crêpe batter — salt", qty: "2", unit: "g" },
      { name: "Suzette sauce — unsalted butter", qty: "100", unit: "g" },
      { name: "Suzette sauce — caster sugar", qty: "100", unit: "g" },
      { name: "Suzette sauce — fresh orange juice", qty: "250", unit: "ml" },
      { name: "Suzette sauce — orange zest", qty: "2", unit: "oranges" },
      { name: "Suzette sauce — lemon juice", qty: "30", unit: "ml" },
      { name: "Suzette sauce — Grand Marnier", qty: "80", unit: "ml" },
      { name: "Suzette sauce — vanilla pod", qty: "1", unit: "pod" },
      { name: "Premium vanilla ice cream", qty: "1", unit: "kg" },
      { name: "Chantilly — 35% whipping cream", qty: "500", unit: "ml" },
      { name: "Chantilly — icing sugar", qty: "50", unit: "g" },
    ],
    method:
      "BATTER: Mix flour, sugar, salt; add eggs, then gradually milk; add melted butter and vanilla; strain and rest 30 min. Cook thin 22–24 cm crêpes; keep covered.\n\n" +
      "SUZETTE SAUCE: Melt butter with sugar; add zest, orange juice, lemon and vanilla; reduce until glossy. Fold each crêpe in quarters into the hot sauce; coat and warm 30 s.\n\n" +
      "FLAMBÉ: Remove pan from direct flame; add 80 ml warm Grand Marnier; ignite carefully; let flames die naturally. (Trained staff only, clear zone, no alcohol bottle over flame.)\n\n" +
      "ICE CREAM: 80–100 g quenelle, store −18°C, remove just before plating.\nCHANTILLY (≈600 g): Whip cold cream with icing sugar and vanilla to firm-but-smooth; ≤4°C.\n\n" +
      "PLATING: 2 crêpes with warm sauce, quenelle of ice cream, rosette of chantilly, fresh orange zest. Warm plate, hot-cold contrast.",
    notes:
      "Allergens: gluten (wheat), eggs, milk; Grand Marnier contains alcohol; possible tree-nut cross-contamination. Est. cost ≈ 29 ZMW/portion; price 150–190 ZMW. 650–750 kcal.",
  },
  {
    name: "Fish Galantine with Aioli",
    category: "Starter",
    yield: "10 portions (140 g galantine + 35 g aioli)",
    ingredients: [
      { name: "White fish fillet", qty: "1.2", unit: "kg" },
      { name: "Peeled prawns", qty: "250", unit: "g" },
      { name: "Egg whites", qty: "120", unit: "g" },
      { name: "35% cream", qty: "250", unit: "ml" },
      { name: "Fine salt", qty: "18", unit: "g" },
      { name: "White pepper", qty: "3", unit: "g" },
      { name: "Lemon (zest + juice)", qty: "1", unit: "pc" },
      { name: "Parsley", qty: "20", unit: "g" },
      { name: "Chives", qty: "15", unit: "g" },
      { name: "Carrot", qty: "100", unit: "g" },
      { name: "Zucchini", qty: "100", unit: "g" },
      { name: "Spinach", qty: "80", unit: "g" },
      { name: "Aioli — egg yolk", qty: "2", unit: "pc" },
      { name: "Aioli — garlic", qty: "20", unit: "g" },
      { name: "Aioli — neutral oil", qty: "220", unit: "ml" },
      { name: "Aioli — olive oil", qty: "80", unit: "ml" },
      { name: "Aioli — lemon", qty: "30", unit: "ml" },
      { name: "Aioli — salt", qty: "4", unit: "g" },
    ],
    method:
      "PREP: Keep fish, cream and equipment very cold. Dice fish. Briefly blanch carrot, courgette and spinach; chill and drain.\n\n" +
      "MOUSSE: Blend fish with salt and pepper; add egg whites, then gradually incorporate cold cream; add lemon, herbs and vegetables. Do not overblend.\n\n" +
      "SHAPING: Roll tightly in food film into a cylinder, remove air, seal ends.\n\n" +
      "COOKING: Poach gently in stock/water 80–85°C until core 63–65°C. Chill rapidly and refrigerate.\n\n" +
      "AIOLI: Crush garlic with salt; whisk with yolks and lemon; slowly emulsify with the oils; adjust seasoning.\n\n" +
      "PLATING: Slice 140 g galantine; serve with 35 g aioli, crisp vegetables, herbs and a few drops of olive oil.",
    notes:
      "Serve 2–4°C, strict cold-chain, small batches. Allergens: fish, crustaceans, egg, milk. Est. cost ≈ 72 ZMW/portion; suggested price 240 ZMW (premium 280). 330–370 kcal.",
  },
  {
    name: "Salmon Steak — Cucumber Noodles, Dill Sauce & Saffron Rice",
    category: "Main",
    yield: "4 portions (180 g salmon each)",
    ingredients: [
      { name: "Salmon steaks", qty: "4 × 180", unit: "g" },
      { name: "Cucumber", qty: "600", unit: "g" },
      { name: "Fresh cream", qty: "180", unit: "ml" },
      { name: "Fish stock", qty: "150", unit: "ml" },
      { name: "Fresh dill", qty: "30", unit: "g" },
      { name: "Lemon", qty: "2", unit: "pcs" },
      { name: "Butter", qty: "50", unit: "g" },
      { name: "Olive oil", qty: "35", unit: "ml" },
      { name: "Basmati rice", qty: "280", unit: "g" },
      { name: "Saffron", qty: "0.4", unit: "g" },
      { name: "Seasonal vegetables", qty: "600", unit: "g" },
      { name: "Garlic", qty: "10", unit: "g" },
      { name: "Salt & pepper", qty: "QS", unit: "" },
    ],
    method:
      "1. SALMON: Season. Sear skin-side down 3–4 min, turn 2–3 min, add butter and baste; keep centre moist and pearly.\n" +
      "2. CUCUMBER NOODLES: Spiralize/julienne, lightly salt 5 min, drain well; dress just before service with lemon, olive oil, pepper and chopped dill.\n" +
      "3. DILL SAUCE: Reduce fish stock by half, add cream and reduce 3–4 min, whisk in butter, lemon juice and dill; adjust seasoning.\n" +
      "4. SAFFRON RICE: Infuse saffron in 60 ml hot water 10 min; cook rice with ~420 ml salted water; add infusion, cover and rest 5 min.\n" +
      "5. VEGETABLES: Cut evenly, blanch if needed, sauté with garlic and olive oil; keep crisp and colourful.\n\n" +
      "PLATING: Cucumber nest at centre, salmon steak, saffron rice and vegetables; nap with ~45 g dill sauce; finish with fresh dill and a lemon wedge.",
    notes:
      "Maintain salmon cold chain; cook to HACCP temperature; serve immediately. Allergens: fish (salmon), milk (cream, butter). Est. cost ≈ 90.75 ZMW/portion; suggested price 390 ZMW (~23% FC). ~820 kcal.",
  },
  {
    name: "Blueberry Tart — Crème Anglaise & Vanilla Ice Cream",
    category: "Dessert",
    yield: "10 portions (Ø24 cm tart + 60 g crème anglaise + 50 g ice cream)",
    ingredients: [
      { name: "Sweet pastry — flour T55", qty: "250", unit: "g" },
      { name: "Sweet pastry — unsalted butter", qty: "125", unit: "g" },
      { name: "Sweet pastry — icing sugar", qty: "90", unit: "g" },
      { name: "Sweet pastry — whole egg", qty: "50", unit: "g" },
      { name: "Sweet pastry — almond powder", qty: "30", unit: "g" },
      { name: "Blueberries (fresh or frozen)", qty: "600", unit: "g" },
      { name: "Filling — caster sugar", qty: "90", unit: "g" },
      { name: "Filling — lemon juice", qty: "15", unit: "g" },
      { name: "Filling — cornstarch", qty: "18", unit: "g" },
      { name: "Filling — butter", qty: "20", unit: "g" },
      { name: "Crème anglaise — whole milk", qty: "500", unit: "ml" },
      { name: "Crème anglaise — 35% cream", qty: "250", unit: "ml" },
      { name: "Crème anglaise — egg yolks", qty: "120", unit: "g" },
      { name: "Crème anglaise — sugar", qty: "100", unit: "g" },
      { name: "Ice cream — milk", qty: "500", unit: "g" },
      { name: "Ice cream — 35% cream", qty: "250", unit: "g" },
      { name: "Ice cream — egg yolks", qty: "120", unit: "g" },
      { name: "Ice cream — sugar", qty: "110", unit: "g" },
      { name: "Ice cream — glucose/trimoline", qty: "40", unit: "g" },
      { name: "Ice cream — milk powder", qty: "35", unit: "g" },
      { name: "Vanilla pods", qty: "2.5", unit: "pods" },
    ],
    method:
      "SWEET PASTRY: Cream butter, icing sugar and vanilla; add egg, then flour, almond powder and salt without overmixing; chill 30–60 min. Line 24 cm ring; blind bake 165–170°C 15 min with weights then 5–8 min without; cool.\n\n" +
      "FILLING: Cook 450 g blueberries with sugar, cornstarch, lemon and vanilla 4–6 min; off heat fold in remaining 150 g blueberries and butter; fill shell, bake 8–10 min at 170°C; cool completely.\n\n" +
      "CRÈME ANGLAISE (≈1 L): Infuse milk, cream, vanilla; blanch yolks and sugar; temper; cook 82–84°C without boiling; strain, chill ≤4°C.\n\n" +
      "VANILLA ICE CREAM: Heat milk, cream, vanilla; combine sugar/milk powder/stabiliser; add yolks; cook 82–84°C; mature 4–12 h ≤4°C; churn; freeze −18°C.\n\n" +
      "SERVICE: One clean wedge on a chilled plate, 60 g crème anglaise around, 50 g ice cream quenelle; fresh blueberries, mint, dusting of icing sugar.",
    notes:
      "Allergens: gluten/wheat, milk, egg, almond/tree nuts. Tart & crème anglaise ≤4°C; ice cream ≈ −18°C. Est. cost ≈ 67 ZMW/portion; price ZMW 240–290 (~25% FC). 520–580 kcal.",
  },
  {
    name: "Swiss Chocolate Mousse — Green Apple Sorbet & Chantilly",
    category: "Dessert",
    yield: "10 portions (100 g mousse + 70 g sorbet + 30 g chantilly)",
    ingredients: [
      { name: "Swiss dark chocolate 64–70%", qty: "500", unit: "g" },
      { name: "Egg yolks", qty: "120", unit: "g" },
      { name: "Caster sugar", qty: "80", unit: "g" },
      { name: "35% whipping cream (mousse)", qty: "250", unit: "g" },
      { name: "Egg whites", qty: "250", unit: "g" },
      { name: "Icing sugar (mousse)", qty: "30", unit: "g" },
      { name: "Fleur de sel", qty: "2", unit: "g" },
      { name: "Sorbet — Granny Smith apples", qty: "1000", unit: "g" },
      { name: "Sorbet — water", qty: "300", unit: "g" },
      { name: "Sorbet — sugar", qty: "220", unit: "g" },
      { name: "Sorbet — glucose", qty: "80", unit: "g" },
      { name: "Sorbet — lime juice", qty: "50", unit: "g" },
      { name: "Sorbet — stabiliser", qty: "4", unit: "g" },
      { name: "Chantilly — 35% cream", qty: "300", unit: "g" },
      { name: "Chantilly — icing sugar", qty: "30", unit: "g" },
      { name: "Chantilly — vanilla", qty: "2", unit: "g" },
    ],
    method:
      "MOUSSE: Melt chocolate to 45–50°C. Whip cream softly, keep chilled. Whisk yolks with sugar, incorporate chocolate. Whip whites with icing sugar to a soft meringue. Fold in whites gently, then whipped cream. Portion and chill at least 4 h at +4°C.\n\n" +
      "GREEN APPLE SORBET: Heat water, sugar, glucose and stabiliser to ~85°C; cool rapidly; blend with apples and lime juice; mature 4–6 h at +4°C; churn; store −18°C.\n\n" +
      "CHANTILLY: Whip cream with icing sugar and vanilla to a soft peak; ≤4°C; pipe just before service.\n\n" +
      "PLATING: 100 g mousse + 70 g sorbet + 30 g chantilly. Garnish: chocolate tuile, lemon-dressed Granny Smith brunoise, mint, chocolate shavings. Serve immediately.",
    notes:
      "Mousse ≤48 h at +4°C; sorbet −18°C. Allergens: milk, eggs; possible soy/tree-nut traces from chocolate. Est. cost ≈ 41.5 ZMW/portion; price 180–220 ZMW (~21% FC). 650–750 kcal.",
  },
  {
    name: "Chicken Shawarma — Toum & Tahini",
    category: "Main",
    yield: "10 kg raw batch (≈56–60 wraps, 125 g cooked each)",
    ingredients: [
      { name: "Boneless chicken thighs", qty: "10", unit: "kg" },
      { name: "Full-fat yoghurt", qty: "1200", unit: "g" },
      { name: "Fresh lemon juice", qty: "500", unit: "g" },
      { name: "Olive oil", qty: "500", unit: "g" },
      { name: "Fresh garlic (marinade)", qty: "250", unit: "g" },
      { name: "Sweet paprika", qty: "150", unit: "g" },
      { name: "Ground cumin", qty: "80", unit: "g" },
      { name: "Ground coriander", qty: "60", unit: "g" },
      { name: "Turmeric", qty: "50", unit: "g" },
      { name: "Black pepper", qty: "50", unit: "g" },
      { name: "Fine salt (marinade)", qty: "150", unit: "g" },
      { name: "Chili", qty: "30", unit: "g" },
      { name: "Ground ginger", qty: "30", unit: "g" },
      { name: "Dried oregano", qty: "30", unit: "g" },
      { name: "Cinnamon", qty: "20", unit: "g" },
      { name: "Cardamom", qty: "20", unit: "g" },
      { name: "White wine vinegar", qty: "150", unit: "g" },
      { name: "Toum — peeled garlic", qty: "300", unit: "g" },
      { name: "Toum — neutral oil", qty: "600", unit: "g" },
      { name: "Toum — lemon juice", qty: "90", unit: "g" },
      { name: "Tahini", qty: "500", unit: "g" },
      { name: "Pita / Arabic flatbread", qty: "80", unit: "g/wrap" },
    ],
    method:
      "MARINADE: Slice chicken 5–8 mm. Mix all marinade ingredients, coat thoroughly, cover, refrigerate 0–4°C for 12–18 h. Pack tightly onto the vertical spit; check balance.\n\n" +
      "TOUM (garlic sauce, 1 kg): Blend garlic + salt to a fine paste; slowly emulsify with 600 g oil, alternating with lemon (90 g); add ≈100 g ice water; finish white, smooth, aerated. Portion 25–30 g.\n\n" +
      "TAHINI (1 kg): Whisk tahini + lemon (120 g); add cold water (~300 g) until creamy; add garlic (30 g), salt (10 g), olive oil (20 g). Portion 15–20 g.\n\n" +
      "ASSEMBLY: Warm flatbread; spread 25 g toum; 125 g hot shaved chicken; tomato, lettuce, onion, pickles; 15 g tahini; parsley + lemon; roll tight; toast on griddle; cut diagonally; serve immediately.\n\n" +
      "YIELD: 10 kg raw → ~7.0–7.5 kg cooked → ~56–60 wraps. Record raw→cooked→shaving loss.",
    notes:
      "Raw chicken 0–4°C; cook to 74°C control point; shave only cooked exterior. Allergens: milk (yoghurt), sesame (tahini), wheat/gluten (pita). Working cost ≈ K46.50/wrap; recommended price K195 (~24% FC).",
  },
];
