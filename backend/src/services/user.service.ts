import { UserModel } from '@/models';
import { hashPassword } from '@/helpers/encryption';

export function insert(email: string, password: string) {
	return UserModel.create({
		email,
		password,
	});
}

export function selectOne(email: string) {
	return UserModel.findOne({ where: { email } });
}

export function updateVerified(email: string, verified = true) {
	return UserModel.update({ verified }, { where: { email } });
}

export function updatePassword(email: string, password: string) {
	return UserModel.update({ password }, { where: { email }, individualHooks: true });
}

export function matchPassword(plainPassword: string, password: string, salt: string) {
	return hashPassword(plainPassword, salt) === password;
}
