const ENV = import.meta.env;

export const routes = {
    home: '/room',
    signUp: '/sign-up',
    signIn: '/sign-in',
    forgot: '/forgot-password',
    change: '/change-password',
    room: '/room',
}

export const api = {
    base: ENV.VITE_API_BASE_URL || '/api/v1.0',
    signIn: ENV.VITE_API_SIGN_IN || '/sign-in',
    signOut: ENV.VITE_API_SIGN_IN || '/sign-out',
    signUp: ENV.VITE_API_SIGN_UP || '/sign-up',
    forgotPassword: ENV.VITE_API_FORGOT_PASSWORD || '/forgot-password',
    changePassword: ENV.VITE_API_CHANGE_PASSWORD || '/change-password/:token',
    refresh: ENV.VITE_API_REFRESH || '/auth/refresh',
    access: ENV.VITE_API_ACCESS || '/auth',
	listRoom: ENV.VITE_API_LIST_ROOM || '/room',
	createRoom: ENV.VITE_API_CREATE_ROOM || '/room',
	joinRoom: ENV.VITE_API_JOIN_ROOM || '/room/join/:roomName',
	leaveRoom: ENV.VITE_API_LEAVE_ROOM || '/room/leave/:roomName',
	createMessage: ENV.VITE_API_CREATE_MESSAGE || '/message',
	uploadFile: ENV.VITE_API_UPLOAD_FILE || '/file',
}

export const socket = {
	base: ENV.VITE_SOCKET_BASE_URL || '/',
	path: ENV.VITE_SOCKET_BASE_PATH || '/socket.io',
}
