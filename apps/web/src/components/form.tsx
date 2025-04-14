"use client"
import { generateID } from "@/lib/utils";
import { useState, FormEvent, ChangeEvent } from 'react';

interface FormFields {
    name: string;
    email: string;
    subject: string;
    occupation: string;
    message: string;
}

interface MessageMutation {
    create: {
        _id: string;
        _type: string;
        read: boolean;
        starred: boolean;
        name: string;
        email: string;
        subject: string;
        fields: Array<{
            _key: string;
            name: string;
            value: string;
        }>;
    };
}

export default function Form() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [occupation, setOccupation] = useState('');
    const [message, setMessage] = useState('');

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const mutations: MessageMutation[] = [{
            create: {
                _id: 'message.',
                _type: 'message',
                read: false,
                starred: false,
                name: name,
                email: email,
                subject: subject,
                fields: [
                    {
                        _key: generateID(),
                        name: 'Occupation',
                        value: occupation
                    },
                    {
                        _key: generateID(),
                        name: 'Message',
                        value: message
                    }
                ]
            }
        }]

        try {
            const response = await fetch("/api/submit-message", {
                method: "POST",
                body: JSON.stringify({ mutations }),
                headers: { "Content-Type": "application/json" },
            })

            if (response.ok) {
                resetUI()
                console.log('Document added successfully:', response)
            }
        } catch (error) {
            console.error('Error adding document:', error);
        }
    }

    function resetUI() {
        setEmail('')
        setName('')
        setSubject('')
        setOccupation('')
        setMessage('')
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setter: (value: string) => void) => {
        setter(e.target.value);
    };

    return (
        <div className='mx-auto mt-20 w-96'>
            <form
                onSubmit={handleSubmit}
                className='flex flex-col justify-center gap-5 text-white'
            >
                <input
                    type="text"
                    value={name}
                    placeholder="Name"
                    className="bg-zinc-900 p-4 border border-zinc-800 rounded-md w-full"
                    onChange={(e) => handleInputChange(e, setName)}
                />
                <input
                    type="text"
                    value={email}
                    placeholder="Email"
                    className="bg-zinc-900 p-4 border border-zinc-800 rounded-md w-full"
                    onChange={(e) => handleInputChange(e, setEmail)}
                />
                <input
                    type="text"
                    value={subject}
                    placeholder="Subject"
                    className="bg-zinc-900 p-4 border border-zinc-800 rounded-md w-full"
                    onChange={(e) => handleInputChange(e, setSubject)}
                />
                <input
                    type="text"
                    value={occupation}
                    placeholder="Occupation"
                    className="bg-zinc-900 p-4 border border-zinc-800 rounded-md w-full"
                    onChange={(e) => handleInputChange(e, setOccupation)}
                />
                <textarea
                    value={message}
                    rows={8}
                    placeholder="Message"
                    className="bg-zinc-900 p-4 border border-zinc-800 rounded-md w-full"
                    onChange={(e) => handleInputChange(e, setMessage)}
                />
                <button
                    type='submit'
                    className="bg-blue-700 p-4 rounded-md w-full text-white"
                >
                    Submit
                </button>
            </form>
        </div>
    )
} 