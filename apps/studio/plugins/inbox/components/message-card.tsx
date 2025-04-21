import { Stack, Card, Flex, Heading, Text, MenuButton, Menu, MenuItem, Button, MenuDivider } from '@sanity/ui';
import { EllipsisVerticalIcon, TrashIcon, StarIcon } from '@sanity/icons'
import { useCallback, useState } from 'react';
import MessageDialog from './message-dialog';

interface Message {
    _id: string;
    name: string;
    email: string;
    subject: string;
    pageTitle?: string;
    read: boolean;
    starred: boolean;
    fields: Array<{ name: string; value: string; }>;
    [key: string]: any;
}

interface MessageCardProps {
    message: Message;
    deleteMessage: (id: string) => void;
    starMessage: (id: string) => void;
    readMessage: (id: string) => void;
}

interface MessageCardContentProps {
    message: Message;
}

interface MessageCardActionsProps {
    message: Message;
    onOpen: () => void;
    deleteMessage: (id: string) => void;
    starMessage: (id: string) => void;
}

interface MessageCardViewButtonProps {
    onOpen: () => void;
}

interface MessageCardMenuButtonProps {
    message: Message;
    deleteMessage: (id: string) => void;
    starMessage: (id: string) => void;
}

export default function MessageCard({
    message,
    deleteMessage,
    starMessage,
    readMessage
}: MessageCardProps) {
    const [open, setOpen] = useState(false)
    const onOpen = useCallback(() => setOpen(true), [])

    const onClose = useCallback(() => {
        setOpen(false)
        readMessage(message._id)
    }, [message, readMessage])

    return (
        <>
            <Card
                padding={4}
                radius={2}
                shadow={1}
                tone="transparent"
                style={{ backgroundColor: '#161824' }}
            >
                <Flex
                    gap={3}
                    align="center"
                    justify="space-between"
                    style={{ paddingRight: '12px' }}
                >
                    <MessageCardContent message={message} />
                    <MessageCardActions
                        message={message}
                        onOpen={onOpen}
                        starMessage={starMessage}
                        deleteMessage={deleteMessage}
                    />
                </Flex>
            </Card>
            {open && (
                <MessageDialog
                    onClose={onClose}
                    message={message}
                    starMessage={starMessage}
                    deleteMessage={deleteMessage}
                />
            )}
        </>
    )
}

function MessageCardContent({ message }: MessageCardContentProps) {
    const { name, email, subject, pageTitle } = message

    return (
        <Flex
            gap={[4]}
            style={{ width: '100%' }}
        >
            <Stack style={{ width: '100%', maxWidth: '220px' }}>
                <Heading style={{ fontSize: '15px' }}>
                    {name}
                </Heading>
                <Text style={{ marginTop: '12px' }}>
                    {email}
                </Text>
            </Stack>
            <Stack style={{ width: '100%', maxWidth: '400px' }}>
                <Heading style={{ fontSize: '15px' }}>
                    Subject
                </Heading>
                <Text style={{ marginTop: '12px' }}>
                    {subject}
                </Text>
                {pageTitle && (
                    <Text size={1} muted style={{ marginTop: '4px' }}>
                        From: {pageTitle}
                    </Text>
                )}
            </Stack>
        </Flex>
    )
}

function MessageCardActions({ message, onOpen, deleteMessage, starMessage }: MessageCardActionsProps) {
    return (
        <Flex
            gap={3}
            align="center"
            justify="space-between"
        >
            <MessageCardViewButton
                onOpen={onOpen}
            />
            <MessageCardMenuButton
                message={message}
                deleteMessage={deleteMessage}
                starMessage={starMessage}
            />
        </Flex>
    )
}

function MessageCardViewButton({ onOpen }: MessageCardViewButtonProps) {
    return (
        <Button
            fontSize={[2]}
            mode="ghost"
            padding={[3]}
            text="View"
            onClick={onOpen}
        />
    )
}

function MessageCardMenuButton({ message, deleteMessage, starMessage }: MessageCardMenuButtonProps) {
    const button = <Button icon={EllipsisVerticalIcon} />
    const starIcon = <StarIcon style={{ color: '#ecc044' }} />
    const deleteIcon = <TrashIcon style={{ color: '#f54747' }} />

    return (
        <MenuButton
            id="menu-button"
            popover={{ portal: true }}
            button={button}
            menu={(
                <Menu>
                    <MenuItem
                        icon={starIcon}
                        text={message.starred ? 'Unstar Message' : 'Star Message'}
                        onClick={() => starMessage(message._id)}
                    />
                    <MenuDivider />
                    <MenuItem
                        icon={deleteIcon}
                        text="Delete Message"
                        onClick={() => deleteMessage(message._id)}
                    />
                </Menu>
            )}
        />
    )
} 