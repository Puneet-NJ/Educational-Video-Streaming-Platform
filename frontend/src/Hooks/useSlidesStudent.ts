import { roomIdAtom, slidesLinksAtom } from "@/lib/atom";
import { BACKEND_URL } from "@/lib/lib";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useToken from "./useToken";

const useSlidesStudent = () => {
	const roomId = useRecoilValue(roomIdAtom);
	const setSlidesLink = useSetRecoilState(slidesLinksAtom);
	const { getToken } = useToken();

	const slidesQuery = useQuery({
		queryKey: ["slides"],
		queryFn: () =>
			axios({
				method: "GET",
				url: `${BACKEND_URL}/slides/${roomId}`,
				headers: { Authorization: `Bearer ${getToken()}` },
			}).then((res) => res.data),
	});

	useEffect(() => {
		if (slidesQuery.data) {
			setSlidesLink(slidesQuery.data.slidesLinks);
		}
	}, [slidesQuery, setSlidesLink]);
};

export default useSlidesStudent;
