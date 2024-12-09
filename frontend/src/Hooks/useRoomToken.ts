const useRoomId_Token = () => {
	const setRoomToken = (token: string) => {
		sessionStorage.setItem("roomToken", token);
	};

	const getRoomToken = () => {
		return sessionStorage.getItem("roomToken");
	};

	const clearRoomToken = () => {
		sessionStorage.removeItem("roomToken");
	};

	return {
		setRoomToken,
		getRoomToken,
		clearRoomToken,
	};
};

export default useRoomId_Token;
