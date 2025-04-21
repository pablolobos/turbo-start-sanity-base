import { getCliClient } from 'sanity/cli'
import { v4 as uuidv4 } from 'uuid'

const client = getCliClient()

// Sucursales data
const sucursalesData = [
    {
        "region": "Iquique",
        "telefono": "+56 2 2299 1100",
        "email": "info.iquique@volvo.com",
        "direccion": "Santa Rosa de Molle 4006-A, Alto Hospicio.",
        "latitud": -20.269968,
        "longitud": -70.0895233,
        "gerencia": [
            {
                "nombre": "Alex Gonzalez",
                "cargo": "Gerente sucursal",
                "telefono": "56 5 7256 1730",
                "email": "alex.gonzalez@volvo.com"
            },
            {
                "nombre": "Juan Carlos Pizarro",
                "cargo": "Administracion y Finanzas",
                "telefono": "56 5 7256 1730",
                "email": "juan.pizarro@volvo.com"
            },
            {
                "nombre": "Daniel San Martin",
                "cargo": "Vendedor de camiones",
                "telefono": "56 9 3394 1341",
                "email": "daniel.san.martin@volvo.com"
            },
            {
                "nombre": "Boris Reygadas",
                "cargo": "Ventas de Repuestos",
                "telefono": "56 9 34641685",
                "email": "boris.rey.gadas.2@consultant.volvo.com"
            },
            {
                "nombre": "Gino Becerra",
                "cargo": "Ventas de Repuestos",
                "telefono": "56 5 7256 1731\n56 9 3457 5647",
                "email": "gino.becerra@volvo.com"
            }
        ]
    },
    {
        "region": "Calama",
        "telefono": "+56 2 2299 1100",
        "email": "info.calama@volvo.com",
        "direccion": "Camino a Chiu-Chiu, Sitio 37. Región de Antofagasta.",
        "latitud": -22.441396,
        "longitud": -68.8953997,
        "gerencia": [
            {
                "nombre": "Mauricio García",
                "cargo": "Gerente Sucursal",
                "telefono": "56 9 4094 1576",
                "email": "mauricio.garcia@volvo.com"
            },
            {
                "nombre": "Loreto Vergara",
                "cargo": "Administracion y Finanzas",
                "telefono": "56 5 5271 8004",
                "email": "loreto.vergara.2@volvo.com"
            },
            {
                "nombre": "Ivan Pescador",
                "cargo": "Venta de Repuestos",
                "telefono": "56 9 44930350",
                "email": "ivan.pescador@volvo.com"
            },
            {
                "nombre": "Natali Saires",
                "cargo": "Consultor Servicios",
                "telefono": "56 9 5774 0986",
                "email": "natali.saires@volvo.com"
            },
            {
                "nombre": "Omar Herrera",
                "cargo": "Vendedor de camiones",
                "telefono": "56 9 93374423",
                "email": "omar.herrera.2@volvo.com"
            }
        ]
    },
    {
        "region": "Antofagasta",
        "telefono": "+56 2 2299 1100",
        "email": "info.antofagasta@volvo.com",
        "direccion": "Amatista N°441, Sector La Chimba, Antofagasta.",
        "latitud": -23.541118621826172,
        "longitud": -70.39035034179688,
        "gerencia": [
            {
                "nombre": "Roberto Muñoz",
                "cargo": "Gerente Sucursal",
                "telefono": "56 9 3258 5936",
                "email": "roberto.munoz@volvo.com"
            },
            {
                "nombre": "Alejandro Oyanedel",
                "cargo": "Venta de Repuestos",
                "telefono": "56 55 2718232\n569 739 881 60",
                "email": "alejandro.oyanedel@volvo.com"
            },
            {
                "nombre": "Damian Braña Basaez",
                "cargo": "Venta de Repuestos",
                "telefono": "56 552 718206\n56 940705460",
                "email": "Damian.brana@volvo.com"
            },
            {
                "nombre": "Diana Gaytan Tapia",
                "cargo": "Servicios",
                "telefono": "569 4222 0615",
                "email": "diana.gaytan.2@volvo.com"
            }
        ]
    },
    {
        "region": "Copiapó",
        "telefono": "+56 2 2299 1100",
        "email": "info.copiapo@volvo.com",
        "direccion": "Ruta 5 Longitudinal Norte (Acceso Sur) , Nº 4200 - Sector Cuesta Cardones, Copiapó.",
        "latitud": -27.40696,
        "longitud": -70.35038,
        "gerencia": [
            {
                "cargo": "Subgerente sucursal",
                "nombre": "Mauricio Meriño",
                "telefono": "56 2 2991 100",
                "email": "mauricio.merino@volvo.com"
            },
            {
                "cargo": "Administrador y finanzas",
                "nombre": "Javier López",
                "telefono": "56 2 2991 100",
                "email": "javier.lopez.2@volvo.com"
            },
            {
                "cargo": "Venta de Repuestos",
                "nombre": "Juan López",
                "telefono": "56 5 2235 4702\n56 9 7958 5668",
                "email": "juan-luiz.lopez@volvo.com"
            },
            {
                "cargo": "Servicios",
                "nombre": "Victor Huenchucoy",
                "telefono": "56 9 7958 5748",
                "email": "victor.huenchucoy@volvo.com"
            },
            {
                "cargo": "Camiones nuevos",
                "nombre": "Freddy Ramírez",
                "telefono": "56 9 4043 7310",
                "email": "freddy.ramirez.2@volvo.com"
            }
        ]
    },
    {
        "region": "La Serena",
        "telefono": "+56 2 2299 1100",
        "email": "info.laserena@volvo.com",
        "direccion": "Lote A1, Parcela 1, Ruta 5 Norte, La Serena.",
        "latitud": -29.917706,
        "longitud": -71.262245,
        "gerencia": [
            {
                "cargo": "Subgerente sucursal",
                "nombre": "Luis Figueroa",
                "telefono": "56 5 1247 1701",
                "email": "luis.figueroa.2@volvo.com"
            },
            {
                "cargo": "Administrador y finanzas",
                "nombre": "Carolina Cortés",
                "telefono": "56 5 1247 1700",
                "email": "carolina.cortes@volvo.com"
            },
            {
                "cargo": "Venta de Repuestos",
                "nombre": "Diego Irarrazaval",
                "telefono": "56 5 1247 1702\n56 9 3418 8568",
                "email": "diego.irarrazaval@volvo.com"
            },
            {
                "cargo": "Camiones nuevos",
                "nombre": "Freddy Ramírez",
                "telefono": "56 9 4043 7310",
                "email": "freddy.ramirez.2@volvo.com"
            }
        ]
    },
    {
        "region": "Santiago",
        "telefono": "+56 2 2299 1100",
        "email": "info.santiago@volvo.com",
        "direccion": "Avda. Presidente Eduardo Frei Montalva N°8691, Quilicura.",
        "latitud": -33.3514139,
        "longitud": -70.7064163,
        "gerencia": [
            {
                "cargo": "Gerente sucursal",
                "nombre": "Carlos Alvarado",
                "telefono": "56 2 2299 1182",
                "email": "carlos.alvarado@volvo.com"
            },
            {
                "cargo": "Administrador y finanzas",
                "nombre": "Gloria Palma",
                "telefono": "56 2 2299 1102",
                "email": "gloria.palma@volvo.com"
            },
            {
                "cargo": "Venta de Repuestos",
                "nombre": "Gustavo Caro",
                "telefono": "56 2 2299 1119\n56 9 8268 8482",
                "email": "gustavo.caro@volvo.com"
            },
            {
                "cargo": "Venta de Repuestos",
                "nombre": "Marco Cisternas",
                "telefono": "56 2 2299 1109\n56 9 7528 2618",
                "email": "marco.cisternas@volvo.com"
            },
            {
                "cargo": "Venta de Repuestos",
                "nombre": "Ruben Rivara",
                "telefono": "56 2 2340 6286\n56 9 8257 8265",
                "email": "ruben.rivara@volvo.com"
            },
            {
                "cargo": "Ventas de Repuestos",
                "nombre": "Carlos Nuñez",
                "telefono": "56 9 448 12398",
                "email": "carlos.nunez.2@volvo.com"
            },
            {
                "cargo": "Consultor de Servicios Correctivo",
                "nombre": "Eduardo Cerda",
                "telefono": "56 9 6435 7777",
                "email": "eduardo.cerda@volvo.com"
            },
            {
                "cargo": "Camiones usados",
                "nombre": "Juan Vázquez",
                "telefono": "56 9 4623 8310",
                "email": "juan.vasquez@volvo.com"
            },
            {
                "cargo": "Camiones usados",
                "nombre": "Jorge Del Valle",
                "telefono": "56 2 2299 1183\n56 9 4240 8811",
                "email": "jorge.del.valle@volvo.com"
            },
            {
                "cargo": "Ejecutivo de Ventas Buses",
                "nombre": "Marcelo Sandoval Neira",
                "telefono": "569 39109384",
                "email": "marcelo.sandoval@volvo.com"
            }
        ]
    },
    {
        "region": "Valparaíso",
        "telefono": "+56 2 2299 1100",
        "email": "Info.valparaiso@volvo.com",
        "direccion": "Ruta 68, parcela 293 KM 97,9, Placilla de Peñuelas, Valparaíso.",
        "latitud": -33.1227852,
        "longitud": -71.5603828,
        "gerencia": [
            {
                "cargo": "Gerente sucursal",
                "nombre": "Klaus Werner",
                "telefono": "56 2 2299 1182",
                "email": "klaus.werner@volvo.com"
            },
            {
                "cargo": "Administrador y finanzas",
                "nombre": "Cynthia Sánchez",
                "telefono": "56 3 2325 3100",
                "email": "cynthia.sanchez@volvo.com"
            },
            {
                "cargo": "Venta de Repuestos",
                "nombre": "Orlando Toro",
                "telefono": "56 3 2325 3103\n56 9 3377 0529",
                "email": "orlando.toro@volvo.com"
            },
            {
                "cargo": "Servicios",
                "nombre": "Fernando Carrasco",
                "telefono": "56 3 2353 3104\n56 9 3187 3073",
                "email": "fernando.carrasco@volvo.com"
            },
            {
                "cargo": "Camiones nuevos",
                "nombre": "Paulo Vásquez",
                "telefono": "56 9 3399 7848",
                "email": "paulo.vasquez@volvo.com"
            }
        ]
    },
    {
        "region": "Rancagua",
        "telefono": "",
        "email": "",
        "direccion": "Av. Ribera Sur 039 Bodega 7, Barrio Industrial KM 90",
        "latitud": -34.190614,
        "longitud": -70.748681,
        "gerencia": [
            {
                "cargo": "Encargado",
                "nombre": "Ignacio Marmolejo Pereira",
                "telefono": "56 9 6439 4796",
                "email": "ignacio.marmolejo@volvo.com"
            },
            {
                "cargo": "Técnico Líder",
                "nombre": "Isaías Mardones",
                "telefono": "56 9 3396 4402",
                "email": "isaias.mardones@volvo.com"
            },
            {
                "cargo": "Camiones nuevos",
                "nombre": "Leonardo Gomez",
                "telefono": "56 9 3429 1370",
                "email": "leonardo.gomez.2@volvo.com"
            }
        ]
    },
    {
        "region": "Service Express Talca",
        "telefono": "+56 2 2299 1100",
        "email": "info.talca@volvo.com",
        "direccion": "21 Oriente 630, Talca",
        "latitud": -35.435806,
        "longitud": -71.638083,
        "gerencia": [
            {
                "cargo": "Gerente sucursal",
                "nombre": "Andrés González",
                "telefono": "569 426 902 46",
                "email": "andres.ag.gonzalez@volvo.com"
            },
            {
                "cargo": "Administrador y finanzas",
                "nombre": "Ramón Riquelme",
                "telefono": "56 7 1234 3000",
                "email": "ramon.riquelme@volvo.com"
            },
            {
                "cargo": "Venta de Repuestos",
                "nombre": "Andrés Cerda",
                "telefono": "56 71 234 3002\n56 9 4074 2621",
                "email": "andres.cerda@volvo.com"
            },
            {
                "cargo": "Servicios",
                "nombre": "Jorge Mendoza",
                "telefono": "56 7 1234 3008\n56 9 4094 1575",
                "email": "jorge.mendoza@volvo.com"
            },
            {
                "cargo": "Camiones nuevos",
                "nombre": "Alfonso Verdugo",
                "telefono": "56 9 4043 7312",
                "email": "alfonso.verdugo@volvo.com"
            }
        ]
    },
    {
        "region": "Concepción",
        "telefono": "+56 2 2299 1100",
        "email": "info.concepcion@volvo.com",
        "direccion": "Ruta 150 (Camino a Penco), km 6.4 lote C-4, Penco, Concepción",
        "latitud": -36.758194,
        "longitud": -73.003028,
        "gerencia": [
            {
                "cargo": "Gerente sucursal",
                "nombre": "Harry Opitz",
                "telefono": "56 4 1256 6819",
                "email": "harry.opitz@volvo.com"
            },
            {
                "cargo": "Administrador y finanzas",
                "nombre": "Jacqueline Monsalves",
                "telefono": "56 4 1256 6801",
                "email": "jacqueline.monsalves@volvo.com"
            },
            {
                "cargo": "Venta de Repuestos",
                "nombre": "José Rivas",
                "telefono": "56 4 1256",
                "email": null
            }
        ]
    },
    {
        "region": "Los Ángeles",
        "telefono": "+56 2 2299 1100",
        "email": "info.losangeles@volvo.com",
        "direccion": "Avda. Las Industrias 7215, Los Angeles.",
        "latitud": -37.420738220214844,
        "longitud": -72.33745574951172,
        "gerencia": []
    },
    {
        "region": "Temuco",
        "telefono": "+56 2 2299 1100",
        "email": "infotemuco@volvo.com",
        "direccion": "Longitudinal Sur 4930, Local 6, Padre las Casas, Temuco.",
        "latitud": -38.7833016,
        "longitud": -72.6131264,
        "gerencia": []
    }
]

