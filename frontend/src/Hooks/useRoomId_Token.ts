const useRoomId_Token = () => {
	const setRoomId = (token: string) => {
		localStorage.setItem("roomId", token);
	};

	const getRoomId = () => {
		return localStorage.getItem("roomId");
	};

	const setRoomToken = (token: string) => {
		localStorage.setItem("roomToken", token);
	};

	const getRoomToken = () => {
		return localStorage.getItem("roomToken");
	};

	return {
		setRoomId,
		getRoomId,
		setRoomToken,
		getRoomToken,
	};
};

export default useRoomId_Token;
