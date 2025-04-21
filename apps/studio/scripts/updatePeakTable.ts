import { getCliClient } from 'sanity/cli'

const client = getCliClient()

// Your peak torque data
const peakData = [
    {
        "engine": "TAD540VE",
        "torque_Nm": 710,
        "rpm": 1400,
        "displacement_L": 5.1,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-540-542-VE.pdf"
    },
    {
        "engine": "TAD541VE",
        "torque_Nm": 810,
        "rpm": 1400,
        "displacement_L": 5.1,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-540-542-VE.pdf"
    },
    {
        "engine": "TAD542VE",
        "torque_Nm": 910,
        "rpm": 1450,
        "displacement_L": 5.1,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-540-542-VE.pdf"
    },
    {
        "engine": "TAD620VE",
        "torque_Nm": 700,
        "rpm": 1500,
        "displacement_L": 5.7,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-620VE.pdf"
    },
    {
        "engine": "TAD720VE",
        "torque_Nm": 854,
        "rpm": 1400,
        "displacement_L": 7.2,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-720VE.pdf"
    },
    {
        "engine": "TAD721VE",
        "torque_Nm": 907,
        "rpm": 1600,
        "displacement_L": 7.2,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-721VE.pdf"
    },
    {
        "engine": "TAD722VE",
        "torque_Nm": 1050,
        "rpm": 1700,
        "displacement_L": 7.2,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-722VE.pdf"
    },
    {
        "engine": "TAD840VE",
        "torque_Nm": 1060,
        "rpm": 1350,
        "displacement_L": 7.7,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-840-843VE.pdf"
    },
    {
        "engine": "TAD841VE",
        "torque_Nm": 1160,
        "rpm": 1350,
        "displacement_L": 7.7,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-840-843VE.pdf"
    },
    {
        "engine": "TAD842VE",
        "torque_Nm": 1235,
        "rpm": 1350,
        "displacement_L": 7.7,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-840-843VE.pdf"
    },
    {
        "engine": "TAD843VE",
        "torque_Nm": 1310,
        "rpm": 1450,
        "displacement_L": 7.7,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-840-843VE.pdf"
    },
    {
        "engine": "TAD1140VE",
        "torque_Nm": 1581,
        "rpm": 1260,
        "displacement_L": 10.8,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-1140-1142VE.pdf"
    },
    {
        "engine": "TAD1141VE",
        "torque_Nm": 1785,
        "rpm": 1260,
        "displacement_L": 10.8,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-1140-1142VE.pdf"
    },
    {
        "engine": "TAD1142VE",
        "torque_Nm": 1938,
        "rpm": 1260,
        "displacement_L": 10.8,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-1140-1142VE.pdf"
    },
    {
        "engine": "TAD1340VE",
        "torque_Nm": 1770,
        "rpm": 1260,
        "displacement_L": 12.8,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-1340VE.pdf"
    },
    {
        "engine": "TAD1341VE",
        "torque_Nm": 1905,
        "rpm": 1260,
        "displacement_L": 12.8,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-1341VE.pdf"
    },
    {
        "engine": "TAD1342VE",
        "torque_Nm": 2005,
        "rpm": 1260,
        "displacement_L": 12.8,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-1342VE.pdf"
    },
    {
        "engine": "TAD1343VE",
        "torque_Nm": 2143,
        "rpm": 1260,
        "displacement_L": 12.8,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-1343VE.pdf"
    },
    {
        "engine": "TAD1344VE",
        "torque_Nm": 2248,
        "rpm": 1260,
        "displacement_L": 12.8,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-1344VE.pdf"
    },
    {
        "engine": "TAD1345VE",
        "torque_Nm": 2325,
        "rpm": 1260,
        "displacement_L": 12.8,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-1345VE.pdf"
    },
    {
        "engine": "TAD1640VE-B",
        "torque_Nm": 2760,
        "rpm": 1200,
        "displacement_L": 16.1,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-1640-1642VE-B.pdf"
    },
    {
        "engine": "TAD1641VE-B",
        "torque_Nm": 2910,
        "rpm": 1200,
        "displacement_L": 16.1,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-1640-1642VE-B.pdf"
    },
    {
        "engine": "TAD1642VE-B",
        "torque_Nm": 3220,
        "rpm": 1200,
        "displacement_L": 16.1,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-1640-1642VE-B.pdf"
    },
    {
        "engine": "TAD1643VE",
        "torque_Nm": 3287,
        "rpm": 1200,
        "displacement_L": 16.1,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-1643VE.pdf"
    },
    {
        "engine": "TAD1643VE-B",
        "torque_Nm": 3260,
        "rpm": 1260,
        "displacement_L": 16.1,
        "download": "http://qa.fenomena.cl/volvo/new_volvochile/wp-content/uploads/2018/01/TAD-1643VE-B.pdf"
    }
]

const PAGE_ID = 'drafts.c5243083-e547-4850-abc0-ca8aa20cf5af'
const TABLE_KEY = '1aea8878bef6'

async function updatePeakTable() {
    try {
        // Format the data for the generic table
        const tableData = {
            _type: 'genericTable',
            _key: TABLE_KEY,
            columnCount: 5,
            variant: 'default',
            title: 'Motores Volvo Penta - Peak Torque',
            columnHeaders: ['Engine', 'Nm', 'RPM', 'Disp. Lt', 'Descargas'],
            rows: peakData.map(item => ({
                cells: [
                    {
                        content: item.engine,
                        isLastColumn: false
                    },
                    {
                        content: item.torque_Nm.toString(),
                        isLastColumn: false
                    },
                    {
                        content: item.rpm.toString(),
                        isLastColumn: false
                    },
                    {
                        content: item.displacement_L.toString(),
                        isLastColumn: false
                    },
                    {
                        content: 'Ficha PDF',
                        isLastColumn: true,
                        link: item.download
                    }
                ]
            }))
        }

        // Update the document
        const result = await client
            .patch(PAGE_ID)
            .set({
                'pageBuilder[1].tabs[1].content[0]': tableData
            })
            .commit()

        console.log('✅ Peak torque table updated successfully')
        return result
    } catch (error) {
        console.error('❌ Error updating peak torque table:', error)
        throw error
    }
}

// Run the update
updatePeakTable()
