import { getCliClient } from 'sanity/cli'

const client = getCliClient()

// Your generator data
const generatorData = [
    {
        "generator": "Series Star",
        "kWe_380V": 380,
        "kWe_400V": 400,
        "kWe_440V": 440,
        "download": null
    },
    {
        "generator": "Parallel Star",
        "kWe_380V": 190,
        "kWe_400V": 200,
        "kWe_440V": 220,
        "download": null
    },
    {
        "generator": "Series Delta",
        "kWe_380V": 220,
        "kWe_400V": 230,
        "kWe_440V": 254,
        "download": null
    },
    {
        "generator": "D5A TA MGS / UCM274D",
        "kWe_380V": 70,
        "kWe_400V": 70,
        "kWe_440V": 63,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/D5A-TA-MGS-1.pdf"
    },
    {
        "generator": "D5A TA MGS / UCM274E",
        "kWe_380V": 86,
        "kWe_400V": 85,
        "kWe_440V": 77,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/D5A-TA-MGS-1.pdf"
    },
    {
        "generator": "D7A TA MGS / UCM274G",
        "kWe_380V": 119,
        "kWe_400V": 119,
        "kWe_440V": 99,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/D7A-TA-MGS-1.pdf"
    },
    {
        "generator": "D7A TA MGS / UCM274H",
        "kWe_380V": 130,
        "kWe_400V": 130,
        "kWe_440V": 110,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/D7A-TA-MGS-1.pdf"
    },
    {
        "generator": "D13 MG MGS / HCM434F",
        "kWe_380V": 248,
        "kWe_400V": 248,
        "kWe_440V": 248,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/D7A-TA-MGS-1.pdf"
    },
    {
        "generator": "D13 MG MGS / HCM534C",
        "kWe_380V": 284,
        "kWe_400V": 284,
        "kWe_440V": 284,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/D7A-TA-MGS-1.pdf"
    },
    {
        "generator": "D13 MG MGS / HCM534D",
        "kWe_380V": 324,
        "kWe_400V": 332,
        "kWe_440V": 332,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/D7A-TA-MGS-1.pdf"
    }
]

const PAGE_ID = 'drafts.b2e0305c-caa2-4492-8405-7d30a6996628'
const TABLE_KEY = '2449b3cff565'

async function updateGeneracionMarinaTable() {
    try {
        // Format the data for the generic table
        const tableData = {
            _type: 'genericTable',
            _key: TABLE_KEY,
            columnCount: 5,
            variant: 'default',
            title: '1500rpm, 50Hz',
            columnHeaders: ['Voltages', 'Potencia en kWe', 'Potencia en kWe', 'Potencia en kWe', 'Descargas'],
            rows: generatorData.map(item => ({
                cells: [
                    {
                        content: item.generator,
                        isLastColumn: false
                    },
                    {
                        content: item.kWe_380V.toString(),
                        isLastColumn: false
                    },
                    {
                        content: item.kWe_400V.toString(),
                        isLastColumn: false
                    },
                    {
                        content: item.kWe_440V.toString(),
                        isLastColumn: false
                    },
                    {
                        content: item.download ? 'Ficha PDF' : '-',
                        isLastColumn: true,
                        link: item.download || undefined
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

        console.log('✅ Generación Marina table updated successfully')
        return result
    } catch (error) {
        console.error('❌ Error updating Generación Marina table:', error)
        throw error
    }
}

// Run the update
updateGeneracionMarinaTable() 