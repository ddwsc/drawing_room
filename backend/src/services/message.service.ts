import { MessageModel } from '@/models';

export function insertText(userId: number, roomId: number, text: string) {
	return MessageModel.create({
		userId,
		roomId,
		type: 'text',
		data: text,
	});
}

export function insertFile(userId: number, roomId: number, url: string) {
	return MessageModel.create({
		userId,
		roomId,
		type: 'file',
		data: url,
	});
}
