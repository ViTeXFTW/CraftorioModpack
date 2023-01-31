// priority: 0

console.info('Hello, World! (You will only see this line once in console, during startup)')

onEvent('item.registry', event => {
    event.create('incomplete_filter').displayName('Incomplete Filter').texture('kubejs:item/incomplete_filter')
    event.create('incomplete_attribute_filter').displayName('Incomplete Attribute Filter').texture('kubejs:item/incomplete_attribute_filter')
    event.create('infinity_ingot').displayName('Infinity Ingot').texture('kubejs:item/infinity_ingot')  // Credits to CreeperGod for the texture
    event.create('ball_baring').displayName('Ball Baring').texture('kubejs:item/ball_baring')
    event.create('zinc_dust').displayName('Zinc Dust').texture('kubejs:item/zinc_dust')
    event.create('incomplete_prescision_mechanism').displayName('Incomplete Precision Mechanism').texture('kubejs:item/incomplete_prescision_mechanism')

})

onEvent('block.registry', event => {

    let machine = (name, layer) => {
        let id = name.toLowerCase()
        event.create(id + '_machine')
            .model('kubejs:block/' + id + '_machine')
            .material('lantern')
            .hardness(3.0)
            .displayName(name + ' Machine')
            .notSolid()
            .renderType(layer)
    }

    machine('Andesite', "solid")
    machine('Brass', "translucent")
    machine('Copper', "cutout")

})


onEvent('fluid.registry', event => {
    // Molten cobbledstone
    event.create('molten_cobblestone')
    .displayName('Molten Cobblestone')
    .stillTexture('kubejs:fluid/cobblestone_still')
    .flowingTexture('kubejs:fluid/cobblestone_flow')
    .bucketColor(0x7f7f7f)

    // Molten infinity ingot
    event.create('molten_infinity')
    .displayName('Molten Infinity')
    .stillTexture('kubejs:fluid/infinity_still')
    .flowingTexture('kubejs:fluid/infinity_flow')
    .bucketColor(0xad22f4)

})

