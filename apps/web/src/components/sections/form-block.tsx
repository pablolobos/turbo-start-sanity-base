"use client"

import { generateID } from "@/lib/utils"
import { useState, FormEvent, ChangeEvent } from 'react'
import { cn } from "@workspace/ui/lib/utils";

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
}

interface FormBlockProps {
    title?: string
    description?: string
    variant?: 'default' | 'withBackground' | 'centered'
    form: FormData
}

export default function FormBlock({ title, description, variant = 'default', form }: FormBlockProps) {
    const [formData, setFormData] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitStatus('idle')

        const mutations = [{
            create: {
                _id: 'message.',
                _type: 'message',
                read: false,
                starred: false,
                name: formData['name'] || 'No name provided',
                email: formData['email'] || 'No email provided',
                subject: form.title,
                fields: Object.entries(formData).map(([name, value]) => ({
                    _key: generateID(),
                    name,
                    value
                }))
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
                setFormData({})
            } else {
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
            id: field.name,
            name: field.name,
            placeholder: field.placeholder,
            value: formData[field.name] || '',
            onChange: handleInputChange,
            required: field.required === 'yes',
            className: "bg-zinc-900 p-4 border border-zinc-800 rounded-md w-full text-white",
        }

        switch (field.type) {
            case 'textarea':
                return (
                    <textarea
                        {...commonProps}
                        rows={5}
                    />
                )
            case 'select':
                return (
                    <select {...commonProps}>
                        <option value="">Selecciona una opción</option>
                        {field.options?.map(option => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                )
            case 'radio':
                return (
                    <div className="flex gap-4">
                        {field.options?.map(option => (
                            <label key={option} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name={field.name}
                                    value={option}
                                    checked={formData[field.name] === option}
                                    onChange={handleInputChange}
                                    required={field.required === 'yes'}
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                )
            case 'checkbox':
                return (
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            {...commonProps}
                            checked={formData[field.name] === 'true'}
                            onChange={e => handleInputChange({
                                ...e,
                                target: { ...e.target, value: e.target.checked ? 'true' : 'false' }
                            } as ChangeEvent<HTMLInputElement>)}
                        />
                        {field.label}
                    </label>
                )
            default:
                return (
                    <input
                        type={field.type}
                        {...commonProps}
                    />
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

    const formClasses = cn(
        'flex flex-col gap-6',
        {
            'items-center': variant === 'centered'
        }
    )

    return (
        <div className={containerClasses}>
            {(title || form.title) && (
                <h2 className="mb-4 font-bold text-white text-3xl sm:text-4xl tracking-tight">
                    {title || form.title}
                </h2>
            )}
            {(description || form.description) && (
                <p className="mb-8 text-gray-300 text-lg">
                    {description || form.description}
                </p>
            )}

            <form onSubmit={handleSubmit} className={formClasses}>
                {form.fields.map((field) => (
                    <div key={field.name} className="w-full">
                        <label htmlFor={field.name} className="block mb-2 font-medium text-gray-300 text-sm">
                            {field.label} {field.required === 'yes' && <span className="text-red-500">*</span>}
                        </label>
                        {renderField(field)}
                    </div>
                ))}

                {submitStatus === 'success' && (
                    <p className="text-green-500">{form.successMessage}</p>
                )}
                {submitStatus === 'error' && (
                    <p className="text-red-500">{form.errorMessage}</p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                        "bg-blue-700 px-6 py-3 rounded-md text-white font-medium transition-colors",
                        {
                            "opacity-50 cursor-not-allowed": isSubmitting,
                            "hover:bg-blue-600": !isSubmitting,
                        }
                    )}
                >
                    {isSubmitting ? 'Enviando...' : (form.submitButtonText || 'Enviar')}
                </button>
            </form>
        </div>
    )
} 