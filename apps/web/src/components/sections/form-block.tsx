"use client"

import { generateID } from "@/lib/utils"
import { cleanRut, validateRut } from "@/lib/rut"
import { useState, FormEvent, useRef, useEffect } from 'react'
import { cn } from "@workspace/ui/lib/utils"
import * as Form from "@radix-ui/react-form"
import { Button } from "@workspace/ui/components/button"

interface FormField {
    label: string
    name: string
    type: string
    required: "yes" | "no"
    options?: string[]
    placeholder?: string
}

interface FormData {
    _id: string
    title: string
    description?: string
    fields: FormField[]
    submitButtonText: string
    successMessage: string
    errorMessage: string
    emailRecipients: string
}

interface FormBlockProps {
    title?: string
    description?: string
    variant?: 'default' | 'withBackground' | 'centered'
    form: FormData
}

// Data for regions and comunas
const regionesData = {
    "regiones": [
        {
            "region": "Arica y Parinacota",
            "comunas": ["Arica", "Camarones", "Putre", "General Lagos"]
        },
        {
            "region": "Tarapacá",
            "comunas": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"]
        },
        {
            "region": "Antofagasta",
            "comunas": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"]
        },
        {
            "region": "Atacama",
            "comunas": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"]
        },
        {
            "region": "Coquimbo",
            "comunas": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"]
        },
        {
            "region": "Valparaíso",
            "comunas": ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Quilpué", "Limache", "Olmué", "Villa Alemana"]
        },
        {
            "region": "Región de O'Higgins",
            "comunas": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"]
        },
        {
            "region": "Región del Maule",
            "comunas": ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"]
        },
        {
            "region": "Región de Ñuble",
            "comunas": ["Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Quirihue", "Ránquil", "Treguaco", "Bulnes", "Chillán Viejo", "Chillán", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay", "Coihueco", "Ñiquén", "San Carlos", "San Fabián", "San Nicolás"]
        },
        {
            "region": "Región del Biobío",
            "comunas": ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"]
        },
        {
            "region": "Región de la Araucanía",
            "comunas": ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"]
        },
        {
            "region": "Región de Los Ríos",
            "comunas": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"]
        },
        {
            "region": "Región de Los Lagos",
            "comunas": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"]
        },
        {
            "region": "Región de Aisén",
            "comunas": ["Coyhaique", "Lago Verde", "Aisén", "Cisnes", "Guaitecas", "Cochrane", "O'Higgins", "Tortel", "Chile Chico", "Río Ibáñez"]
        },
        {
            "region": "Región de Magallanes ",
            "comunas": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos (Ex Navarino)", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"]
        },
        {
            "region": "Región Metropolitana",
            "comunas": ["Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "Santiago", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"]
        }
    ]
}

// RegionComunaSelector component
function RegionComunaSelector({ fieldName, required }: { fieldName: string, required: boolean }) {
    const regionSelectRef = useRef<HTMLSelectElement>(null);
    const comunaSelectRef = useRef<HTMLSelectElement>(null);

    // Initial setup after component mounts
    useEffect(() => {
        // Initialize event listeners
        if (regionSelectRef.current) {
            regionSelectRef.current.addEventListener('change', function () {
                const selectedRegion = this.value;

                // Clear and disable comuna select if no region is selected
                if (!selectedRegion && comunaSelectRef.current) {
                    while (comunaSelectRef.current.options.length > 1) {
                        comunaSelectRef.current.remove(1);
                    }
                    comunaSelectRef.current.disabled = true;
                    return;
                }

                // Find the selected region data
                const regionData = regionesData.regiones.find(r => r.region === selectedRegion);

                // Update comuna options if region data exists
                if (regionData && comunaSelectRef.current) {
                    // Enable the comuna select
                    comunaSelectRef.current.disabled = false;

                    // Clear existing options (except the first one)
                    while (comunaSelectRef.current.options.length > 1) {
                        comunaSelectRef.current.remove(1);
                    }

                    // Add new options
                    regionData.comunas.forEach(comuna => {
                        const option = document.createElement('option');
                        option.value = comuna;
                        option.text = comuna;
                        comunaSelectRef.current?.add(option);
                    });
                }
            });
        }
    }, []);

    const commonProps = {
        required: required,
        className: cn(
            "w-full rounded-sm border border-border bg-input",
            "px-4 py-3 text-base",
            "placeholder:text-zinc-500",
            "focus:border-black focus:outline-none focus:ring-2 focus:ring-ring"
        )
    };

    return (
        <div className="space-y-4">
            {/* Calle */}
            <div>
                <label className="block mb-1 font-medium text-sm">Calle</label>
                <Form.Control asChild>
                    <input
                        type="text"
                        name={`${fieldName}_calle`}
                        {...commonProps}
                        placeholder="Nombre de la calle y número"
                    />
                </Form.Control>
            </div>

            {/* Región */}
            <div>
                <label className="block mb-1 font-medium text-sm">Región</label>
                <Form.Control asChild>
                    <select
                        ref={regionSelectRef}
                        name={`${fieldName}_region`}
                        id={`${fieldName}_region`}
                        {...commonProps}
                    >
                        <option value="">Seleccione una región</option>
                        {regionesData.regiones.map((regionData) => (
                            <option key={regionData.region} value={regionData.region}>
                                {regionData.region}
                            </option>
                        ))}
                    </select>
                </Form.Control>
            </div>

            {/* Comuna */}
            <div>
                <label className="block mb-1 font-medium text-sm">Comuna</label>
                <Form.Control asChild>
                    <select
                        ref={comunaSelectRef}
                        name={`${fieldName}_comuna`}
                        id={`${fieldName}_comuna`}
                        {...commonProps}
                        disabled={true}
                    >
                        <option value="">Seleccione una comuna</option>
                    </select>
                </Form.Control>
            </div>
        </div>
    );
}

