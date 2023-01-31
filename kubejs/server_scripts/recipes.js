// priority: 0

settings.logAddedRecipes = true
settings.logRemovedRecipes = true
settings.logSkippedRecipes = false
settings.logErroringRecipes = true

console.info('Hello, World! (You will see this line every time server resources reload)')

var log = []

let MOD = (domain, id, x) => (x ? `${x}x ` : "") + (id.startsWith('#') ? '#' : "") + domain + ":" + id.replace('#', '')
let CR = (id, x) => MOD("create", id, x)
let KJ = (id, x) => MOD("kubejs", id, x)
let F = (id, x) => MOD("forge", id, x)
let SD = (id, x) => MOD("storagedrawers", id, x)
let MC = (id, x) => MOD("minecraft", id, x)
let CCA = (id, x) => MOD("createaddition", id, x)
let TC = (id, x) => MOD("tconstruct", id, x)
let TE = (id, x) => MOD("thermal", id, x)

onEvent('item.registry', event => {

    event.create('incomplete_filter').displayName('Incomplete Filter').texture('kubejs:item/incomplete_filter')
    event.create('incomplete_attribute_filter').displayName('Incomplete Attribute Filter').texture('kubejs:item/incomplete_attribute_filter')
    event.create('infinity_ingot').displayName('Infinity Ingot').texture('kubejs:item/infinity_ingot')  // Credits to CreeperGod for the texture
    event.create('ball_baring').displayName('Ball Baring').texture('kubejs:item/ball_baring')
    event.create('zinc_dust').displayName('Zinc Dust').texture('kubejs:item/zinc_dust')
    event.create('incomplete_prescision_mechanism').displayName('Incomplete Precision Mechanism').texture('kubejs:item/incomplete_prescision_mechanism')

})

onEvent('item.tags', event => {

})

onEvent('recipes', event => {

    removeRecipes(event)
    recipeTweaks(event)

})

