
<h3 style="color: aqua"> Add custom crafting recipe  </h3>

```js
event.custom({
        "type": "minecraft:crafting_shaped",
        "pattern": [
            'AAA',
            'ABA',
            'AAA'
        ],
        "key": {
            "A": {
                "item": "minecraft:iron_ingot"
            },
            "B": {
                "item": "minecraft:iron_block"
            }
        },
        "result": {
            "item": "createaddition:electric_motor",
            "count": 1
        }
    })
```

<h3 style="color: aqua"> Add custom Tinkers smeltery recipe  </h3>

```js
event.custom({
        "type": "tconstruct:melting",
        "ingredient": {
            "item": "minecraft:redstone"
        },
        "result": {
            "fluid": "kubejs:molten_redstone",
            "amount": 144
        },
        "temperature": 500,
        "time": 50
    })
```

