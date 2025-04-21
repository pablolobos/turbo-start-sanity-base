import { getCliClient } from 'sanity/cli'

const client = getCliClient()

// Your Iron Women data
const ironWomenData = [
    {
        "operador": "RBU",
        "rut": "•••••522-8",
        "nombre": "KAREN ANDREA ROMERO MOYANO"
    },
    {
        "operador": "RBU",
        "rut": "•••••916-1",
        "nombre": "EVELYN IVETH AILLAPÁN LIENAF"
    },
    {
        "operador": "RBU",
        "rut": "•••••550-3",
        "nombre": "JAVIERA PAZ VALENZUELA ARAOS"
    },
    {
        "operador": "RBU",
        "rut": "•••••449-0",
        "nombre": "ELIZABETH DE LAS MERCEDES BARRERA LUCO"
    },
    {
        "operador": "RBU",
        "rut": "•••••109-5",
        "nombre": "SOLANGE EVELYN SILVA GUTIÉRREZ"
    },
    {
        "operador": "RBU",
        "rut": "•••••409-K",
        "nombre": "DANIELA LORENA MATURANA ASTUDILLO"
    },
    {
        "operador": "RBU",
        "rut": "•••••351-K",
        "nombre": "KATHERINE PATRICIA GARÍN ARMIJO"
    },
    {
        "operador": "RBU",
        "rut": "•••••995-2",
        "nombre": "SANDRA PATRICIA GONZÁLEZ CORNEJO"
    },
    {
        "operador": "RBU",
        "rut": "•••••732-0",
        "nombre": "BERNARDITA DEL PILAR TAPIA ALIAGA"
    },
    {
        "operador": "RBU",
        "rut": "•••••252-2",
        "nombre": "CAROLINA ANDREA ARREY GUTIÉRREZ"
    },
    {
        "operador": "METROPOL",
        "rut": "•••••309-1",
        "nombre": "PAMELA DEL CARMEN VILCHES MARTINEZ"
    },
    {
        "operador": "METROPOL",
        "rut": "•••••648-8",
        "nombre": "ELIZABETH JAZMIN TANTAS LOPEZ"
    },
    {
        "operador": "METROPOL",
        "rut": "•••••801-K",
        "nombre": "JACQUELINE DEL CARMEN CONTRERAS MENESES"
    },
    {
        "operador": "METROPOL",
        "rut": "•••••020-5",
        "nombre": "KATHERINE NICOLE GONGORA OTAROLA"
    },
    {
        "operador": "METROPOL",
        "rut": "•••••575-4",
        "nombre": "SERGIA INGRID GARCIA GARNICA"
    },
    {
        "operador": "METROPOL",
        "rut": "•••••098-6",
        "nombre": "ANNIE ANDREA SEPULVEDA VARGAS"
    },
    {
        "operador": "METROPOL",
        "rut": "•••••417-9",
        "nombre": "JAEL ELIZABETH MEZA SEPULVEDA"
    },
    {
        "operador": "METROPOL",
        "rut": "•••••189-6",
        "nombre": "NATALIA KARINA RAGGI ALVARADO"
    },
    {
        "operador": "METROPOL",
        "rut": "•••••932-2",
        "nombre": "KATHERINE YESENIA GUZMAN CASTRO"
    },
    {
        "operador": "METROPOL",
        "rut": "•••••473-K",
        "nombre": "KAREN ANDREA CURRIHUINCA HERRERA"
    }
]

const PAGE_ID = 'drafts.afa59aed-c10f-42e1-a2c9-4bf526f2fd61'
const TABLE_KEY = '69e7ce72062c'

async function updateIronWomenTable() {
    try {
        // Format the data for the generic table
        const tableData = {
            _type: 'genericTable',
            _key: TABLE_KEY,
            columnCount: 3,
            variant: 'default',
            title: 'Seleccionadas Iron Women buses 2025',
            columnHeaders: ['Operador', 'RUT', 'Nombre'],
            rows: ironWomenData.map(item => ({
                cells: [
                    {
                        content: item.operador,
                        isLastColumn: false
                    },
                    {
                        content: item.rut,
                        isLastColumn: false
                    },
                    {
                        content: item.nombre,
                        isLastColumn: true
                    }
                ]
            }))
        }

        // Update the document
        const result = await client
            .patch(PAGE_ID)
            .set({
                'pageBuilder[1]': tableData
            })
            .commit()

        console.log('✅ Iron Women table updated successfully')
        return result
    } catch (error) {
        console.error('❌ Error updating Iron Women table:', error)
        throw error
    }
}

// Run the update
updateIronWomenTable() 