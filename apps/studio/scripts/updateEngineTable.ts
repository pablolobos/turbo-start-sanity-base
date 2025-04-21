import { getCliClient } from 'sanity/cli'

const client = getCliClient()

// Your engine data
const engineData = [
    {
        "engine": "TAD540VE",
        "kW": 105,
        "hp": 143,
        "rpm": 2200,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-540-542-VE.pdf"
    },
    {
        "engine": "TAD541VE",
        "kW": 129,
        "hp": 175,
        "rpm": 2200,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-540-542-VE.pdf"
    },
    {
        "engine": "TAD542VE",
        "kW": 160,
        "hp": 218,
        "rpm": 2200,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-540-542-VE.pdf"
    },
    {
        "engine": "TAD620VE",
        "kW": 155,
        "hp": 211,
        "rpm": 2500,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-620VE.pdf"
    },
    {
        "engine": "TAD720VE",
        "kW": 174,
        "hp": 237,
        "rpm": 2300,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-720VE.pdf"
    },
    {
        "engine": "TAD721VE",
        "kW": 195,
        "hp": 265,
        "rpm": 2300,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-721VE.pdf"
    },
    {
        "engine": "TAD722VE",
        "kW": 223,
        "hp": 303,
        "rpm": 2300,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-722VE.pdf"
    },
    {
        "engine": "TAD840VE",
        "kW": 160,
        "hp": 218,
        "rpm": 2200,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-840-843VE.pdf"
    },
    {
        "engine": "TAD841VE",
        "kW": 185,
        "hp": 252,
        "rpm": 2200,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-840-843VE.pdf"
    },
    {
        "engine": "TAD842VE",
        "kW": 210,
        "hp": 286,
        "rpm": 2200,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-840-843VE.pdf"
    },
    {
        "engine": "TAD843VE",
        "kW": 235,
        "hp": 320,
        "rpm": 2200,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-840-843VE.pdf"
    },
    {
        "engine": "TAD1140VE",
        "kW": 235,
        "hp": 320,
        "rpm": 2100,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-1140-1142VE.pdf"
    },
    {
        "engine": "TAD1141VE",
        "kW": 265,
        "hp": 360,
        "rpm": 2100,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-1140-1142VE.pdf"
    },
    {
        "engine": "TAD1142VE",
        "kW": 285,
        "hp": 388,
        "rpm": 1700,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-1140-1142VE.pdf"
    },
    {
        "engine": "TAD1340VE",
        "kW": 256,
        "hp": 348,
        "rpm": 2100,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-1340VE.pdf"
    },
    {
        "engine": "TAD1341VE",
        "kW": 275,
        "hp": 374,
        "rpm": 2100,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-1341VE.pdf"
    },
    {
        "engine": "TAD1342VE",
        "kW": 310,
        "hp": 422,
        "rpm": 2100,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-1342VE.pdf"
    },
    {
        "engine": "TAD1343VE",
        "kW": 332,
        "hp": 452,
        "rpm": 2100,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-1343VE.pdf"
    },
    {
        "engine": "TAD1344VE",
        "kW": 352,
        "hp": 479,
        "rpm": 2100,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-1344VE.pdf"
    },
    {
        "engine": "TAD1345VE",
        "kW": 394,
        "hp": 536,
        "rpm": 2100,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-1345VE.pdf"
    },
    {
        "engine": "TAD1640VE-B",
        "kW": 405,
        "hp": 551,
        "rpm": 1900,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-1640-1642VE-B.pdf"
    },
    {
        "engine": "TAD1641VE-B",
        "kW": 450,
        "hp": 612,
        "rpm": 1800,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-1640-1642VE-B.pdf"
    },
    {
        "engine": "TAD1642VE-B",
        "kW": 515,
        "hp": 700,
        "rpm": 1800,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-1640-1642VE-B.pdf"
    },
    {
        "engine": "TAD1643VE",
        "kW": 565,
        "hp": 768,
        "rpm": 1850,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-1643VE.pdf"
    },
    {
        "engine": "TAD1643VE-B",
        "kW": 565,
        "hp": 768,
        "rpm": 1900,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-1643VE-B.pdf"
    }
]

const PAGE_ID = 'drafts.c5243083-e547-4850-abc0-ca8aa20cf5af'
const TABLE_KEY = 'b87f82569fc7'

async function updateEngineTable() {
    try {
        // Format the data for the generic table
        const tableData = {
            _type: 'genericTable',
            _key: TABLE_KEY,
            columnCount: 5,
            variant: 'default',
            title: 'Motores Volvo Penta',
            columnHeaders: ['Engine', 'kW', 'HP', 'RPM', 'Download'],
            rows: engineData.map(item => ({
                cells: [
                    {
                        content: item.engine,
                        isLastColumn: false
                    },
                    {
                        content: item.kW.toString(),
                        isLastColumn: false
                    },
                    {
                        content: item.hp.toString(),
                        isLastColumn: false
                    },
                    {
                        content: item.rpm.toString(),
                        isLastColumn: false
                    },
                    {
                        content: 'Download PDF',
                        isLastColumn: true,
                        // You might want to add a link field to your schema to handle this properly
                        link: item.download
                    }
                ]
            }))
        }

        // Update the document
        const result = await client
            .patch(PAGE_ID)
            .set({
                'pageBuilder[1].tabs[0].content[0]': tableData
            })
            .commit()

        console.log('✅ Table updated successfully')
        return result
    } catch (error) {
        console.error('❌ Error updating table:', error)
        throw error
    }
}

// Run the update
updateEngineTable() 