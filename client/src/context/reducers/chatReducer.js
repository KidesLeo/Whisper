import { cloneState } from './utils';

export default function chatReducer(state, action) {
    const clonedState = cloneState(state);

    switch (action.type) {
        case 'ADD_MESSAGE_OLD': {
            const { id, time, room, messageId, status } = action.payload;

            const message = {
                message: action.payload.message,
                time,
                senderId: id,
                id: messageId,
                status,
            };

            if (clonedState[id] === undefined) {
                clonedState[id] = {
                    id,
                    messages: [].concat(message),
                    room,
                };
            } else {
                clonedState[id].messages.push(message);
            }
            break;
        }

        case 'CREATE_CHAT': {
            const {
                chatId,
                userIds,
                messages = {},
                createdAt = new Date(),
            } = action.payload;

            clonedState[chatId] = {
                userIds,
                messages,
                createdAt,
            };
            break;
        }

        case 'ADD_MESSAGE': {
            const { senderId, room, id, message, time, status } =
                action.payload;

            if (!clonedState[room]) {
                throw new Error('Room not found!');
            }

            clonedState[room].messages[id] = {
                senderId,
                room,
                id,
                message,
                time,
                status,
            };
            break;
        }

        case 'UPDATE_MESSAGE': {
            const { id, message } = action.payload;

            if (!clonedState[message.room]) {
                throw new Error('Room not found!');
            }

            if (id !== message.id) {
                delete clonedState[message.room].messages[id];
            }

            clonedState[message.room].messages[message.id] = message;
            break;
        }

        default:
            throw new Error('No action provided!');
    }

    // Save auth state to localStorage on each change
    localStorage.setItem('chats', JSON.stringify(clonedState));

    return clonedState;
}
