import { BACKEND_URL } from "@/lib/lib";
import axios from "axios";
import { useState } from "react";
import useToken from "./useToken";
import { useMutation } from "@tanstack/react-query";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { roomIdAtom, slidesLinksAtom } from "@/lib/atom";

const useMenuTeacher = () => {
	const [slides, setSlides] = useState<File>();
	const [slideLinks, setSlideLinks] = useState([]);
	const maxSlidesSize = 5 * 1000000;
	const { getToken } = useToken();
	const roomId = useRecoilValue(roomIdAtom);

	const setSlidesLinks = useSetRecoilState(slidesLinksAtom);

	const mutation = useMutation({
		mutationFn: (formData: FormData) =>
			axios({
				method: "POST",
				url: `${BACKEND_URL}/slides/${roomId}`,
				data: formData,
				headers: {
					Authorization: `Bearer ${getToken()}`,
					"Content-Type": "multipart/form-data",
				},
			}),

		onSuccess: (response) => {
			setSlideLinks(response.data.slides);
			setSlidesLinks(response.data.slides);
		},
	});

	const handleSlidesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSlides(e.target.files?.[0]);
	};

	const handleUploadSlides = () => {
		if (!slides) {
			return;
		}

		if (slides?.size > maxSlidesSize) {
			return;
		}

		const formData = new FormData();
		formData.append("slides", slides);

		mutation.mutate(formData);
	};

	return {
		handleSlidesChange,
		handleUploadSlides,

		slideLinks,
	};
};

export default useMenuTeacher;
