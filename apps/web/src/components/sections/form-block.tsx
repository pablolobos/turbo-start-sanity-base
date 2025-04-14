"use client"

import { generateID } from "@/lib/utils"
import { useState, FormEvent, useRef } from 'react'
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

export default function FormBlock({ title, description, variant = 'default', form }: FormBlockProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const formRef = useRef<HTMLFormElement>(null)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsSubmitting(true)
        setSubmitStatus('idle')

        const formData = new FormData(event.currentTarget)
        const fields = form.fields.map(field => ({
            _key: generateID(),
            name: field.name,
            value: formData.get(field.name)?.toString() || ''
        }))

        const mutations = [{
            create: {
                _id: 'message.',
                _type: 'message',
                read: false,
                starred: false,
                name: formData.get('name')?.toString() || 'No name provided',
                email: formData.get('email')?.toString() || 'No email provided',
                subject: form.title,
                fields,
                emailRecipients: form.emailRecipients
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
                            "w-fit  px-4 py-3",
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