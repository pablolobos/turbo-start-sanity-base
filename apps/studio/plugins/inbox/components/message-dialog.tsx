import { Dialog, Stack, Flex, Heading, Text, Button } from '@sanity/ui';
import { TrashIcon, StarIcon } from '@sanity/icons'

interface Field {
    name: string;
    value: string;
}

interface Message {
    _id: string;
    subject: string;
    name: string;
    email: string;
    starred: boolean;
    fields: Field[];
    [key: string]: any;
}

interface MessageDialogProps {
    onClose: () => void;
    message: Message;
    starMessage: (id: string) => void;
    deleteMessage: (id: string) => void;
}

interface DialogHeadingProps {
    message: Message;
}

interface DialogContentProps {
    message: Message;
}

interface DialogItemProps {
    name: string;
    value: string;
}

interface DialogActionsProps {
    message: Message;
    starMessage: (id: string) => void;
    deleteMessage: (id: string) => void;
}

export default function MessageDialog({
    onClose,
    message,
    starMessage,
    deleteMessage
}: MessageDialogProps) {
    return (
        <Dialog
            width={1}
            zOffset={1000}
            onClose={onClose}
            header="Message"
            id="message-dialog"
        >
            <Stack
                space={5}
                style={{ padding: '0px 20px 20px 20px' }}
            >
                <DialogHeading message={message} />
                <DialogContent message={message} />
                <DialogActions
                    message={message}
                    starMessage={starMessage}
                    deleteMessage={deleteMessage}
                />
            </Stack>
        </Dialog>
    )
}

function DialogHeading({ message }: DialogHeadingProps) {
    const { subject } = message

    return (
        <Heading
            size={1}
            style={{
                padding: '24px 0 14px 0',
                borderTop: '1px solid #1b1d26',
                borderBottom: '1px solid #1b1d26'
            }}
        >
            Subject: &nbsp;
            <span style={{ fontWeight: '400' }}>
                {subject}
            </span>
        </Heading>
    )
}

function DialogContent({ message }: DialogContentProps) {
    const { name, email, fields } = message

    return (
        <Flex
            direction="column"
            gap={4}
            style={{
                paddingBottom: '26px',
                borderBottom: '1px solid #1b1d26'
            }}
        >
            <DialogItem name="Name" value={name} />
            <DialogItem name="Email" value={email} />
            {fields.map((field, index) => (
                <DialogItem
                    key={index}
                    name={field.name}
                    value={field.value}
                />
            ))}
        </Flex>
    )
}

function DialogItem({ name, value }: DialogItemProps) {
    return (
        <Flex align="flex-start" gap={3}>
            <Heading style={{ fontSize: '14px' }}>
                {name}:
            </Heading>
            <Text style={{ marginTop: '-3.1px' }}>{value}</Text>
        </Flex>
    )
}

function DialogActions({ message, starMessage, deleteMessage }: DialogActionsProps) {
    const deleteIcon = <TrashIcon />
    const starIcon = <StarIcon style={{ color: '#ecc044' }} />
    const isStarred = message.starred

    return (
        <Flex gap={4}>
            <Button
                fontSize={[2]}
                mode="ghost"
                padding={[3]}
                text={isStarred ? 'Unstar' : 'Star'}
                onClick={() => starMessage(message._id)}
                icon={starIcon}
                style={{ flex: '1' }}
            />
            <Button
                fontSize={[2]}
                mode="ghost"
                padding={[3]}
                text="Delete"
                tone="critical"
                icon={deleteIcon}
                onClick={() => deleteMessage(message._id)}
                style={{ flex: '1' }}
            />
        </Flex>
    )
} 