export default function FormBlock({ title, description, variant = 'default', form }: FormBlockProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const formRef = useRef<HTMLFormElement>(null)
    const [utmParams, setUtmParams] = useState<Record<string, string>>({})

    // Capture UTM parameters on component mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href)
            const params = url.searchParams

            const utmData: Record<string, string> = {}
            const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']

            utmKeys.forEach(key => {
                const value = params.get(key)
                if (value) {
                    utmData[key] = value
                }
            })

            setUtmParams(utmData)
        }
    }, [])

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsSubmitting(true)
        setSubmitStatus('idle')

        const formData = new FormData(event.currentTarget)
        const fields = form.fields.map(field => {
            let value = formData.get(field.name)?.toString() || ''

            // Clean RUT value if field type is rut
            if (field.type === 'rut') {
                value = cleanRut(value)
            }

            // Handle direccion field type
            if (field.type === 'direccion') {
                // Get values from the three direccion fields
                const calle = formData.get(`${field.name}_calle`)?.toString() || ''
                const region = formData.get(`${field.name}_region`)?.toString() || ''
                const comuna = formData.get(`${field.name}_comuna`)?.toString() || ''

                // Format the value as a combined address string
                value = `${calle}, ${comuna}, ${region}`.trim()

                // Return separate fields for each component
                return [
                    {
                        _key: generateID(),
                        name: `${field.name}_calle`,
                        value: calle
                    },
                    {
                        _key: generateID(),
                        name: `${field.name}_region`,
                        value: region
                    },
                    {
                        _key: generateID(),
                        name: `${field.name}_comuna`,
                        value: comuna
                    }
                ]
            }

            return {
                _key: generateID(),
                name: field.name,
                value
            }
        })

        // Flatten the fields array since direccion fields return multiple entries
        const flattenedFields = fields.flat()

        // Add UTM parameters as additional fields
        const utmFields = Object.entries(utmParams).map(([key, value]) => ({
            _key: generateID(),
            name: key,
            value
        }))

        // Combine regular fields with UTM fields
        const allFields = [...flattenedFields, ...utmFields]

        const mutations = [{
            create: {
                _id: 'message.',
                _type: 'message',
                read: false,
                starred: false,
                name: formData.get('name')?.toString() || 'No name provided',
                email: formData.get('email')?.toString() || 'No email provided',
                subject: form.title,
                fields: allFields,
                emailRecipients: form.emailRecipients,
                utmParams: utmParams
            }
        }]

        try {
            const response = await fetch("/api/submit-message", {
                method: "POST",
                body: JSON.stringify({ mutations }),
                headers: { "Content-Type": "application/json" },
            })

            if (response.ok) {
                setSubmitStatus('success')
                formRef.current?.reset()
            } else {
                const errorData = await response.json()
                console.error('Form submission error:', errorData)
                setSubmitStatus('error')
            }
        } catch (error) {
            console.error('Error submitting form:', error)
            setSubmitStatus('error')
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderField = (field: FormField) => {
        const commonProps = {
            required: field.required === 'yes',
            placeholder: field.placeholder,
            className: cn(
                "w-full rounded-sm border border-border bg-input",
                "px-4 py-3 text-base",
                "placeholder:text-zinc-500",
                "focus:border-black focus:outline-none focus:ring-2 focus:ring-ring"
            )
        }

        switch (field.type) {
            case 'direccion':
                return <RegionComunaSelector fieldName={field.name} required={field.required === 'yes'} />
            case 'rut':
                return (
                    <Form.Control asChild>
                        <input
                            type="text"
                            {...commonProps}
                            pattern="[0-9Kk\.-]*"
                            maxLength={12}
                            placeholder={field.placeholder || "12.345.678-9"}
                            onBlur={(e) => {
                                const isValid = validateRut(e.target.value);
                                e.target.setCustomValidity(isValid ? '' : 'RUT inválido');
                            }}
                            onChange={(e) => {
                                // Reset validation state when user starts typing again
                                e.target.setCustomValidity('');
                            }}
                        />
                    </Form.Control>
                )
            case 'textarea':
                return (
                    <Form.Control asChild>
                        <textarea
                            {...commonProps}
                            rows={5}
                        />
                    </Form.Control>
                )
            case 'select':
                return (
                    <Form.Control asChild>
                        <select {...commonProps}>
                            <option value="">Selecciona una opción</option>
                            {field.options?.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </Form.Control>
                )
            case 'radio':
                return (
                    <div className="flex flex-wrap gap-4">
                        {field.options?.map(option => (
                            <div key={option} className="flex items-center gap-2">
                                <Form.Control asChild>
                                    <input
                                        type="radio"
                                        required={field.required === 'yes'}
                                        value={option}
                                        className="bg-zinc-900 border-zinc-800 focus:ring-blue-600/50 text-blue-600"
                                    />
                                </Form.Control>
                                <span className="text-white">{option}</span>
                            </div>
                        ))}
                    </div>
                )
            case 'checkbox':
                return (
                    <div className="flex items-center gap-2">
                        <Form.Control asChild>
                            <input
                                type="checkbox"
                                required={field.required === 'yes'}
                                className="bg-zinc-900 border-zinc-800 rounded focus:ring-blue-600/50 text-blue-600"
                            />
                        </Form.Control>
                        <span className="text-white">{field.label}</span>
                    </div>
                )
            default:
                return (
                    <Form.Control asChild>
                        <input
                            type={field.type}
                            {...commonProps}
                        />
                    </Form.Control>
                )
        }
    }

    const containerClasses = cn(
        'mx-auto max-w-2xl py-12',
        {
            'bg-zinc-900 px-4 sm:px-6 lg:px-8 rounded-lg': variant === 'withBackground',
            'text-center': variant === 'centered',
        }
    )

    return (
        <div className={containerClasses}>
            {(title || form.title) && (
                <h2 className="mb-4 font-bold text-3xl sm:text-4xl tracking-tight">
                    {title || form.title}
                </h2>
            )}
            {(description || form.description) && (
                <p className="mb-8 text-lg">
                    {description || form.description}
                </p>
            )}

            <Form.Root
                ref={formRef}
                onSubmit={handleSubmit}
                className="space-y-6"
            >
                {form.fields.map((field) => (
                    <Form.Field
                        key={field.name}
                        name={field.name}
                        className="gap-2 grid"
                    >
                        <div className="flex justify-between items-baseline">
                            <Form.Label className="font-medium text-sm">
                                {field.label}
                                {field.required === 'yes' && (
                                    <span className="ml-1 text-red-500">*</span>
                                )}
                            </Form.Label>
                            <div className="flex gap-2">
                                <Form.Message
                                    className="text-red-500 text-sm"
                                    match="valueMissing"
                                >
                                    Campo requerido
                                </Form.Message>
                                {field.type === 'email' && (
                                    <Form.Message
                                        className="text-red-500 text-sm"
                                        match="typeMismatch"
                                    >
                                        Email inválido
                                    </Form.Message>
                                )}
                                {field.type === 'rut' && (
                                    <Form.Message
                                        className="text-red-500 text-sm"
                                        match={(value: string) => {
                                            return !validateRut(value);
                                        }}
                                    >
                                        RUT inválido
                                    </Form.Message>
                                )}
                            </div>
                        </div>
                        {renderField(field)}
                    </Form.Field>
                ))}

                {submitStatus === 'success' && (
                    <p className="text-green-500 text-sm">{form.successMessage}</p>
                )}
                {submitStatus === 'error' && (
                    <p className="text-red-500 text-sm">{form.errorMessage}</p>
                )}

                <Form.Submit asChild>
                    <Button
                        disabled={isSubmitting}
                        className={cn(
                            "w-fit px-4 py-3",
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                    >
                        {isSubmitting ? 'Enviando...' : (form.submitButtonText || 'Enviar')}
                    </Button>
                </Form.Submit>
            </Form.Root>
        </div>
    )
} 