function recipeTweaks(event) {

    // Create Tweaks

    // Create shafts and gantry shafts
    event.remove({output: CR('shaft')})
    event.remove({output: CR('gantry_shaft')})
    event.shaped(CR('shaft', 2), [
        'A',
        'A'
    ], {
        A: CR('andesite_alloy')
    }).id('kubejs:shaft_manual_only');

    event.recipes.create.mechanical_crafting(CR('shaft', 8), [
        ' A ',
        ' A ',
    ], {
        A: CR('andesite_alloy')
    }).id('kubejs:shaft_from_mechanical_crafting');

    event.shaped(CR('gantry_shaft', 2), [
        'A',
        'B',
        'A'
    ], {
        B: MC('redstone'),
        A: CR('andesite_alloy')
    });

    // Create cogwheels and large cogwheels
    event.remove({output: CR('cogwheel')})
    event.remove({output: CR('large_cogwheel')})
    event.shaped(CR('cogwheel', 1), [
        ' A ',
        'ABA',
        ' A '
    ], {
        B: CR('shaft'),
        A: '#minecraft:wooden_buttons'
    }).id('kubejs:cogwheel_manual_only');

    event.recipes.create.mechanical_crafting(CR('cogwheel', 2), [
        ' A ',
        'ABA',
        ' A '
    ], {
        B: CR('shaft'),
        A: '#minecraft:wooden_buttons'
    });

    event.recipes.createSequencedAssembly([
        CR('cogwheel', 4),
    ], CR('shaft'), [
        event.recipes.createDeploying(CR('shaft'), [CR('shaft'), '#minecraft:wooden_buttons']),
        event.recipes.createDeploying(CR('shaft'), [CR('shaft'), '#minecraft:wooden_buttons']),
        event.recipes.createDeploying(CR('shaft'), [CR('shaft'), '#minecraft:wooden_buttons']),
        event.recipes.createDeploying(CR('shaft'), [CR('shaft'), '#minecraft:wooden_buttons'])
    ]).transitionalItem(CR('shaft')).loops(1).id('kubejs:cogwheel_from_sequenced_assembly');

    event.shaped(CR('large_cogwheel', 1), [
        'AAA',
        'ABA',
        'AAA'
    ], {
        B: CR('shaft'),
        A: '#minecraft:wooden_buttons'
    }).id('kubejs:large_cogwheel_manual_only');

    event.shaped(CR('large_cogwheel', 1), [
        ' A ',
        'ABA',
        ' A '
    ], {
        B: CR('cogwheel'),
        A: '#minecraft:wooden_buttons'
    }).id('kubejs:large_cogwheel_from_cogwheel_manual_only');

    event.recipes.create.mechanical_crafting(CR('large_cogwheel', 2), [
        ' A ',
        'ABA',
        ' A '
    ], {
        B: CR('cogwheel'),
        A: '#minecraft:wooden_buttons'
    });
    event.recipes.create.mechanical_crafting(CR('large_cogwheel', 2), [
        'AAA',
        'ABA',
        'AAA'
    ], {
        B: CR('shaft'),
        A: '#minecraft:wooden_buttons'
    });

    event.recipes.createSequencedAssembly([
        CR('large_cogwheel', 4),
    ], CR('cogwheel'), [
        event.recipes.createDeploying(CR('cogwheel'), [CR('cogwheel'), '#minecraft:wooden_buttons']),
        event.recipes.createDeploying(CR('cogwheel'), [CR('cogwheel'), '#minecraft:wooden_buttons']),
        event.recipes.createDeploying(CR('cogwheel'), [CR('cogwheel'), '#minecraft:wooden_buttons']),
        event.recipes.createDeploying(CR('cogwheel'), [CR('cogwheel'), '#minecraft:wooden_buttons'])
    ]).transitionalItem(CR('cogwheel')).loops(1).id('kubejs:large_cogwheel_from_sequenced_assembly');

    // Belt Connector and rubber handling
    event.remove({output: CR('belt_connector')})
    event.remove({id: TE('smelting/cured_rubber_from_smelting')})
    event.shaped(CR('belt_connector'), [
        '   ',
        'AAA',
        'AAA'
    ], {
        A: TE('cured_rubber')
    });
    event.custom({
        "type": "minecraft:blasting",
        "ingredient": {
            "item": TE('rubber')
        },
        "result": TE('cured_rubber'),
        "experience": 0.1,
        "cookingtime": 100
    });

    let overrideTreeOutput = (id, trunk, leaf) => {
        event.remove({ id: id })
        event.custom({
            "type": "thermal:tree_extractor",
            "trunk": trunk,
            "leaves": leaf,
            "result": {
                "fluid": "thermal:resin",
                "amount": 25
            }
        });
    }
    overrideTreeOutput(TE('devices/tree_extractor/tree_extractor_jungle'), MC('jungle_log'), MC('jungle_leaves'))
    overrideTreeOutput(TE('devices/tree_extractor/tree_extractor_spruce'), MC('spruce_log'), MC('spruce_leaves'))
    overrideTreeOutput(TE('devices/tree_extractor/tree_extractor_dark_oak'), MC('dark_oak_log'), MC('dark_oak_leaves'))
    overrideTreeOutput(TE('compat/biomesoplenty/tree_extractor_bop_maple'), MC('oak_log'), 'biomesoplenty:maple_leaves')

    event.recipes.createCompacting('1x ' + TE('rubber'), [Fluid.of(TE('resin'), 250)])

    // Destabelized restone and Quartz to rose quartz
    event.remove({output: CR('rose_quartz')})
    event.remove({output: TE('redstone')})

    event.custom({
        "type": "tconstruct:melting",
        "ingredient": {
            "item": MC('redstone')
        },
        "result": {
            "fluid": TE('redstone'),
            "amount": 100
        },
        "temperature": 300,
        "time": 10
    });
    event.recipes.createMixing('1x ' + CR('rose_quartz'), [Fluid.of(TE('redstone'), 800), MC('quartz')])

    // Remove gear recipes
    event.remove({id: TE('press_gear_die')})
    event.shaped(TE('press_gear_die'), [
        ' A ',
        'ABA',
        ' A '
    ], {
        A: CR('iron_sheet'),
        B: MC('iron_nugget')
    });

    // Remove gear recipes
    let gears = ["iron_gear", "copper_gear", "gold_gear", "netherite_gear", "lapis_gear", "diamond_gear", "emerald_gear", "quartz_gear", "tin_gear", "lead_gear",
                 "silver_gear", "nickel_gear", "bronze_gear", "constantan_gear", "electrum_gear", "invar_gear", "signalum_gear", "lumium_gear", "enderium_gear"];
    let gearMaterial = ["iron", "copper", "gold", "netherite", "lapis", "diamond", "emerald", "quartz", "tin", "lead",
                        "silver", "nickel", "bronze", "constantan", "electrum", "invar", "signalum", "lumium", "enderium"];

    gears.forEach(gear => {
        event.remove({output: TE(gear)})
    });
    event.recipes.createDeploying('1x ' + TE('iron_gear'), [MC('iron_ingot'), TE('press_gear_die')]);
    event.recipes.createDeploying('1x ' + TE('copper_gear'), [MC('copper_ingot'), TE('press_gear_die')]);
    event.recipes.createDeploying('1x ' + TE('gold_gear'), [MC('gold_ingot'), TE('press_gear_die')]);
    event.recipes.createDeploying('1x ' + TE('netherite_gear'), [TE('netherite_plate'), TE('press_gear_die')]);
    event.recipes.createDeploying('1x ' + TE('lapis_gear'), [MC('lapis_lazuli'), TE('press_gear_die')]);
    event.recipes.createDeploying('1x ' + TE('diamond_gear'), [MC('diamond'), TE('press_gear_die')]);
    event.recipes.createDeploying('1x ' + TE('emerald_gear'), [MC('emerald'), TE('press_gear_die')]);
    event.recipes.createDeploying('1x ' + TE('quartz_gear'), [MC('quartz'), TE('press_gear_die')]);
    event.recipes.createDeploying('1x ' + TE('tin_gear'), [TE('tin_ingot'), TE('press_gear_die')]);
    event.recipes.createDeploying('1x ' + TE('lead_gear'), [TE('lead_ingot'), TE('press_gear_die')]);
    event.recipes.createDeploying('1x ' + TE('silver_gear'), [TE('silver_ingot'), TE('press_gear_die')]);
    event.recipes.createDeploying('1x ' + TE('nickel_gear'), [TE('nickel_ingot'), TE('press_gear_die')]);
    event.recipes.createDeploying('1x ' + TE('bronze_gear'), [TE('bronze_ingot'), TE('press_gear_die')]);
    event.recipes.createDeploying('1x ' + TE('constantan_gear'), [TE('constantan_ingot'), TE('press_gear_die')]);
    event.recipes.createDeploying('1x ' + TE('electrum_gear'), [TE('electrum_ingot'), TE('press_gear_die')]);
    event.recipes.createDeploying('1x ' + TE('invar_gear'), [TE('invar_ingot'), TE('press_gear_die')]);
    event.recipes.createDeploying('1x ' + TE('signalum_gear'), [TE('signalum_ingot'), TE('press_gear_die')]);
    event.recipes.createDeploying('1x ' + TE('lumium_gear'), [TE('lumium_ingot'), TE('press_gear_die')]);
    event.recipes.createDeploying('1x ' + TE('enderium_gear'), [TE('enderium_ingot'), TE('press_gear_die')]);

    // Remove tinker's alloy recipes and replace with create mixing
    let molten_alloys = ["molten_amethyst_bronze", "molten_brass", "molten_bronze", "molten_constantan", "molten_electrum", "molten_enderium",
        "molten_hepatizon", "molten_invar", "molten_lumium", "molten_netherite", "molten_obsidian", "molten_obsidian_from_soup",
        "molten_manyullyn", "molten_signalum", "molten_pig_iron", "molten_queen_slime", "molten_rose_gold", "molten_slimesteel"];

    molten_alloys.forEach(alloy => {
        event.remove({id: TC('smeltery/alloys/' + alloy)})
    });
    event.recipes.createMixing([Fluid.of(TC('molten_bronze'), 360)], [Fluid.of(TC('molten_copper'), 270), Fluid.of(TC('molten_tin'), 90)]);
    event.recipes.createMixing([Fluid.of(TC('molten_brass'), 180)], [Fluid.of(TC('molten_copper'), 90), Fluid.of(TC('molten_zinc'), 90)]);
    event.recipes.createMixing([Fluid.of(TC('molten_electrum'), 180)], [Fluid.of(TC('molten_gold'), 90), Fluid.of(TC('molten_silver'), 90)]);
    event.recipes.createMixing([Fluid.of(TC('molten_invar'), 270)], [Fluid.of(TC('molten_iron'), 180), Fluid.of(TC('molten_nickel'), 90)]);
    event.recipes.createMixing([Fluid.of(TC('molten_constantan'), 180)], [Fluid.of(TC('molten_copper'), 90), Fluid.of(TC('molten_nickel'), 90)]);
    event.recipes.createMixing([Fluid.of(TC('molten_signalum'), 360)], [Fluid.of(TC('molten_copper'), 270), Fluid.of(TC('molten_silver'), 90), Fluid.of(TE('redstone'), 360)]).heated();
    event.recipes.createMixing([Fluid.of(TC('molten_lumium'), 360)], [Fluid.of(TC('molten_tin'), 270), Fluid.of(TC('molten_silver'), 90), Item.of(MC('glowstone_dust'), 2)]).heated();
    event.recipes.createMixing([Fluid.of(TC('molten_enderium'), 180)], [Fluid.of(TC('molten_lead'), 270), Fluid.of(TC('molten_diamond'), 90), Fluid.of(TC('molten_ender'), 180)]).superheated();

    // Add recipes for compacting molten alloys into ingots
    event.recipes.create.compacting([Item.of(TE('bronze_ingot'), 1)], [Fluid.of(TC('molten_bronze'), 90)]);
    event.recipes.create.compacting([Item.of(CR('brass_ingot'), 1)], [Fluid.of(TC('molten_brass'), 90)]);
    event.recipes.create.compacting([Item.of(TE('electrum_ingot'), 1)], [Fluid.of(TC('molten_electrum'), 90)]);
    event.recipes.create.compacting([Item.of(TE('invar_ingot'), 1)], [Fluid.of(TC('molten_invar'), 90)]);
    event.recipes.create.compacting([Item.of(TE('constantan_ingot'), 1)], [Fluid.of(TC('molten_constantan'), 90)]);
    event.recipes.create.compacting([Item.of(TE('signalum_ingot'), 1)], [Fluid.of(TC('molten_signalum'), 90)]);
    event.recipes.create.compacting([Item.of(TE('lumium_ingot'), 1)], [Fluid.of(TC('molten_lumium'), 90)]);
    event.recipes.create.compacting([Item.of(TE('enderium_ingot'), 1)], [Fluid.of(TC('molten_enderium'), 90)]);

    // Remove other ingot recipes
    event.remove({id: CR('mixing/brass_ingot')});
    event.remove({id: TE('fire_charge/electrum_ingot_2')});
    event.remove({id: TE('fire_charge/invar_ingot_3')});
    event.remove({id: TE('fire_charge/constantan_ingot_2')});
    event.remove({id: TE('fire_charge/signalum_ingot_4')});
    event.remove({id: TE('fire_charge/lumium_ingot_4')});
    event.remove({id: TE('fire_charge/enderium_ingot_2')});
    event.remove({id: TE('fire_charge/bronze_ingot_4')});

    // Remove dust recipes from thermal expansion machines and replace with create crushing
    let dusts = ["apatite_dust", "cinnabar_dust", "niter_dust", "sulfur_dust", "ender_pearl_dust", "iron_dust", "gold_dust", "copper_dust",
                 "netherite_dust", "lapis_dust", "diamond_dust", "emerald_dust", "quartz_dust", "lead_dust", "tin_dust", "silver_dust", "nickel_dust"];

    dusts.forEach(dust => {
        event.remove({output: TE(dust)});
    });

    event.recipes.create.crushing([Item.of(TE('iron_dust'), 2), Item.of(TE('iron_dust')).withChance(0.25)],[Item.of(CR('crushed_iron_ore'))]);
    event.recipes.create.crushing([Item.of(TE('gold_dust'), 2), Item.of(TE('gold_dust')).withChance(0.25)],[Item.of(CR('crushed_gold_ore'))]);
    event.recipes.create.crushing([Item.of(TE('copper_dust'), 2), Item.of(TE('copper_dust')).withChance(0.25)],[Item.of(CR('crushed_copper_ore'))]);
    event.recipes.create.crushing([Item.of(TE('netherite_dust'), 2), Item.of(TE('netherite_dust')).withChance(0.25)],[Item.of(MC('netherite_scrap'))]);
    event.recipes.create.crushing([Item.of(TE('lapis_dust'), 2), Item.of(TE('lapis_dust')).withChance(0.25)],[Item.of(MC('lapis_lazuli'))]);
    event.recipes.create.crushing([Item.of(TE('diamond_dust'), 1), Item.of(TE('diamond_dust')).withChance(0.25)],[Item.of(CCA('diamond_grit'))]);
    event.recipes.create.crushing([Item.of(TE('emerald_dust'), 2), Item.of(TE('emerald_dust')).withChance(0.25)],[Item.of(MC('emerald'))]);
    event.recipes.create.crushing([Item.of(TE('quartz_dust'), 2), Item.of(TE('quartz_dust')).withChance(0.25)],[Item.of(MC('quartz'))]);
    event.recipes.create.crushing([Item.of(TE('lead_dust'), 2), Item.of(TE('lead_dust')).withChance(0.25)],[Item.of(CR('crushed_lead_ore'))]);
    event.recipes.create.crushing([Item.of(TE('tin_dust'), 2), Item.of(TE('tin_dust')).withChance(0.25)],[Item.of(CR('crushed_tin_ore'))]);
    event.recipes.create.crushing([Item.of(TE('silver_dust'), 2), Item.of(TE('silver_dust')).withChance(0.25)],[Item.of(CR('crushed_silver_ore'))]);
    event.recipes.create.crushing([Item.of(TE('nickel_dust'), 2), Item.of(TE('nickel_dust')).withChance(0.25)],[Item.of(CR('crushed_nickel_ore'))]);
    event.recipes.create.crushing([Item.of(TE('niter_dust'), 2), Item.of(TE('niter_dust')).withChance(0.25)],[Item.of(TE('niter'))]);
    event.recipes.create.crushing([Item.of(TE('sulfur_dust'), 2), Item.of(TE('sulfur_dust')).withChance(0.25)],[Item.of(TE('sulfur'))]);
    event.recipes.create.crushing([Item.of(TE('ender_pearl_dust'), 2), Item.of(TE('ender_pearl_dust')).withChance(0.25)],[Item.of(MC('ender_pearl'))]);
    event.recipes.create.crushing([Item.of(TE('cinnabar_dust'), 2), Item.of(TE('cinnabar_dust')).withChance(0.25)],[Item.of(TE('cinnabar'))]);
    event.recipes.create.crushing([Item.of('kubejs:zinc_dust', 2), Item.of('kubejs:zinc_dust').withChance(0.25)],[Item.of(CR('crushed_zinc_ore'))]);

    // Add smelting and blasting recipes for dusts which can be turned into ingots
    event.blasting(TE('iron_dust'), MC('iron_ingot'));
    event.blasting(TE('gold_dust'), MC('gold_ingot'));
    event.blasting(TE('copper_dust'), MC('copper_ingot'));
    event.blasting(TE('lead_dust'), TE('lead_ingot'));
    event.blasting(TE('tin_dust'), TE('tin_ingot'));
    event.blasting(TE('silver_dust'), TE('silver_ingot'));
    event.blasting(TE('nickel_dust'), TE('nickel_ingot'));
    event.blasting(CR('zinc_ingot'), 'kubejs:zinc_dust');

    // Add mixing recipes for dust blends and remove default thermal recipes
    event.remove({id: TE('bronze_dust_4')});
    event.remove({id: TE('electrum_dust_2')});
    event.remove({id: TE('invar_dust_3')});
    event.remove({id: TE('constantan_dust_2')});
    event.remove({id: TE('signalum_dust_4')});
    event.remove({id: TE('lumium_dust_4')});
    event.remove({id: TE('enderium_dust_2')});

    event.recipes.createMixing([Item.of(TE('bronze_dust'), 4), Item.of(TE('bronze_dust')).withChance(0.25), Item.of(TE('copper_dust')).withChance(0.25)], [Item.of(TE('copper_dust'), 3), Item.of(TE('tin_dust'))]);
    event.recipes.createMixing([Item.of(TE('electrum_dust'), 2), Item.of(TE('electrum_dust')).withChance(0.25)], [Item.of(TE('gold_dust')), Item.of(TE('silver_dust'))]).heated();
    event.recipes.createMixing([Item.of(TE('invar_dust'), 3), Item.of(TE('invar_dust')).withChance(0.25), Item.of(TE('iron_dust')).withChance(0.25)], [Item.of(TE('iron_dust'), 2), Item.of(TE('nickel_dust'))]).heated();
    event.recipes.createMixing([Item.of(TE('constantan_dust'), 2), Item.of(TE('constantan_dust')).withChance(0.25)], [Item.of(TE('copper_dust')), Item.of(TE('nickel_dust'))]).heated();
    event.recipes.createMixing([Item.of(TE('signalum_dust'), 4), Item.of(TE('signalum_dust')).withChance(0.25), Item.of(MC('redstone')).withChance(0.25)], [Item.of(TE('copper_dust'), 3), Item.of(TE('niter_dust')), Item.of(MC('redstone'), 4)]).superheated();
    event.recipes.createMixing([Item.of(TE('lumium_dust'), 4), Item.of(TE('lumium_dust')).withChance(0.25), Item.of(TE('silver_dust')).withChance(0.25)], [Item.of(TE('silver_dust'), 3), Item.of(TE('niter_dust'))]).superheated();
    event.recipes.createMixing([Item.of(TE('enderium_dust'), 2), Item.of(TE('enderium_dust')).withChance(0.25), Item.of(TE('lead_dust')).withChance(0.1)], [Item.of(TE('lead_dust'), 2), Item.of(TE('ender_pearl_dust'))]).superheated();

    // Add mechanical crafting recipes for the different Thermal machines and subproducts
    event.remove({output: TE('redstone_servo')});
    event.remove({output: TE('rf_coil')});
    event.remove({output: TE('device_tree_extractor')});
    event.remove({output: TE('tinker_bench')});
    event.remove({output: TE('dynamo_stirling')});
    event.remove({output: TE('dynamo_compression')});
    event.remove({output: TE('dynamo_magmatic')});
    event.remove({output: TE('dynamo_numismatic')});
    event.remove({output: TE('dynamo_lapidary')});
    event.remove({output: TE('dynamo_disenchantment')});
    event.remove({output: TE('dynamo_gourmand')});

    event.recipes.create.mechanical_crafting(Item.of(TE('redstone_servo'), 1), [
        'RSR',
        ' I ',
        'RSR'
    ], {
        R: 'minecraft:redstone',
        S: 'thermal:silver_ingot',
        I: 'thermal:invar_ingot'
    }).id('kubejs:redstone_servo');

    event.recipes.create.mechanical_crafting(Item.of(TE('device_tree_extractor'), 1), [
        'EWWWE',
        'WGIGW',
        'WIBIW',
        'WGSGW',
        'EWWWE'
    ], {
        W: '#minecraft:planks',
        S: 'thermal:redstone_servo',
        B: 'minecraft:bucket',
        G: '#thermal:glass/hardened',
        I: 'thermal:iron_gear',
        E: 'thermal:electrum_ingot'
    }).id('kubejs:device_tree_extractor');

    event.recipes.create.mechanical_crafting(Item.of(TE('rf_coil'), 1), [
        '     R',
        '    E ',
        '   G  ',
        '  E   ',
        ' R    '
    ], {
        R: 'minecraft:redstone',
        E: 'thermal:electrum_ingot',
        G: 'minecraft:gold_ingot',
    }).id('kubejs:rf_coil');

    event.recipes.create.mechanical_crafting(Item.of(TE('tinker_bench'), 1), [
        'IITII',
        'WGWGW',
        'WSBSW',
        'WDGEW',
        'WR RW'
        ], {
        W: '#minecraft:planks',
        S: 'thermal:rf_coil',
        B: 'minecraft:crafting_table',
        G: '#thermal:glass/hardened',
        E: 'thermal:emerald_gear',
        D: 'thermal:diamond_gear',
        R: 'thermal:redstone_servo',
        I: 'minecraft:iron_ingot',
        T: 'thermal:electrum_ingot'
    }).id('kubejs:tinker_bench');

    event.recipes.create.mechanical_crafting(Item.of(TE('dynamo_stirling'), 1), [
        ' C ',
        'LEL',
        'SPS'
    ], {
        C: 'thermal:rf_coil',
        L: 'thermal:lead_ingot',
        E: 'thermal:electrum_gear',
        S: '#forge:stone',
        P: 'minecraft:piston'
    }).id('kubejs:dynamo_stirling');

    event.recipes.create.mechanical_crafting(Item.of(TE('dynamo_compression'), 1), [
        ' C ',
        'IEI',
        'BPB'
    ], {
        C: 'thermal:rf_coil',
        I: 'minecraft:iron_ingot',
        E: 'thermal:electrum_gear',
        B: 'thermal:bronze_ingot',
        P: 'minecraft:piston'
    }).id('kubejs:dynamo_compression');

    event.recipes.create.mechanical_crafting(Item.of(TE('dynamo_magmatic'), 1), [
        ' C ',
        'TST',
        'IPI'
    ], {
        C: 'thermal:rf_coil',
        I: 'thermal:invar_ingot',
        S: 'thermal:signalum_gear',
        T: 'thermal:tin_ingot',
        P: 'minecraft:piston'
    }).id('kubejs:dynamo_magmatic');


    // Tweak create machines recipes to use Minecraft smithing table
    event.remove({output: 'create:mechanical_mixer'});
    event.remove({output: 'create:mechanical_press'});
    event.remove({output: 'create:mechanical_drill'});
    event.remove({output: 'create:mechanical_saw'});
    event.remove({output: 'create:deployer'});
    event.remove({output: 'create:mechanical_crafter'});
    event.remove({output: 'create:encased_fan'});
    event.remove({output: 'create:andesite_funnel'});
    event.remove({output: 'create:andesite_tunnel'});

    event.shaped('kubejs:andesite_machine', [
        'AAA',
        'ABA',
        'AAA'
    ], {
        A: CR('cogwheel'),
        B: CR('andesite_casing')
    }).id('kubejs:andesite_machine_from_crafting_manual_only');

    event.recipes.create.mechanical_crafting(Item.of('kubejs:andesite_machine', 2), [
        'AAA',
        'ABA',
        'AAA'
    ], {
        A: CR('cogwheel'),
        B: CR('andesite_casing')
    });

    event.smithing('create:mechanical_mixer', 'kubejs:andesite_machine', 'create:whisk').id('kubejs:mixer');
    event.smithing('create:mechanical_press', 'kubejs:andesite_machine', 'minecraft:iron_block').id('kubejs:press');
    event.smithing('create:mechanical_drill', 'kubejs:andesite_machine', 'thermal:drill_head').id('kubejs:drill');
    event.smithing('create:mechanical_saw', 'kubejs:andesite_machine', 'thermal:saw_blade').id('kubejs:saw');
    event.smithing('create:deployer', 'kubejs:andesite_machine', 'create:brass_hand').id('kubejs:deployer');
    event.smithing('create:encased_fan', 'kubejs:andesite_machine', 'create:propeller').id('kubejs:fan');
    event.smithing('createaddition:straw', 'kubejs:andesite_machine', 'minecraft:bamboo').id('kubejs:straw');
    event.smithing(Item.of('create:andesite_funnel', 2), 'kubejs:andesite_machine', 'minecraft:hopper').id('kubejs:andesite_funnel');
    event.smithing('create:andesite_tunnel', 'create:andesite_funnel', 'minecraft:crafting_table').id('kubejs:andesie_tunnel');

    let itemApplication = (ingredient1, ingredient2, results) => {
        event.custom({
            "type": "create:item_application",
            "ingredients": [
                {
                    "item": ingredient1
                },
                {
                    "item": ingredient2
                }],
            "results": [{
                "item": results
            }]
        })
    }

    itemApplication('kubejs:andesite_machine', 'create:whisk', 'create:mechanical_mixer');
    itemApplication('kubejs:andesite_machine', 'minecraft:iron_block', 'create:mechanical_press');
    itemApplication('kubejs:andesite_machine', 'thermal:drill_head', 'create:mechanical_drill');
    itemApplication('kubejs:andesite_machine', 'thermal:saw_blade', 'create:mechanical_saw');
    itemApplication('kubejs:andesite_machine', 'create:brass_hand', 'create:deployer');
    itemApplication('kubejs:andesite_machine', 'create:propeller', 'create:encased_fan');
    itemApplication('kubejs:andesite_machine', 'minecraft:bamboo', 'createaddition:straw');

    event.shaped('kubejs:copper_machine', [
        'AAA',
        'ABA',
        'AAA'
    ], {
        A: CR('fluid_pipe'),
        B: CR('copper_casing')
    }).id('kubejs:copper_machine_from_crafting_manual_only');

    event.recipes.create.mechanical_crafting(Item.of('kubejs:copper_machine', 2), [
        'AAA',
        'ABA',
        'AAA'
    ], {
        A: CR('fluid_pipe'),
        B: CR('copper_casing')
    });

    event.remove({output: 'create:mechanical_crafter'});
    event.remove({output: 'create:spout'});
    event.remove({output: 'create:item_drain'});
    event.remove({output: 'create:fluid_valve'});
    event.remove({output: 'create:smart_fluid_pipe'});
    event.remove({output: 'create:fluid_tank'});
    event.remove({output: 'create:fluid_valve'});
    event.remove({output: 'create:hose_pulley'});

    event.smithing('create:mechanical_crafter', 'kubejs:copper_machine', 'minecraft:crafting_table').id('kubejs:mechanical_crafter');
    event.smithing('create:spout', 'kubejs:copper_machine', 'minecraft:hopper').id('kubejs:spout');
    event.smithing('create:item_drain', 'kubejs:copper_machine', 'minecraft:iron_bars').id('kubejs:item_drain');
    event.smithing('create:fluid_valve', 'kubejs:copper_machine', 'create:hand_crank').id('kubejs:fluid_valve');
    event.smithing('create:hose_pulley', 'kubejs:copper_machine', 'create:fluid_tank').id('kubejs:hose_pulley');
    event.smithing('create:smart_fluid_pipe', 'kubejs:copper_machine', 'create:filter').id('kubejs:smart_fluid_pipe');
    event.smithing('create:fluid_tank', 'kubejs:copper_machine', 'minecraft:barrel').id('kubejs:fluid_tank');
    event.smithing('create:mechanical_pump', 'kubejs:copper_machine', 'create:cogwheel').id('kubejs:mechanical_pump');

    itemApplication('kubejs:copper_machine', 'minecraft:crafting_table', 'create:mechanical_crafter');
    itemApplication('kubejs:copper_machine', 'minecraft:hopper', 'create:spout');
    itemApplication('kubejs:copper_machine', 'minecraft:iron_bars', 'create:item_drain');
    itemApplication('kubejs:copper_machine', 'create:hand_crank', 'create:fluid_valve');
    itemApplication('kubejs:copper_machine', 'create:filter', 'create:smart_fluid_pipe');
    itemApplication('kubejs:copper_machine', 'minecraft:barrel', 'create:fluid_tank');
    itemApplication('kubejs:copper_machine', 'create:cogwheel', 'create:mechanical_pump');
    itemApplication('kubejs:copper_machine', 'create:fluid_tank', 'create:hose_pulley');

    event.remove({output: 'create:precision_mechanism'});
    event.remove({output: 'create:mechanical_arm'});
    event.remove({output: 'create:rotation_speed_controller'});
    event.remove({output: 'create:brass_funnel'});
    event.remove({output: 'create:brass_tunnel'});

    let incomplete = 'kubejs:incomplete_prescision_mechanism';

    event.recipes.createSequencedAssembly([
        CR('precision_mechanism'),
    ], CR('golden_sheet'), [
        event.recipes.createFilling(incomplete, [incomplete, Fluid.of(MC('lava'), 250)]),
        event.recipes.createDeploying(incomplete, [incomplete, CR('brass_ingot')]),
        event.recipes.createDeploying(incomplete, [incomplete, CR('polished_rose_quartz')]),
        event.recipes.createFilling(incomplete, [incomplete, Fluid.of(MC('water'), 250)]),
    ]).transitionalItem(incomplete).id('kubejs:precision_mechanism').loops(1);

    event.shaped('kubejs:brass_machine', [
        'AAA',
        'ABA',
        'AAA'
    ], {
        A: CR('precision_mechanism'),
        B: CR('brass_casing')
    }).id('kubejs:brass_machine_from_crafting_manual_only');

    event.recipes.create.mechanical_crafting(Item.of('kubejs:brass_machine', 2), [
        'AAA',
        'ABA',
        'AAA'
    ], {
        A: CR('precision_mechanism'),
        B: CR('brass_casing')
    });

    event.smithing('create:mechanical_arm', 'kubejs:brass_machine', 'create:brass_hand').id('kubejs:mechanical_arm');
    event.smithing('create:rotation_speed_controller', 'kubejs:brass_machine', 'create:precision_mechanism').id('kubejs:rotation_speed_controller');
    event.smithing(Item.of('create:brass_funnel', 2), 'kubejs:brass_machine', 'create:filter').id('kubejs:brass_funnel');
    event.smithing('create:brass_tunnel', 'create:brass_funnel', 'create:brass_block').id('kubejs:brass_tunnel');

    itemApplication('kubejs:brass_machine', 'create:brass_hand', 'create:mechanical_arm');
    itemApplication('kubejs:brass_machine', 'create:precision_mechanism', 'create:rotation_speed_controller');

    // Change recipes for filters to be a sequenced assembly
    event.remove({output: 'create:filter'});
    event.remove({output: 'create:attribute_filter'});

    let incomplete_filter = 'kubejs:incomplete_filter';
    let incomplete_attribute_filter = 'kubejs:incomplete_attribute_filter';

    event.recipes.createSequencedAssembly([
        CR('filter'),
    ], ('#minecraft:wool'), [
        event.recipes.createDeploying(incomplete_filter, [incomplete_filter, MC('iron_nugget')]),
        event.recipes.createDeploying(incomplete_filter, [incomplete_filter, MC('iron_nugget')]),
        event.recipes.createPressing(incomplete_filter, incomplete_filter)
    ]).transitionalItem(incomplete_filter).id('kubejs:filter').loops(1);

    event.recipes.createSequencedAssembly([
        CR('attribute_filter'),
    ], CR('filter'), [
        event.recipes.createDeploying(incomplete_attribute_filter, [incomplete_attribute_filter, CR('brass_nugget')]),
        event.recipes.createDeploying(incomplete_attribute_filter, [incomplete_attribute_filter, CR('brass_nugget')]),
        event.recipes.createPressing(incomplete_attribute_filter, incomplete_attribute_filter)
    ]).transitionalItem(incomplete_attribute_filter).id('kubejs:attribute_filter').loops(1);

    //

}
function removeRecipes(event) {

    // Remove all alloy recipes
    let molten_alloys = ["molten_amethyst_bronze", "molten_brass", "molten_bronze", "molten_constantan", "molten_electrum", "molten_enderium",
        "molten_hepatizon", "molten_invar", "molten_lumium", "molten_netherite", "molten_obsidian", "molten_obsidian_from_soup",
        "molten_manyullyn", "molten_signalum", "molten_pig_iron", "molten_queen_slime", "molten_rose_gold", "molten_slimesteel"]

    molten_alloys.forEach(alloy => {
        event.remove({id: TC('smeltery/alloys/' + alloy)})
    })





}