async function populateSucursales() {
    try {
        console.log(`Populating sucursales data with:`)
        console.log(`Project ID: ${client.config().projectId}`)
        console.log(`Dataset: ${client.config().dataset}`)

        // First, delete any existing sucursales to avoid duplicates
        console.log(`Deleting any existing sucursales...`)
        await client.delete({ query: '*[_type == "sucursales"]' })

        // Create a transaction for better performance
        const transaction = client.transaction()

        // Process each sucursal
        for (const sucursal of sucursalesData) {
            const sucursalId = uuidv4()
            const slug = sucursal.region
                .toLowerCase()
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/[^\w-]+/g, '') // Remove special characters

            // Create the sucursal document
            const sucursalDoc = {
                _id: sucursalId,
                _type: 'sucursales',
                title: sucursal.region,
                region: sucursal.region,
                telefono: sucursal.telefono,
                email: sucursal.email,
                direccion: sucursal.direccion,
                latitud: sucursal.latitud,
                longitud: sucursal.longitud,
                slug: {
                    _type: 'slug',
                    current: slug
                },
                // Map gerencia to personas
                personas: sucursal.gerencia.map(persona => ({
                    _key: uuidv4(),
                    nombre: persona.nombre,
                    cargo: persona.cargo,
                    telefono: persona.telefono,
                    email: persona.email || ''
                }))
            }

            // Add to transaction
            transaction.create(sucursalDoc)
        }

        // Commit transaction
        console.log(`Creating ${sucursalesData.length} sucursales...`)
        await transaction.commit()

        console.log('✅ Sucursales created successfully!')
    } catch (error) {
        console.error('❌ Error creating sucursales:', error)
    }
}

// Run the script
populateSucursales() 