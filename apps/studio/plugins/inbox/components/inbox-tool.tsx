import { useClient } from 'sanity'
import { ToastProvider, useToast, Spinner, Card, Text, Container, Stack, Flex } from '@sanity/ui';
import { useListeningQuery } from 'sanity-plugin-utils'
import MessageList from './message-list';

interface Message {
    _id: string;
    name: string;
    email: string;
    subject: string;
    read: boolean;
    starred: boolean;
    fields: Array<{ name: string; value: string; }>;
    [key: string]: any;
}

interface QueryResponse {
    data: Message[];
    loading: boolean;
    error: Error | null;
}

export default function InboxTool() {
    const toast = useToast()
    const client = useClient({ apiVersion: "2021-06-07" })

    const {
        data: messages = [],
        loading,
        error
    } = useListeningQuery<Message[]>(`*[_type == 'message'] | order(_createdAt desc)`, {
        initialValue: [],
    }) as QueryResponse

    async function deleteMessage(id: string): Promise<void> {
        try {
            await client
                .delete(id)
                .then(() => {
                    toast.push({
                        status: 'success',
                        title: 'Message Deleted',
                    })
                })
        } catch (error) {
            toast.push({
                status: 'error',
                title: 'Failed to Delete Message',
            })
        }
    }

    async function starMessage(id: string): Promise<void> {
        const message = messages.find((m: Message) => m._id === id)
        if (!message) return

        const isStarred = !message.starred

        try {
            await client
                .patch(id)
                .set({ starred: isStarred })
                .commit()
                .then(() => {
                    toast.push({
                        status: 'success',
                        title: `Message ${message.starred ? 'Unstarred' : 'Starred'}`,
                    })
                })
        } catch (error) {
            toast.push({
                status: 'error',
                title: 'Failed to Star Message',
            })
        }
    }

    async function readMessage(id: string): Promise<void> {
        try {
            await client
                .patch(id)
                .set({ read: true })
                .commit()
        } catch (error) {
            toast.push({
                status: 'error',
                title: 'Failed to Load Message',
            })
        }
    }

    if (loading) return <LoadingView />
    if (error) return <ErrorView />

    return (
        <ToastProvider>
            <MessageList
                messages={messages}
                deleteMessage={deleteMessage}
                starMessage={starMessage}
                readMessage={readMessage}
            />
        </ToastProvider>
    )
}

function LoadingView() {
    return (
        <Container style={{ marginTop: '60px' }}>
            <Card
                padding={4}
                radius={2}
                shadow={1}
                tone="positive"
            >
                <Flex
                    gap={4}
                    align="center"
                    justify="center"
                >
                    <Text
                        align="center"
                        size={3}
                    >
                        Loading Messages
                    </Text>
                    <Spinner muted />
                </Flex>
            </Card>
        </Container>
    )
}

function ErrorView() {
    return (
        <Container style={{ marginTop: '60px' }}>
            <Card
                padding={4}
                radius={2}
                shadow={1}
                tone="critical"
            >
                <Stack space={2}>
                    <Text
                        align="center"
                        size={3}
                    >
                        Error Loading Messages
                    </Text>
                    <Text
                        align="center"
                        size={2}
                    >
                        Please try again later
                    </Text>
                </Stack>
            </Card>
        </Container>
    )
} 